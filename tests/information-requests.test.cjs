const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const handler = require('../api/information-requests');
const nodemailer = require('../api/node_modules/nodemailer');
const originalFetch = global.fetch;
const originalTransport = nodemailer.createTransport;
after(() => { global.fetch = originalFetch; nodemailer.createTransport = originalTransport; });
const fixture = () => ({ name: 'Test Resident', email: 'resident@example.com', phone: '', subject: 'Station visit', message: 'How can I arrange a visit?', turnstileToken: 'test-token' });

test('validates required answers and rejects header injection and spam', () => {
  assert.equal(handler.validate(fixture()).email, 'resident@example.com');
  for (const edit of [b => { b.name = ''; }, b => { b.email = 'invalid'; }, b => { b.subject = 'Hello\r\nBcc: other@example.com'; }, b => { b.message = 'x'.repeat(5001); }, b => { b.website = 'spam'; }, b => { b.turnstileToken = ''; }]) {
    const body = fixture(); edit(body);
    assert.throws(() => handler.validate(body));
  }
});

test('sends to both chiefs and requires acceptance of both recipients', async () => {
  Object.assign(process.env, { SMTP_PASSWORD: 'test', TURNSTILE_SECRET_KEY: 'test', TURNSTILE_SITE_KEY: 'test' });
  let action = 'information_request';
  global.fetch = async () => ({ ok: true, json: async () => ({ success: true, action, hostname: 'wpvfd.net' }) });
  let accepted = ['chief@wpvfd.net', 'asstchief@wpvfd.net'];
  const messages = [];
  nodemailer.createTransport = () => ({ sendMail: async message => { messages.push(message); return { accepted }; }, close() {} });
  const request = { method: 'POST', headers: { host: 'wpvfd.net', origin: 'https://wpvfd.net' }, body: fixture() };
  const context = { log: { error() {} } };
  await handler(context, request);
  assert.equal(context.res.status, 200);
  assert.deepEqual(messages[0].to, ['Chief@wpvfd.net', 'asstchief@wpvfd.net']);
  assert.equal(messages[0].replyTo, 'resident@example.com');
  assert.equal(messages[0].subject, 'NEW INFORMATION REQUEST FROM WEBSITE: Station visit');
  assert.ok(messages[0].text.includes('How can I arrange a visit?'));
  accepted = ['chief@wpvfd.net'];
  await handler(context, request);
  assert.equal(context.res.status, 502);
  action = 'membership';
  await handler(context, request);
  assert.equal(context.res.status, 400);
  assert.equal(messages.length, 2);
  await handler(context, { ...request, headers: { ...request.headers, origin: 'https://other.example' } });
  assert.equal(context.res.status, 403);
});
