/**
 * 2024-03-28 16:52:37
 * @author Mint.Yan
 * @description 返回数组从大到小的前K项
 * @param {Array<number>} arr
 * @param {number} limit topK值
 * @returns {Array<number>}
 */
const getTopK = (arr, limit) => {
  if (!Array.isArray(arr)) throw Error(`${arr} is not an array`);
  if (typeof limit !== "number") throw Error(`${limit} is not a number`);
  limit = Math.min(limit, arr.length);
  const quickSort = (arr) => {
    // 此处 当数组的length<=limit时，即可返回
    // 此时用测试用例中调用quickSort的次数是1和5
    if (arr.length <= limit) {
      return arr;
    }
    // 此条件，测试用例中调用quickSort的次数均为7
    // if (arr.length <= 1) {
    //   return arr;
    // }
    const left = [],
      right = [],
      point = Math.floor(arr.length / 2);
    for (let i = 0; i < arr.length; i++) {
      if (i == point) continue;
      else if (arr[i] < arr[point]) right.push(arr[i]);
      else left.push(arr[i]);
    }
    return [...quickSort(left), arr[point], ...quickSort(right)];
  };
  const res = quickSort(arr).splice(0, limit);
  return res;
};
//====== 测试区域开始 ======
console.log(getTopK([1, 3, 5, 2, 1], 10));
console.log(getTopK([1, 3, 5, 2, 1], 3));
//====== 测试区域结束 ======
