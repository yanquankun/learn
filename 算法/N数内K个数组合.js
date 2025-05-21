/**
 * @description 给定两个整数 n 和 k，返回范围 [1, n] 中所有可能的 k个数的组合
 * @link https://leetcode.cn/problems/combinations/
 * @param {number} n
 * @param {number} k
 * @return {number[][]}
 */
var combine = function (n, k) {
  let res = [];

  const dfs = function (path) {
    for (let i = 1; i < n + 1; i++) {
      if (path.length === k) {
        res.push(path.slice());
        return;
      }

      // 剪枝
      // 1. 如果当前路径已经包含了 i，直接跳过
      // 2. 如果当前路径的最后一个元素大于等于 i，直接跳过
      if (path.includes(i) || (i >= 1 && i < path[path.length - 1])) {
        continue;
      }

      path.push(i);
      dfs(path);
      path.pop();
    }
  };
  dfs([]);

  return res;
};
