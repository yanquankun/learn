// 给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按 任意顺序 返回。

// 给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。
// 0 <= digits.length <= 4
// digits[i] 是范围 ['2', '9'] 的一个数字

/**
 * 2024-12-06 11:08:32
 * @author Mint.Yan
 * @link https://leetcode.cn/problems/letter-combinations-of-a-phone-number/description/?source=vscode
 * @description 电话号码的字母组合
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function (digits) {
  if (!digits) return [];
  const map = {
    2: ["a", "b", "c"],
    3: ["d", "e", "f"],
    4: ["g", "h", "i"],
    5: ["j", "k", "l"],
    6: ["m", "n", "o"],
    7: ["p", "q", "r", "s"],
    8: ["t", "u", "v"],
    9: ["w", "x", "y", "z"],
  };

  if (digits.length === 1) return map[digits];

  const res = [];

  const curDigitLetters = map[digits[0]];

  curDigitLetters.forEach((letter) => {
    letterCombinations(digits.slice(1)).forEach((rest) => {
      res.push(letter + rest);
    });
  });

  return res;
};

//====== 测试区域开始 ======
console.log(letterCombinations("23")); // ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]
console.log(letterCombinations("")); // []
console.log(letterCombinations("2")); // ["a", "b", "c"]
//====== 测试区域结束 ======
