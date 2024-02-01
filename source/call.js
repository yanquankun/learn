/**
 * 2024-02-01 11:09:37
 * @author Mint.Yan
 * @description: call 实现
 * @param: {...arguments} [context,...args] context及剩余参数
 * @returns: any
 */
Function.prototype._call = function () {
  if (typeof this !== "function") throw Error(`${this} must be a function`);
  let context = Array.prototype.shift.call(arguments),
    result = null;
  context =
    context === null || context === undefined ? globalThis : Object(context);
  const symbol = Symbol("fn");
  context[symbol] = this;
  result = context[symbol](...arguments);
  delete context[symbol];
  return result;
};

//====== 测试区域开始 ======
var test = function (p) {
  console.log(this, p);
};
test._call(null, 1);
test._call({ a: 1 }, 1);
test._call(1, 1);
test._call("", 1);
//====== 测试区域结束 ======
