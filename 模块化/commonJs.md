在nodejs中，由于有且仅有一个入口文件（启动文件），而开发一个应用肯定会涉及到多个文件配合，因此，nodejs对模块化的需求比浏览器端要大的多

![img](https://oss.yanquankun.cn/oss-cdn/2019-12-02-11-15-01.png!watermark)

由于nodejs刚刚发布的时候，前端没有统一的、官方的模块化规范，因此，它选择使用社区提供的CommonJS作为模块化规范

在学习CommonJS之前，首先认识两个重要的概念：**模块的导出**和**模块的导入**

## 模块的导出

要理解模块的导出，首先要理解模块的含义

什么是模块？

模块就是一个JS文件，它实现了一部分功能，并隐藏自己的内部实现，同时提供了一些接口供其他模块使用

模块有两个核心要素：**隐藏**和**暴露**

隐藏的，是自己内部的实现

暴露的，是希望外部使用的接口

任何一个正常的模块化标准，都应该默认隐藏模块中的所有实现，而通过一些语法或api调用来暴露接口

**暴露接口的过程即模块的导出**

![img](https://oss.yanquankun.cn/oss-cdn/2019-12-02-11-27-12.png!watermark)

## 模块的导入

当需要使用一个模块时，使用的是该模块暴露的部分（导出的部分），隐藏的部分是永远无法使用的。

**当通过某种语法或api去使用一个模块时，这个过程叫做模块的导入**

## CommonJS规范

CommonJS使用`exports`导出模块，`require`导入模块

具体规范如下：

1. 如果一个JS文件中存在`exports`或`require`，该JS文件是一个模块
2. 模块内的所有代码均为隐藏代码，包括全局变量、全局函数，这些全局的内容均不应该对全局变量造成任何污染
3. 如果一个模块需要暴露一些API提供给外部使用，需要通过`exports`导出，`exports`是一个空的对象，你可以为该对象添加任何需要导出的内容
4. 如果一个模块需要导入其他模块，通过`require`实现，`require`是一个函数，传入模块的路径即可返回该模块导出的整个内容

## nodejs对CommonJS的实现

为了实现CommonJS规范，nodejs对模块做出了以下处理

1. 为了保证高效的执行，仅加载必要的模块。nodejs只有执行到`require`函数时才会加载并执行模块

2. 为了隐藏模块中的代码，nodejs执行模块时，会将模块中的所有代码放置到一个函数中执行，以保证不污染全局变量。

   ```javascript
    (function(){
        //模块中的代码
    })()
   ```

3. 为了保证顺利的导出模块内容，nodejs做了以下处理

   1. 在模块开始执行前，初始化一个值`module.exports = {}`
   2. `module.exports`即模块的导出值
   3. 为了方便开发者便捷的导出，nodejs在初始化完`module.exports`后，又声明了一个变量`exports = module.exports`

   ```javascript
    (function(module){
        module.exports = {};
        var exports = module.exports;
        //模块中的代码
        return module.exports;
    })()
   ```

4. 为了避免反复加载同一个模块，nodejs默认开启了模块缓存，如果加载的模块已经被加载过了，则会自动使用之前的导出结果

## commonJS代码实现

```javascript
// 简单版 CommonJS require 实现

// 模块缓存对象，用于存储已加载的模块
const moduleCache = {};

// 解析模块路径的函数
function resolveModulePath(request, parent) {
  // 这里简化实现，实际上需要处理相对路径、绝对路径、node_modules等
  // 如果是相对路径，则相对于父模块路径解析
  // 如果是绝对路径，则直接使用
  // 如果既不是相对也不是绝对路径，则需要在node_modules中查找
  
  // 简化版本：仅处理基本情况
  const path = require('path'); // 这里假设原生path模块可用
  
  // 如果是相对路径
  if (request.startsWith('./') || request.startsWith('../')) {
    const parentDir = parent ? path.dirname(parent.filename) : process.cwd();
    return path.resolve(parentDir, request);
  }
  
  // 如果是内置模块，直接返回
  if (isBuiltinModule(request)) {
    return request;
  }
  
  // 其他情况简化处理(假设在node_modules目录中)
  return path.resolve('node_modules', request);
}

// 判断是否是内置模块
function isBuiltinModule(request) {
  // 简化检查，实际上需要检查所有内置模块
  const builtinModules = ['fs', 'path', 'http', 'util', /* 其他内置模块 */];
  return builtinModules.includes(request);
}

// 加载模块的函数
function loadModule(filename) {
  // 简化实现，实际上需要处理不同类型的文件(.js, .json, .node等)
  const fs = require('fs'); // 假设原生fs模块可用
  
  try {
    // 读取文件内容
    const content = fs.readFileSync(filename, 'utf-8');
    return content;
  } catch (err) {
    throw new Error(`无法加载模块 ${filename}: ${err.message}`);
  }
}

// Module类
class Module {
  constructor(id, parent) {
    this.id = id; // 模块ID，通常是文件路径
    this.exports = {}; // 模块导出的内容
    this.parent = parent; // 父模块
    this.filename = id; // 模块文件名
    this.loaded = false; // 模块是否已加载完成
    this.children = []; // 子模块
  }
  
  // 加载并编译模块
  load() {
    if (this.loaded) return;
    
    // 加载模块内容
    const content = loadModule(this.filename);
    
    // 编译并执行模块代码
    this._compile(content, this.filename);
    
    this.loaded = true;
  }
  
  // 编译模块
  _compile(content, filename) {
    // 创建模块包装函数
    // 在Node.js中，模块代码被包装在一个函数中执行
    // (function(exports, require, module, __filename, __dirname) {
    //    // 模块代码
    // });
    
    const wrapper = [
      '(function (exports, require, module, __filename, __dirname) { ',
      '\n});'
    ];
    
    // 将模块代码包装到函数中
    const wrappedCode = wrapper[0] + content + wrapper[1];
    
    // 使用vm模块运行代码（简化版本）
    // 实际中使用vm.runInThisContext或类似方法
    const compiledFunction = eval(wrappedCode);
    
    // 创建require函数
    const requireFn = (path) => {
      return Module._load(path, this);
    };
    
    // 获取目录名
    const path = require('path');
    const dirname = path.dirname(filename);
    
    // 执行编译后的函数
    compiledFunction(this.exports, requireFn, this, filename, dirname);
  }
  
  // 静态方法，加载模块
  static _load(request, parent) {
    // 解析模块路径
    const filename = resolveModulePath(request, parent);
    
    // 检查缓存
    if (moduleCache[filename]) {
      // 如果模块已在缓存中，直接返回其exports
      return moduleCache[filename].exports;
    }
    
    // 对于内置模块，使用不同的加载逻辑
    if (isBuiltinModule(request)) {
      // 简化版本，假设可以直接require内置模块
      return require(request);
    }
    
    // 创建新的模块实例
    const module = new Module(filename, parent);
    
    // 将模块放入缓存，在解析循环依赖时非常重要
    moduleCache[filename] = module;
    
    // 如果有父模块，将新模块添加到父模块的children中
    if (parent) {
      parent.children.push(module);
    }
    
    // 加载模块
    try {
      module.load();
    } catch (err) {
      // 如果加载失败，从缓存中删除
      delete moduleCache[filename];
      throw err;
    }
    
    return module.exports;
  }
}

// 创建全局require函数
function createRequire(filename) {
  // 创建一个"假"的父模块
  const parent = new Module(filename, null);
  
  // 返回绑定到这个父模块的require函数
  return function require(path) {
    return Module._load(path, parent);
  };
}

// 导出
module.exports = {
  Module,
  createRequire,
};
```

