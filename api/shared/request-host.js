// Azure can forward an internal API hostname instead of the public website host.
// Accept the department's explicit public origins and keep same-host previews.
const publicOrigins = new Set(['https://wpvfd.net', 'https://www.wpvfd.net']);

function requestHost(headers = {}) {
  const forwardedHost = headers['x-forwarded-host'] || headers.host;
  const host = typeof forwardedHost === 'string' ? forwardedHost.split(',')[0].trim().toLowerCase() : '';
  if (!headers.origin) return host;
  const origin = new URL(headers.origin);
  if (!['http:', 'https:'].includes(origin.protocol) || origin.origin !== headers.origin) throw new Error('Invalid origin');
  if (!publicOrigins.has(origin.origin) && origin.host !== host) throw new Error('Invalid origin');
  return origin.host;
}

module.exports = requestHost;
