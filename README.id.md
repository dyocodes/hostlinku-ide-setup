# Setup IDE & Coding Agent di Hostlinku

[![CI](https://github.com/dyocodes/hostlinku-ide-setup/actions/workflows/ci.yml/badge.svg)](https://github.com/dyocodes/hostlinku-ide-setup/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[English](README.md) | **Bahasa Indonesia** | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

Template konfigurasi siap pakai, ringkasan Base URL, dan skrip verifikasi endpoint untuk menghubungkan **Cursor**, **Cline / Roo Code**, **Zed**, **Codex CLI**, **OpenCode**, dan **Continue** ke [Hostlinku](https://hostlinku.com).

## Ringkasan Base URL

| Klien | Provider / Mode | Base URL | Template |
|---|---|---|---|
| **Cursor** | Override OpenAI Base URL | `https://api.hostlinku.com/v1` | Pengaturan UI |
| **Cline / Roo Code** | OpenAI Compatible *(disarankan)* | `https://api.hostlinku.com/v1` | Pengaturan UI |
| **Cline / Roo Code** | Anthropic (custom base URL) | `https://api.hostlinku.com` *(tanpa `/v1`)* | Pengaturan UI |
| **Zed** | `openai_compatible.hostlinku` | `https://api.hostlinku.com/v1` | [`configs/zed-settings.json`](configs/zed-settings.json) |
| **Codex CLI** | Custom provider (`wire_api = "responses"`) | `https://api.hostlinku.com/v1` | [`configs/codex-config.toml`](configs/codex-config.toml) |
| **OpenCode** | `@ai-sdk/openai-compatible` | `https://api.hostlinku.com/v1` | [`configs/opencode.json`](configs/opencode.json) |
| **Continue** | `openai` | `https://api.hostlinku.com/v1` | [`configs/continue-config.json`](configs/continue-config.json) |

## Verifikasi API key terlebih dahulu

Uji `/v1/models`, `/v1/chat/completions`, dan `/v1/responses` sebelum memasukkan key ke editor (tanpa dependensi, Node.js ≥ 18):

```bash
HOSTLINKU_API_KEY=sk-your-api-key node scripts/verify-ide-endpoint.mjs
```

## Catatan penting per klien

- **Cursor:** Tombol *Verify* mengirim request dari server Cursor (URL `localhost` ditolak; `https://api.hostlinku.com/v1` valid). Fitur Cursor Tab (autocomplete) tetap berjalan di server Cursor; Chat, Cmd-K, dan Agent memakai Hostlinku. Bila koneksi macet, ubah *HTTP Compatibility Mode* ke **HTTP/1.1**.
- **Cline & Roo Code:** Pilih **OpenAI Compatible** agar semua slug katalog (Claude, GPT, DeepSeek) bisa dipakai. Jika memilih **Anthropic**, hapus `/v1` dari Base URL (`https://api.hostlinku.com`) dan gunakan slug Claude yang dikenali Cline.
- **Zed:** Deklarasikan model pada `language_models.openai_compatible.hostlinku.available_models` di `settings.json`, lalu tempel key di pengaturan Agent Panel (atau ekspor `HOSTLINKU_API_KEY`). Fitur Edit Predictions memakai `/v1/completions` (FIM) yang tidak tersedia di Hostlinku — biarkan Edit Predictions di default.
- **Codex CLI:** Wajib disimpan di `~/.codex/config.toml` (bukan `.codex/config.toml` di dalam project) dengan `wire_api = "responses"`. Pada mode Performance/Economy, gunakan model OpenAI/GPT (`gpt-5-5`, `gpt-5-6-luna`, `gpt-6-astra`); model Claude & domestik tidak didukung Codex CLI.
- **OpenCode:** Simpan key di `~/.config/opencode/hostlinku-api-key.txt` dan rujuk dengan `{file:~/.config/opencode/hostlinku-api-key.txt}` di [`configs/opencode.json`](configs/opencode.json), lalu buka ulang OpenCode.
- **Continue:** Mendukung peran `chat`, `edit`, dan `apply` (`configs/continue-config.json`, atau ubah ke `~/.continue/config.yaml`). Biarkan peran `autocomplete` / `embed` / `rerank` memakai provider lain.

## Troubleshooting umum

| Error | Kemungkinan penyebab |
|---|---|
| `401 UNAUTHORIZED` | Spasi terbawa saat menyalin key, key dicabut, atau `HOSTLINKU_API_KEY` belum diekspor sebelum IDE/CLI dibuka. |
| `404` di semua request | Kurang `/v1` pada jalur OpenAI-compatible, atau kelebihan `/v1` pada jalur Anthropic-compatible. |
| `404 MODEL_NOT_FOUND` | Salah ketik slug atau model tidak masuk Service Mode key. Cek lewat `GET /v1/models`. |
| `400 max_tokens` | Batas output melebihi `maxOutputTokens` model; turunkan `max_tokens` di config. |

## Tautan

- Panduan Integrasi Lengkap: <https://docs.hostlinku.com/integrations>
- Setup Claude Code: <https://github.com/dyocodes/hostlinku-claude-code-setup>
- Contoh API: <https://github.com/dyocodes/hostlinku-api-examples>
- Console: <https://console.hostlinku.com>

## Lisensi

[MIT](LICENSE). Template hanya berisi placeholder API key.
