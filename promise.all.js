/**
 * 2024-01-31 13:37:33
 * @author Mint.Yan
 * @description: Promise.all实现
 * @param: {Array<Promise>} list List of promises
 * @returns: {Array<any>}
 */
const all = function (list) {
  if (!Array.isArray(list)) throw Error("param must be an array");
  const result = [];
  let flag = 0;
  return new Promise((resolve, reject) => {
    const fn = function (val, idx) {
      try {
        if (val instanceof Promise) {
          val.then(
            (res) => {
              fn(res, idx);
            },
            (err) => {
              reject(err);
            }
          );
        } else {
          result[idx] = val;
          flag++;
        }
        if (flag == list.length) resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    for (let i = 0; i < list.length; i++) {
      fn(list[i], i);
    }
  });
};

//====== 测试区域开始 ======
let p1 = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(1);
  }, 100);
});
let p2 = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(2);
  }, 500);
});
let p3 = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(3);
  }, 1000);
});
all([p1, p2, p3, 666]).then((res) => {
  console.log(res); // [3, 1, 2]
});
const res = all([p1, p2, p3, 666]);
console.log(res);
//====== 测试区域结束 ======
