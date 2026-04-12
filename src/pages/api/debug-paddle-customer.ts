import type { APIRoute } from 'astro';

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export const GET: APIRoute = async ({ url }) => {
  const customerId = url.searchParams.get('customer_id');
  const apiKey = import.meta.env.PADDLE_API_KEY;

  if (!customerId) {
    return json({ error: 'Missing customer_id query param' }, 400);
  }

  if (!apiKey) {
    return json({ error: 'Missing PADDLE_API_KEY' }, 500);
  }

  const response = await fetch(`https://api.paddle.com/customers/${customerId}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Paddle-Version': '1',
    },
  });

  const text = await response.text();

  return json({
    customerId,
    ok: response.ok,
    status: response.status,
    body: text,
    apiKeyPrefix: apiKey.slice(0, 18),
    apiKeyLength: apiKey.length,
  });
};
