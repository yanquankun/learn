/** 
 * 七个不同的符号代表罗马数字，其值如下：
    符号	值
    I	    1
    V	    5
    X	    10
    L	    50
    C	    100
    D	    500
    M	    1000
    *   罗马数字是通过添加从最高到最低的小数位值的转换而形成的。将小数位值转换为罗马数字有以下规则：
    *   如果该值不是以 4 或 9 开头，请选择可以从输入中减去的最大值的符号，将该符号附加到结果，减去其值，然后将其余部分转换为罗马数字。
    *  如果该值以 4 或 9 开头，使用 减法形式，表示从以下符号中减去一个符号，例如 4 是 5 (V) 减 1 (I): IV ，9 是 10 (X) 减 1 (I)：IX。仅使用以下减法形式：4 (IV)，9 (IX)，40 (XL)，90 (XC)，400 (CD) 和 900 (CM)。
    *   只有 10 的次方（I, X, C, M）最多可以连续附加 3 次以代表 10 的倍数。你不能多次附加 5 (V)，50 (L) 或 500 (D)。如果需要将符号附加4次，请使用 减法形式。
    *TIP: 1 <= num <= 3999
 */

/**
 * 2024-11-30 16:28:28
 * @author Mint.Yan
 * @description 整数转罗马数字
 * @link https://leetcode.cn/problems/integer-to-roman/description/?source=vscode
 * @param {number} num
 * @return {string}
 */
var intToRoman = function (num) {
  const unitMap = {
    1: "I",
    5: "V",
    10: "X",
    50: "L",
    100: "C",
    500: "D",
    1000: "M",
  };

  const specilMap = {
    4: "IV",
    9: "IX",
    40: "XL",
    90: "XC",
    400: "CD",
    900: "CM",
  };

  /**
   * 获取当前位置表示数字的符号
   * cur 当前数字
   * gears 当前位置表示的分位数
   */
  const getCurPosUnit = (cur, gears = 1) => {
    if (cur === "4" || cur === "9") {
      return specilMap[cur * gears];
    } else if (cur < 4) {
      // 可表示的
      return unitMap[gears].repeat(cur);
    } else {
      // 可直接表示的
      if (unitMap[cur * gears]) return unitMap[cur * gears];
      // 不可直接表示的 eg：（6 7 8）* gears
      const repeatNum = (cur * gears - 5 * gears) / gears;
      return unitMap[5 * gears] + unitMap[gears].repeat(repeatNum);
    }
  };

  num = num.toString();

  return num
    .toString()
    .split("")
    .reduce(
      (acc, cur, index) =>
        (acc += getCurPosUnit(cur, Math.pow(10, num.length - 1 - index))),
      ""
    );
};

//====== 测试区域开始 ======
console.log(intToRoman(3)); // "III"
console.log(intToRoman(58)); // "LVIII"
console.log(intToRoman(1994)); // "MCMXCIV"
//====== 测试区域结束 ======
