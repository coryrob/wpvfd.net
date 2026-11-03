const { test } = require('node:test');
const assert = require('node:assert/strict');
const requestHost = require('../api/shared/request-host');

test('public department origins work behind an internal Azure hostname', () => {
  for (const hostname of ['wpvfd.net', 'www.wpvfd.net']) {
    assert.equal(requestHost({ origin: `https://${hostname}`, host: 'internal.azurewebsites.net', 'x-forwarded-host': 'internal.azurewebsites.net' }), hostname);
  }
});

test('same-host previews and comma-separated proxy hosts work', () => {
  assert.equal(requestHost({ origin: 'https://preview.example', 'x-forwarded-host': 'preview.example, internal.example' }), 'preview.example');
  assert.equal(requestHost({ origin: 'http://localhost:4280', host: 'localhost:4280' }), 'localhost:4280');
});

test('unrelated, malformed, and misleading department origins are rejected', () => {
  for (const origin of ['https://other.example', 'https://wpvfd.net.other.example', 'null', 'invalid', 'https://wpvfd.net/path']) {
    assert.throws(() => requestHost({ origin, host: 'internal.azurewebsites.net' }));
  }
});
