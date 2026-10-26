// One-time setup: register the webhook and subscribe to new posts from watched accounts.
// Usage: X_BEARER_TOKEN=... X_WEBHOOK_URL=https://yourdomain/api/x-webhook node scripts/x-setup.mjs
// Deploy the site first: X calls the URL (CRC check) while registering.
const BEARER = process.env.X_BEARER_TOKEN;
const URL_ = process.env.X_WEBHOOK_URL;
const ACCOUNTS = (process.env.X_ACCOUNTS ?? "ClaudeDevs,thsottiaux").split(",");
if (!BEARER || !URL_) throw new Error("set X_BEARER_TOKEN and X_WEBHOOK_URL");

const api = async (path, init = {}) => {
  const res = await fetch(`https://api.x.com${path}`, {
    ...init,
    headers: { authorization: `Bearer ${BEARER}`, "content-type": "application/json" },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${path} ${res.status} ${JSON.stringify(json)}`);
  return json;
};

const hook = await api("/2/webhooks", { method: "POST", body: JSON.stringify({ url: URL_ }) });
const webhookId = hook.data.id;
console.log("webhook", webhookId, "valid:", hook.data.valid);

for (const name of ACCOUNTS) {
  const { data } = await api(`/2/users/by/username/${name}`);
  const sub = await api("/2/activity/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      event_type: "post.create",
      filter: { user_id: data.id },
      tag: `posts:${name}`,
      webhook_id: webhookId,
    }),
  });
  console.log("subscribed", name, data.id, sub.data?.subscription?.subscription_id);
}
