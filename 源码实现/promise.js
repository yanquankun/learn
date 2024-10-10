/**
 * 2024-10-08 11:22:25
 * @author Mint.Yan
 * @description Promise simple source code
 * @param executor(resolve: <T>(val:T), reject: (err:unknow)=>void) => void
 * @return Promise
 */

/**
 * 1. new Promise时，需要传递一个 executor 执行器，执行器立刻执行
 * 2. executor 接受两个参数，分别是 resolve 和 reject
 * 3. promise 只能从 pending 到 rejected, 或者从 pending 到 fulfilled
 * 4. promise 的状态一旦确认，就不会再改变
 * 5. promise 都有 then 方法，then 接收两个参数，分别是 promise 成功的回调 onFulfilled,
 *      和 promise 失败的回调 onRejected
 * 6. 如果调用 then 时，promise已经成功，则执行 onFulfilled，并将promise的值作为参数传递进去。
 *      如果promise已经失败，那么执行 onRejected, 并将 promise 失败的原因作为参数传递进去。
 *      如果promise的状态是pending，需要将onFulfilled和onRejected函数存放起来，等待状态确定后，再依次将对应的函数执行(发布订阅)
 * 7. then 的参数 onFulfilled 和 onRejected 可以缺省
 * 8. promise 可以then多次，promise 的then 方法返回一个 promise
 * 9. 如果 then 返回的是一个结果，那么就会把这个结果作为参数，传递给下一个then的成功的回调(onFulfilled)
 * 10. 如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个then的失败的回调(onRejected)
 * 11.如果 then 返回的是一个promise,那么需要等这个promise，那么会等这个promise执行完，promise如果成功，
 *   就走下一个then的成功，如果失败，就走下一个then的失败
 */
const PENDING = "pending";
const RESOLVED = "resolve";
const REJECTED = "rejected";
function myPromise(executor) {
  this.state = PENDING;
  this.resolveCbs = [];
  this.rejectCbs = [];

  executor(resolve.bind(this), reject.bind(this));

  function resolve(val) {
    // 维持promise不可变性
    if (this.state === PENDING) {
      this.state = RESOLVED;
      this.value = val;
      this.resolveCbs.forEach((fn) => fn());
    }
  }
  function reject(err) {
    // 维持promise不可变性
    if (this.state === PENDING) {
      this.state = REJECTED;
      this.reason = err;
      this.rejectCbs.forEach((fn) => fn());
    }
  }
}
myPromise.prototype.then = function (onFulfilled, onRejected) {
  /**
   * onFulfilled和onRejected必须是函数
   */
  onFulfilled =
    typeof onFulfilled === "function" ? onFulfilled : (value) => value;
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (reason) => {
          throw reason;
        };
  /**
   * then 返回新的promise
   */
  let self = this; // 保存实例
  const nextPromise = new myPromise((resolve, reject) => {
    // then中的回调需要推入微任务队列 此处我们使用延时器模拟异步
    // pending状态下，将成功|失败回调推入各自的队列中
    if (self.state === PENDING) {
      self.resolveCbs.push(() => {
        setTimeout(() => {
          try {
            let ret = onFulfilled(self.value);
            resolvePromise(nextPromise, ret, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      });
      self.rejectCbs.push(() => {
        setTimeout(() => {
          try {
            let ret = onRejected(self.reason);
            resolvePromise(nextPromise, ret, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      });
    }
    // 必须在promise变成 fulfilled 时，调用 onFulfilled，参数是promise的value
    if (self.state === RESOLVED) {
      setTimeout(() => {
        try {
          let ret = onFulfilled(self.value);
          resolvePromise(nextPromise, ret, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    }
    // 必须在promise变成 rejected 时，调用 onRejected，参数是promise的reason
    if (self.state === REJECTED) {
      setTimeout(() => {
        try {
          let ret = onRejected(self.reason);
          resolvePromise(nextPromise, ret, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    }
  });
  // 链式调用
  return nextPromise;
};
/**
 * 统一处理then中的回调状态
 * 接收上一个prmise以及之前的promise value
 */
function resolvePromise(nextPromise, ret, resolve, reject) {
  // 如果 promise2 和 x 相等，那么 reject promise with a TypeError
  if (nextPromise === ret) {
    reject(new TypeError("Chaining Cycle!"));
  }

  // 2.3.3.1 let then = x.then.
  // 2.3.3.2 如果 x.then 这步出错，那么 reject promise with e as the reason..
  // 2.3.3.3 如果 then 是一个函数，then.call(x, resolvePromiseFn, rejectPromise)
  //     2.3.3.3.1 resolvePromiseFn 的 入参是 y, 执行 resolvePromise(nextPromise, ret, resolve, reject);
  //     2.3.3.3.2 rejectPromise 的 入参是 err, reject promise with err.
  //     2.3.3.3.3 如果 resolvePromise 和 rejectPromise 都调用了，那么第一个调用优先，后面的调用忽略。
  //     2.3.3.3.4 如果调用then抛出异常e
  //         2.3.3.3.4.1 如果 resolvePromise 或 rejectPromise 已经被调用，那么忽略
  //         2.3.3.3.4.3 否则，reject promise with e as the reason
  // 2.3.3.4 如果 then 不是一个function. fulfill promise with x.
  if (ret && (typeof ret === "object" || typeof ret === "function")) {
    // 2.3.3.3.3
    // 如果 resolvePromise 和 rejectPromise 都调用了，那么第一个调用优先，后面的调用忽略
    // 通过used来建立之前的then回调是否调用过
    // 只要被调用过，后续的都将被忽略
    let used = false;
    try {
      // 2.3.3.1
      let then = ret.then;
      if (typeof then === "function") {
        then.call(
          ret,
          // 2.3.3.3.1
          (val) => {
            if (!used) {
              used = true;
              resolve(val);
            }
          },
          // 2.3.3.3.2
          (err) => {
            if (!used) {
              used = true;
              reject(err);
            }
          }
        );
      } else {
        // 2.3.3.4
        if (!used) {
          used = true;
          resolve(ret);
        }
      }
    } catch (error) {
      // 2.3.3.2
      if (!used) {
        used = true;
        reject(err);
      }
    }
  } else {
    // !如果 x 不是一个 object 或者 function，fulfill promise with x.
    // 上个then中的回调结果 如果不是promise 或者 对象 或者 函数 直接resolve其结果
    // 更新promise的value值
    resolve(ret);
  }
}
//====== 测试区域开始 ======
const p = new myPromise((resolve, reject) => {
  setTimeout(() => {
    console.log("resovle");
    resolve("resovle");
  }, 500);
});
// const p = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     console.log("resovle");
//     resolve("resovle");
//   }, 500);
// });
p.then((res) => {
  console.log("第一个then：", res);
  return res + "1";
})
  .then((res) => {
    console.log("第二个then：", res);
    // return res + "2";
    return new myPromise((r) => r(res + "2"));
  })
  .then((res) => {
    console.log("第三个then:", res);
  });

p.then((res) => {
  console.log("第四个then:", res);
});
//====== 测试区域结束 ======
