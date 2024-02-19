/**
 * 2024-02-19 14:45:12
 * @author Mint.Yan
 * @description: 数组扁平化
 * @param: {Array} arr
 * @param: {Number} depth 默认为1
 * @returns: Array
 */
const flat = (arr, depth = 1) => {
  if (!Array.isArray(arr)) throw Error(`${arr} must be an array`);
  if (!arr.length) return [];
  // depth为0 则直接返回数组 不需要扁平化
  if (depth == 0) return arr;
  return arr.reduce((totalizer, currentVal) => {
    return totalizer.concat(
      depth && Array.isArray(currentVal)
        ? flat(currentVal, --depth)
        : currentVal
    );
  }, []);
};
//====== 测试区域开始 ======
let arr = [1, [2, [3, [4, 5]]], 6];
console.log(flat(arr)); // [ 1, 2, [ 3, [ 4, 5 ] ], 6 ]
console.log(flat(arr, 1)); // [ 1, 2, [ 3, [ 4, 5 ] ], 6 ]
console.log(flat(arr, 2)); // [ 1, 2, 3, [ 4, 5 ], 6 ]
console.log(flat(arr, 3)); // [ 1, 2, 3, 4, 5, 6 ]
console.log(flat(arr, 4)); // [ 1, 2, 3, 4, 5, 6 ]
console.log(flat(arr, 6)); // [ 1, 2, 3, 4, 5, 6 ]
//====== 测试区域结束 ======