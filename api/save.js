export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { img, grid, title } = req.body;
    if (!img) return res.status(400).json({ error: 'No image' });

    const id = Math.random().toString(36).slice(2, 8);
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const content = JSON.stringify({ img, grid, title });

    // PUT directly to Vercel Blob storage
    const putRes = await fetch(
      `https://blob.vercel-storage.com/puzzles-${id}.json`,
      {
        method: 'PUT',
        headers: {
          'authorization': `Bearer ${token}`,
          'content-type': 'application/octet-stream',
          'x-content-type': 'application/json',
          'x-cache-control-max-age': '31536000',
        },
        body: content,
      }
    );

    if (!putRes.ok) {
      const errText = await putRes.text();
      return res.status(500).json({ error: errText });
    }

    const putData = await putRes.json();
    return res.status(200).json({ id, url: putData.url });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
