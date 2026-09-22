// 给你两个整数，被除数 dividend 和除数 divisor。将两数相除，要求 不使用 乘法、除法和取余运算。
// 整数除法应该向零截断，也就是截去（truncate）其小数部分。例如，8.345 将被截断为 8 ，-2.7335 将被截断至 -2 。
// 返回被除数 dividend 除以除数 divisor 得到的 商 。
// 注意：假设我们的环境只能存储 32 位 有符号整数，其数值范围是 [−231,  231 − 1] 。本题中，如果商 严格大于 231 − 1 ，则返回 231 − 1 ；如果商 严格小于 -231 ，则返回 -231 。

/**
 * 2024-12-13 15:58:19
 * @author Mint.Yan
 * @link https://leetcode.cn/problems/divide-two-integers/
 * @param {number} dividend
 * @param {number} divisor
 * @return {number}
 */
var divide = function (dividend, divisor) {
  if (dividend === 0) return 0;

  const max = Math.pow(2, 31) - 1,
    min = Math.pow(-2, 31),
    // true:符号相同 false:符号不同
    symbol = (dividend ^ divisor) >= 0,
    asbdivisor = Math.abs(divisor);
  let absdividend = Math.abs(dividend), // 被除的余数
    sum = 0,
    pow = 31;

  // 特殊情况
  if (absdividend < asbdivisor) return 0;
  if (absdividend === asbdivisor) return symbol ? 1 : -1;
  if (asbdivisor === 1) {
    return symbol ? Math.min(max, absdividend) : Math.max(min, -absdividend);
  }

  // >>>  无符号右移 m>>>n === Math.floor(m/(2^n))
  // >> 有符号右移 m>>n === Math.floor(m/(2^n))
  // << 无符号左移 m<<n === m*(2^n)
  // 思路为获取absdividend中有多少个asbdivisor，最大则就有max或min个asbdivisor，计算每次最多能被多个2的次方整除的次数
  while (absdividend >= asbdivisor) {
    if (pow < 0) break;
    // absdividend有math.pow(2,pow)个2
    if (absdividend >>> pow >= asbdivisor) {
      // 剩下的余数  继续循环，直到absdividend小于asbdivisor，说明余数小于asbdivisor则停止
      absdividend -= asbdivisor << pow;
      sum += Math.pow(2, pow);
    }
    // absdividend没有math.pow(2,pow)个2
    pow--;
  }

  // 溢出则取边界值
  if (pow == 31) {
    return symbol ? max : min;
  }

  return symbol ? sum : -sum;
};

//====== 测试区域开始 ======
console.log(divide(10, 3)); // 3
console.log(divide(7, -3)); // -2
console.log(divide(0, 1)); // 0
console.log(divide(1, 1)); // 1
console.log(divide(-2147483648, -1)); // 2147483647
console.log(divide(2147483647, 1)); // 2147483647
//====== 测试区域结束 ======
