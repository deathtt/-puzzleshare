export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    // Use Vercel Blob list API correctly
    const listRes = await fetch(
      `https://blob.vercel-storage.com?prefix=puzzles-${id}&limit=1`,
      {
        headers: {
          'authorization': `Bearer ${token}`
        }
      }
    );

    if (!listRes.ok) {
      const t = await listRes.text();
      return res.status(500).json({ error: t });
    }

    const listData = await listRes.json();

    if (!listData.blobs || listData.blobs.length === 0) {
      return res.status(404).json({ error: 'Puzzle not found' });
    }

    // Fetch actual puzzle data from blob URL (public)
    const puzzleRes = await fetch(listData.blobs[0].url);
    const text = await puzzleRes.text();

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(text);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
