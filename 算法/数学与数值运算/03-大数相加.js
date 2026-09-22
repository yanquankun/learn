/**
 * 2024-03-08 16:53:07
 * @author Mint.Yan
 * @description 两个大数相加 本版本只考虑正数
 * @param number num1
 * @param number num2
 * @returns string
 */
const getBigNumSum = (num1, num2) => {
  if (typeof num1 !== "number" || typeof num2 !== "number")
    throw Error("parameter must be a number");
  if (num1 > Number.MAX_VALUE || num2 > Number.MAX_VALUE)
    throw Error("parameter must be a valid number");
  num1 = String(Math.abs(num1)).split("").reverse().join("");
  num2 = String(Math.abs(num2)).split("").reverse().join("");
  // 始终将更大的数设置给num1，用长度长的作为循环基数
  if (num1.length < num2.length) {
    [num1, num2] = [num2, num1];
  }

  let save = 0;
  let res = [];
  for (let i = 0; i < num1.length; i++) {
    // num2[i]可能没有值 赋值为0
    const curSum = Number(num1[i]) + (Number(num2[i]) || 0) + save;
    save = curSum >= 10 ? 1 : 0;
    res.unshift(curSum >= 10 ? curSum - 10 : curSum);
  }
  return (save ? 1 : "") + res.join("");
};
//====== 测试区域开始 ======
console.log(getBigNumSum(798912377132, 99999999999)); // 799012377131
//====== 测试区域结束 ======
