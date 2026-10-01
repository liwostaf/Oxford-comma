export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const db = env.DB;

  if (!db) {
    return new Response(JSON.stringify({
      note: 'Database not configured. Using default menu.',
      drinks: [
        { id: 'latte', name: 'Latte', price: 4.25, description: 'Double shot, silky steamed milk.' },
        { id: 'cappuccino', name: 'Cappuccino', price: 4.00, description: 'Espresso, milk, and a thick cap of foam.' },
        { id: 'flatwhite', name: 'Flat white', price: 4.25, description: 'Ristretto shots, thin velvety milk.' },
        { id: 'honeylav', name: 'Honey lavender', price: 5.00, description: 'House syrup with local Massachusetts honey.' },
        { id: 'matcha', name: 'Matcha latte', price: 5.00, description: 'Ceremonial-grade matcha, whisked to order.' },
        { id: 'coldbrew', name: 'Nitro cold brew', price: 4.00, description: 'Slow-steeped, poured creamy on tap.' }
      ],
      sizes: [
        { id: '12oz', name: '12 oz', priceAdd: 0 },
        { id: '16oz', name: '16 oz', priceAdd: 0.75 }
      ],
      milks: [
        { id: 'whole', name: 'Whole', priceAdd: 0 },
        { id: '2pct', name: '2%', priceAdd: 0 },
        { id: 'skim', name: 'Skim', priceAdd: 0 },
        { id: 'oat', name: 'Oat', priceAdd: 0.75 },
        { id: 'almond', name: 'Almond', priceAdd: 0.75 },
        { id: 'none', name: 'No milk', priceAdd: 0 }
      ]
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const drinks = await db.prepare('SELECT * FROM drinks WHERE status = ? ORDER BY name').bind('active').all();
    const sizes = await db.prepare('SELECT * FROM sizes ORDER BY name').all();
    const milks = await db.prepare('SELECT * FROM milks ORDER BY name').all();

    return new Response(JSON.stringify({
      drinks: drinks.results || [],
      sizes: sizes.results || [],
      milks: milks.results || []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
