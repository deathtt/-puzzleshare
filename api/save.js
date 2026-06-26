export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  try {
    const body = await req.json();
    const { img, grid, title } = body;
    const id = Math.random().toString(36).slice(2, 8);

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const filename = `puzzles/${id}.json`;
    const content = JSON.stringify({ img, grid, title });

    const res = await fetch(
      `https://blob.vercel-storage.com/${filename}`,
      {
        method: 'PUT',
        headers: {
          'authorization': `Bearer ${token}`,
          'content-type': 'application/json',
          'x-content-type': 'application/json',
          'x-cache-control-max-age': '31536000',
        },
        body: content,
      }
    );

    const data = await res.json();
    return new Response(JSON.stringify({ id, url: data.url }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
