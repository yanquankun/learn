/*
 * 反转链表 入门
 */
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
  var newListNode = null;
  while (head) {
    // 注意：链表也是对象  会存在浅拷贝
    // 如果缓存的是当前项，如var cur = head;cur.next =  newListNode;
    // 会导致head直接变为1-->null
    var next = head.next;
    head.next = newListNode;
    newListNode = head;
    head = next;
  }
  return newListNode;
};