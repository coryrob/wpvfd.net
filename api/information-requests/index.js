const smtp = require('../shared/smtp');
const requestHost = require('../shared/request-host');

function validate(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body) || body.website) throw new Error('Unable to submit this request.');
  const values = {};
  for (const [name, limit] of Object.entries({ name: 120, email: 254, phone: 40, subject: 160, message: 5000 })) {
    const value = body[name] ?? '';
    if (typeof value !== 'string' || value.length > limit || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value) || (name !== 'message' && /[\r\n]/.test(value))) throw new Error(`Check the ${name} field.`);
    values[name] = value.trim();
    if (name !== 'phone' && !values[name]) throw new Error(`The ${name} field is required.`);
  }
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(values.email)) throw new Error('Enter a valid email address.');
  if (typeof body.turnstileToken !== 'string' || !body.turnstileToken || body.turnstileToken.length > 2048) throw new Error('Complete the security check.');
  return values;
}

module.exports = async (context, req) => {
  const reply = (status, body) => { context.res = { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body }; };
  const available = ['SMTP_PASSWORD', 'TURNSTILE_SECRET_KEY', 'TURNSTILE_SITE_KEY'].every(key => process.env[key]);
  if (req.method === 'GET') { reply(200, { available, siteKey: process.env.TURNSTILE_SITE_KEY || null }); return; }
  if (req.method !== 'POST') { reply(405, { error: 'Method not allowed.' }); return; }
  if (!available) { reply(503, { error: 'Online requests are unavailable. Please call (903) 873-3011.' }); return; }
  let host;
  try {
    host = requestHost(req.headers);
  } catch { reply(403, { error: 'Submit your request from the department website.' }); return; }
  if (Number(req.headers?.['content-length']) > 40000 || Buffer.byteLength(JSON.stringify(req.body ?? '')) > 40000) { reply(413, { error: 'Your request is too long.' }); return; }
  let values;
  try { values = validate(req.body); }
  catch (error) { reply(400, { error: error.message }); return; }
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET_KEY, response: req.body.turnstileToken }),
      signal: AbortSignal.timeout(15000)
    });
    const security = await response.json();
    if (!response.ok || !security.success || security.action !== 'information_request' || !host || security.hostname !== host.split(':')[0]) {
      reply(400, { error: 'Security check expired or failed. Please complete it again.' }); return;
    }
    await smtp.send({
      to: ['Chief@wpvfd.net', 'asstchief@wpvfd.net'],
      replyTo: values.email,
      subject: `NEW INFORMATION REQUEST FROM WEBSITE: ${values.subject}`,
      text: `Information request submitted through the WPVFD website.\n\nName: ${values.name}\nEmail: ${values.email}\nPhone: ${values.phone || 'Not provided'}\nSubject: ${values.subject}\n\n${values.message}`
    });
    reply(200, { success: true });
  } catch {
    context.log.error('Information request verification or email delivery failed.');
    reply(502, { error: 'We could not confirm delivery. Please try again or call (903) 873-3011.' });
  }
};
module.exports.validate = validate;
