export function headerValue(headers, name) {
  if (!headers) return '';
  const value = typeof headers.get === 'function'
    ? headers.get(name)
    : headers[name] || headers[name.toLowerCase()];
  return String(Array.isArray(value) ? value[0] : value || '');
}

export function requestSiteOrigin(req, env = process.env) {
  const configured = String(env.SITE_ORIGIN || '').trim().replace(/\/$/, '');
  if (configured) return configured;
  const headers = req?.headers;
  const host = headerValue(headers, 'x-forwarded-host') || headerValue(headers, 'host');
  const hostname = host.split(',')[0].trim();
  const forwardedProto = headerValue(headers, 'x-forwarded-proto').split(',')[0].trim();
  const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(hostname);
  const proto = forwardedProto || (hostname && !local ? 'https' : 'http');
  if (hostname) return proto + '://' + hostname;
  const vercel = String(env.VERCEL_URL || '').trim().replace(/^https?:\/\//, '');
  if (vercel) return 'https://' + vercel;
  return 'http://localhost:3000';
}
