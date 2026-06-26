export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return new Response('Missing id', { status: 400 });

  try {
    const blobUrl = `https://${process.env.BLOB_STORE_URL}/puzzles/${id}.json`;
    const res = await fetch(blobUrl);
    if (!res.ok) return new Response('Puzzle not found', { status: 404 });
    const data = await res.text();
    return new Response(data, {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    return new Response('Error loading puzzle', { status: 500 });
  }
}
