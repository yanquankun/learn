/**
 * 2024-02-01 14:24:47
 * @author Mint.Yan
 * @description: apply 实现
 * @param: {...arguments} [context,...args] context及剩余参数
 * @returns: any
 */
Function.prototype._apply = function () {
  if (typeof this !== "function") throw Error(`${this} must be a function`);
  let context = Array.prototype.shift.call(arguments),
    result = null;
  context =
    context === null || context === undefined ? globalThis : Object(context);
  const symbol = Symbol("fn");
  context[symbol] = this;
  result = context[symbol](arguments);
  delete context[symbol];
  return result;
};

//====== 测试区域开始 ======
var test = function (p) {
  console.log(this, p);
};
test._apply(null, [1]);
test._apply({ a: 1 }, [1]);
test._apply(1, [1]);
test._apply("", [1]);
//====== 测试区域结束 ======
