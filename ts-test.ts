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
