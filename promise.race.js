/**
 * 2024-01-31 18:34:24
 * @author Mint.Yan
 * @description: Promise.race
 * @param: {Array<Promise>} list List of promises
 * @returns: {any}
 */
const race = function (list) {
  if (!Array.isArray(list)) throw Error("param must be an array");
  return new Promise(function (resolve, reject) {
    for (let i = 0; i < list.length; i++) {
      try {
        if (list[i] instanceof Promise) {
          list[i].then((res) => {
            resolve(res);
          });
        } else {
          resolve(list[i]);
        }
      } catch (error) {
        reject(error);
      }
    }
  });
};

//====== 测试区域开始 ======
// test
let p1 = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(1);
  }, 1000);
});
let p2 = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(2);
  }, 2000);
});
let p3 = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(3);
  }, 3000);
});
race([p3, p1, p2, 666]).then((res) => {
  console.log(res); // 1
});
//====== 测试区域结束 ======
