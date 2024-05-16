/**
 * 2024-02-01 18:41:02
 * @author Mint.Yan
 * @description: 深拷贝实现
 * @param: {any} source 源对象
 * @returns: {any} 深拷贝后的对象
 */
const deepClone = (source, weakMap = new WeakMap()) => {
  // 简单数据类型直接返回 null也是object 但需要直接返回
  if (
    (typeof source !== "object" && typeof source !== "function") ||
    source === null
  ) {
    return source;
  }
  // 日期类型
  if (source instanceof Date) {
    const dateConstr = source.constructor;
    return new dateConstr(source);
  }
  // 函数类型
  if (source instanceof Function) {
    const fnStr = source.toString();
    return new Function(`return ${fnStr}`)();
  }
  //   正则类型
  if (source instanceof RegExp) {
    const regConstr = source.constructor;
    return new regConstr(source);
  }
  // 使用weakMap是因为它对数据的绑定是弱引用 会自动GC
  // 通过weakMap解决循环引用的问题
  const cloneData = Array.isArray(source) ? [] : Object.create({});
  if (weakMap.has(source)) {
    return source;
  }
  weakMap.set(source, cloneData);
  for (const key in source) {
    cloneData[key] = deepClone(source[key], weakMap);
  }
  return cloneData;
};
//====== 测试区域开始 ======
var obj = {
  a: 1,
  b: 2,
  c: [1, 2, { d: 3 }],
  date: new Date(),
  reg: /d+/,
  fn: function (param) {
    console.log(param);
  },
};
obj.obj = obj;
var newObj = deepClone(obj);
newObj.fn("我是参数");
console.log(newObj);
// newObj.a = "123";
// console.log(obj, newObj);
//====== 测试区域结束 ======
