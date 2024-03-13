/**
 * 2024-03-13 19:12:30
 * @author Mint.Yan
 * @description 错误执行后，进行最多max次重试
 * @param Promise task 异步任务
 * @param Number maxCount 最大重试次数
 * @returns Promise<any>
 */
const requestRetry = (task, maxCount) => {
  if (typeof task !== "function") {
    throw Error(`${task} is not a Function`);
  }
  if (typeof maxCount !== "number") {
    throw Error(`${maxCount} is not a number`);
  }
  return new Promise((resolve, reject) => {
    // 必须要通过辅助函数执行任务，不能递归调用requestRetry
    // 会造成promise丢失的情况
    const _runTask = (task) => {
      console.log("maxCount", maxCount);
      const promiesIns = task();
      if (!(promiesIns instanceof Promise)) {
        reject(`${promiesIns} is not a Promise`);
      }
      promiesIns.then(
        (res) => {
          resolve(res);
        },
        (err) => {
          if (--maxCount <= 0) reject(err);
          else _runTask(task);
        }
      );
    };
    _runTask(task);
  });
};
//====== 测试区域开始 ======
let count = 3;
const task = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (count-- > 1) reject("错误啦");
      else resolve("成功啦");
    }, 1000);
  });
  //   return 1;
};
requestRetry(task, 2).then(
  (res) => {
    console.log("成功", res);
  },
  (err) => {
    console.log("失败", err);
  }
);
//====== 测试区域结束 ======
