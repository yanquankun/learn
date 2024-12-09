// 给出数字n，列出n对所有的合法括号
// 1<=n<=8

/**
 * 2024-12-09 19:52:07
 * @author Mint.Yan
 * @link https://leetcode.cn/problems/generate-parentheses/description/
 * @description 括号生成
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function (n) {
  if (n === 1) return ["()"];
  let res = [];

  /**
   * 回溯递归
   * str: 当前字符串
   * left: 左括号个数
   * right: 右括号个数
   */
  const helper = (str, left, right) => {
    if (str.length === 2 * n) {
      res.push(str);
      return;
    }

    // ==========核心是此处，两个条件会同步进行判断=============
    // 如何保证获取到的括号一定是合法的？
    // 由于先运行的是left的判断条件，所以先补入的一定是左括号，最后补入的一定是右括号

    // 左括号少于n，可以补一个左括号
    if (left < n) {
      helper(str + "(", left + 1, right);
    }

    // 右括号必须小于左括号个数，可以补一个右括号
    if (right < left) {
      helper(str + ")", left, right + 1);
    }
    // =======================
  };

  helper("", 0, 0);

  return res;
};

//====== 测试区域开始 ======
generateParenthesis(3); // ["((()))","(()())","(())()","()(())","()()()"]
//====== 测试区域结束 ======
