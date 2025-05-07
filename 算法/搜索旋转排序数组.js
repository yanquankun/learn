/**
 * 2025-05-07 16:50:54
 * @author Mint.Yan
 * @description 
 * 整数数组 nums 按升序排列，数组中的值 互不相同
    在传递给函数之前，nums 在预先未知的某个下标 k（0 <= k < nums.length）上进行了 旋转，使数组变为 [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]（下标 从 0 开始 计数）。例如， [0,1,2,4,5,6,7] 在下标 3 处经旋转后可能变为 [4,5,6,7,0,1,2] 。
    给你 旋转后 的数组 nums 和一个整数 target ，如果 nums 中存在这个目标值 target ，则返回它的下标，否则返回 -1 。
    你必须设计一个时间复杂度为 O(log n) 的算法解决此问题。
 * @link https://leetcode.cn/problems/search-in-rotated-sorted-array/
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
*/
var search = function (nums, target) {
  const findMinNumIdx = (list) => {
    let left = 0,
      right = list.length - 1;
    while (left < right) {
      // 二分法查找（效率上看，二分法查找更高）
      const mid = Math.floor((left + right) / 2);
      if (list[mid] > list[right]) {
        left = mid + 1;
      } else {
        right = mid;
      }
      // // 双指针查找
      // if (list[left] < list[right]) {
      //   right--;
      // } else {
      //   left++;
      // }
    }
    return left;
  };

  const findTargetIndex = (list) => {
    let res = -1;
    for (let i = 0; i < list.length; i++) {
      if (list[i] === target) {
        res = i;
        break;
      }
    }
    return res;
  };

  // 二分查找
  const minIdx = findMinNumIdx(nums);

  if (nums[minIdx] === target) {
    return minIdx;
  }

  // target在右边
  // 右边如果存在，则需要补充前面的元素下标
  const rightIdx = findTargetIndex(nums.slice(minIdx + 1));
  if (rightIdx > -1) {
    return minIdx + rightIdx + 1;
  }

  // target在左边
  const leftIdx = findTargetIndex(nums.slice(0, minIdx));
  if (leftIdx > -1) {
    return leftIdx;
  }

  return -1;
};

//====== 测试区域开始 ======
console.log(search([4, 5, 6, 7, 0, 1, 2], 0)); // 4
console.log(search([4, 5, 6, 7, 0, 1, 2], 3)); // -1
console.log(search([1], 0)); // -1
console.log(search([1, 3], 3)); // 1
//====== 测试区域结束 ======
