# Hostlinku IDE 与编程助手配置集

[![CI](https://github.com/dyocodes/hostlinku-ide-setup/actions/workflows/ci.yml/badge.svg)](https://github.com/dyocodes/hostlinku-ide-setup/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[English](README.md) | [Bahasa Indonesia](README.id.md) | [日本語](README.ja.md) | **简体中文**

开箱即用的配置模板、Base URL 速查表与端点校验脚本，帮助你在 **Cursor**、**Cline / Roo Code**、**Zed**、**Codex CLI**、**OpenCode** 和 **Continue** 中接入 [Hostlinku](https://hostlinku.com)。

## Base URL 速查表

| 客户端 | 提供商 / 模式 | Base URL | 模板文件 |
|---|---|---|---|
| **Cursor** | Override OpenAI Base URL | `https://api.hostlinku.com/v1` | 界面设置 |
| **Cline / Roo Code** | OpenAI Compatible *（推荐）* | `https://api.hostlinku.com/v1` | 界面设置 |
| **Cline / Roo Code** | Anthropic（自定义 Base URL） | `https://api.hostlinku.com` *（不带 `/v1`）* | 界面设置 |
| **Zed** | `openai_compatible.hostlinku` | `https://api.hostlinku.com/v1` | [`configs/zed-settings.json`](configs/zed-settings.json) |
| **Codex CLI** | 自定义提供商（`wire_api = "responses"`） | `https://api.hostlinku.com/v1` | [`configs/codex-config.toml`](configs/codex-config.toml) |
| **OpenCode** | `@ai-sdk/openai-compatible` | `https://api.hostlinku.com/v1` | [`configs/opencode.json`](configs/opencode.json) |
| **Continue** | `openai` | `https://api.hostlinku.com/v1` | [`configs/continue-config.json`](configs/continue-config.json) |

## 先验证 API Key 连通性

把密钥填入编辑器前，先验证 `/v1/models`、`/v1/chat/completions` 和 `/v1/responses`（零依赖，需要 Node.js ≥ 18）：

```bash
HOSTLINKU_API_KEY=sk-your-api-key node scripts/verify-ide-endpoint.mjs
```

## 各客户端要点与注意事项

- **Cursor：** 点击 *Verify* 时请求从 Cursor 服务器发出（不支持 `localhost`，`https://api.hostlinku.com/v1` 可正常通过）。Cursor Tab 自动补全仍使用官方后端，Chat、Cmd-K 和 Agent 走 Hostlinku。如遇流式卡顿，可将 *HTTP Compatibility Mode* 切换为 **HTTP/1.1**。
- **Cline / Roo Code：** 使用 **OpenAI Compatible** 可调用目录中的全部模型（Claude、GPT、DeepSeek）。如改用 **Anthropic**，请去掉 `/v1`（填 `https://api.hostlinku.com`）并仅选择 Cline 内置识别的 Claude ID。
- **Zed：** 需在 `settings.json` 的 `language_models.openai_compatible.hostlinku.available_models` 显式列出模型，并在 Agent Panel 设置中粘贴密钥（或导出 `HOSTLINKU_API_KEY`）。Edit Predictions 依赖 `/v1/completions` (FIM)，请保持默认。
- **Codex CLI：** 必须写入用户主目录 `~/.codex/config.toml`（项目内 `.codex/config.toml` 不生效），并保留 `wire_api = "responses"`。Performance / Economy 模式下请使用 OpenAI/GPT 模型（`gpt-5-5`、`gpt-5-6-luna`、`gpt-6-astra`），不支持 Claude 或国产模型。
- **OpenCode：** 将密钥存入 `~/.config/opencode/hostlinku-api-key.txt`，在 [`configs/opencode.json`](configs/opencode.json) 中通过 `{file:~/.config/opencode/hostlinku-api-key.txt}` 引用，保存后重启 OpenCode。
- **Continue：** 支持 `chat`、`edit`、`apply` 角色（[`configs/continue-config.json`](configs/continue-config.json)，或转换为 `~/.continue/config.yaml`）。`autocomplete` / `embed` / `rerank` 请保留其他提供商。

## 常见故障排查

| 错误 | 常见原因 |
|---|---|
| `401 UNAUTHORIZED` | 复制密钥时带入多余空格、密钥已吊销，或启动 IDE/CLI 前未导出 `HOSTLINKU_API_KEY`。 |
| 所有请求均返回 `404` | OpenAI 兼容路径漏掉 `/v1`，或 Anthropic 兼容路径多加了 `/v1`。 |
| `404 MODEL_NOT_FOUND` | 模型 slug 拼写有误，或该模型不在当前密钥的 Service Mode 内（可通过 `GET /v1/models` 检查）。 |
| `400 max_tokens` | 输出 token 上限超出模型自身的 `maxOutputTokens`，请调低配置中的 `max_tokens`。 |

## 链接

- IDE 与编程助手文档：<https://docs.hostlinku.com/zh/integrations>
- Claude Code 配置仓库：<https://github.com/dyocodes/hostlinku-claude-code-setup>
- API 示例仓库：<https://github.com/dyocodes/hostlinku-api-examples>
- Console：<https://console.hostlinku.com>

## 许可证

[MIT](LICENSE)。模板仅包含占位符密钥。
