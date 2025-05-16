function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}
/**
 * @description 给你一个链表的头节点 head ，旋转链表，将链表每个节点向右移动 k 个位置
 * eg: 输入：head = [1,2,3,4,5], k = 2
 * 输出：[4,5,1,2,3]
 * 解释：向右旋转 1 步：[5,1,2,3,4]，向右旋转 2 步：[4,5,1,2,3]
 * @link https://leetcode.cn/problems/rotate-list/
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var rotateRight = function (head, k) {
  if (k === 0 || !head || !head.next) return head;

  // 无法直接获取链表最后一个节点，所以先转换成数组，并且获取长度，这样直接省略K次多余的翻转
  let len = 0,
    arr = [];

  while (head) {
    arr.push(head.val);
    head = head.next;
    len++;
  }

  // k次旋转，实际只需要旋转 k%len 次
  k = k % len;
  while (k--) {
    arr.unshift(arr.pop());
  }

  // 重新构建链表
  let res = (cur = new ListNode(0));
  for (let i = 0; i < len; i++) {
    cur.next = new ListNode(arr[i]);
    cur = cur.next;
  }

  return res.next;
};

//====== 测试区域开始 ======
const head = {
  val: 1,
  next: {
    val: 2,
    next: {
      val: 3,
      next: {
        val: 4,
        next: {
          val: 5,
          next: null,
        },
      },
    },
  },
};
const k = 2;
const result = rotateRight(head, k);
console.log(result); // 输出：[4,5,1,2,3]
//====== 测试区域结束 ======
