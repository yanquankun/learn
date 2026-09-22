/**
 * @description
 * 给定两个以字符串形式表示的非负整数 num1 和 num2，返回 num1 和 num2 的乘积，它们的乘积也表示为字符串形式。注意：不能使* 用任何内置的 BigInteger 库或直接将输入转换为整数
 * @link https://leetcode.cn/problems/multiply-strings/
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var addNum = function (num1, num2) {
  if (num1.length < num2.length) [num1, num2] = [num2, num1];
  num2 = num2.padStart(num1.length, "0");

  let len = num1.length - 1,
    res = "",
    carry = 0;
  while (len >= 0) {
    let sum = Number(num1[len]) + Number(num2[len]) + carry;
    if (sum >= 10) {
      carry = 1;
      sum -= 10;
    } else {
      carry = 0;
    }
    res = String(sum) + res;
    len--;
  }
  if (carry) {
    res = String(carry) + res;
  }
  while (res.startsWith("0") && res.length > 1) {
    res = String(res).slice(1);
  }
  return res;
};
var multiply = function (num1, num2) {
  // 获取最长数字
  if (num1.length < num2.length) [num1, num2] = [num2, num1];

  let len = num2.length - 1,
    res = "",
    carry = 0; // 进位个数（等于补0的个数）
  while (len >= 0) {
    let mult = 0;
    for (let i = num2[len]; i--; ) {
      // 大数相乘会丢失精度，依然采取累加
      mult = addNum(String(num1), String(mult));
    }

    // 累加每次乘法的结果
    mult = String(mult);
    res = addNum(res || "0", mult.padEnd(mult.length + carry, "0"));
    // 每累加一次，等于要在后面补carry个0再进行结果累加
    carry++;
    len--;
  }

  res = String(res);
  // 处理前导0
  while (res.startsWith("0") && res.length > 1) {
    res = String(res).slice(1);
  }

  return res;
};
//====== 测试区域开始 ======
console.log(multiply("123", "456")); // 56088
console.log(multiply("2", "3")); // 6
console.log(multiply("123456789", "987654321")); // 121932631112635269
//====== 测试区域结束 ======
