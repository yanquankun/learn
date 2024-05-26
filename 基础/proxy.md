## Vue3 为什么使用 proxy 替换 defineProperty 来实现响应式？

- Proxy 无需一层层递归为每个属 性添加代理，一次即可完成以上操作，性能上更好
- 解决 Vue2 中 Object 和 Array 部分 API 数据更新无法监听到的问题，但是 Proxy 可以完美监听到任何方式 的数据改变
- 唯一缺陷就是浏览器的兼容性不好

### 简单实现下

```javascript
const watch = function (obj, bindGet, bindSet) {
  let handler = {
    get(target, property) {
      // 收集依赖
      bindGet(target, property);
      return Reflect.get(target, property);
    },
    set(target, property, value) {
      // 派发更新
      bindSet(property, value);
      return Reflect.set(target, property, value);
    },
  };
  return new Proxy(obj, handler);
};
let obj = { a: 1 };
let proxyObj = watch(
  obj,
  (target, property) => {
    console.log(`给${JSON.stringify(target)}的${property}属性绑定依赖`);
  },
  (property, value) => {
    console.log(`${property}属性的值变更为了${value}`);
  }
);
proxyObj.a;
proxyObj.a = 2;
```
