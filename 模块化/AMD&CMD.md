### AMD

全称是Asynchronous Module Definition，即异步模块加载机制

require.js实现了AMD规范

在AMD中，导入和导出模块的代码，都必须放置在define函数中，依赖前置

```javascript
define([依赖的模块列表], function(模块名称列表){
    //模块内部的代码
    return 导出的内容
})
```

### CMD

全称是Common Module Definition，公共模块定义规范

sea.js实现了CMD规范

在CMD中，导入和导出模块的代码，都必须放置在define函数中，就近依赖，需要时才会加载

```javascript
define(function(require, exports, module){
    //模块内部的代码
})
```