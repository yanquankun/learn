/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @description 给你二叉树的根节点root,返回其节点值的 层序遍历[即逐层地，从左到右访问所有节点]
 * @return {number[][]}
 */
var levelOrder = function (root) {
  if (!root) return [];
  const res = [[root.val]];
  const save = [];
  root.left && save.push(root.left.val);
  root.right && save.push(root.right.val);
  save.length && res.push(save);
  if (root.left) {
    const left = levelOrder(root.left);
    left.shift();
    left.length && res.push(...left);
  }
  if (root.right) {
    const right = levelOrder(root.right);
    right.shift();
    right.length && res.push(...right);
  }
  return res;
};
//====== 测试区域开始 ======
/**
 * @link https://leetcode.cn/problems/binary-tree-level-order-traversal/description/
 */
//====== 测试区域结束 ======
