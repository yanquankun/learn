/**
 * 2024-11-25 11:06:30
 * @author Mint.Yan
 * @link https://leetcode.cn/problems/3sum/description/
 * @description 给你一个整数数组 nums ，判断是否存在三元组 [nums[i], nums[j], nums[k]] 满足 i != j、i != k 且 j != k ，同时还满足 nums[i] + nums[j] + nums[k] == 0 。请你返回所有和为 0 且不重复的三元组
 * 3 <= nums.length <= 3000
 * -105 <= nums[i] <= 105
 * @param {number[]} nums
 * @return {number[][]}
 */
const threeSum = function (nums) {
  // 排序后再对比，减少避免重复的难度
  nums = nums.sort((a, b) => a - b);

  let point = 0, // 基准值
    start = 1,
    end = nums.length - 1,
    result = [];

  while (point < nums.length - 2) {
    const sum = -nums[point];

    // start 和 end进行左右向内移动
    // 同时对比相加之和就与sum的大小
    while (start < end) {
      if (nums[start] + nums[end] > sum) {
        // 去除重复
        while (nums[end] === nums[--end]) {}
        continue;
      }

      if (nums[start] + nums[end] < sum) {
        // 去除重复
        while (nums[start] === nums[++start]) {}
        continue;
      }

      if (nums[start] + nums[end] === sum) {
        result.push([nums[point], nums[start], nums[end]]);
        // 继续找剩下存在的可能
        while (nums[end] === nums[--end]) {}
        while (nums[start] === nums[++start]) {}
      }
    }

    // 跳过重复的point值
    while (nums[point] === nums[++point]) {}
    start = point + 1;
    end = nums.length - 1;
  }

  return result;
};

//====== 测试区域开始 ======
console.log(threeSum([-1, 0, 1, 2, -1, -4]));
//====== 测试区域结束 ======
