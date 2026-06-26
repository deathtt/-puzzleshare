export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const storeId = process.env.BLOB_STORE_ID;

    // List blobs to find the puzzle
    const listRes = await fetch(
      `https://blob.vercel-storage.com?prefix=puzzles-${id}&limit=1`,
      {
        headers: {
          'authorization': `Bearer ${token}`,
          'x-vercel-blob-store-id': storeId,
        }
      }
    );

    const listData = await listRes.json();

    if (!listData.blobs || !listData.blobs.length) {
      return res.status(404).send('Puzzle not found');
    }

    const puzzleRes = await fetch(listData.blobs[0].url);
    const text = await puzzleRes.text();

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(text);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
