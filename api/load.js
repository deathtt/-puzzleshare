export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  try {
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({ 
      prefix: `puzzles/${id}`,
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    if (!blobs.length) {
      return res.status(404).send('Puzzle not found');
    }

    const response = await fetch(blobs[0].url);
    const text = await response.text();

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(text);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
