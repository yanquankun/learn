/**
 * 2024-03-08 15:06:19
 * @author Mint.Yan
 * @description 判断一个
 * @param number num
 * @returns boolean
 */
const isPrime = (num) => {
  if (typeof num !== "number") throw Error(`${num} is not a number`);
  if (num <= 0) throw Error(`${num} cannot be zero or negative`);
  if (!Number.isInteger(num)) throw Error(`${num} must be an integer`);
  if (num === 1) return false;

  // num可分解为Math.sqrt(num)*Math.sqrt(num)
  // 如果在[2,Math.sqrt(num)]这个区间内没有公约数
  // 那么在[Math.sqrt(num),num]这个区间内也一定没有公约数
  for (let i = 2; i < Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};
//====== 测试区域开始 ======
// console.log(isPrime("prime"));
// console.log(isPrime(-1));
// console.log(isPrime(1.1));
console.log(isPrime(2));
console.log(isPrime(3));
console.log(isPrime(6));
console.log(isPrime(16));
console.log(isPrime(17));
console.log(isPrime(18));
//====== 测试区域结束 ======
