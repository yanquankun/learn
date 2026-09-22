/**
 * 2025-03-28 10:53:44
 * @author Mint.Yan
 * @description 给定一个不含重复数字的数组 nums ，返回其 所有可能的全排列 。你可以 按任意顺序 返回答案
 * @link https://leetcode.cn/problems/permutations/
 */
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function (nums) {
  if (!nums.length) return [];
  if (nums.length === 1) return [nums];
  let res = [];

  /**
   * path 当前的组合路径
   */
  const dfs = (path) => {
    if (path.length === nums.length) res.push(path);

    for (let i = 0; i < nums.length; i++) {
      // 此处是关键，跳过重复可能项
      if (path.includes(nums[i])) continue;
      dfs([...path, nums[i]]);
    }
  };

  dfs([]);

  return res;
};

//====== 测试区域开始 ======
console.log(permute([1, 2, 3]));
// [
//   [3, 2, 1],
//   [2, 3, 1],
//   [3, 1, 2],
//   [1, 3, 2],
//   [2, 1, 3],
//   [1, 2, 3],
// ];
//====== 测试区域结束 ======
