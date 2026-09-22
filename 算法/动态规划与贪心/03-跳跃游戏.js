/**
 * @description 给你一个非负整数数组 nums ，你最初位于数组的 第一个下标 。数组中的每个元素代表你在该位置可以跳跃的最大长度,判断你是否能够到达最后一个下标，如果可以，返回 true，否则，返回 false
 * @link https://leetcode.cn/problems/jump-game/
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function (nums) {
  // 贪心算法
  // 对于任意一个位置y，如果存在一个位置x，且满足以下条件，则y一定可以到达：
  // 1. x可以到达
  // 2. x+nums[x] 也就是当前位置能跳跃的最大距离大于等于nums.length-1（本身从0开始，等于跳跃的距离只需要len-1就够了）
  for (let i = 0, max = 0; i < nums.length; i++) {
    // 满足条件1
    if (i <= max) {
      // 满足条件2
      if (max >= nums.length - 1) return true;
      max = Math.max(max, i + nums[i]);
    }
  }
  return false;
};

//====== 测试区域开始 ======
console.log(canJump([2, 3, 1, 1, 4])); // true
console.log(canJump([3, 2, 1, 0, 4])); // false
console.log(canJump([0])); // true
//====== 测试区域结束 ======
