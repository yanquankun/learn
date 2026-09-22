/**
 *给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。
 *请你将两个数相加，并以相同形式返回一个表示和的链表。
 *你可以假设除了数字 0 之外，这两个数都不会以 0 开头。
 */
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

/**
 * 2024-12-11 14:55:34
 * @author Mint.Yan
 * @link https://leetcode.cn/problems/add-two-numbers/
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (l1, l2) {
  let newListNode = new ListNode(0),
    // 牵引链表
    head = newListNode,
    flag = 0;

  while (l1 || l2) {
    const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + flag;
    flag = sum >= 10 ? 1 : 0;
    newListNode.next = new ListNode(sum >= 10 ? sum - 10 : sum);

    l1 && (l1 = l1.next);
    l2 && (l2 = l2.next);
    newListNode = newListNode.next;
  }

  // 进位还有的情况下，补充到结果中
  if (flag) newListNode.next = new ListNode(1);

  return head.next;
};
