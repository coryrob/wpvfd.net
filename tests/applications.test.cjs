const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const vm = require('node:vm');
const { PDFDocument } = require('../api/node_modules/pdf-lib');
const handler = require('../api/applications');
const sections = require('../api/shared/schema.json');
const fields = sections.flatMap(section => section.fields);
const originalFetch = global.fetch;
const nodemailer = require('../api/node_modules/nodemailer');
const smtp = require('../api/shared/smtp');
const originalCreateTransport = nodemailer.createTransport;
after(() => { global.fetch = originalFetch; nodemailer.createTransport = originalCreateTransport; });

function fixture() {
  const values = {};
  for (const f of fields) values[f.name] = f.required ? (f.choices?.[0] || (f.type === 'date' ? '2000-01-01' : 'Test Applicant')) : '';
  Object.assign(values, { email: 'applicant@example.com', ssnLastFour: '1234', zip: '75169', state: 'TX', phone: '9035550100', licenseClass: 'C' });
  return { values, submissionId: '12345678-1234-4234-9234-123456789012', turnstileToken: 'test-token', certificationAccepted: true, screeningAccepted: true, electronicSignatureAccepted: true, attachments: [{ name: 'license.pdf', content: Buffer.from('%PDF-test-document').toString('base64') }] };
}
const headers = { origin: 'https://wpvfd.net', host: 'wpvfd.net' };
function context() { return { log: { error() {} } }; }
function configure() {
  Object.assign(process.env, { SMTP_PASSWORD: 'test', TURNSTILE_SECRET_KEY: 'test', TURNSTILE_SITE_KEY: 'test-public' });
}
function services(mailStatus = 200, security = { success: true, action: 'membership', hostname: 'wpvfd.net' }) {
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    assert.ok(url.includes('siteverify'));
    return { ok: true, json: async () => security };
  };
  nodemailer.createTransport = options => ({
    async sendMail(message) {
      calls.push({ smtp: options, message });
      if (mailStatus !== 200) throw new Error('SMTP failure');
      return { accepted: ['officers@wpvfd.net'], messageId: message.messageId };
    },
    close() {}
  });
  return calls;
}

test('schemas, original pages and 97 fillable controls match', async () => {
  const sandbox = { window: {} };
  vm.runInNewContext(await fs.readFile('js/application-schema.js', 'utf8'), sandbox);
  assert.equal(JSON.stringify(sandbox.window.applicationSections), JSON.stringify(sections));
  const bytes = await fs.readFile('Documents/WPFD_Application_Fillable.pdf');
  assert.deepEqual(bytes, await fs.readFile('api/templates/application.pdf'));
  const pdf = await PDFDocument.load(bytes);
  assert.equal(pdf.getPageCount(), 8);
  assert.equal(pdf.getForm().getFields().length, 97);
  assert.deepEqual(pdf.getForm().getFields().map(f => f.getName()).sort(), fields.map(f => f.name).sort());
  for (const f of fields) {
    assert.ok(f.x >= 0 && f.y >= 0 && f.x + f.width <= 612 && f.y + f.height <= 792);
    assert.ok(f.page >= 3 && f.page <= 7);
  }
});
test('validates required fields, dates, choices, conditional fields and consent', () => {
  assert.equal(handler.validate(fixture()).values.email, 'applicant@example.com');
  for (const edit of [
    b => { b.values.firstName = ''; },
    b => { b.values.birthDate = '2000-02-31'; },
    b => { b.values.email = 'not-an-email'; },
    b => { b.values.ssnLastFour = '12345'; },
    b => { b.values.membershipType = 'Unknown'; },
    b => { b.values.membershipType = 'Other'; },
    b => { b.values.licenseMatches = 'No'; },
    b => { b.values.heardFrom = 'Other'; },
    b => { b.certificationAccepted = false; },
    b => { b.screeningAccepted = 'true'; },
    b => { b.electronicSignatureAccepted = false; },
    b => { b.website = 'spam'; },
    b => { b.values.lastName = 'Test\u0000Name'; },
    b => { b.values.lastName = 'Test\r\nName'; },
    b => { b.submissionId = 'invalid'; }
  ]) { const body = fixture(); edit(body); assert.throws(() => handler.validate(body)); }
});
test('requires license attachment and rejects unsupported, malformed, excessive and oversized uploads', () => {
  for (const attachments of [[], Array(7).fill(fixture().attachments[0]), [{ name: 'test.txt', content: Buffer.from('plain text').toString('base64') }], [{ content: '!invalid!' }], [{ content: Buffer.concat([Buffer.from('%PDF-'), Buffer.alloc(6 * 1024 * 1024)]).toString('base64') }]]) {
    assert.throws(() => handler.validate({ ...fixture(), attachments }));
  }
  const body = fixture();
  body.attachments[0].name = '../../evil\nfilename.pdf';
  assert.match(handler.validate(body).attachments[0].filename, /^driver-license-[a-zA-Z0-9_-]+\.pdf$/);
});
test('completed PDF is flattened, includes full-answer appendix and is stable for retries', async () => {
  const values = handler.validate(fixture()).values;
  values.motivation = 'I want to serve my community. '.repeat(30);
  const output = await handler.completedPdf(values);
  assert.equal(output, await handler.completedPdf(values));
  const pdf = await PDFDocument.load(Buffer.from(output, 'base64'));
  assert.ok(pdf.getPageCount() > 8);
  assert.equal(pdf.getForm().getFields().length, 0);
});
test('missing setup reports unavailable and never calls external services', async () => {
  delete process.env.SMTP_PASSWORD;
  const calls = services();
  const ctx = context();
  await handler(ctx, { method: 'GET' });
  assert.equal(ctx.res.body.available, false);
  await handler(ctx, { method: 'POST', body: fixture(), headers });
  assert.equal(ctx.res.status, 503);
  assert.equal(calls.length, 0);
});
test('cross-origin and invalid submissions cannot send email', async () => {
  configure();
  const calls = services();
  const ctx = context();
  await handler(ctx, { method: 'POST', body: fixture(), headers: { ...headers, origin: 'https://other.example' } });
  assert.equal(ctx.res.status, 403);
  await handler(ctx, { method: 'POST', body: {}, headers });
  assert.equal(ctx.res.status, 400);
  assert.equal(calls.length, 0);
});
test('failed security, wrong hostname and wrong action cannot send email', async () => {
  configure();
  for (const security of [{ success: false }, { success: true, hostname: 'other.example', action: 'membership' }, { success: true, hostname: 'wpvfd.net', action: 'other' }]) {
    const calls = services(200, security);
    const ctx = context();
    await handler(ctx, { method: 'POST', body: fixture(), headers });
    assert.equal(ctx.res.status, 400);
    assert.equal(calls.length, 1);
  }
});
test('provider acceptance returns success; completed PDF and license go only to officers', async () => {
  configure();
  const calls = services();
  const ctx = context();
  await handler(ctx, { method: 'POST', body: fixture(), headers });
  assert.equal(ctx.res.status, 200);
  assert.equal(ctx.res.body.success, true);
  const email = calls[1].message;
  assert.deepEqual(email.to, ['officers@wpvfd.net']);
  assert.equal(email.replyTo, 'applicant@example.com');
  assert.equal(email.from, 'WPVFD Applications <operations@wpvfd.net>');
  assert.equal(email.attachments[0].encoding, 'base64');
  assert.equal(email.attachments.length, 2);
  assert.equal(email.attachments[0].filename, 'WPVFD-completed-application.pdf');
  assert.ok(email.text.includes('electronic signature acknowledgment'));
  const previousRequest = calls[1].message;
  await handler(ctx, { method: 'POST', body: fixture(), headers });
  assert.deepEqual(previousRequest, calls[3].message);
  assert.equal(previousRequest.messageId, calls[3].message.messageId);
});
test('provider failures never report success and do not expose provider responses', async () => {
  configure();
  services(500);
  const ctx = context();
  await handler(ctx, { method: 'POST', body: fixture(), headers });
  assert.equal(ctx.res.status, 502);
  assert.equal(ctx.res.body.success, undefined);
  assert.ok(!JSON.stringify(ctx.res).includes('test-mail-id'));
});
test('SMTP settings match SMTP2GO and require verified STARTTLS', () => {
  const options = smtp.settings();
  assert.equal(options.host, 'mail.smtp2go.com');
  assert.equal(options.port, 587);
  assert.equal(options.auth.user, 'operations@wpvfd.net');
  assert.equal(options.secure, false);
  assert.equal(options.requireTLS, true);
  assert.equal(options.tls.rejectUnauthorized, true);
  assert.equal(options.disableFileAccess, true);
  assert.equal(options.disableUrlAccess, true);
});
test('SMTP recipient rejection never reports success', async () => {
  configure();
  services();
  let closed = false;
  nodemailer.createTransport = () => ({ sendMail: async () => ({ accepted: [], rejected: ['officers@wpvfd.net'] }), close() { closed = true; } });
  const ctx = context();
  await handler(ctx, { method: 'POST', body: fixture(), headers });
  assert.equal(ctx.res.status, 502);
  assert.equal(closed, true);
});
