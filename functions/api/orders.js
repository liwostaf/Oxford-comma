export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;
  const url = new URL(request.url);

  try {
    if (method === 'POST' && url.pathname === '/api/orders') {
      return handleCreateOrder(request, env);
    } else if (method === 'GET' && url.pathname === '/api/orders') {
      return handleGetOrders(request, env);
    } else if (method === 'GET' && url.pathname.match(/^\/api\/orders\/\d+$/)) {
      return handleGetOrder(request, env);
    } else {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleCreateOrder(request, env) {
  const data = await request.json();
  const { name, contact, drink, size, milk, pickupTime, popupDate } = data;

  if (!name || !contact || !drink || !size || !milk || !pickupTime) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const id = Date.now().toString();
  const db = env.DB;

  if (!db) {
    return new Response(JSON.stringify({
      error: 'Database not configured',
      note: 'Orders are stored in localStorage for Phase 1'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const orderNumber = await db.prepare(
    'SELECT COUNT(*) as count FROM orders'
  ).first();

  const newOrderNumber = (orderNumber?.count || 0) + 1;

  await db.prepare(`
    INSERT INTO orders (id, orderNumber, guestName, guestEmail, guestPhone, drink, drinkId, size, milk, pickupTime, popupDate, status, totalPrice, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `).bind(id, newOrderNumber.toString(), name, contact, contact, drink, '', size, milk, pickupTime, popupDate || '2026-10-05', 'reserved', 4.50).run();

  return new Response(JSON.stringify({
    success: true,
    order: {
      id,
      number: newOrderNumber,
      name,
      contact,
      drink,
      size,
      milk,
      pickupTime,
      status: 'reserved'
    }
  }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleGetOrders(request, env) {
  const db = env.DB;

  if (!db) {
    return new Response(JSON.stringify({
      note: 'Database not configured. Phase 1 uses localStorage',
      orders: []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const orders = await db.prepare(
    'SELECT * FROM orders ORDER BY createdAt DESC LIMIT 50'
  ).all();

  return new Response(JSON.stringify(orders), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleGetOrder(request, env) {
  const db = env.DB;
  const orderId = request.url.split('/').pop();

  if (!db) {
    return new Response(JSON.stringify({
      error: 'Database not configured'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const order = await db.prepare(
    'SELECT * FROM orders WHERE id = ?'
  ).bind(orderId).first();

  if (!order) {
    return new Response(JSON.stringify({ error: 'Order not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify(order), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
