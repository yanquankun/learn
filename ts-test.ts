let obj: string = "1";
console.log(obj);
abstract class test {
  abstract say(word: string): void;
}

class childTest extends test {
  static child = 2;
  private child2 = 2;
  child3 = 3;
  say(word: string): void {
    console.log("child1" + word);
  }
  asay(word: string): void {
    console.log("child1" + word);
  }
}

class childTest2 extends test {
  say(word: string): void {
    console.log("child2" + word);
  }
}

var child1 = new childTest();
var child2 = new childTest2();
console.dir(child1.asay);
child1.say("hello");
child2.say("hello");

class Test2 {
  static a = 1;
  b: number = 2;
  private c = 3;
  public d = 4;
}
const testChild = new Test2();
console.log(testChild.b);
console.log(testChild.d);
console.dir(testChild);
console.dir(Test2.a);

/** 类型断言 */
let num = <number>1;
let num1 = 1 as number;
let num2: number = 1;
let num3: number = <number>1;

export const util: Util = (p) => {
  return Boolean(p);
};

// 对象只读
const obj1: deepReadonly<{
  name: string;
  obj: {
    age: number;
  };
}> = {
  name: "yqk",
  obj: {
    age: 10,
  },
};
obj1.name = "yqk2";
obj1.obj.age = 20;
// 数组只读
const arr: readonly (number | { a: number })[] = [1, 2, 3, { a: 1 }];
arr[3].a = 1;
const arr2: deepReadonly<(number | { a: number })[]> = [1, 2, 3, { a: 1 }];
arr2[3].a = 1;
arr2[0] = 1;

// 变量解构
Object.defineProperty(Object, "Symbol.iterator", {
  value: Object.values(this)[Symbol.iterator](),
});
const [a1, b1] = { a1: 1, b1: 2 };

interface SearchFunc {
  (source: string, subString: string): boolean;
}
let mySearch: SearchFunc;
mySearch = function (src: string, sub: string): boolean {
  let result = src.search(sub);
  return result > -1;
};

class t {
  aga: number = 12;
  protected age: number = 12;

  say() {
    this.aga;
    this.age;
    t.say2();
  }

  static say2() {
    const _this = new t();
    console.log(_this.age);
  }
}
const tt = new t();
tt.say();
tt.aga;

type fnReturn = void | number | string;
function fn(p: string): string;
function fn(p: number): number;
function fn(): void;
function fn(p?): fnReturn {
  if (p) return 1;
}
function fn2(p: string): string {
  return p;
}
function fn3(p: Parameters<typeof fn2>[0]): ReturnType<typeof fn2> {
  return p;
}
fn3("1");

function strEnum<T extends string>(o: Array<T>): { [K in T]: K } {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}

// 创建 K: V
const Direction = strEnum(["North", "South", "East", "West"]);

// 创建一个类型
type Direction = keyof typeof Direction;
// 简单的使用
let sample: Direction = "East";
