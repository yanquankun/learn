/**
 * 2024-01-26 17:25:51
 * @author Mint.Yan
 * @description: instanceof实现
 * @param: {object} left
 * @param: {object} right
 * @returns: boolean
 */
function _instanceof(left, right) {
  // instanceof只能判断复杂数据类型
  // 判断left原型链是否在Object上
  // 可判断left为Object Array Function Date RegExp的情况
  if (!Object.prototype.isPrototypeOf(left)) return false;

  let proto = left.__proto__;
  const prototype = right.prototype;

  while (true) {
    if (proto === null) return false;
    if (proto === prototype) return true;

    proto = proto.__proto__;
  }
}

//====== 测试区域开始 ======
var noop = () => {};
console.log(noop instanceof Function);
console.log(_instanceof(noop, Function));

console.log([] instanceof Array);
console.log(_instanceof([], Array));

console.log(noop instanceof Object);
console.log(_instanceof(noop, Object));

console.log(1 instanceof Object);
console.log(_instanceof(1, Object));

var simpleStr = "This is a simple string";
var myString = new String();
var newStr = new String("String created with constructor");
var myDate = new Date();
var myObj = {};
var myNonObj = Object.create(null);

console.log(_instanceof(simpleStr, String));
console.log(simpleStr instanceof String);
console.log(_instanceof(myString, String));
console.log(myString instanceof String);
console.log(_instanceof(newStr, String));
console.log(newStr instanceof String);
console.log(_instanceof(myString, Object));
console.log(myString instanceof Object);
console.log(_instanceof(myObj, Object));
console.log(myObj instanceof Object);
console.log(_instanceof({}, Object));
console.log({} instanceof Object);
console.log(_instanceof(myNonObj, Object));
console.log(myNonObj instanceof Object);
console.log(_instanceof(myString, Date));
console.log(myString instanceof Date);
console.log(_instanceof(myDate, Date));
console.log(myDate instanceof Date);
console.log(_instanceof(myDate, Object));
console.log(myDate instanceof Object);
console.log(_instanceof(myDate, String));
console.log(myDate instanceof String);

//====== 测试区域结束 ======
