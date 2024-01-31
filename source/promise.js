/**
 * 2024-01-30 13:22:04
 * @author Mint.Yan
 * @description: Promise简单实现
 * @param: {Function} fn callback
 * @returns: Promise
 */
var cbs = [];
const promise = function (fn) {
  var _self = this;
  this.result = null;
  this.resolveCallbacks = [];
  this.rejectCallbacks = [];
  this.status = "pending";

  function resolve(value) {
    // 如果传入的是promise，则状态改变需要等传入的promise改变后才能改变
    if (value instanceof promise) {
      return value.then(resolve, reject);
    }
    setTimeout(function () {
      // then方法的执行是在宏任务中执行
      if (_self.status === "pending") {
        _self.status = "resolved";
        _self.result = value;
        _self.resolveCallbacks.forEach((fn) => {
          fn(_self.result);
        });
      }
    });
  }

  function reject(value) {
    setTimeout(() => {
      if (_self.status === "pending") {
        _self.status = "rejected";
        _self.result = value;
        _self.rejectCallbacks.forEach((fn) => {
          _self.result = fn(_self.result);
        });
      }
    });
  }

  //   function then(resolveFn, rejectFn) {
  //     return new promise(function (resolve, reject) {
  //       resolveFn =
  //         typeof resolveFn === "function"
  //           ? resolveFn
  //           : function (val) {
  //               return val;
  //             };

  //       rejectFn =
  //         typeof rejectFn === "function"
  //           ? rejectFn
  //           : function (val) {
  //               return val;
  //             };
  //       if (_self.status === "pending") {
  //         _self.resolveCallbacks.push(resolveFn);
  //         _self.rejectCallbacks.push(rejectFn);
  //       }
  //       if (_self.status === "resolved") {
  //         try {
  //           const result = resolveFn(_self.result);
  //           return result instanceof promise
  //             ? result.then(resolve, reject)
  //             : resolve(result);
  //         } catch (error) {
  //           reject(error);
  //         }
  //       }

  //       if (_self.status === "rejected") {
  //         try {
  //           const result = rejectFn(_self.result);
  //           return result instanceof promise
  //             ? result.then(resolve, reject)
  //             : resolve(result);
  //         } catch (error) {
  //           reject(error);
  //         }
  //       }
  //     });
  //   }

  try {
    fn(resolve.bind(this), reject.bind(this));
  } catch (error) {
    reject(error);
  }
};
promise.resolve = function (val) {
  return new promise((resolve) => {
    resolve(val);
  });
};
promise.reject = function (err) {
  return new promise((_, reject) => {
    reject(err);
  });
};
promise.prototype.then = function (resolveFn, rejectFn) {
  var self = this;
  return new promise(function (resolve, reject) {
    resolveFn =
      typeof resolveFn === "function"
        ? resolveFn
        : function (val) {
            return val;
          };

    rejectFn =
      typeof rejectFn === "function"
        ? rejectFn
        : function (val) {
            return val;
          };
    if (self.status === "pending") {
      self.resolveCallbacks.push(resolveFn);
      self.rejectCallbacks.push(rejectFn);
      console.log(self.resolveCallbacks);
    }
    if (self.status === "resolved") {
      try {
        const result = resolveFn(self.result);
        return result instanceof promise
          ? result.then(resolve, reject)
          : resolve(result);
      } catch (error) {
        reject(error);
      }
    }

    if (self.status === "rejected") {
      try {
        const result = rejectFn(self.result);
        return result instanceof promise
          ? result.then(resolve, reject)
          : resolve(result);
      } catch (error) {
        reject(error);
      }
    }
  });
};
//====== 测试区域开始 ======
// const promise1 = new promise((resolve, reject) => {
//   console.log("promise1");
//   resolve("resolve1");
// });
// const promise2 = promise1.then((res) => {
//   console.log(res);
// });
// console.log("1", promise1);
// console.log("2", promise2);
// const promise3 = new promise((resolve, reject) => {
//   console.log(1);
//   console.log(2);
//   resolve();
//   reject();
// });
// promise3.then(() => {
//   console.log(3);
// });
// console.log(4);
// promise.resolve(1).then((res) => {
//   console.log(res);
// });
const promise4 = new promise((resolve, reject) => {
  resolve(1);
});
promise4
  .then((res) => {
    console.log(res);
    return res;
  })
  .then((res) => {
    console.log(res);
  });
// promise
//   .resolve(1)
//   .then(2)
//   .then((res) => {
//     console.log(res);
//   });
//====== 测试区域结束 ======
