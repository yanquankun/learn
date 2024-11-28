// 给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i]) 。
// 找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。
// 返回容器可以储存的最大水量。
// 说明：你不能倾斜容器。
// n == height.length
// 2 <= n <= 105
// 0 <= height[i] <= 104

/**
 * 2024-11-28 11:41:58
 * @author Mint.Yan
 * @link https://leetcode.cn/problems/container-with-most-water/description/?source=vscode
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function (height) {
  let left = 0,
    right = height.length - 1,
    res = 0;

  while (left < right) {
    const min = Math.min(height[left], height[right]);
    res = Math.max(res, (right - left) * min);

    // 哪侧最短，则从该侧向内靠近
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return res;
};

//====== 测试区域开始 ======
maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]); // 49
//====== 测试区域结束 ======
