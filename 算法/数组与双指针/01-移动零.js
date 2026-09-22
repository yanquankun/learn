/**
 * 2024-05-20 09:57:57
 * @author Mint.Yan
 * @description 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
 *  请注意 ，必须在不复制数组的情况下原地对数组进行操作。
 * @param {number[]} nums
 * @return {number[]}
 */
var moveZeroes = function (nums) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      // 每次找到第一个0的位置
      const firstZeroIdx = nums.indexOf(0);
      // 存在且小于当前元素的位置 则需要更换位置
      if (firstZeroIdx > -1 && i > firstZeroIdx) {
        [nums[firstZeroIdx], nums[i]] = [nums[i], nums[firstZeroIdx]];
      }
    }
  }
  return nums;
};
//====== 测试区域开始 ======
console.log(moveZeroes([0, 1, 0, 3, 12]));
console.log(moveZeroes([1]));
console.log(moveZeroes([0]));
//====== 测试区域结束 ======
