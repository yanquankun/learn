**Babel**

Babel 是一个 JavaScript 编译器，主要用于将现代 JavaScript 转译为更广泛支持的旧版本。

1. `输入代码：` Babel 解析输入的现代 JS 代码。
2. `生成 AST：` 使用 @babel/parser 将代码解析为 AST。
3. `转换代码：` 通过插件链对 AST 进行修改（例如 ES6 转 ES5）。
4. `输出代码：` 通过 @babel/generator 将 AST 转换回可执行的 JavaScript。

### 实现一个简单的代码转译器，支持 print("Hello, World!")，将其转译为 console.log("Hello, World!")

#### 解析（Parse）

```javascript
// 将print代码转换为AST
function parse(code) {
  // 简单解析，支持 print("...")
  const match = code.match(/print\("(.+)"\)/);
  if (!match) {
    throw new Error("Invalid syntax");
  }

  return {
    type: "CallExpression",
    callee: "print",
    arguments: [
      {
        type: "Literal",
        value: match[1],
      },
    ],
  };
}

// 示例代码
const sourceCode = 'print("Hello, World!")';
const ast = parse(sourceCode);
console.log("AST:", JSON.stringify(ast, null, 2));
// AST：
// {
//   "type": "CallExpression",
//   "callee": "print",
//   "arguments": [
//     {
//       "type": "Literal",
//       "value": "Hello, World!"
//     }
//   ]
// }
```

#### 转换（Transform）

```javascript
// 转换print为console.log
function transform(ast) {
  if (ast.type === "CallExpression" && ast.callee === "print") {
    return {
      type: "CallExpression",
      callee: "console.log",
      arguments: ast.arguments,
    };
  }
  throw new Error("Unsupported AST node");
}

const transformedAst = transform(ast);
console.log("Transformed AST:", JSON.stringify(transformedAst, null, 2));
// Transformed AST:
// {
//   "type": "CallExpression",
//   "callee": "console.log",
//   "arguments": [
//     {
//       "type": "Literal",
//       "value": "Hello, World!"
//     }
//   ]
// }
```

#### 生成（Generate）

```javascript
// 将转换后的代码重新转换为js code
function generate(ast) {
  if (ast.type === "CallExpression" && ast.callee === "console.log") {
    const args = ast.arguments
      .map((arg) => {
        if (arg.type === "Literal") {
          return `"${arg.value}"`;
        }
        throw new Error("Unsupported argument type");
      })
      .join(", ");

    return `${ast.callee}(${args});`;
  }
  throw new Error("Unsupported AST node");
}

const outputCode = generate(transformedAst);
console.log("Output Code:", outputCode);
// Output Code:
// console.log("Output Code:", outputCode);
```

### AST Parse Tool

| 工具         | 特点                                                                      | 支持扩展 | 主要用途                 |
| ------------ | ------------------------------------------------------------------------- | -------- | ------------------------ |
| `Esprima`    | 简单轻量，生成标准 ESTree AST                                             | 否       | 基本代码解析             |
| `Acorn`      | 快速、小型，可扩展                                                        | 是       | 模块化解析器             |
| `Espree`     | 基于 Acorn，支持 JSX                                                      | 是       | ESLint 默认解析器        |
| `TypeScript` | 原生支持 TS 和 JS，强大                                                   | 否       | TypeScript 项目          |
| `UglifyJS`   | 解析、压缩一体化                                                          | 否       | 代码压缩和优化           |
| `Shift AST`  | 专注 ECMAScript 标准，功能全面                                            | 是       | 专业代码分析和工具链支持 |
| `SWC`        | 使用 Rust 编写，比 Babel 快很多，支持最新的 ECMAScript 和 TypeScript 标准 | 是       | 适合对性能要求较高的场景 |

### AST Generate

| 工具               | 特点                                                                      | 适用场景                        |
| ------------------ | ------------------------------------------------------------------------- | ------------------------------- |
| `@babel/generator` | 与 Babel 配合完美，支持复杂 AST                                           | Babel 插件开发，现代 JavaScript |
| `escodegen`        | 支持 ESTree 标准，功能全面                                                | 基础代码生成                    |
| `astring`          | 轻量级，专注于简单快速的代码生成                                          | 性能敏感的代码生成场景          |
| `TypeScript`       | 内置于 TypeScript，适合处理 TS 和 JS AST                                  | TypeScript 项目开发             |
| `SWC`              | 使用 Rust 编写，比 Babel 快很多，支持最新的 ECMAScript 和 TypeScript 标准 | 适合对性能要求较高的场景        |

### SWC

SWC（Speedy Web Compiler）是一个现代化、高性能的编译器，用于处理 JavaScript 和 TypeScript。它也支持将 AST 转换为 JavaScript 代码，我个人比较推荐使用这种方式：

```javascript
npm install @swc/core
```

```javascript
const { parseSync, printSync } = require("@swc/core");

// 示例 JavaScript 代码
const code = `
const x = 10;
function greet() {
  console.log("Hello, World!");
}
`;

// 1. 解析代码为 AST
const ast = parseSync(code, {
  syntax: "ecmascript", // 语法类型，支持 "typescript" 和 "ecmascript"
  comments: false, // 是否保留注释
  target: "es2020", // 目标 ECMAScript 版本
});

// 2. 将 AST 转换回 JavaScript 代码
const output = printSync(ast, {
  minify: false, // 是否最小化代码
  sourceMaps: false, // 是否生成 Source Map
});

// 输出生成的代码
console.log(output.code);
// const x = 10;
// function greet() {
//   console.log("Hello, World!");
// }
```
