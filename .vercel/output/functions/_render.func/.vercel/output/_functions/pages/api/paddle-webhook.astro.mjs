import { createHmac } from 'node:crypto';
export { renderers } from '../../renderers.mjs';

function toGroupedCode(value) {
  const normalized = value.replace(/[^A-Z0-9]/g, "").toUpperCase().slice(0, 20);
  const chunks = normalized.match(/.{1,5}/g) ?? [];
  return chunks.join("-");
}
function getPlanLabel(plan) {
  switch (plan) {
    case "lifetime":
      return "Lifetime";
    default:
      return "Custom";
  }
}
function generateAuthorizationCode(input, secret) {
  const payload = `${input.orderId}:${input.email.trim().toLowerCase()}:${input.plan}`;
  const digest = createHmac("sha256", secret).update(payload).digest("base64url");
  return toGroupedCode(digest);
}

function verifyPaddleSignature(rawBody, signatureHeader, secret, toleranceSeconds = 30) {
  {
    return false;
  }
}
function resolvePlanFromPriceId(priceId) {
  return "custom";
}
function extractTransactionDetails(event) {
  const transaction = event.data;
  const orderId = transaction?.id?.trim();
  const email = transaction?.customer?.email?.trim().toLowerCase();
  const priceId = transaction?.items?.[0]?.price_id ?? transaction?.items?.[0]?.price?.id ?? null;
  const plan = resolvePlanFromPriceId();
  return {
    orderId,
    email,
    priceId,
    plan
  };
}

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://edit-page.yourdomain.com", "SSR": true};
function getRequiredEnv(name) {
  const value = Object.assign(__vite_import_meta_env__, { _: process.env._ })[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function buildEmailHtml(input) {
  const planLabel = getPlanLabel(input.plan);
  const code = escapeHtml(input.authorizationCode);
  const orderId = escapeHtml(input.orderId);
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h1 style="font-size: 20px; margin-bottom: 16px;">Your Edit Page authorization code</h1>
      <p>Thanks for your purchase.</p>
      <p><strong>Plan:</strong> ${planLabel}</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p style="margin: 24px 0;">
        <span style="display: inline-block; font-size: 24px; letter-spacing: 1px; font-weight: 700; background: #f3f4f6; padding: 12px 16px; border-radius: 10px;">
          ${code}
        </span>
      </p>
      <p>Enter this code in the Edit Page app or extension to activate your purchase.</p>
    </div>
  `.trim();
}
function buildEmailText(input) {
  return [
    "Your Edit Page authorization code",
    "",
    `Plan: ${getPlanLabel(input.plan)}`,
    `Order ID: ${input.orderId}`,
    `Authorization Code: ${input.authorizationCode}`,
    "",
    "Enter this code in the Edit Page app or extension to activate your purchase."
  ].join("\n");
}
async function sendLicenseEmail(input) {
  const apiKey = getRequiredEnv("RESEND_API_KEY");
  const from = getRequiredEnv("RESEND_FROM_EMAIL");
  const replyTo = Object.assign(__vite_import_meta_env__, { _: process.env._ }).RESEND_REPLY_TO || void 0;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `edit-page-license-${input.orderId}`
    },
    body: JSON.stringify({
      from,
      to: [input.email],
      subject: "Your Edit Page authorization code",
      html: buildEmailHtml(input),
      text: buildEmailText(input),
      ...replyTo ? { replyTo } : {}
    })
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend request failed (${response.status}): ${errorText}`);
  }
  const result = await response.json();
  return result.id;
}

const prerender = false;
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
function getLicenseSecret() {
  {
    throw new Error("Missing required environment variable: LICENSE_KEY_SECRET");
  }
}
const POST = async ({ request }) => {
  const rawBody = await request.text();
  request.headers.get("paddle-signature");
  if (!verifyPaddleSignature()) {
    return json({ error: "Invalid Paddle signature" }, 401);
  }
  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return json({ error: "Invalid JSON payload" }, 400);
  }
  if (event.type !== "transaction.completed") {
    return json({
      ok: true,
      ignored: true,
      eventType: event.type ?? null
    });
  }
  try {
    const { email, orderId, plan, priceId } = extractTransactionDetails(event);
    if (!email || !orderId) {
      return json(
        {
          error: "Missing transaction email or order id"
        },
        422
      );
    }
    const authorizationCode = generateAuthorizationCode(
      {
        email,
        orderId,
        plan
      },
      getLicenseSecret()
    );
    const emailId = await sendLicenseEmail({
      authorizationCode,
      email,
      orderId,
      plan
    });
    return json({
      ok: true,
      orderId,
      email,
      plan,
      priceId,
      emailId: emailId ?? null
    });
  } catch (error) {
    console.error("[paddle-webhook] Failed to process webhook", error);
    return json({ error: "Webhook processing failed" }, 500);
  }
};
const GET = async () => json({
  ok: true,
  endpoint: "/api/paddle-webhook"
});

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
