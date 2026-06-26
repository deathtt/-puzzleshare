import { put } from '@vercel/blob';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    const { img, grid, title } = body;

    if (!img || !grid || !title) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    // Generate short random ID like abc123
    const id = Math.random().toString(36).slice(2, 8);
    const data = JSON.stringify({ img, grid, title, id });

    // Save to Vercel Blob
    const blob = await put(`puzzles/${id}.json`, data, {
      access: 'public',
      contentType: 'application/json',
    });

    return new Response(JSON.stringify({ id, url: blob.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
