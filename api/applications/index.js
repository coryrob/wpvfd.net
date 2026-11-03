const { createHash } = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const sections = require('../shared/schema.json');
const smtp = require('../shared/smtp');
const fields = sections.flatMap(section => section.fields);
const MAX_FILES = 6;
const MAX_BYTES = 6 * 1024 * 1024;
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

function configuration() {
  return ['SMTP_PASSWORD', 'TURNSTILE_SECRET_KEY', 'TURNSTILE_SITE_KEY'].every(key => process.env[key]);
}
function validate(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Please complete the application form.');
  if (!/^[a-f0-9-]{36}$/i.test(body.submissionId || '')) throw new Error('Refresh the page before submitting.');
  if (typeof body.turnstileToken !== 'string' || body.turnstileToken.length > 2048) throw new Error('Complete the security check.');
  if (body.website) throw new Error('Unable to submit this application.');
  if (!body.certificationAccepted || body.certificationAccepted !== true || body.screeningAccepted !== true || body.electronicSignatureAccepted !== true) throw new Error('Review and accept all three acknowledgments.');
  if (!body.values || typeof body.values !== 'object' || Array.isArray(body.values)) throw new Error('Application fields are missing.');
  const values = {};
  for (const f of fields) {
    const value = body.values[f.name] ?? '';
    if (typeof value !== 'string' || value.length > f.maxLength || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value)) throw new Error(`Check ${f.label}.`);
    if (!f.multiline && /[\r\n]/.test(value)) throw new Error(`Check ${f.label}.`);
    values[f.name] = value.trim();
    if (f.required && !values[f.name]) throw new Error(`${f.label} is required.`);
    if (value && f.choices && !f.choices.includes(value)) throw new Error(`Check ${f.label}.`);
    if (value && f.type === 'email' && !emailPattern.test(value)) throw new Error('Enter a valid email address.');
    if (value && f.pattern && !new RegExp(`^(?:${f.pattern})$`).test(value)) throw new Error(`Check ${f.label}.`);
    if (value && f.type === 'date') {
      const date = new Date(value);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0,10) !== value || value > new Date().toISOString().slice(0,10)) throw new Error(`Enter a valid date for ${f.label}.`);
    }
  }
  if (values.membershipType === 'Other' && !values.membershipOther) throw new Error('Describe the other membership type.');
  if (values.licenseMatches === 'No' && !values.licenseAddress) throw new Error('Enter the address on your driver license.');
  if (values.heardFrom === 'Other' && !values.heardOther) throw new Error('Tell us how you heard about the department.');
  if (!Array.isArray(body.attachments) || !body.attachments.length || body.attachments.length > MAX_FILES) throw new Error('Attach your driver license and up to five supporting documents.');
  let total = 0;
  const attachments = body.attachments.map((file, index) => {
    if (!file || typeof file.content !== 'string' || file.content.length > Math.ceil(MAX_BYTES / 3) * 4 || file.content.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(file.content)) throw new Error('Invalid attachment.');
    const bytes = Buffer.from(file.content, 'base64');
    total += bytes.length;
    if (!bytes.length || total > MAX_BYTES) throw new Error('Attachments must total 6 MB or less.');
    let extension;
    if (bytes.subarray(0,5).toString() === '%PDF-') extension = 'pdf';
    else if (bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) extension = 'png';
    else if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) extension = 'jpg';
    else throw new Error('Only PDF, PNG and JPEG attachments are accepted.');
    const name = typeof file.name === 'string' ? file.name.replace(/\.[^.]*$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0,70) : 'document';
    return { filename: `${index === 0 ? 'driver-license' : `supporting-${index}`}-${name}.${extension}`, content: file.content };
  });
  return { values, attachments };
}

// Standard PDF fonts support Latin text. Preserve the original Unicode answers in
// the email as well, so no information is lost if a PDF glyph needs substitution.
function pdfText(value) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-').replace(/[^\x20-\x7e\r\n]/g, '?');
}
async function completedPdf(values) {
  const pdf = await PDFDocument.load(await fs.readFile(path.join(__dirname, '../templates/application.pdf')), { updateMetadata: false });
  const form = pdf.getForm();
  for (const f of fields) {
    const control = form.getField(f.name);
    const value = values[f.name];
    if (f.choices) { if (value) control.select(value); }
    else {
      control.setText(pdfText(value));
      // Auto-size single line fields; keep paragraphs readable in the packet.
      control.setFontSize(f.multiline ? 9 : 0);
    }
  }
  form.flatten();
  // Keep full answers legible even when they exceed a space on the original form.
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  let page;
  let y;
  function newPage() {
    page = pdf.addPage([612, 792]);
    y = 735;
    page.drawText('WPVFD - Complete application answers', { x: 45, y, size: 15, font });
    y -= 30;
  }
  function line(text) {
    if (y < 55) newPage();
    page.drawText(text, { x: 45, y, size: 10, font, color: rgb(0, 0, 0) });
    y -= 14;
  }
  newPage();
  for (const section of sections) {
    if (y < 100) newPage();
    line(pdfText(section.title));
    for (const f of section.fields) {
      const text = pdfText(`${f.label}: ${values[f.name] || 'Not provided'}`);
      for (const paragraph of text.split(/\r?\n/)) {
        let remaining = paragraph;
        if (!remaining) line('');
        while (remaining) {
          let length = Math.min(remaining.length, 110);
          while (length > 1 && font.widthOfTextAtSize(remaining.slice(0, length), 10) > 520) length--;
          if (length < remaining.length && remaining.lastIndexOf(' ', length) > length / 2) length = remaining.lastIndexOf(' ', length);
          line(remaining.slice(0, length));
          remaining = remaining.slice(length).trimStart();
        }
      }
    }
    y -= 10;
  }
  return Buffer.from(await pdf.save()).toString('base64');
}

module.exports = async function (context, req) {
  const reply = (status, body) => { context.res = { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body }; };
  if (req.method === 'GET') {
    reply(200, { available: configuration(), siteKey: process.env.TURNSTILE_SITE_KEY || null });
    return;
  }
  if (req.method !== 'POST') { reply(405, { error: 'Method not allowed.' }); return; }
  if (!configuration()) { reply(503, { error: 'Online applications are temporarily unavailable. Call (903) 873-3011 or use the downloadable packet.' }); return; }
  const origin = req.headers?.origin;
  const host = req.headers?.['x-forwarded-host'] || req.headers?.host;
  if (origin) {
    try { if (new URL(origin).host !== host) { reply(403, { error: 'Submit the application from the department website.' }); return; } }
    catch { reply(403, { error: 'Invalid request origin.' }); return; }
  }
  if (Number(req.headers?.['content-length']) > 9 * 1024 * 1024 || Buffer.byteLength(JSON.stringify(req.body ?? '')) > 9 * 1024 * 1024) { reply(413, { error: 'Attachments must total 6 MB or less.' }); return; }
  let data;
  try { data = validate(req.body); }
  catch (error) { reply(400, { error: error.message }); return; }
  try {
    const securityResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET_KEY, response: req.body.turnstileToken }),
      signal: AbortSignal.timeout(15000)
    });
    const security = await securityResponse.json();
    if (!securityResponse.ok || !security.success || security.action !== 'membership' || (host && security.hostname !== host.split(':')[0])) { reply(400, { error: 'Security check expired or failed. Please complete it again.' }); return; }
    const pdf = await completedPdf(data.values);
    const answers = sections.map(section => `${section.title}\n${section.fields.map(f => `${f.label}: ${data.values[f.name] || 'Not provided'}`).join('\n')}`).join('\n\n');
    const digest = createHash('sha256').update(JSON.stringify(data)).digest('hex');
    await smtp.send({
        to: ['officers@wpvfd.net'],
        replyTo: data.values.email,
        messageId: `<application.${req.body.submissionId}.${digest}@wpvfd.net>`,
        subject: `NEW APP FROM WEBSITE: ${data.values.firstName} ${data.values.lastName}`,
        text: `A membership application was submitted through the WPVFD website.\nReference: ${req.body.submissionId}\n\nThe applicant accepted the certification/background authorization, physical/drug screening consent, and electronic signature acknowledgment. Typed signatures appear in the attached packet. The PDF includes a full-answer appendix for longer responses.\n\n${answers}\n\nThe attached files were supplied by the applicant.`,
        attachments: [{ filename: 'WPVFD-completed-application.pdf', content: pdf }, ...data.attachments]
    });
    reply(200, { success: true, reference: req.body.submissionId });
  } catch {
    // Do not log applicant fields, identity documents, provider responses or keys.
    context.log.error('Membership submission failed during verification, PDF creation or email delivery.');
    reply(502, { error: 'We could not confirm delivery. Your answers are still on this page. Please try again, or call (903) 873-3011.' });
  }
};
module.exports.validate = validate;
module.exports.completedPdf = completedPdf;
