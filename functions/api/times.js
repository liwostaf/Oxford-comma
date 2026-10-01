export async function onRequest(context) {
  const { request } = context;

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = new URL(request.url);
  const date = url.searchParams.get('date') || '2026-10-05';

  const times = [
    '12:30pm', '12:45pm', '1:00pm', '1:15pm', '1:30pm', '1:45pm', '2:00pm'
  ];

  return new Response(JSON.stringify({
    date,
    times
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
