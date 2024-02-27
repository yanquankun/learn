/**
 * 2024-02-27 19:09:55
 * @author Mint.Yan
 * @description 广度优先遍历
 * @param {node} root 根节点
 * @param {Array<node>} deepNode 遍历后的结果
 * @returns Array<node>
 */
const breadthSearch = (node, deepNode = []) => {
  // 推入初始节点
  if (!deepNode.length) deepNode.push(node);
  const children = node.children || [];
  // 通过缓存栈保存该层级下所有节点的children
  const stack = [];
  for (let i = 0; i < children.length; i++) {
    deepNode.push(children[i]);
    // 获取该节点所有的子节点 并推入缓存栈中
    // 目的是记录下一层级所有的子节点
    children[i].children &&
      children[i].children.length &&
      stack.push(...children[i].children);
  }
  // 必须等该层级所有节点都遍历后，再递归下一层级
  stack.length &&
    breadthSearch(
      {
        children: stack,
      },
      deepNode
    );
  return deepNode;
};
//====== 测试区域开始 ======
var obj = {
  val: 1,
  children: [
    {
      val: 2,
      children: [
        {
          val: 4,
          children: [{ val: 7 }],
        },
        {
          val: 5,
        },
      ],
    },
    {
      val: 3,
      children: [
        {
          val: 6,
        },
      ],
    },
  ],
};
console.log(breadthSearch(obj));
// [
//   { val: 1, children: [[Object], [Object]] },
//   { val: 2, children: [[Object], [Object]] },
//   { val: 3, children: [[Object]] },
//   { val: 4, children: [[Object]] },
//   { val: 5 },
//   { val: 6 },
//   { val: 7 },
// ];
//====== 测试区域结束 ======
