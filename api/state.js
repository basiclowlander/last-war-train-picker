// Proxies the state bin (persons + lastPick). Key stays server-side.
export default async function handler(req, res) {
  const { JSONBIN_STATE_BIN_ID: BIN_ID, JSONBIN_API_KEY: API_KEY } = process.env;

  if (!BIN_ID || !API_KEY) {
    return res.status(500).json({ error: 'JSONBIN_STATE_BIN_ID and JSONBIN_API_KEY env vars are not set' });
  }

  try {
    if (req.method === 'GET') {
      const r = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: { 'X-Master-Key': API_KEY, 'X-Bin-Meta': 'false' },
      });
      const data = await r.json();
      return res.status(r.status).json(data);
    }

    if (req.method === 'PUT') {
      const r = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
        body: JSON.stringify(req.body),
      });
      const data = await r.json();
      return res.status(r.status).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
