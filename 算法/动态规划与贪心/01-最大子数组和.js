/**
 * 给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和
 * 子数组 是数组中的一个连续部分。
 */

/**
 * 2024-12-30 11:02:55
 * @author Mint.Yan
 * @link https://leetcode-cn.com/problems/maximum-subarray/
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
  if (nums.length === 1) return nums[0];

  let pre = 0, // 记录当前位置前的子数组最大的和，小于当前num时，重置为num
    res = nums[0]; // 为什么要这个配置，因为可能nums中全是负数，所以要有一个初始值

  nums.forEach((num) => {
    // 记录到num位置时，最大的子数组和
    pre = Math.max(pre + num, num);
    res = Math.max(res, pre);
  });

  return res;
};

//====== 测试区域开始 ======
maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]); // 6
maxSubArray([1]); // 1
maxSubArray([5, 4, -1, 7, 8]); // 23
//====== 测试区域结束 ======
