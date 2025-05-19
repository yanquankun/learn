function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}
/**
 * @description 给你两个 非空 链表来代表两个非负整数。数字最高位位于链表开始位置。它们的每个节点只存储一位数字。将这两数相加会返回一个新的链表。你可以假设除了数字 0 之外，这两个数字都不会以零开头。
 * @link https://leetcode.cn/problems/add-two-numbers-ii/
 * @example
 * 输入：l1 = [7,2,4,3], l2 = [5,6,4]
 * 输出：[7,8,0,7]
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (l1, l2) {
  const reserverListNode = (list) => {
    let prev = null;
    let cur = list;
    while (cur) {
      const next = cur.next;
      cur.next = prev;
      prev = cur;
      cur = next;
    }
    return prev;
  };

  l1 = reserverListNode(l1);
  l2 = reserverListNode(l2);

  // carry 进位
  let carry = 0,
    res = new ListNode(0),
    cur = res;

  // 三者只要有一个，则可以继续求和
  while (l1 || l2 || carry) {
    const sum = (l1?.val ?? 0) + (l2?.val ?? 0) + carry;
    if (sum >= 10) {
      carry = 1;
      cur.val = sum % 10;
    } else {
      carry = 0;
      cur.val = sum;
    }
    l1 = l1 ? l1.next : null;
    l2 = l2 ? l2.next : null;
    if (l1 || l2 || carry) {
      cur.next = new ListNode(0);
      cur = cur.next;
    }
  }

  return reserverListNode(res);
};

//====== 测试区域开始 ======
const l1 = new ListNode(7, new ListNode(2, new ListNode(4, new ListNode(3))));
const l2 = new ListNode(5, new ListNode(6, new ListNode(4)));
console.log(addTwoNumbers(l1, l2)); // [7,8,0,7]
//====== 测试区域结束 ======
