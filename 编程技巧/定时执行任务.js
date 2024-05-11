/**
 * 2024-03-19 18:18:33
 * @author Mint.Yan
 * @description 定时执行任务
 * @param Number delay 延时时间
 * @param Function callback 执行函数
 * @returns void
 */
const settimer = function (delay = 100, callback) {
  if (typeof callback !== "function") {
    throw Error(`${callback} is not a function`);
  }
  // 初始时间
  let start = +new Date();
  // 停止循环
  let stop = false;
  let timeId = null;
  // 是否已注册了待执行的settimeout
  // 如果已经注册了，那么即使stop为true也应该执行完注册的settimeout后再停止
  let isRegister = false;
  function timer() {
    isRegister = true;
    timeId = setTimeout(() => {
      const current = +new Date();
      // 只要存在已注册的或者stop为false 都应该执行callback
      if (current - start >= delay && (isRegister || !stop)) {
        callback();
        start = current;
      }
      if (!stop) {
        timer();
      } else {
        // 只有在stop停止后，才注销注册
        // 否则会少执行一次
        isRegister = false;
      }
    }, delay);
  }
  timer.stop = function () {
    stop = true;
    timeId = null;
  };
  return timer;
};

//====== 测试区域开始 ======
const time = settimer(100, () => {
  console.log(+new Date());
});
time();
setTimeout(() => {
  time.stop();
}, 200);
time();
// 1710914536398
// 1710914536510
// 1710914536611
// 1710914536712
// 1710914536812
//====== 测试区域结束 ======
