export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return new Response('Missing id', { status: 400 });

  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const res = await fetch(
      `https://blob.vercel-storage.com/puzzles/${id}.json`,
      {
        headers: { 'authorization': `Bearer ${token}` }
      }
    );
    if (!res.ok) return new Response('Puzzle not found', { status: 404 });
    const text = await res.text();
    return new Response(text, {
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
