var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var obj = "1";
console.log(obj);
var test = /** @class */ (function () {
    function test() {
    }
    return test;
}());
var childTest = /** @class */ (function (_super) {
    __extends(childTest, _super);
    function childTest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.child2 = 2;
        _this.child3 = 3;
        return _this;
    }
    childTest.prototype.say = function (word) {
        console.log("child1" + word);
    };
    childTest.prototype.asay = function (word) {
        console.log("child1" + word);
    };
    childTest.child = 2;
    return childTest;
}(test));
var childTest2 = /** @class */ (function (_super) {
    __extends(childTest2, _super);
    function childTest2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    childTest2.prototype.say = function (word) {
        console.log("child2" + word);
    };
    return childTest2;
}(test));
var child1 = new childTest();
var child2 = new childTest2();
console.dir(child1.asay);
child1.say("hello");
child2.say("hello");
var Test2 = /** @class */ (function () {
    function Test2() {
        this.b = 2;
        this.c = 3;
        this.d = 4;
    }
    Test2.a = 1;
    return Test2;
}());
var testChild = new Test2();
console.log(testChild.b);
console.log(testChild.d);
console.dir(testChild);