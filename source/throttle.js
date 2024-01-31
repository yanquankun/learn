/**
 * 2024-01-31 19:54:36
 * @author Mint.Yan
 * @description: 节流函数实现 N秒内只执行一次
 * @param: {Function} fn
 * @param: {number} delay
 * @returns: Function
 */
const throttle = (fn, delay = 500) => {
  var timer = null;
  return function () {
    if (timer) return;
    const context = this;
    fn.call(context, ...arguments);
    timer = setTimeout(() => {
      timer = null;
    }, delay);
  };
};

//====== 测试区域开始 ======
const test = function (p) {
  console.log(p);
};
const debounceFn = throttle(test, 1000);
debounceFn(1);
debounceFn(2);
debounceFn(3);
//====== 测试区域结束 ======
