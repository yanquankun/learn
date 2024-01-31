/**
 * 2024-01-31 19:44:09
 * @author Mint.Yan
 * @description: 防抖函数实现 n秒后执行一次
 * @param: {Function} fn
 * @param: {number} delay
 * @returns: Function
 */
const debounce = (fn, delay = 500) => {
  var timer = null;
  return function () {
    const context = this;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn.call(context, ...arguments);
    }, delay);
  };
};

//====== 测试区域开始 ======
const test = function (p) {
  console.log(p);
};
const debounceFn = debounce(test, 1000);
debounceFn(1);
debounceFn(2);
debounceFn(3);
setTimeout(() => {
  debounceFn(4);
}, 1050);
//====== 测试区域结束 ======
