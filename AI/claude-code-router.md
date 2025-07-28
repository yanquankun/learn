

### Claude Code Router 使用指南与实践经验分享

> 本文介绍了一个轻量级本地代理工具 —— [Claude Code Router](https://github.com/musistudio/claude-code-router)，它能将 Claude API 路由到你本地，从而实现自定义接入 Gemini、OpenAI、Claude 等多种 AI 服务的能力。

---

### ✨ 什么是 Claude Code Router？

`Claude Code Router（ccr）` 是由 [@musistudio](https://github.com/musistudio) 开源的一个 Node.js 工具，旨在通过本地服务统一转发各种 AI 平台（如 Claude、Gemini、OpenAI）的请求，使得多模型接入变得更加统一灵活。

它的核心目标是：
- **通过本地启动的服务统一管理模型请求**
- **支持 CLI 快速调用 AI 模型**
- **为插件、编辑器、MCP 工具提供统一接入点**

---

### 🚀 快速开始

#### 1. 安装

确保你已经安装了 Node.js（建议 v18+）：

```bash
npm install -g claude-code-router
```

#### 2. 启动服务

```bash
ccr code
```

这会在本地启动一个 HTTP 服务（默认端口 `11434`），用于路由各类 AI 请求。

如果出现以下错误提示：

```bash
Service not running, starting service...
Service startup timeout, please manually run `ccr start` to start the service
```

说明服务启动较慢，建议手动运行 `ccr start` 以查看具体日志。

如果运行正常，则会提示你输入模型、api key等文本，根据提示输入即可，它会生成一个`~/.claude-code-router/config.json`配置文件，如果一切ok，那么你讲看到如下界面：

![image-20250716163724504](https://oss.yanquankun.cn/oss-cdn/image-20250716163724504.png!watermark)

#### 3. 查看配置文件

默认配置文件位于：

```bash
~/.claude-code-router/config.json
```

你可以修改此文件来自定义模型接入，以我个人为例，我使用的是gemini api（白嫖党最爱😄），配置如下：

**本文不对gemini api如何使用进行说明~各位可自行查阅使用方式😋**

```json
{
  "LOG": false,
  "OPENAI_API_KEY": "",
  "OPENAI_BASE_URL": "",
  "OPENAI_MODEL": "",
  "Providers": [
    {
      "name": "gemini",
      "api_base_url": "https://generativelanguage.googleapis.com/v1beta/models/",
      "api_key": "你自己的token",
      "models": [
        "gemini-2.5-flash"
      ],
      "transformer": {
        "use": ["gemini"]
      }
    }
  ],
  "Router": {
    "default": "gemini,gemini-2.5-flash",
    "background": "gemini,gemini-2.5-flash",
    "think": "gemini,gemini-2.5-flash",
    "longContext": "gemini,gemini-2.5-flash"
  },
  // 重点说明下PROXY_URL字段：由于gemini的访问会有国内限制，所以我们需要一个🪜来进行代理，由于我个人使用的是shadowsocket
  // 其Http代理配置为127.0.0.1:1087，所以此处也需要配置下gemini api的代理转发路径
  "PROXY_URL": "http://127.0.0.1:1087"
}
```

------

### 📦 高级功能与集成

Claude Code Router 实际可以作为一个本地“中转中心”，你可以：

- 同时转发多个模型服务（Claude、Gemini、OpenAI）
- 配合前端 UI 工具构建多模型助手
- 作为 Chat 客户端的后端转发服务

------

### 🔒 安全性注意事项

- `ccr` 本质是一个本地 HTTP 代理服务，不建议直接暴露到公网
- 若用于公网环境，建议增加身份认证或通过 Nginx 网关限制访问

---

### ❓或许你会问，这样做，我们不就享受不到原装的claude模型能力了吗？

**Claude（尤其是 Anthropic 提供的官方服务）目前对中国大陆用户极度不友好**，这也是为什么像 `Claude Code Router` 这样的本地代理工具**非常必要**的原因之一，虽然我们对内容的处理使用了其他模型，但是对于claude code来说，它的核心不光是配套的模型能力，还有**提示词**、**事件编排**、**脚手架能力**也是很有使用价值的~

> 💡 总结：
>
> Claude Code Router 并不会削弱 Claude 模型能力，也不会“替代”官方服务。它只是让你能在本地更好地组织、使用、代理这些强大的 AI 接口，并统一化接口形式，尤其适用于多模型开发和安全场景下的需求。
