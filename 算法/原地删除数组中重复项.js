/**
 * @description 给你一个有序数组 nums ，请你 原地 删除重复出现的元素，使得出现 次数超过两次的元素只出现两次 ，返回删除后数组的新长度。不要使用额外的数组空间，你必须在 原地 修改输入数组 并在使用 O(1) 额外空间的条件下完成。
 * @link https://leetcode.cn/problems/remove-duplicates-from-sorted-array-ii/
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function (nums) {
  // 记录每个数字出现的次数
  let count = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === nums[i - 1]) {
      count++;
    } else {
      count = 1;
    }

    if (count > 2) {
      nums.splice(i, 1);
      i--;
    }
  }
  return nums.length;
};

//====== 测试区域开始 ======
console.log(removeDuplicates([1, 1, 1, 2, 2, 3])); // 输出: 5，数组 nums 的前五个元素是 1，1，2，2，3
//====== 测试区域结束 ======
