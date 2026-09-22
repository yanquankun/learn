// 异步加法
function asyncAdd(a, b, cb) {
  setTimeout(() => {
    cb(null, a + b);
  }, 1000);
  // throw Error("出现异常");
}

// 实现下 sum 函数。注意不能使用加法，在 sum 中借助 asyncAdd 完成加法。尽可能的优化这个方法的时间。
function sum() {
  const args = arguments;
  let res = 0;
  let flag = 0;
  return new Promise((resolve, reject) => {
    // 类似promise.all，不要去等上个结果，直接异步累加结果即可
    for (let i = 0; i < args.length; i++) {
      new Promise((r, j) => {
        try {
          asyncAdd(0, args[i], (err, ret) => {
            if (err) j(err);
            r(ret);
          });
        } catch (e) {
          reject(e);
        }
      }).then((ret) => {
        res += ret;
        flag++;
        if (flag === args.length) {
          resolve(res);
        }
      });
    }
  });
}

async function total() {
  const now = +new Date();
  const res1 = await sum(1, 2, 3, 4, 5, 6, 4, 1, 5, 6, 1, 3, 1, 12, 32, 66);
  const end = +new Date();
  console.log(res1, end - now);
}

total();

//====== 测试区域开始 ======
// 1. 先测试asyncAdd中异常case 【打开throw Error("出现异常");】
// Output: UnhandledPromiseRejectionWarning: Error: 出现异常
// 2. 测试正常流程，及输出时间
// Output: 152 1003 [用时1s]
//====== 测试区域结束 ======
