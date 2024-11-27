// 请你来实现一个 myAtoi(string s) 函数，使其能将字符串转换成一个 32 位有符号整数。

// 函数 myAtoi(string s) 的算法如下：

// 空格：读入字符串并丢弃无用的前导空格（" "）
// 符号：检查下一个字符（假设还未到字符末尾）为 '-' 还是 '+'。如果两者都不存在，则假定结果为正。
// 转换：通过跳过前置零来读取该整数，直到遇到非数字字符或到达字符串的结尾。如果没有读取数字，则结果为0。
// 舍入：如果整数数超过 32 位有符号整数范围 [−231,  231 − 1] ，需要截断这个整数，使其保持在这个范围内。具体来说，小于 −231 的整数应该被舍入为 −231 ，大于 231 − 1 的整数应该被舍入为 231 − 1 。
// 返回整数作为最终结果。
// 0 <= s.length <= 200
// s 由英文字母（大写和小写）、数字（0-9）、' '、'+'、'-' 和 '.' 组成

/**
 * 2024-11-27 13:10:45
 * @author Mint.Yan
 * @link https://leetcode.cn/problems/string-to-integer-atoi/description/?source=vscode
 * @description 请你来实现一个 myAtoi(string s) 函数，使其能将字符串转换成一个 32 位有符号整数
 * @param {string} s
 * @return {number}
 */
var myAtoi = function (s) {
  let res = "",
    flag = false; // 是否出现过符号

  for (let i = 0; i < s.length; i++) {
    if (s[i] === " ") {
      // 空格只能出现在最前面 后面出现则直接中止
      // flag为true说明出现过符号 则开始匹配后面的【连续】数字，不连续则直接中止
      if (res.length || flag) break;
      else continue;
    }
    if (s[i] === "-" || s[i] === "+") {
      // - + 号只能出现在最前面且一次
      if (flag || res.length) break;
      res += s[i] === "+" ? "" : s[i];
      flag = true;
    }
    if (/[a-zA-z]/.test(s[i])) {
      break;
    }
    if (s[i] === ".") {
      break;
    }
    if (/[0-9]/.test(s[i])) {
      res += s[i];
    }
  }

  // NaN 直接按0处理
  return res > Math.pow(2, 31) - 1
    ? Math.pow(2, 31) - 1
    : res < -Math.pow(2, 31)
    ? -Math.pow(2, 31)
    : isNaN(res)
    ? 0
    : Number(res);
};

//====== 测试区域开始 ======
console.log(myAtoi("42"));              // 42
console.log(myAtoi(" -042"));           // -42
console.log(myAtoi("1337c0d3"));        // 1337
console.log(myAtoi("0-1"));             // 0
console.log(myAtoi("words and 987"));   // 0
//====== 测试区域结束 ======
