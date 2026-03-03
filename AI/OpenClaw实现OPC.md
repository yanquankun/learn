目前OPC（一人公司）的概念很火爆，那我们也跟风来一个，配合现在爆火的🦞OpenClaw搭建一个OPC

*目前我主力Channel选择的是discord，日常使用上，discord会比飞书更好用，备用渠道使用飞书，这里我推荐使用飞书的方式实现OPC*

---

🏢 一人公司（OPC）多 Bot 协作系统搭建笔记

基于 OpenClaw + 飞书，实现主 Bot 分发任务、各角色 Bot 独立回复的多智能体工作流

---

🎯 目标

在飞书群聊中，实现以下工作流：

Mint @OpenClaw（主管家）发起任务
                ↓
OpenClaw 判断任务类型 → sessions_send 分配给对应角色
                ↓
Kai·Dev / Mia·PM / Aria·UI 等角色用自己的 Bot 账号回复群聊

---

🤖 角色设定

OpenClaw 🔮
• 负责领域: 总调度、任务分发
• 飞书 Bot 账号: 主账号（default）

Mia · PM 🗂️
• 负责领域: 需求分析、PRD、任务拆解
• 飞书 Bot 账号: pm
Kai · Dev 💻
• 负责领域: 代码、技术方案、开发
• 飞书 Bot 账号: dev

Aria · UI 🎨
• 负责领域: 设计、配色、UI 组件
• 飞书 Bot 账号: ui

Rex · QA 🧪
• 负责领域: 测试、Bug、验收
• 飞书 Bot 账号: qa

Nova · Ops 📢
• 负责领域: 文案、运营、推广
• 飞书 Bot 账号: ops

Zoe · Data 📊
• 负责领域: 数据分析、调研、竞品
• 飞书 Bot 账号: data

![image-20260303171603651](https://oss.yanquankun.cn/oss-cdn/img/image-20260303171603651.png!watermark)

---

🏗️ 系统架构

核心组件

```txt
OpenClaw Gateway（常驻服务）
├── channels.feishu
│ ├── accounts.default → OpenClaw 主账号
│ ├── accounts.pm → Mia · PM
│ ├── accounts.dev → Kai · Dev
│ ├── accounts.ui → Aria · UI
│ ├── accounts.qa → Rex · QA
│ ├── accounts.ops → Nova · Ops
│ └── accounts.data → Zoe · Data
├── agents
│ ├── main → 主会话
│ ├── feishu-opc → 飞书群专属调度 agent
│ ├── pm / dev / ui → 各角色 agent
│ └── qa / ops / data
└── bindings
└── feishu group oc_xxx → feishu-opc agent
```

---

⚙️ 关键配置

飞书群消息策略

```json
{
  "channels": {
    "feishu": {
      "groups": {
        "oc_e361d8ec4a3102023ea8f7bb1e008e95": {
          "requireMention": true
        }
      },
      "accounts": {
        "pm": { "groups": { "oc_xxx": { "requireMention": false } } },
        "dev": { "groups": { "oc_xxx": { "requireMention": false } } },
        "ui": { "groups": { "oc_xxx": { "requireMention": false } } },
        "qa": { "groups": { "oc_xxx": { "requireMention": false } } },
        "ops": { "groups": { "oc_xxx": { "requireMention": false } } },
        "data": { "groups": { "oc_xxx": { "requireMention": false } } }
      }
    }
  }
}
```


设计逻辑：

• default（OpenClaw）requireMention: true → 只响应 @OpenClaw，避免响应所有消息
• 角色 Bot requireMention: false → 收到 sessions_send 分配的任务后，能主动发消息到群里

飞书 OPC 群绑定专属 Agent

```json
{
  "bindings": [
    {
      "agentId": "feishu-opc",
      "match": {
        "channel": "feishu",
        "peer": {
          "kind": "group",
          "id": "oc_e361d8ec4a3102023ea8f7bb1e008e95"
        }
      }
    }
  ]
}
```

作用： 飞书 OPC 群的消息专属路由到 feishu-opc agent，加载调度专用的 AGENTS.md。

专属调度 AGENTS.md
路径：~/.openclaw/agents/feishu-opc/agent/AGENTS.md

核心逻辑：

收到任务
    ↓
判断角色（pm/dev/ui/qa/ops/data）
    ↓
sessions_send(label="dev", message="任务 + 要求用自己 accountId 发到飞书群")
    ↓
角色处理完 → message(channel=feishu, accountId=dev, target=chat:oc_xxx)
    ↓
角色回复 Moltbot「已发送✅」→ NO_REPLY

---
🚧 踩坑记录

❌ 坑1：飞书 Bot @ Bot 不生效

现象： OpenClaw 在群里 @Kai·Dev，Kai 没有响应
原因： 飞书平台限制——机器人发出的消息不会触发其他机器人的事件订阅（防止无限循环）
解法： 改用 OpenClaw 内部的 sessions_send 工具调度，完全绕过飞书事件系统

❌ 坑2：所有 Bot 都响应群消息

现象： 群里一条消息，7 个 Bot 全部响应，乱成一锅粥
原因： requireMention: false 对所有账号生效
解法： 仅 default 账号设置 requireMention: true；角色账号通过 sessions_send 被动接收任务

❌ 坑3：bot open_id resolved: unknown

现象： Gateway 重启后 @OpenClaw 无法触发，日志显示 did not mention bot
原因： 重启时飞书 API 请求失败，bot open_id 未能获取，mention 匹配失败
解法： 再次重启 Gateway，确认日志中所有账号 bot open_id resolved: ou_xxx（非 unknown）

❌ 坑4：AGENTS.md 调度指引没被加载

现象： OpenClaw 在群里直接自己回答了，没有分发任务
原因： main agent 没有配置 agentDir，加载的是 workspace 里的通用 AGENTS.md
解法： 创建 feishu-opc 专属 agent + binding，把调度逻辑直接写入专属 AGENTS.md

---

✅ 最终效果

![image-20260303171451707](https://oss.yanquankun.cn/oss-cdn/img/image-20260303171451707.png!watermark)

每个角色都有独立的 Bot 账号、独立的人设、独立的专业能力，真正实现了一人公司多角色协作的感觉 🎉

---

📁 关键文件路径

**~/.openclaw/openclaw.json**
• 用途: 主配置（账号、binding、agent）
**~/.openclaw/agents/feishu-opc/agent/AGENTS.md**
• 用途: 飞书群调度专属指引

**~/.openclaw/workspace-{role}/AGENTS.md**
• 用途: 各角色工作指引

**~/.openclaw/workspace-{role}/SOUL.md**
• 用途: 各角色人设

**~/clawd/OPC.md**
• 用途: OPC 调度手册（v6）

---

最后说下我的配置：


**平台**
OpenClaw + 飞书|discord | 服务器：Vultr VPS

**VPS**

vCPU/s: 1 vCPU

RAM: 2048.00 MB

Storage: 55 GB SSD

