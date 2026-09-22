/**
 * 1. 两数之和
 *
 * 难度：简单
 * 题目链接：https://leetcode.cn/problems/two-sum/
 *
 * 给你一个整数数组 nums 和一个整数 target，
 * 找出数组中相加等于 target 的两个元素，返回它们的下标。
 *
 * 规则：
 * - 每组输入保证恰好存在一组有效答案。
 * - 两个下标必须不同，不能重复使用同一个元素。
 * - 不同位置的元素可以具有相同的值。
 * - 返回下标的顺序不限，下标从 0 开始。
 *
 * 示例 1：
 * 输入：nums = [2, 7, 11, 15]，target = 9
 * 输出：[0, 1]
 * 说明：nums[0] + nums[1] = 2 + 7 = 9。
 *
 * 示例 2：
 * 输入：nums = [3, 2, 4]，target = 6
 * 输出：[1, 2]
 *
 * 示例 3：
 * 输入：nums = [3, 3]，target = 6
 * 输出：[0, 1]
 *
 * 数据范围：
 * - 2 <= nums.length <= 10^4
 * - -10^9 <= nums[i] <= 10^9
 * - -10^9 <= target <= 10^9
 *
 * 进阶：
 * 尝试实现时间复杂度低于 O(n^2) 的算法。
 */

/**
 * 找出数组中和为目标值的两个元素的下标。
 *
 * @param nums - 整数数组，保证存在唯一一组有效答案。
 * @param target - 两个元素相加需要得到的目标值。
 * @returns 两个不同下标组成的数组，顺序不限。
 *
 * @example
 * twoSum([2, 7, 11, 15], 9); // [0, 1]
 */
function twoSum(nums: number[], target: number): number[] {
  let prev = 0,
    next = 1;

  while (prev < nums.length - 1) {
    while (next < nums.length) {
      if (nums[prev] + nums[next] === target) {
        return [prev, next];
      }
      next++;
    }
    next = ++prev + 1;
  }

  return [];
}

//====== 测试区域开始 ======
// 注释为预期结果；返回的两个下标顺序相反也正确。
// 当前函数尚未实现，运行时会输出空数组。

// 题目示例
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6)); // [1, 2]
console.log(twoSum([3, 3], 6)); // [0, 1]

// 补充用例
console.log(twoSum([-3, 4, 3, 90], 0)); // [0, 2]
console.log(twoSum([0, 4, 3, 0], 0)); // [0, 3]
console.log(twoSum([-1, -2, -3, -4, -5], -8)); // [2, 4]
console.log(twoSum([1, 2], 3)); // [0, 1]
//====== 测试区域结束 ======
