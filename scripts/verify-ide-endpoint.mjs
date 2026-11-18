#!/usr/bin/env node
// Verifies Hostlinku endpoints used by Cursor, Cline, Zed, Codex CLI, OpenCode, and Continue:
//   1. GET /v1/models (free discovery for your key's Service Mode)
//   2. POST /v1/chat/completions
//   3. POST /v1/responses (stateless; used by Codex CLI)
// Zero dependencies, Node >= 18.

const apiKey = process.env.HOSTLINKU_API_KEY;
if (!apiKey) {
  console.error("Set HOSTLINKU_API_KEY before running (see .env.example).");
  process.exit(1);
}

const base = (process.env.HOSTLINKU_BASE_URL ?? "https://api.hostlinku.com")
  .replace(/\/+$/, "")
  .replace(/\/v1$/, "");
const model = process.env.HOSTLINKU_MODEL ?? "gpt-5-5";
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${apiKey}`,
  "User-Agent": "hostlinku-ide-setup/0.1.0",
};

// 1. Model list
const modelsRes = await fetch(`${base}/v1/models`, { headers });
if (!modelsRes.ok) {
  console.error(`GET /v1/models failed HTTP ${modelsRes.status}: ${await modelsRes.text()}`);
  process.exit(1);
}
const modelsData = await modelsRes.json();
const slugs = (modelsData.data ?? []).map((m) => m.id);
console.log(`GET /v1/models OK: ${slugs.length} models (has ${model}: ${slugs.includes(model)})`);

// 2. Chat Completions (Cursor, Cline OpenAI-compatible, Zed, OpenCode, Continue)
const chatRes = await fetch(`${base}/v1/chat/completions`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    model,
    max_tokens: 64,
    messages: [{ role: "user", content: "Reply with exactly two words: chat ok." }],
  }),
});
if (!chatRes.ok) {
  console.error(`POST /v1/chat/completions failed HTTP ${chatRes.status}: ${await chatRes.text()}`);
  process.exit(1);
}
const chatData = await chatRes.json();
console.log("POST /v1/chat/completions OK:", chatData.choices?.[0]?.message?.content?.trim());

// 3. Responses API (Codex CLI wire_api="responses")
const respRes = await fetch(`${base}/v1/responses`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    model,
    max_output_tokens: 256,
    store: false,
    input: "Reply with exactly two words: responses ok.",
  }),
});
if (!respRes.ok) {
  console.error(`POST /v1/responses failed HTTP ${respRes.status}: ${await respRes.text()}`);
  process.exit(1);
}
const respData = await respRes.json();
const msg = respData.output?.find((item) => item.type === "message");
const text = msg?.content?.find((part) => part.type === "output_text")?.text ?? `(status: ${respData.status})`;
console.log("POST /v1/responses OK:", text.trim());
