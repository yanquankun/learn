/**
 * 2024-11-26 11:25:39
 * @author Mint.Yan
 * @link https://leetcode.cn/problems/zigzag-conversion/description
 * @description 将一个给定字符串 s 根据给定的行数 numRows ，以从上往下、从左到右进行 Z * 字形排列。
 * 比如输入字符串为 "PAYPALISHIRING" 行数为 3 时，排列如下：
 * P   A   H   N
 * A P L S I I G
 * Y   I   R
 * 之后，你的输出需要从左往右逐行读取，产生出一个新的字符串，比如："PAHNAPLSIIGYIR"。
 * @param {string} s 给定字符串
 * @param {number} numRows 行数
 * @return string
 */
function convert(s: string, numRows: number): string {
  if (numRows === 1) return s;

  // 不要直接使用new Array(numRows).fill([])
  // 使用fill填充时，是通过赋值引用的方式。也就是说，[].fill(value) 会让每个数组元素指向同一个对象引用
  let arr: string[][] = new Array(numRows).fill(null).map(() => []),
    // s的填充索引
    fillIndex = 0,
    // 填充深度
    deep = 0;

  // eg：numRows=3 则可将其分为三行，每行一个数组
  //       填充过程为数组角标从0-3 3-0 0-3...
  // [
  //   [],
  //   [],
  //   [],
  // ]
  while (fillIndex < s.length) {
    while (deep < numRows) {
      if (!s[fillIndex]) break;
      arr[deep].push(s[fillIndex]);

      fillIndex++;
      deep++;
    }

    // 最大深度越界，回到最大深度numRows
    deep--;

    while (--deep > 0) {
      if (!s[fillIndex]) break;
      arr[deep].push(s[fillIndex]);
      fillIndex++;
    }
  }

  return arr.reduce((acc, cur) => acc + cur.join(""), "");
}

//====== 测试区域开始 ======
console.log(convert("PAYPALISHIRING", 3)); // PAHNAPLSIIGYIR
console.log(convert("PAYPALISHIRING", 4)); // PINALSIGYAHRPI
console.log(convert("AB", 1)); // AB
//====== 测试区域结束 ======
