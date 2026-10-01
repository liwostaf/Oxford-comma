export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;

  try {
    if (method === 'POST' && request.url.includes('/api/auth/login')) {
      return handleLogin(request, env);
    } else if (method === 'POST' && request.url.includes('/api/auth/signup')) {
      return handleSignup(request, env);
    } else if (method === 'POST' && request.url.includes('/api/auth/verify')) {
      return handleVerify(request, env);
    } else if (method === 'POST' && request.url.includes('/api/auth/logout')) {
      return handleLogout(request, env);
    } else {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleLogin(request, env) {
  const data = await request.json();
  const { contact } = data;

  if (!contact) {
    return new Response(JSON.stringify({ error: 'Contact required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Phase 1: Generate and return verification code
  // In production, this would send via email/SMS
  const verificationCode = '123456';
  const sessionId = 'temp-' + Date.now();

  return new Response(JSON.stringify({
    success: true,
    message: 'Verification code sent',
    sessionId,
    // For testing: code is always 123456
    testCode: verificationCode
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleSignup(request, env) {
  const data = await request.json();
  const { name, email, phone, password } = data;

  if (!name || !email || !password) {
    return new Response(JSON.stringify({
      error: 'Name, email, and password are required'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (password.length < 8) {
    return new Response(JSON.stringify({
      error: 'Password must be at least 8 characters'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Phase 1: Send verification code
  const verificationCode = '123456';
  const sessionId = 'signup-' + Date.now();

  return new Response(JSON.stringify({
    success: true,
    message: 'Verification code sent to email',
    sessionId,
    testCode: verificationCode
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleVerify(request, env) {
  const data = await request.json();
  const { sessionId, code, contact, name, isSignup } = data;

  // Phase 1: Accept hardcoded code
  if (code !== '123456') {
    return new Response(JSON.stringify({
      error: 'Invalid verification code'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Create session token
  const sessionToken = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

  return new Response(JSON.stringify({
    success: true,
    message: 'Verified successfully',
    sessionToken,
    user: {
      name: name || contact,
      contact: contact,
      createdAt: new Date().toISOString()
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleLogout(request, env) {
  return new Response(JSON.stringify({
    success: true,
    message: 'Logged out successfully'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
