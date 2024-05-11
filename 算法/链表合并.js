function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}
/**
 * 2024-04-25 15:54:16
 * @author Mint.Yan
 * @description 链表合并
 * @param {ListNode} head1
 * @param {ListNode} head2
 * @returns ListNode
 */
var mergeTwoLists = function (list1, list2) {
  if (!list1 && !list2) return list1;
  if (!list1) return list2;
  if (!list2) return list1;
  let newListNode = new ListNode();
  // 通过一个新的头节点来记录newListNode链表
  let head = newListNode;
  while (list1 && list2) {
    if (list1.val > list2.val) {
      newListNode.next = new ListNode(list2.val);
      list2 = list2.next;
    } else {
      newListNode.next = new ListNode(list1.val);
      list1 = list1.next;
    }
    // 持续迭代newListNode链表的next项
    newListNode = newListNode.next;
  }
  if (!list1) newListNode.next = list2;
  if (!list2) newListNode.next = list1;
  return head.next;
};

//====== 测试区域开始 ======
/**
 * @link https://leetcode.cn/problems/merge-two-sorted-lists/discussion/
 */
const node1 = new ListNode(1);
const node2 = new ListNode(2);
const node5 = new ListNode(5);
const list1 = new ListNode(0);
list1.next = node1;
list1.next.next = node2;
const list2 = new ListNode(3);
list2.next = node5;
console.log(list1);
// ListNode {
//     val: 0,
//     next: ListNode { val: 1, next: ListNode { val: 2, next: null } }
//   }
console.log(list2);
// ListNode { val: 3, next: ListNode { val: 5, next: null } }
console.log(mergeTwoLists(list1, list2));
// ListNode {
//     val: 0,
//     next: ListNode { val: 1, next: ListNode { val: 2, next: [ListNode] } }
//   }
//====== 测试区域结束 ======
