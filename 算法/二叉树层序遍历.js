/**
 * @link https://leetcode.cn/problems/binary-tree-level-order-traversal/description/
 * @description 给你二叉树的根节点 root ，返回其节点值的 层序遍历 。 （即逐层地，从左到右访问所有节点），注意：每层的结果放到一个数组中
 * @example
 * 输入：root = [3,9,20,null,null,15,7]
 * 输出：[[3],[9,20],[15,7]]
 *
 * 输入：root = [1]
 * 输出：[[1]]
 *
 */

// 层序遍历本质上属于广度优先遍历（breadth-first traversal），也称广度优先搜索（breadth-first search, BFS），它体现了一种“一圈一圈向外扩展”的逐层遍历方式
// 广度优先遍历通常借助“队列”来实现。队列遵循“先进先出”的规则，而广度优先遍历则遵循“逐层推进”的规则，两者背后的思想是一致的。

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
 * @return {number[][]}
 */
// 方式一：通过记录每层的节点数量进行广度遍历
// 时间、空间复杂度均为O(n)，但耗时和内存占用较低
// 推荐！！！
var levelOrder = function (root) {
  if (!root) return [];

  let queen = [root],
    list = [],
    count = queen.length;

  while (queen.length) {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push(queen[0].val);

      const node = queen.shift();
      if (node.left) {
        queen.push(node.left);
      }
      if (node.right) {
        queen.push(node.right);
      }
    }
    count = queen.length;
    list.push(temp);
  }

  return list;
};
// 方式二：通过两个队列进行每层节点数保存，并记录每层的结果
// 时间、空间复杂度均为O(n)，但耗时和内存占用较高
var levelOrder = function (root) {
  if (!root) return [];

  let queen = [root],
    levelQueen = [],
    list = [];
  while (queen.length) {
    const node = queen.shift();
    if (!list.length) {
      list = [[node.val]];
    } else {
      list[list.length - 1].push(node.val);
    }

    if (node.left) {
      levelQueen.push(node.left);
    }
    if (node.right) {
      levelQueen.push(node.right);
    }

    if (!queen.length) {
      queen = levelQueen;
      levelQueen = [];
      queen.length && list.push([]);
    }
  }

  return list;
};

//====== 测试区域开始 ======
console.log(levelOrder([3, 9, 20, null, null, 15, 7])); // [[3],[9,20],[15,7]]
//====== 测试区域结束 ======
