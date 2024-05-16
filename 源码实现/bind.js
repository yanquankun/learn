/**
 * 2024-02-01 14:59:25
 * @author Mint.Yan
 * @description: bind 实现
 * @param: {context} context 函数上下文
 * @returns: Function
 */
Function.prototype._bind = function (context) {
  if (typeof this !== "function") throw Error(`${this} must be a function`);
  const args = Array.prototype.slice.shift(arguments);
  context =
    context === undefined || context === null ? globalThis : Object(context);
  return function () {
    const fn = this;
    fn.apply(context, ...args.concat(arguments));
  };
};

//====== 测试区域开始 ======
var t = function () {
  console.log(this, arguments);
};
t.bind(123)(1);
t.bind(123, 1)(2, { a: 1 });
t.bind(null, 1)(2, { a: 1 });
//====== 测试区域结束 ======
