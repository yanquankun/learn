const isPrime = (num) => {
  if (typeof num !== "number") throw Error(`${num} is not a number`);
  if (num <= 0) throw Error(`${num} cannot be zero or negative`);
  if (!Number.isInteger(num)) throw Error(`${num} must be an integer`);
  if (num === 1) return false;

  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};
/**
 * 2024-03-08 15:33:48
 * @author Mint.Yan
 * @description 给定整数 n ，返回 所有小于非负整数 n 的质数的数量
 * @param number n
 * @returns number
 */
const getPrimeCount = function (n) {
  if (typeof n !== "number") throw Error(`${n} is not a number`);
  if (n < 0) throw Error(`${n} must be greater than zero`);
  if (!Number.isInteger(n)) throw Error(`${n} must be integer`);
  if (n <= 1) return 0;

  let count = 0;
  for (let i = 2; i < n; i++) {
    if (isPrime(i)) count++;
  }
  return count;
};
//====== 测试区域开始 ======
/**
 * @link https://leetcode.cn/problems/count-primes/description/
 */
console.log(getPrimeCount(179765));
//====== 测试区域结束 ======
