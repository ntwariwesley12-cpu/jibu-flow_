module.exports = async (req, res) => {
  const RENDER_URL = process.env.RENDER_URL;
  if (!RENDER_URL) {
    return res.status(500).json({ success: false, error: 'RENDER_URL not configured' });
  }

  const target = RENDER_URL.replace(/\/$/, '') + (req.url || '/');

  const headers = {};
  for (const [k, v] of Object.entries(req.headers)) {
    if (k.toLowerCase() !== 'host') headers[k] = v;
  }

  const init = {
    method: req.method,
    headers,
    redirect: 'follow'
  };

  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    init.body = JSON.stringify(req.body);
    if (!headers['content-type'] && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
  }

  try {
    const upstream = await fetch(target, init);
    const text = await upstream.text();
    res.status(upstream.status);
    const ct = upstream.headers.get('content-type');
    if (ct) res.setHeader('content-type', ct);
    return res.send(text);
  } catch (err) {
    console.error('Proxy error:', err.message);
    return res.status(502).json({ success: false, error: 'Backend unreachable: ' + err.message });
  }
};
