// 实现 LRUCache 类【最近最少使用，最远未使用的将被丢弃】：
// LRUCache(int capacity) 以 正整数 作为容量 capacity 初始化 LRU 缓存
// int get(int key) 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1 。
// void put(int key, int value) 如果关键字 key 已经存在，则变更其数据值 value ；如果不存在，则向缓存中插入该组 key-value 。如果插入操作导致关键字数量超过 capacity ，则应该 逐出 最久未使用的关键字。

/**
 * @param {number} capacity
 */
var LRUCache = function (capacity) {
  this.capacity = capacity || 0;
  this.stack = new Map();
};

/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function (key) {
  if (!this.stack.has(key)) {
    return -1;
  }
  const val = this.stack.get(key);
  this.stack.delete(key);
  this.stack.set(key, val);
  return val;
};

/**
 * @param {number} key
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function (key, value) {
  if (this.stack.has(key)) {
    this.stack.delete(key);
    this.stack.set(key, value);
  } else {
    if (this.stack.size < this.capacity) {
      this.stack.set(key, value);
    } else {
      const lastKey = this.stack.keys().next().value;
      this.stack.delete(lastKey);
      this.stack.set(key, value);
    }
  }
};

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
//====== 测试区域开始 ======
var lruCache = new LRUCache(2);
lruCache.put(1, 1);
lruCache.put(2, 2);
console.log(lruCache, lruCache.get(1)); // LRUCache { capacity: 2, stack: Map(2) { 2 => 2, 1 => 1 } } 1
lruCache.put(3, 3);
console.log(lruCache, lruCache.get(2)); // LRUCache { capacity: 2, stack: Map(2) { 1 => 1, 3 => 3 } } -1
lruCache.put(4, 4);
console.log(lruCache, lruCache.get(1)); // LRUCache { capacity: 2, stack: Map(2) { 3 => 3, 4 => 4 } } -1
console.log(lruCache, lruCache.get(3)); // LRUCache { capacity: 2, stack: Map(2) { 4 => 4, 3 => 3 } } 3
console.log(lruCache, lruCache.get(4)); // LRUCache { capacity: 2, stack: Map(2) { 3 => 3, 4 => 4 } } 4
//====== 测试区域结束 ======
