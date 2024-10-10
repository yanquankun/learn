console.log('start');
const p = new Promise((resolve, reject) => {
    console.log('promise start');
    resolve();
    console.log('promise end');
}).then(()=>{
    console.log('promise1');
}).then(()=>{
    console.log('promise2');
})
const fn2 = async function(){
    console.log('fn2');
    await fn3();
    console.log('fn2 end')
}
const fn3 = async function(){
    console.log('fn3')
}
const fn = async function(){
    console.log('async');
    await fn2(); 
    console.log('end2');
}
fn();
console.log('end');

//====== 测试区域开始 ======
// 原则：1.有微先微，无微后宏  2.async内await前视为同步，后视为微任务（Promise.then()）

// 第一轮：
// 宏任务队列：script
// 微任务队列：none
// 微任务队列为空，先执行宏任务
// 同步执行：start、promise start、promise end、async、fn2、fn3、end
// 宏任务队列: none
// 微任务队列：p.then1、p.then2、fn2 await后部分、fn await后部分
// 此时第一轮任务执行完

// 第二轮：
// 先清理微任务p.then1、p.then2、fn2 await后部分、fn await后部分
// 宏任务：none
// 微任务：none
// 输出promise1、promise2、fn2 end、end2

// 第三轮
// 宏任务：none
// 微任务：none
// js执行线程进入休眠

// 最终输出：start、promise start、promise end、async、fn2、fn3、end、promise1、promise2、fn2 end、end2
//====== 测试区域结束 ======