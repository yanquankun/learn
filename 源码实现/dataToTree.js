/**
 * 2024-02-19 16:48:43
 * @author Mint.Yan
 * @description: 对象转树形结构
 * @param: {Array} data 具有父子关系的原数组
 * @param: {String} parentKey 父节点key 默认值pid
 * @param: {String} childKey 子节点key 默认值id
 * @param: {String} childrenKey 子级节点key 默认值children
 * @returns: {Array} 树形结构数组
 */
const dataToTree = (
  data,
  parentKey = "pid",
  childKey = "id",
  childrenKey = "children"
) => {
  if (!Array.isArray(data)) throw Error(`${data} must be an array`);
  if (!data.length) return [];
  const root = data.filter((item) => !item[parentKey]);
  // 设置当前项的children属性
  const setChildren = (current) => {
    const children = getChildren(data, current[childKey]);
    children.length && (current[childrenKey] = children);
  };
  // 作为辅助函数 获取root节点的子级
  const getChildren = (data, parentId) => {
    return data.filter((item) => {
      if (item[parentKey] === parentId) {
        setChildren(item);
        return item;
      }
    });
  };
  return root.map((parent) => {
    setChildren(parent);
    return parent;
  });
};

//====== 测试区域开始 ======
source = [
  {
    id: 1,
    pid: 0,
    name: "1",
  },
  {
    id: 2,
    pid: 1,
    name: "2",
  },
  {
    id: 3,
    pid: 2,
    name: "3",
  },
  {
    id: 4,
    pid: 0,
    name: "4",
  },
  {
    id: 5,
    pid: 4,
    name: "5",
  },
  {
    id: 7,
    pid: 4,
    name: "7",
  },
  {
    id: 8,
    pid: 7,
    name: "8",
  },
  {
    id: 6,
    pid: "",
    name: "6",
  },
];
const child = dataToTree(source, "pid", "id");
console.log(child);
//====== 测试区域结束 ======
