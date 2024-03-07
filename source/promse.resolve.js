/**
 * 2024-03-07 14:52:08
 * @author Mint.Yan
 * @link https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.resolve
 * @description This function returns either a new promise resolved with the passed argument, or the argument itself if the argument is a promise produced by this constructor.
 * 1. Let C be the this value.
 * 2. If C is not an Object, throw a TypeError exception.
 * 3. Return ? PromiseResolve(C, x).
 * @param {(reason: any) => void | PromiseLike<void>) | null | undefined} val
 * @returns Promise<any>
 */
Promise.resolve = function (val) {
  // 或者如果该值为一个 Promise 对象，则返回该对象
  if (val instanceof Promise) return val;
  // 如果传入的是一个 thenable 对象，则通过传入一对解决函数作为参数调用该 thenable 对象的 then 方法后得到的状态将作为返回的 Promise 对象的状态
  else if (val && val.then && typeof val.then === "function")
    return new Promise((resolve, reject) => val.then(resolve, reject));
  // 如果传入的是一个非 thenable 对象的值，则返回的 Promise 对象将以该值兑现。
  else return new Promise((resolve) => resolve(val));
};
//====== 测试区域开始 ======
Promise.resolve("resolve").then((res) => {
  console.log(res);
});
const original = Promise.resolve(33);
const cast = Promise.resolve(original);
cast.then((value) => {
  console.log(`值：${value}`);
});
const thenable = {
  then(onFulfilled, onRejected) {
    onFulfilled({
      // 该 thenable 对象将兑现为另一个 thenable 对象
      then(onFulfilled, onRejected) {
        onFulfilled(42);
      },
    });
  },
};
Promise.resolve(thenable).then((v) => {
  console.log(v); // 42
});
//====== 测试区域结束 ======
