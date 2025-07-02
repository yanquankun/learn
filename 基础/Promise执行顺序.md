**有关Promise的执行顺序题经常会让大家迷惑不已，稍不小心，就可能错误，在开始前，有必要先了解下哪些是宏任务和微任务**

`宏任务`

| 类型                      | 示例                       |
| ------------------------- | -------------------------- |
| `setTimeout`              | `setTimeout(() => {}, 0)`  |
| `setInterval`             | `setInterval(() => {}, 0)` |
| `setImmediate`（Node.js） | `setImmediate(() => {})`   |
| I/O 操作                  | 文件读取、网络请求的回调   |
| UI 渲染（浏览器）         | 页面重排与重绘             |
| MessageChannel            | `port.postMessage()`       |

`微任务`

| 类型                               | 示例                         |
| ---------------------------------- | ---------------------------- |
| `Promise.then / catch / finally`   | `Promise.resolve().then()`   |
| `queueMicrotask`                   | `queueMicrotask(() => {})`   |
| `MutationObserver`                 | DOM 变更观察者               |
| `process.nextTick`（Node.js 专有） | `process.nextTick(() => {})` |

**了解了宏任务和微任务有哪些后，再看下事件循环的流程**

![image-20250702153924067](https://oss.yanquankun.cn/oss-cdn/image-20250702153924067.png!watermark)

**通过上图可以看到，事件执行顺序其实是由多个任务调度过程完成的，在多个进程中，浏览器会根据进程的优先级进行推进，如果当前有空余时间，就会开始执行事件调度进程，这时候会先进行同步执行js代码，如果遇到了微任务，则放入到微任务队列中，如果遇到了宏任务，则加入到宏任务队列中，当同步事件执行完成后，会开始情况微任务队列，清空后，会看宏任务队列，将宏任务执行的结果标记后推入到队列中，按照队列的特点，逐步弹出结果，直到清空所有的宏任务和微任务队列，此时完成了本次的事件循环，浏览器进入空闲状态，然后等待下一次的事件循环**

> **了解事件循环的本质，即是判断执行顺序的依据**

```javascript
# 先来看一道题
console.log('start');
setTimeout(() => {
  console.log('timeout');
}, 0);
Promise.resolve().then(() => {
  console.log('promise1');
}).then(() => {
  console.log('promise2');
});
async function foo() {
  console.log('foo start');
  await bar();
  console.log('foo end');
}
async function bar() {
  console.log('bar');
}
foo();
console.log('end');
```

**我们来分析下执行顺序**

1. 同步执行阶段

- 执行 Promise.resolve().then...，注册了两个微任务，但不会立即执行。
- 定义了 foo 和 bar 函数。
- 调用 foo()：
- 打印 'foo start'
- 执行 await bar()，这时会执行 bar()，打印 'bar'
- 遇到 await，foo end 之后的代码（即 console.log('foo end')）会被包裹到一个微任务中，并暂停当前函数，等待 Promise.resolve(bar()) 完成。

2. 微任务队列

- 现在微任务队列里有：
  promise1（第一个 then）foo end（await 之后的语句）promise2（第二个 then）
  但实际上，这三者的入队顺序很关键！

> **关键点：微任务的入队顺序**
>
> > Promise.resolve().then(...) 的 then 回调会立即插入微任务队列。
> > foo() 执行到 await bar() 时，bar() 也是个 async 函数，返回的其实是一个已经 resolved 的 Promise，所以 await bar() 等价于 await Promise.resolve(undefined)，所以 console.log('foo end') 也会插入到微任务队列。但是，Promise 的 then 链式调用会"扁平化"插入微任务队列：下一个 then 必须等上一个 then 的回调执行完后才插入队列。

具体来说，队列是这样变化的：

- promise1 被插入微任务队列
- foo end 被插入微任务队列（因为 await 了一个已 resolve 的 Promise）
- 此时 promise2 还没有插入队列，因为要等 promise1 的 then 回调执行完（即“promise1”输出后），才会把 promise2 插入
- 所以最终微任务队列的执行顺序是：promise1 foo end promise2

```javascript
// 最终的输出结果：
// start
// foo start
// bar
// end
// promise1
// foo end
// promise2
// timeout
```

> 小技巧：
>
> 1. **await 后续代码**
>
>   function(){...;await xxx;...} 遇到这种的，可以直接将 await 下面的代码看出包裹在 then 里的代码，放入到微任务队列中
>
> 2. **Promise.resolve().then(xxx).then(xxx).......**
>
>   Promise 的 then 链式调用会"扁平化"插入微任务队列，下一个 then 必须等上一个 then 的回调执行完后才插入队列

**再来看两道题**

```javascript
 Promise.resolve()
  .then(() => {
    console.log("promise1");
  })
  .then(() => {
    console.log("promise2");
  });
async function foo() {
  console.log("foo start");
  await bar();
  console.log("foo end");
}
async function bar2() {
  console.log("bar2");
  await bar3();
}
async function bar3() {
  console.log("bar3");
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
  console.log("bar3 end");
}
async function bar() {
  console.log("bar");
  await bar2();
}
Promise.resolve()
  .then(() => {
    console.log("promise3");
  })
  .then(() => {
    console.log(" promise4");
  });
foo();
console.log("end");
// 输出顺序：foo start/bar/bar2/bar3/end/promise1/promise3/promise2/promise4/bar3 end/foo end
```

```javascript
Promise.resolve()
  .then(() => {
    console.log("promise1");
  })
  .then(() => {
    console.log("promise2");
  });
async function foo() {
  console.log("foo start");
  await bar();
  console.log("foo end");
}
async function bar() {
  console.log("bar");
  await bar2();
}
async function bar2() {
  console.log("bar2");
  await bar3();
}
async function bar3() {
  console.log("bar3");
  await 1;
  console.log("bar3 end");
}
Promise.resolve()
  .then(() => {
    console.log("promise3");
  })
  .then(() => {
    console.log(" promise4");
  });
foo();
console.log("end");
// 输出顺序：foo start/bar/bar2/bar3/end/promise1/promise3/bar3 end/promise2/promise4/foo end
```

> *这里大家会有一个疑惑，为什么foo end会最后执行，不是应该被提前注入到微任务队列吗？*
>
> **以第二题为例解释：**
>
> 我们在bar3函数中，执行await 1;console.log("bar3 end");相当于如下代码：
>
> **Promise.resolve(1).then(()=>console.log("bar3 end"))**
>
> 此时会将then(()=>console.log("bar3 end"))加入到微任务队列中，然后停止函数的执行
>
> **此时微任务队列为[ console.log("promise1"),console.log("promise3"),console.log("bar3 end")]**
>
> *输出：promise1、promise3、bar3 end*
>
> 然后开始挨个执行微任务，并将后续的微任务推入到微任务队列中，这一轮微任务清空
>
> **此时微任务队列为[ console.log("promise2"),console.log("promise4"),console.log("foo end")]**
>
> *输出：promise2、promise4、foo end*
>
> **此时任务队列全部清空，浏览器进入空闲，等待下次事件循环任务队列执行**
