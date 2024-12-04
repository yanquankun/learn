// 给你一个长度为 n 的整数数组 nums 和 一个目标值 target。请你从 nums 中选出三个整数，使它们的和与 target 最接近。
// 返回这三个数的和。
// 假定每组输入只存在恰好一个解。
// 3 <= nums.length <= 1000
// -1000 <= nums[i] <= 1000
// -104 <= target <= 104

/**
 * 2024-12-04 17:15:29
 * @author Mint.Yan
 * @description 寻找最接近的三数之和
 * @link https://leetcode.cn/problems/3sum-closest/description/?source=vscode
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var threeSumClosest = function (nums, target) {
  nums.sort((a, b) => a - b);
  let point = 0,
    res = null;

  while (point < nums.length - 2) {
    let left = point + 1;
    let right = nums.length - 1;
    while (left < right) {
      let sum = nums[point] + nums[left] + nums[right];

      if (sum > target) {
        right--;
      } else if (sum < target) {
        left++;
      } else {
        return sum;
      }

      res =
        res === null
          ? sum
          : Math.abs(sum - target) < Math.abs(res - target)
          ? sum
          : res;
    }
    point++;
  }

  return res;
};

//====== 测试区域开始 ======
console.log(threeSumClosest([-1, 2, 1, -4], 1)); // 2
console.log(threeSumClosest([0, 0, 0], 1)); // 0
//====== 测试区域结束 ======
