/**
 * 2024-03-05 15:34:33
 * @author Mint.Yan
 * @description 判断字符串是否是回文字符串 如aba abba
 * @param {number} n
 * @param {number} sum
 * @returns {Array<number>}
 */
const getTargetForSum = (str) => {
  if (str.length == 1) return true;
  let left = 0,
    right = str.length - 1;
  while (left <= right) {
    if (str[left] !== str[right]) return false;
    left++;
    right--;
  }
  return true;
};
//====== 测试区域开始 ======
console.log(getTargetForSum("aba"));
console.log(getTargetForSum("abba"));
console.log(getTargetForSum("abca"));
console.log(getTargetForSum("abc"));
console.log(getTargetForSum("ac"));
console.log(getTargetForSum("cc"));
//====== 测试区域结束 ======
