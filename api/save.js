export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { img, grid, title } = req.body;
    const id = Math.random().toString(36).slice(2, 8);
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const filename = `puzzles-${id}.json`;
    const content = JSON.stringify({ img, grid, title });

    const response = await fetch(
      `https://blob.vercel-storage.com/${filename}`,
      {
        method: 'PUT',
        headers: {
          'authorization': `Bearer ${token}`,
          'content-type': 'application/json',
          'x-content-type': 'application/json',
        },
        body: content,
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: err });
    }

    const data = await response.json();
    return res.status(200).json({ id, url: data.url });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
