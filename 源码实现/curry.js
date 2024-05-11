/**
 * 2024-02-01 15:19:52
 * @author Mint.Yan
 * @description: 函数柯里化实现
 * @param: {Function} fn 需要柯里化的函数
 * @param: {arguments} args 参数
 * @returns: any
 */
const curry = (fn, ...args) => {
  // 函数柯里化实现是通过判断多次调用后的参数length是否大于等于原函数的length
  // 再通过bind的延迟加载的特性以及合并参数的特性实现缓存参数
  /**
   * bind实现可参考如下地址：
   * {@link https://github.com/yanquankun/learn/blob/master/source/bind.js GitHub}.
   */
  return args.length < fn.length
    ? curry.bind(null, fn, ...args)
    : fn(...args.slice(0, fn.length));
};

//====== 测试区域开始 ======
const fn = function (a, b, c, d, e, f) {
  console.log(arguments);
};
const curryFn = curry(fn, 111);
curryFn(1, 2, 3)(4);
curryFn(1, 2, 3)(4)(5, 6);
curryFn(1, 2, 3)(4)(5, 6, 7);
const curryFn2 = curry(fn);
curryFn2()()(1, 2, 3, 4, 5, 6);
//====== 测试区域结束 ======
