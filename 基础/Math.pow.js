/**
 * 实现 pow(x, n) ，即计算 x 的整数 n 次幂函数（即，xn ）。
 */
/**
 * @param {number} x
 * @param {number} n
 * @return {number}
 */
var myPow = function (x, n) {
  if (x === 0 || x === 1) return x;

  if (n === 0) return 1;
  else if (n < 0) return 1 / myPow(x, -n);
  else {
    // 降低时间复杂度
    if (n % 2 === 0) {
      return myPow(x * x, n / 2);
    } else {
      return myPow(x * x, (n - 1) / 2) * x;
    }
  }
};
