/**
 * 给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。
 */
/**
 * Definition for singly-linked list.
 */
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}
/**
 * 2024-12-12 16:08:17
 * @author Mint.Yan
 * @link https://leetcode.cn/problems/swap-nodes-in-pairs/
 * @description 两两交换链表中的节点
 * @param {ListNode} head
 * @return {ListNode}
 */
var swapPairs = function (head) {
  const resNodeList = new ListNode();
  resNodeList.next = head;
  // 作用为牵引节点
  let current = resNodeList;
  while (current.next && current.next.next) {
    const first = current.next;
    const second = current.next.next;

    // 交换节点
    first.next = second.next;
    second.next = first;
    current.next = second;

    current = current.next.next;
  }
  return resNodeList.next;
};

//====== 测试区域开始 ======
console.log(
  swapPairs(new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4)))))
); // [2,1,4,3]
//====== 测试区域结束 ======
