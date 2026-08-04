// Proxies the admins bin (read-only from the app — manage admins directly in JSONBin).
export default async function handler(req, res) {
  const { JSONBIN_ADMINS_BIN_ID: BIN_ID, JSONBIN_API_KEY: API_KEY } = process.env;

  if (!BIN_ID || !API_KEY) {
    return res.status(500).json({ error: 'JSONBIN_ADMINS_BIN_ID and JSONBIN_API_KEY env vars are not set' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const r = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { 'X-Master-Key': API_KEY, 'X-Bin-Meta': 'false' },
    });
    const data = await r.json();
    return res.status(r.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
