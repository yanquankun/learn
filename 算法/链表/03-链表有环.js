/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * 2024-02-28 17:32:04
 * @author Mint.Yan
 * @description 如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。注意：pos 不作为参数进行传递 。仅仅是为了标识链表的实际情况。
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function (head) {
  if (!head) return false;
  // 解决思路就是用两个节点进行赛跑，pre一次前进一步，after一次前进两步
  // 如果有环，那这两个节点一点会相遇
  let pre = head,
    after = head;
  while (after && after.next) {
    if (pre === after.next) {
      return true;
    }
    pre = pre.next;
    after = after.next.next;
  }
  return false;
};
//====== 测试区域开始 ======
/**
 * @link https://leetcode.cn/problems/linked-list-cycle/description/
 */
//====== 测试区域结束 ======
