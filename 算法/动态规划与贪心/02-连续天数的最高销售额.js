/**
 * 2024-05-16 18:22:39
 * @author Mint.Yan
 * @description 连续天数的最高销售额
 * 某公司每日销售额记于整数数组 sales，请返回所有 连续 一或多天销售额总和的最大值。
 * 要求实现时间复杂度为 O(n) 的算法。
 * 示例 1:
 * 输入：sales = [-2,1,-3,4,-1,2,1,-5,4]
 * 输出：6
 * 解释：[4,-1,2,1] 此连续四天的销售总额最高，为 6。
 * 示例 2:
 * 输入：sales = [5,4,-1,7,8]
 * 输出：23
 * 解释：[5,4,-1,7,8] 此连续五天的销售总额最高，为 23。
 * @param {number[]} sales
 * @returns {number}
 */
var maxSales = function (sales) {
  let res = sales[0],
    pre = 0;
  for (let i = 0; i < sales.length; i++) {
    // 动态规划 我们只需要关心当次f(i-1)和上次f(i)最大值是多少即可
    // 通过pre每次更新  迭代当前日期之前的最大值
    // f(i)只和f(i−1)相关，通过pre来维护对于当前f(i)的f(i−1)的值是多少
    pre = Math.max(pre + sales[i], sales[i]);
    res = Math.max(pre, res);
  }
  return res;
};
//====== 测试区域开始 ======
/**
 * @link https://leetcode.cn/problems/lian-xu-zi-shu-zu-de-zui-da-he-lcof/
 */
//====== 测试区域结束 ======
