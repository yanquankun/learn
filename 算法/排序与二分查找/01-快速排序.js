/**
 * 2024-02-28 13:17:22
 * @author Mint.Yan
 * @description 快速排序 时间复杂度nlog(n)
 * @param {Array<number>} arr
 * @returns {Array<number>}
 */
const quickSort = (arr) => {
  if (!Array.isArray(arr)) throw Error(`${arr} is not an array`);
  if (arr.length < 2) return arr;
  // 设置对比值
  const point = arr[Math.floor(arr.length / 2)];
  // 小于对比值的
  const leftStack = [];
  // 大于对比值的
  const rightStack = [];
  for (let i = 0; i < arr.length; i++) {
    // 跳过目标值
    if (i === Math.floor(arr.length / 2)) continue;
    if (arr[i] < point) {
      leftStack.push(arr[i]);
    } else {
      rightStack.push(arr[i]);
    }
  }
  return [...quickSort(leftStack), point, ...quickSort(rightStack)];
};
//====== 测试区域开始 ======
var arr = [1, 2, 4, 3, 4, 5, 6, 8, 1, 2, 7, 8, 1, 9, 12];
console.log(quickSort(arr));
//====== 测试区域结束 ======
