# Hostlinku IDE・コーディングエージェント 設定集

[![CI](https://github.com/dyocodes/hostlinku-ide-setup/actions/workflows/ci.yml/badge.svg)](https://github.com/dyocodes/hostlinku-ide-setup/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[English](README.md) | [Bahasa Indonesia](README.id.md) | **日本語** | [简体中文](README.zh-CN.md)

**Cursor**、**Cline / Roo Code**、**Zed**、**Codex CLI**、**OpenCode**、**Continue** を [Hostlinku](https://hostlinku.com) へ接続するための設定テンプレート、ベース URL 一覧、接続確認スクリプトです。

## ベース URL 一覧

| クライアント | プロバイダー / モード | ベース URL | テンプレート |
|---|---|---|---|
| **Cursor** | Override OpenAI Base URL | `https://api.hostlinku.com/v1` | UI 設定 |
| **Cline / Roo Code** | OpenAI Compatible *（推奨）* | `https://api.hostlinku.com/v1` | UI 設定 |
| **Cline / Roo Code** | Anthropic（カスタムベース URL） | `https://api.hostlinku.com` *（`/v1` なし）* | UI 設定 |
| **Zed** | `openai_compatible.hostlinku` | `https://api.hostlinku.com/v1` | [`configs/zed-settings.json`](configs/zed-settings.json) |
| **Codex CLI** | カスタムプロバイダー（`wire_api = "responses"`） | `https://api.hostlinku.com/v1` | [`configs/codex-config.toml`](configs/codex-config.toml) |
| **OpenCode** | `@ai-sdk/openai-compatible` | `https://api.hostlinku.com/v1` | [`configs/opencode.json`](configs/opencode.json) |
| **Continue** | `openai` | `https://api.hostlinku.com/v1` | [`configs/continue-config.json`](configs/continue-config.json) |

## 先にキーの動作確認をする

エディタへ設定する前に `/v1/models`、`/v1/chat/completions`、`/v1/responses` の疎通を確認できます（依存関係なし、Node.js ≥ 18）。

```bash
HOSTLINKU_API_KEY=sk-your-api-key node scripts/verify-ide-endpoint.mjs
```

## クライアント別の注意点

- **Cursor:** `Verify` は Cursor のサーバーから送信されます（`localhost` は不可、`https://api.hostlinku.com/v1` は可）。Cursor Tab（補完）は従来通り Cursor 側で動作し、Chat・Cmd-K・Agent が Hostlinku を使用します。接続が止まる場合は *HTTP Compatibility Mode* を **HTTP/1.1** に変更してください。
- **Cline / Roo Code:** カタログ内の全モデル（Claude、GPT、DeepSeek）を使うなら **OpenAI Compatible** を選択してください。**Anthropic** を使う場合はベース URL から `/v1` を外し（`https://api.hostlinku.com`）、Cline が認識できる Claude モデル ID を指定します。
- **Zed:** `settings.json` の `language_models.openai_compatible.hostlinku.available_models` にモデルを明記し、Agent Panel の設定からキーを貼り付けます（または `HOSTLINKU_API_KEY` をエクスポート）。Edit Predictions は `/v1/completions` (FIM) を使うため対象外です。
- **Codex CLI:** プロジェクト内の `.codex/config.toml` ではなく、必ずホームの `~/.codex/config.toml` に `wire_api = "responses"` を設定してください。Performance / Economy モードでは OpenAI/GPT 系モデル（`gpt-5-5`、`gpt-5-6-luna`、`gpt-6-astra`）のみ対応します。
- **OpenCode:** `~/.config/opencode/hostlinku-api-key.txt` にキーを保存し、[`configs/opencode.json`](configs/opencode.json) から `{file:~/.config/opencode/hostlinku-api-key.txt}` で参照したうえでアプリを再起動してください。
- **Continue:** `chat`、`edit`、`apply` ロールに対応しています（[`configs/continue-config.json`](configs/continue-config.json)、または `~/.continue/config.yaml` 形式で利用）。`autocomplete` / `embed` / `rerank` は別プロバイダーのままにしてください。

## トラブルシューティング

| エラー | 主な原因 |
|---|---|
| `401 UNAUTHORIZED` | キー前後の余分な空白、無効化されたキー、または IDE 起動前の `HOSTLINKU_API_KEY` 未設定。 |
| すべてのリクエストで `404` | OpenAI 互換 URL の `/v1` 漏れ、または Anthropic 互換 URL に不要な `/v1` を付けている。 |
| `404 MODEL_NOT_FOUND` | slug の打ち間違い、またはキーの Service Mode にないモデル。`GET /v1/models` で確認してください。 |
| `400 max_tokens` | モデルの `maxOutputTokens` 上限を超えています。設定値を下げてください。 |

## リンク

- IDE・エージェント連携ガイド: <https://docs.hostlinku.com/ja/integrations>
- Claude Code セットアップ: <https://github.com/dyocodes/hostlinku-claude-code-setup>
- API サンプル集: <https://github.com/dyocodes/hostlinku-api-examples>
- Console: <https://console.hostlinku.com>

## ライセンス

[MIT](LICENSE)。テンプレートはプレースホルダーのキーのみを含みます。
