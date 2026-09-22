// 前序遍历：根结点 ---> 左子树 ---> 右子树
// 中序遍历：左子树---> 根结点 ---> 右子树
// 后序遍历：左子树 ---> 右子树 ---> 根结点
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0  val)
 *     this.left = (left===undefined ? null  left)
 *     this.right = (right===undefined ? null  right)
 * }
 */
/**
 * 2024-02-27 132454
 * @author Mint.Yan
 * @description 前序遍历
 * @param {TreeNode} root
 * @returns {number []}
 */
const frontTraversal = function (root) {
  if (!root) return [];
  const res = [];
  res.push(root.val);
  root.left && res.push(...preorderTraversal(root.left));
  root.right && res.push(...preorderTraversal(root.right));
  return res;
};
//====== 测试区域开始 ======
/**
 * @link https://leetcode.cn/problems/binary-tree-preorder-traversal/description/
 */
//====== 测试区域结束 ======
/**
 * 2024-02-27 132545
 * @author Mint.Yan
 * @description 中序遍历
 * @param {TreeNode} root
 * @returns {number []}
 */
const midTraversal = function (root) {
  if (!root) return [];
  const res = [];
  root.left && res.push(...preorderTraversal(root.left));
  res.push(root.val);
  root.right && res.push(...preorderTraversal(root.right));
  return res;
};
//====== 测试区域开始 ======
/** 
 * @link https://leetcode.cn/problems/binary-tree-inorder-traversal/description/
 */
//====== 测试区域结束 ======
/**
 * 2024-02-27 132549
 * @author Mint.Yan
 * @description 后序遍历
 * @param {TreeNode} root
 * @returns {number []}
 */
const backTraversal = function (root) {
  if (!root) return [];
  const res = [];
  root.left && res.push(...preorderTraversal(root.left));
  root.right && res.push(...preorderTraversal(root.right));
  res.push(root.val);
  return res;
};
//====== 测试区域开始 ======
/** 
 * @link https://leetcode.cn/problems/binary-tree-postorder-traversal/description/
 */
//====== 测试区域结束 ======
