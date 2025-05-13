/**
 * @description 给定一个可包含重复数字的序列 nums ，按任意顺序 返回所有不重复的全排列
 * @link https://leetcode.cn/problems/permutations-ii/
 * @param {number[]} nums
 * @return {number[][]}
 */
/** 
 * 回溯算法的核心
    回溯算法的核心是"尝试-回退"的过程：
    尝试：将当前元素添加到路径中，标记为已使用
    递归：继续探索下一层决策
    回退：恢复状态，撤销刚才的选择
 */
var permuteUnique = function (nums) {
  const res = [],
    exist = [];

  const backtrack = (path, used) => {
    if (path.length === nums.length) {
      // 去除重复项
      if (exist.includes(path.join(","))) {
        return;
      } else {
        res.push([...path]);
        exist.push(path.join(","));
        return;
      }
    }

    for (let i = 0; i < nums.length; i++) {
      // 剪枝
      // 1. 该元素已经使用过
      // 2. 该元素和前一个元素相同，且前一个元素没有被使用过
      // 有关第二步为什么这样做：
      // 假设有 nums = [1,1',2]，其中 1 和 1' 是相同的数字，但我们用 1' 表示第二个 1：
      // 当我们选择第一个位置时，可以选择 1、1' 或 2
      // 如果我们选择了第一个 1，那么 used[0] = 1
      // 当考虑第二个 1'（即 i = 1）时：
      // 此时 nums[1] === nums[0]
      // 如果 used[0] = 1（第一个 1 已使用），剪枝条件不满足，我们可以使用 1'
      // 如果 used[0] = 0（第一个 1 未使用），剪枝条件满足，我们跳过 1'
      // 这样确保了相同数字按照从左到右的顺序使用，避免了排列重复。

      if (used[i] || (i > 0 && nums[i] === nums[i - 1] && !used[i - 1])) {
        continue;
      }

      // 尝试
      path.push(nums[i]);
      used[i] = 1;
      // 递归
      backtrack(path, used);
      // 回退
      path.pop();
      used[i] = 0;
    }
  };
  backtrack([], Array(nums.length).fill(0));

  return res;
};
//====== 测试区域开始 ======
console.log(permuteUnique([3, 3, 0, 3])); // [ [ 3, 3, 0, 3 ], [ 3, 3, 3, 0 ], [ 3, 0, 3, 3 ], [ 0, 3, 3, 3 ]]
//====== 测试区域结束 ======
// @lc code=end
