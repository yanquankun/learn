_我们在使用 vue3 的时候，对于数据共享，基本会想到 vuex 和 pinia，但 vue3 中，更推荐的是 pinia，什么是 pinia 呢？可以借用 vuejs 官方文档中的内容：_

![image-20250619175851399](https://oss.yanquankun.cn/oss-cdn/image-20250619175851399.png!watermark)

**或许我们会对 vue 中的状态管理产生一些疑问 ❓ 它是如何进行的数据共享？其内部的一些方法是如何实现的 ❓ 我们可以通过源码进行一窥究竟**

#### 源码下载

github 地址：https://github.com/vuejs/pinia

建议自己 fork 一份进行调试

**这里我个人已经梳理了一个简单的 pinia 源码仓库，地址： [learnPinia](https://github.com/yanquankun/learnPinia/tree/learn) 供大家借鉴~**

#### 源码结构分析

先看下整个 pinia 项目的目录结构以及分工

```javascript
pinia/
├── packages/
│   ├── docs/                   # 文档相关内容
│   │   └── zh/                 # 中文文档
│   │       └── api/            # API 文档
│   │           └── interfaces/ # 接口相关文档
│   │           └── modules/    # 模块相关文档
│   ├── nuxt/                   # 与 Nuxt 集成相关的代码
│   ├── online-playground/      # 在线 playground，用于快速测试和体验
│   ├── pinia/                  # Pinia 核心库代码
│   │   ├── .gitignore          # 配置 Git 忽略的文件和目录
│   │   ├── CHANGELOG.md        # 版本变更日志
│   │   ├── README.md           # 项目说明文档
│   │   ├── api-extractor.json  # API 提取工具的配置文件
│   │   ├── index.cjs           # CommonJS 模块入口文件
│   │   ├── package.json        # 项目元数据和依赖信息
│   │   ├── src/                # 源代码目录
│   │   │   ├── createPinia.ts  # 创建 Pinia 实例的代码
│   │   │   ├── devtools/       # 开发工具相关代码
│   │   │   ├── env.ts          # 环境相关的配置和判断代码
│   │   │   ├── global.d.ts     # 全局类型声明文件
│   │   │   ├── globalExtensions.ts # 全局扩展代码
│   │   │   ├── hmr.ts          # 热模块替换相关代码
│   │   │   ├── index.ts        # 模块入口文件
│   │   │   ├── mapHelpers.ts   # 映射辅助函数相关代码
│   │   │   ├── rootStore.ts    # 根 store 相关代码
│   │   │   ├── store.ts        # 定义 store 的核心代码
│   │   │   ├── storeToRefs.ts  # 将 store 转换为 refs 的代码
│   │   │   ├── subscriptions.ts # 订阅相关代码
│   │   │   └── types.ts        # 类型定义文件
│   │   ├── test-dts/           # 类型定义测试文件
│   │   │   ├── actions.test-d.ts # 动作类型定义测试
│   │   │   ├── ...             # 其他类型定义测试文件
│   │   │   └── tsconfig.json   # TypeScript 配置文件
│   │   └── __tests__/          # 测试代码目录
│   │       ├── actions.spec.ts # 动作相关测试
│   │       ├── combinedStores.spec.ts # 组合 store 相关测试
│   │       ├── devtools.spec.ts # 开发工具相关测试
│   │       ├── ...             # 其他测试文件
│   ├── playground/             # 本地 playground，用于开发和测试
│   │   └── src/
│   │       ├── stores/
│   │       │   └── wholeStore.ts # 示例 store 文件
│   │       └── views/
│   │           └── AllStoresDispose.vue # 视图组件文件
│   └── size-check/             # 代码体积检查相关代码
│   └── testing/                # 测试相关的辅助代码
├── .github/                    # GitHub 相关配置文件
├── scripts/                    # 脚本文件目录
│   ├── docs-check.sh           # 文档检查脚本
│   ├── release.mjs             # 版本发布脚本
│   └── verifyCommit.mjs        # 提交信息验证脚本
├── .gitignore                  # 配置 Git 忽略的文件和目录
├── .npmrc                      # npm 配置文件
├── .prettierignore             # Prettier 忽略的文件和目录
├── .prettierrc.js              # Prettier 配置文件
├── LICENSE                     # 项目许可证文件
├── README.md                   # 项目根目录说明文档
├── SECURITY.md                 # 安全相关说明文档
├── codecov.yml                 # Codecov 配置文件
├── netlify.toml                # Netlify 部署配置文件
├── package.json                # 项目根目录元数据和依赖信息
├── pnpm-lock.yaml              # pnpm 依赖锁定文件
├── pnpm-workspace.yaml         # pnpm 工作区配置文件
├── renovate.json               # Renovate 配置文件，用于自动更新依赖
├── rollup.config.mjs           # Rollup 打包配置文件
├── tsconfig.json               # TypeScript 根配置文件
├── vitest.config.ts            # Vitest 测试配置文件
└── vitest.workspace.js         # Vitest 工作区配置文件
```

_可以看到有很多子包，但我们不需要挨个解读和学习，重点将放在 package/pinia、package/playground 这两个包上，pinia 包则是它的具体实现源码，playground 包则是我们调试的 demo_

下面给出 pinia 包的目录结构介绍

```javascript
packages/pinia/
├── .gitignore                  # 配置 Git 忽略的文件和目录，确保某些文件不会被提交到版本控制系统
├── CHANGELOG.md                # 记录 Pinia 库每个版本的变更内容，方便开发者了解版本更新情况
├── README.md                   # 详细介绍 Pinia 库的功能、使用方法、安装方式等信息，是新用户了解项目的重要入口
├── api-extractor.json          # API 提取工具的配置文件，用于从源代码中提取 API 文档信息
├── index.cjs                   # CommonJS 模块的入口文件，方便使用 CommonJS 规范的项目引入 Pinia
├── package.json                # 定义了 Pinia 库的元数据，如名称、版本、依赖等，是项目管理的重要文件
├── src/                        # 源代码目录，包含了 Pinia 库的核心实现
│   ├── createPinia.ts          # 提供创建 Pinia 实例的函数，是使用 Pinia 的基础
│   ├── devtools/               # 开发工具相关的代码，用于在开发环境中调试和监控 Pinia store
│   ├── env.ts                  # 处理环境相关的逻辑，如判断是否为客户端环境等
│   ├── global.d.ts             # 全局类型声明文件，为整个项目提供类型支持
│   ├── globalExtensions.ts     # 实现全局扩展功能，可用于扩展 Pinia 的默认行为
│   ├── hmr.ts                  # 热模块替换（HMR）相关的代码，在开发过程中实现代码修改后无需刷新页面即可更新
│   ├── index.ts                # 模块的入口文件，统一导出 Pinia 的核心功能和类型
│   ├── mapHelpers.ts           # 提供映射辅助函数，方便在组件中使用 store 的状态和方法
│   ├── rootStore.ts            # 定义根 store 的相关接口和类型，是整个 Pinia 架构的基础
│   ├── store.ts                # 核心文件，定义了如何创建和管理 store，包括状态、getters、actions 等
│   ├── storeToRefs.ts          # 实现将 store 的状态转换为响应式引用（refs）的功能，方便在组件中使用
│   ├── subscriptions.ts        # 处理 store 的订阅逻辑，允许监听状态变化和动作调用
│   └── types.ts                # 定义了 Pinia 中使用的各种类型，确保代码的类型安全
├── test-dts/                   # 类型定义测试文件目录，用于验证类型定义的正确性
│   ├── actions.test-d.ts       # 测试动作（actions）类型定义的文件
│   ├── ...                     # 其他类型定义测试文件，根据不同的功能模块进行分类测试
│   └── tsconfig.json           # TypeScript 配置文件，指定了测试代码的编译选项
└── __tests__/                  # 测试代码目录，包含了对 Pinia 各个功能模块的单元测试和集成测试
    ├── actions.spec.ts         # 测试动作（actions）功能的文件
    ├── combinedStores.spec.ts  # 测试组合 store 功能的文件，验证多个 store 之间的交互和使用
    ├── devtools.spec.ts        # 测试开发工具相关功能的文件
    ├── ...                     # 其他测试文件，覆盖了 Pinia 的各种功能和场景
```

#### 源码运行

```javascript
// 通过如下脚本，可以开启playground项目的运行
"play": "pnpm run -r play",
```

_一个成熟的库，必然会兼容不同的模块化方式，我们在不同场景下，必然希望可以自动进行模块化引入，那么 pinia 是如何做的呢 ❓ 答案是在 package.json 中增加不同模块化和环境对应配置即可，那么根据 node 的引用策略，则会注入对应的入口文件，下面我们解析下 pinia bundle 的 package.json 中的一些配置_

```json
{

  "main": "index.cjs", // node环境默认使用该入口
  "module": "dist/pinia.mjs", // esm入口
  "unpkg": "dist/pinia.iife.js", // cdn平台使用的入口，如果没有这个字段，unpkg 默认加载 main 或 module 字段指定的文件，通常是 CJS 或 ESM 格式，不适合浏览器直接用 <script> 标签引用
  "jsdelivr": "dist/pinia.iife.js", // cdn平台使用的入口，如果没有这个字段，unpkg 默认加载 main 或 module 字段指定的文件，通常是 CJS 或 ESM 格式，不适合浏览器直接用 <script> 标签引用
  "exports": {
    ".": { // 控制 `import 'pinia'` 时的行为，用来定义主入口路径
      "node": { // node 环境在esm和cjs引用中，不同环境所引用的pinia sdk
        "import": {
          "production": "./dist/pinia.prod.cjs",
          "development": "./dist/pinia.mjs",
          "default": "./dist/pinia.mjs"
        },
        "require": {
          "production": "./dist/pinia.prod.cjs",
          "development": "./dist/pinia.cjs",
          "default": "./index.cjs"
        }
      },
      "import": "./dist/pinia.mjs", // ESModule 引入优先
      "require": "./index.cjs" // 其次是cjs 引入
    },
    "./package.json": "./package.json" // 控制是否允许外部读取 `pinia/package.json`，如果没有此字段，当你使用 import pkg from 'pinia/package.json'; 时，将会出现ERR_PACKAGE_PATH_NOT_EXPORTED的报错
  },
  ... // 其余部分配置不做解释
}
```

ok，我们已了解了 pinia 的入口引入方式，下面将在 demo 中配置 pinia 的入口地址以供我们进行源码调试。

在 demo 中，你需要将 pinia 资源引用执行到所期望调试的模块，我们是期望直接在本地源码中进行调试，所以可以在 vite 这样配置：

```javascript
resolve: {
    dedupe: ['vue', 'pinia'],
    alias: {
      // 这样pinia将指向到了我们项目中的pinia源码中
      pinia: fileURLToPath(new URL('../pinia/src/index.ts', import.meta.url)),
    },
},
```

#### 源码调试

1. 环境准备

​ 首先需要完善我们的 ide 的调试环境，由于 playground 中引用的是 pinia 本地包，是 ts 文件配置，所以我们需要配置如下的 launch.json

```json
{
  // 使用 IntelliSense 了解相关属性。
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "name": "调试pinia",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:5173/",
      "webRoot": "${workspaceFolder}",
      "sourceMaps": true,
      "trace": true,
      "skipFiles": ["<node_internals>/**"],
      "sourceMapPathOverrides": {
        "http://localhost:5173/src/*": "${workspaceFolder}/learnPinia/packages/playground/src/*",
      }
    },
    ...
  ]
}

```

2. 增加断点

![image-20250620155933989](https://oss.yanquankun.cn/oss-cdn/image-20250620155933989.png!watermark)

3. 开启调试模式
   ![image-20250620160020922](https://oss.yanquankun.cn/oss-cdn/image-20250620160020922.png!watermark)

在调试 tab 中，选取我们刚创建好的 `调试pinia` 选项后点击开启按钮，可以看到进入了调试模式
![image-20250620160158745](https://oss.yanquankun.cn/oss-cdn/image-20250620160158745.png!watermark)
