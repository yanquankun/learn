/**
 * @description 给你一个整数数组 nums ，数组中的元素 互不相同 。返回该数组所有可能的子集（幂集）。解集 不能 包含重复的子集。你可以按 任意顺序 返回解集。
 * @link https://leetcode.cn/problems/subsets/
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsets = function (nums) {
  const res = [[]];
  nums = nums.sort((a, b) => a - b);

  const dfs = (path, used) => {
    if (path.length === nums.length) return;

    for (let i = 0; i < nums.length; i++) {
      // 剪枝
      // 1. 不能重复使用同一个元素
      // 2. 如果path是空的，则直接push
      // 3. 如果path不为空，则需要判断当前元素是否大于path的前一个元素（前面已经sort了，每次path在push前只要大于上一个元素则说明该条路线是递增的，是合法路线）
      if (path.includes(nums[i])) continue;

      if (!path.length || nums[i] > path[path.length - 1]) {
        path.push(nums[i]);
        res.push([...path]);
        dfs(path, used);
        path.pop();
      }
    }
  };
  dfs([]);

  return res;
};
//====== 测试区域开始 ======
console.log(subsets([1, 2, 3])); // [ [], [ 1 ], [ 1, 2 ], [ 1, 2, 3 ], [ 1, 3 ], [ 2 ], [ 2, 3 ], [ 3 ] ]
console.log(subsets([0])); // [[],[0]]
//====== 测试区域结束 ======
