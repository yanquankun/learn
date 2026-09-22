/**
 * 给你一个 无重复元素 的整数数组 candidates 和一个目标整数 target ，找出 candidates 中可以使数字* 和为目标数 target 的 所有 不同组合 ，并以列表形式返回。你可以按 任意顺序 返回这些组合。
 * candidates 中的 同一个 数字可以 无限制重复被选取 。如果至少一个数字的被选数量不同，则两种组合是* 不同的。
 * 对于给定的输入，保证和为 target 的不同组合数少于 150 个。
 */

/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
let combinationSum = (candidates, target) => {
  // 升序减少复杂度
  candidates = candidates.sort((a, b) => a - b);

  // 回溯终止条件
  if (candidates.length === 1 && candidates[0] === target) return [target];

  let res = [];

  for (let i = 0; i < candidates.length; i++) {
    if (candidates[i] === target) res.push([candidates[i]]);

    if (candidates[i] > target) break;

    // 每次递归，只在[i, candidates.length)范围内查找
    // arr: 符合sum = target - candidates[i]的所有组合
    const arr = combinationSum(candidates.slice(i), target - candidates[i]);

    arr.length &&
      arr.forEach((item) => {
        res.push([...(Array.isArray(item) ? item : [item]), candidates[i]]);
      });
  }

  return res;
};
// 如果对上述进行空间复杂度优化，可采取下面方式，该方式更简洁
combinationSum = (candidates, target) => {
  const res = [];
  /**
   * @param {number} target 目标值
   * @param {number} index 起始下标
   * @param {number[]} path 满足target的组合
   */
  const dfs = (target, index, path) => {
    if (target < 0) return;
    if (target === 0) {
      res.push(path);
      return;
    }
    for (let i = index; i < candidates.length; i++) {
      dfs(target - candidates[i], i, [...path, candidates[i]]);
    }
  };
  dfs(target, 0, []);

  return res;
};
//====== 测试区域开始 ======
console.log(combinationSum([2, 3, 6, 7], 7)); // [[2,2,3],[7]]
console.log(combinationSum([2, 3, 5], 8)); // [[2,2,2,2],[2,3,3],[3,5]]
//====== 测试区域结束 ======
