/**
 * 2024-03-07 14:33:40
 * @author Mint.Yan
 * @link https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.prototype.catch
 * @description catch可参见上述Promise规范实现
 * This method performs the following steps when called:
 * 1. Let promise be the this value.
 * 2. Return ? Invoke(promise, "then", « undefined, onRejected »).
 * @param {(reason: any) => void | PromiseLike<void>) | null | undefined} onrejected
 * @returns Promise<T | void>
 */
Promise.prototype.catch = function (rejectFn) {
  console.log("self catch");
  return this.then(null, rejectFn);
};
//====== 测试区域开始 ======
Promise.reject("error")
  .catch((e) => {
    console.log(e);
    return "next " + e;
  })
  .then((res) => {
    console.log(res);
  });
//====== 测试区域结束 ======
