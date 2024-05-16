/**
 * 2024-01-26 14:55:42
 * @author Mint.Yan
 * @description Object.create 实现
 * @param {null|object} proto 继承的原型
 * @returns object
*/
function createObj(proto) {
  if (!arguments.length || proto === undefined) {
    console.log(arguments);
    throw Error(
      "Uncaught TypeError: Object prototype may only be an Object or null: undefined"
    );
  }

  const obj = {};
  obj.__proto__ = proto;
  return obj;
}

//====== 测试区域开始 ======
console.log(Object.create({})); // {}
console.log(Object.create(null)); // [Object: null prototype] {}
console.log(Object.create({ a: 1 })); // {}

console.log(createObj({})); // {}
console.log(createObj(null)); // [Object: null prototype] {}
console.log(createObj({ a: 1 })); // {}
//====== 测试区域结束 ======
