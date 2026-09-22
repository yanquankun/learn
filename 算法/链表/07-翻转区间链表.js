function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}
/**
 * @description 给你单链表的头指针 head 和两个整数 left 和 right ，其中 left <= right 。请你反转从位置 left 到位置 right 的链表节点，返回 反转后的链表
 * @link https://leetcode.cn/problems/reverse-linked-list-ii/
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
//====== 方案一 ======
// 方案一是通过双指针方式翻转指定区间的链表
// 优点：空间复杂度低，时间复杂度 O(n)
// 缺点：代码逻辑相对复杂
// 思路：
// 1. 先找到待翻转链表的前一个节点 pre 和后一个节点 end
// 2. 截取待翻转链表，断开前后链表，这样可以截取待翻转链表
// 3. 翻转待翻转链表
// 4. 连接翻转前的链表和翻转后的链表
// 5. 返回新的链表头
var reverseBetween = function (head, left, right) {
  if (!head.next || left === right) return head;

  let dummy = new ListNode(0, head), // 基准节点
    pre = dummy, // 除待翻转链表前的节点
    end = null; // 除待翻转链表后的节点

  for (let i = 0; i < left - 1; i++) {
    pre = pre.next;
  }

  let leftNode = pre.next; // 待翻转链表第一个节点
  let rightNode = pre; // 待翻转链表最后一个节点
  for (let i = 0; i < right - left + 1; i++) {
    rightNode = rightNode.next;
  }

  end = rightNode.next;
  // 核心：截取待翻转链表！！！
  pre.next = null; // 断开翻转前的链表
  rightNode.next = null; // 断开翻转后的链表

  reverseLinkedList(leftNode);

  pre.next = rightNode; // 连接翻转前的链表
  leftNode.next = end; // 连接翻转后的链表
  return dummy.next;
};
const reverseLinkedList = (head) => {
  let pre = null;
  let cur = head;

  while (cur) {
    const next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
};
//====== 方案一 ======

//====== 方案二 ======
// 方案二是通过数组方式先获取所有节点，然后对指定区间进行翻转，最后再重新构建链表
// 优点：代码简单易懂，逻辑清晰
// 缺点：空间复杂度较高
var reverseBetween = function (head, left, right) {
  if (!head.next || left === right) return head;

  let arr = [],
    newList = new ListNode(0),
    cur = newList;

  // 通过数组方式先获取所有节点
  while (head) {
    arr.push(head.val);
    head = head.next;
  }

  // 这种方式比较笨，不推荐
  arr = arr
    .slice(0, left - 1)
    .concat(arr.slice(left - 1, right).reverse(), arr.slice(right));

  for (let i = 0; i < arr.length; i++) {
    cur.next = new ListNode(arr[i]);
    cur = cur.next;
  }

  return newList.next;
};
//====== 方案二 ======

//====== 测试区域开始 ======
const test = () => {
  let head = new ListNode(
    1,
    new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5))))
  );
  console.log(reverseBetween(head, 2, 4)); // 1 -> 4 -> 3 -> 2 -> 5
};
test();
//====== 测试区域结束 ======
