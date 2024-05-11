// 给你一个字符串 s 和一个字符 c ，且 c 是 s 中出现过的字符。
// 返回一个整数数组 answer ，其中 answer.length == s.length 且 answer[i] 是 s 中从下标 i 到离它 最近 的字符 c 的 距离 。
// 两个下标 i 和 j 之间的 距离 为 abs(i - j) ，其中 abs 是绝对值函数。

/**
 * @param {string} s
 * @param {character} c
 * @return {number[]}
 */
var shortestToChar = function (s, c) {
  const res = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] === c) {
      res[i] = 0;
      continue;
    }
    // 获取左侧最近的c的位置 没有则设置为数组长度[最大长度]
    const leftIndex = s.substr(0, i).lastIndexOf(c);
    const leftDistance = leftIndex > -1 ? i - leftIndex : s.length;
    // 获取右侧最近的c的位置 没有则设置为数组长度[最大长度]
    const rightIndex = s.substr(i).indexOf(c);
    const rightDistance = rightIndex > -1 ? rightIndex : s.length;
    res[i] = Math.min(leftDistance, rightDistance);
  }
  return res;
};
//====== 测试区域开始 ======
console.log(shortestToChar("aaba", "b")); // [ 2, 1, 0, 1 ]
//====== 测试区域结束 ======
