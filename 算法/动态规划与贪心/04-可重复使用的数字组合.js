/**
 * @description 给你一个由 不同 整数组成的数组 nums ，和一个目标整数 target 。请你从 nums 中找出并返回总和为 target 的元素组合的个数
 * @link https://leetcode.cn/problems/combination-sum-iv/
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var combinationSum4 = function (nums, target) {
  // 使用回溯暴力破解，虽然可以拿到正确答案，但时间复杂度是指数级的，会超时
  //   let res = 0;
  //   const dfs = (sum) => {
  //     if (sum === target) {
  //       res++;
  //       return;
  //     }
  //     if (sum > target) {
  //       return;
  //     }
  //     for (let i = 0; i < nums.length; i++) {
  //       dfs(sum + nums[i]);
  //     }
  //   };
  //   dfs(0);
  //   return res;

  // 本题正确思路应该使用动态规划
  // dp[i] 表示和为 i 的组合数
  // 思路解析:
  // 已知dp[0] = 1，则可以认为是求dp[target]的值，而在0<i<=target的情况下，可以看成是求解dp[i]的值
  // 此时，可以先分析其求值的规律，所有的结果必然在nums数组中，那么假如这个结果数组中的最后一项是num，则一定有num<=i，那么num的前面的部分必然是一个和为i-num的组合，1+dp[i-sum]即可看为是一条解，因此计算dp[i]的时候，可以计算所有的dp[i-sum]的值的和
  const dp = new Array(target + 1).fill(0);
  dp[0] = 1; // 初始化，和为0时有1种组合（不选任何数）
  for (let i = 1; i <= target; i++) {
    for (let num of nums) {
      if (i - num >= 0) {
        dp[i] += dp[i - num]; // 当前和为i的组合数等于之前和为i-num的组合数
      }
    }
  }
  return dp[target];
};

//====== 测试区域开始 ======
console.log(combinationSum4([1, 2, 3], 4)); // 输出: 7
console.log(combinationSum4([9], 3)); // 输出: 0
console.log(combinationSum4([1, 2, 3], 32)); // 输出: 181997601
console.log(combinationSum4([1, 2, 3], 0)); // 输出: 1
//====== 测试区域结束 ======
