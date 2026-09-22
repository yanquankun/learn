/**
 * 2024-02-27 19:10:02
 * @author Mint.Yan
 * @description 深度优先遍历
 * @param {node} root 根节点
 * @param {Array<node>} deepNode 遍历后的结果
 * @returns Array<node>
 */
const deepSearch = (root, deepNode = []) => {
  if (root) {
    deepNode.push(root);
    const children = root.children || [];
    for (let i = 0; i < children.length; i++) {
      deepSearch(children[i], deepNode);
    }
  }
  return deepNode;
};
//====== 测试区域开始 ======
let obj = {
  children: [
    {
      index: 0,
      children: [
        {
          index: 1,
          children: [
            {
              index: 3,
            },
          ],
        },
      ],
    },
    {
      index: 4,
    },
    {
      index: 5,
      children: [
        {
          index: 7,
          children: [
            {
              index: 8,
            },
          ],
        },
      ],
    },
    {
      index: 6,
    },
  ],
};
console.log(deepSearch(obj));
// [
//   { children: [[Object], [Object], [Object], [Object]] },
//   { index: 0, children: [[Object]] },
//   { index: 1, children: [[Object]] },
//   { index: 3 },
//   { index: 4 },
//   { index: 5, children: [[Object]] },
//   { index: 7, children: [[Object]] },
//   { index: 8 },
//   { index: 6 },
// ];
//====== 测试区域结束 ======
