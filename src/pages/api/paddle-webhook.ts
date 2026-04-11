import type { APIRoute } from 'astro';

// Paddle webhook secret key (from Paddle dashboard > Notifications > Webhooks)
const PADDLE_WEBHOOK_SECRET = import.meta.env.PADDLE_WEBHOOK_SECRET || '';

// Simple license store (for demo - use a real database in production)
const licenses = new Map<string, {
  email: string;
  orderId: string;
  plan: 'lifetime' | 'oneMonth';
  createdAt: number;
}>();

// Generate a simple license key
function generateLicenseKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = '';
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (i < 3) key += '-';
  }
  return key;
}

// Send email with license key (placeholder - use Resend, SendGrid, etc. in production)
async function sendLicenseEmail(email: string, licenseKey: string, plan: string) {
  console.log(`[EMAIL] Would send to ${email}: License ${licenseKey} for ${plan}`);
  // In production: integrate with Resend/SendGrid
  // Example with Resend:
  /*
  await resend.emails.send({
    from: 'Edit Page <noreply@edit-page.com>',
    to: email,
    subject: 'Your Edit Page License Key',
    html: `<p>Thank you for your purchase!</p>
           <p>Your license key: <strong>${licenseKey}</strong></p>
           <p>Plan: ${plan}</p>
           <p>Enter this key in the Edit Page extension to activate.</p>`
  });
  */
}

// Verify Paddle webhook signature
async function verifyWebhookSignature(request: Request, body: string): Promise<boolean> {
  if (!PADDLE_WEBHOOK_SECRET) {
    console.warn('[PADDLE] No webhook secret configured, skipping verification');
    return true; // Skip verification for demo
  }

  // In production, verify the Paddle-Signature header
  // See: https://developer.paddle.com/webhooks/signature-verification
  return true;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.text();
    const data = JSON.parse(body);

    console.log('[PADDLE] Webhook received:', data.type);

    // Verify signature
    const isValid = await verifyWebhookSignature(request, body);
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle transaction completed event
    if (data.type === 'transaction.completed') {
      const transaction = data.data;
      const email = transaction.customer?.email || transaction.customer_id;
      const orderId = transaction.id;

      // Determine the plan from the price ID
      const priceId = transaction.items?.[0]?.price_id;
      let plan: 'lifetime' | 'oneMonth' = 'oneMonth';

      // Map Paddle price IDs to plans
      const PRICE_IDS = {
        lifetime: import.meta.env.PADDLE_PRICE_LIFETIME || '',
        oneMonth: import.meta.env.PADDLE_PRICE_ONEMONTH || '',
      };

      if (priceId === PRICE_IDS.lifetime) plan = 'lifetime';
      if (priceId === PRICE_IDS.oneMonth) plan = 'oneMonth';

      // Generate license key
      const licenseKey = generateLicenseKey();

      // Store license
      licenses.set(licenseKey, {
        email,
        orderId,
        plan,
        createdAt: Date.now()
      });

      console.log('[PADDLE] License created:', { email, orderId, plan, licenseKey });

      // Send email (placeholder)
      await sendLicenseEmail(email, licenseKey, plan);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[PADDLE] Webhook error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Also export GET for verification endpoint
export const GET: APIRoute = async ({ url }) => {
  const licenseKey = url.searchParams.get('key');

  if (!licenseKey) {
    return new Response(JSON.stringify({ error: 'Missing license key' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const license = licenses.get(licenseKey.toUpperCase());

  if (!license) {
    return new Response(JSON.stringify({ valid: false, error: 'Invalid license key' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Check expiration for one-month plan
  let valid = true;
  let expiresAt = null;

  if (license.plan === 'oneMonth') {
    expiresAt = license.createdAt + 30 * 24 * 60 * 60 * 1000;
    valid = Date.now() < expiresAt;
  }

  return new Response(JSON.stringify({
    valid,
    plan: license.plan,
    email: license.email,
    orderId: license.orderId,
    expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
