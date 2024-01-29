/**
 * 2024-01-29 15:45:06
 * @author Mint.Yan
 * @description: new 实现
 * @returns: instanceof context
 */
function createNew() {
  // 获取构造函数
  const constr = Array.prototype.shift.call(arguments);
  if (typeof constr !== "function") {
    throw Error("constr must be an constructor");
    return;
  }
  // 构造空对象，将对象的隐式原型指向构造函数的显式原型
  // var obj = Object.create({});
  // obj.__proto__ = constr.prototype;
  var obj = Object.create(constr.prototype);
  // 新对象this指向构造函数，并获取执行后的返回值
  var result = constr.apply(obj, arguments);
  // 之所以有判断result的原因是，如果构造函数有返回值&返回值为object类型
  // 那么，就子类其实继承的是构造函数返回的object
  return typeof result === "object" ? result : obj;
}

//====== 测试区域开始 ======
var parent = function (p1, p2) {
  this.name = "test";
  this.age = "666";
};
var child = new parent(1, 2);
console.log(child);
var child2 = createNew(parent, 1, 2);
console.log(child2);
var parent2 = function (p1, p2) {
  this.name = "test";
  this.age = "666";
  console.log(p1, p2);
  return {
    p1,
    p2,
  };
};
var child3 = new parent2(1, 2);
console.log(child3);
var child4 = createNew(parent2, 1, 2);
console.log(child4);
//====== 测试区域结束 ======
