/**
 * 2024-03-22 11:41:36
 * @author Mint.Yan
 * @description 字符串出现的不重复最长长度
 * @param {String} str 输入字符串
 * @returns {Number}
 */
const getNoRepeatStrLen = (str) => {
  if (typeof str !== "string") throw Error(`${str} is not a string`);
  if (str.length <= 1) return str.length;
  // case1：通过滑动窗口解决 性能好
  let start = 0,
    res = 0,
    map = new Map();
  for (let i = 0; i < str.length; i++) {
    if (map.has(str[i])) {
      start = Math.max(start, map.get(str[i]));
    }
    map.set(str[i], i);
    res = Math.max(res, i - start);
  }
  // case2：通过移动位置查询  较慢
  //   let arr = [],
  //     res = 0,
  //     start = 0;
  //   for (let i = 0; i < str.length; i++) {
  //     if (!arr.includes(str[i])) {
  //       arr.push(str[i]);
  //       res = Math.max(res, arr.length);
  //     } else {
  //       i = ++start;
  //     }
  //   }
  return res;
};
//====== 测试区域开始 ======
console.log(getNoRepeatStrLen("123111213412"));
//====== 测试区域结束 ======
