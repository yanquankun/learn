/**
 * 128. 最长连续序列
 *
 * 难度：中等
 * 题目链接：https://leetcode.cn/problems/longest-consecutive-sequence/
 *
 * 给你一个未排序的整数数组 nums，
 * 找出其中数值连续的最长序列，返回该序列的长度。
 *
 * 规则：
 * - 数值连续是指按从小到大排列后，相邻数字的差为 1。
 * - 序列中的数字不需要在原数组中位置相邻，也不需要按顺序出现。
 * - 重复数字不会增加连续序列的长度。
 * - 数组为空时，返回 0。
 *
 * 示例 1：
 * 输入：nums = [100, 4, 200, 1, 3, 2]
 * 输出：4
 * 说明：最长连续序列为 [1, 2, 3, 4]，长度为 4。
 *
 * 示例 2：
 * 输入：nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]
 * 输出：9
 * 说明：最长连续序列为 [0, 1, 2, 3, 4, 5, 6, 7, 8]。
 *
 * 示例 3：
 * 输入：nums = [1, 0, 1, 2]
 * 输出：3
 * 说明：最长连续序列为 [0, 1, 2]，重复的 1 不增加长度。
 *
 * 数据范围：
 * - 0 <= nums.length <= 10^5
 * - -10^9 <= nums[i] <= 10^9
 *
 * 复杂度要求：
 * - 实现时间复杂度为 O(n) 的算法，n 为数组长度。
 */

/**
 * 计算数组中最长连续整数序列的长度。
 *
 * @param nums - 未排序的整数数组，可以包含重复数字或为空。
 * @returns 最长连续序列的长度；空数组返回 0。
 *
 * @example
 * longestConsecutive([100, 4, 200, 1, 3, 2]); // 4
 */
function longestConsecutive(nums: number[]): number {
  if (nums.length < 2) return nums.length;

  nums = nums.sort((a, b) => a - b);

  let result = 1,
    // 记录当前连续序列的起始位置
    pre = 0,
    // 记录当前连续序列的结束位置
    next = 1;

  while (pre < nums.length - 1) {
    // 记录重复数字的数量
    let repeat = 0;

    while (next < nums.length) {
      // 1. 如果当前数字与前一个数字相同，则继续向后移动，记录重复数量
      if (nums[next - 1] === nums[next]) {
        next++;
        repeat++;
      }
      // 2. 如果当前数字与前一个数字相差为 1，则继续向后移动，更新最长连续序列长度
      else if (nums[next] - nums[next - 1] === 1) {
        result = Math.max(result, next - pre - repeat + 1);
        next++;
      } else {
        break;
      }
    }
    pre = next++;
  }

  return result;
}

//====== 测试区域开始 ======
console.log(longestConsecutive([100, 4, 200, 1, 3, 2])); // 4
console.log(longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])); // 9
console.log(longestConsecutive([1, 0, 1, 2])); // 3
console.log(longestConsecutive([])); // 0
console.log(longestConsecutive([7])); // 1
console.log(longestConsecutive([2, 2, 2])); // 1
console.log(longestConsecutive([1, 3, 5, 7])); // 1
console.log(longestConsecutive([5, 4, 3, 2, 1])); // 5
console.log(longestConsecutive([-2, -3, -1, 0, 1])); // 5
console.log(longestConsecutive([10, 11, 12, 1, 2, 3, 4])); // 4
console.log(longestConsecutive([-1000000000, -999999999, 1000000000])); // 2
//====== 测试区域结束 ======
