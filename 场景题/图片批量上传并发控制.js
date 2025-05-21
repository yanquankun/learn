// 假设你要实现一个「批量图片上传」的功能，前端有一个数组files，包含若干个用户选择的图片文件。你的任务是：
// 实现一个上传函数uploadFiles(files, limit)，参数files为文件数组，limit为最大并发数（如3表示最多同时上传3个）。
// 假设有一个异步API函数upload(file): Promise，用于上传单个文件（模拟即可）。
// 要求：
// 任何时刻最多只有limit个上传任务并发进行。
// 所有文件都上传完成后，uploadFiles返回一个Promise，resolve时返回每个文件的上传结果（按原顺序）。
// 错误处理：某个文件上传失败时，该文件对应结果为Error对象，但不影响其它文件的上传。

const { fi } = require("element-plus/lib/locale/index.js");

// 模拟异步上传接口，随机1-2秒resolve或reject
function upload(file) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.8) {
        resolve("上传成功: " + file.name);
      } else {
        reject(new Error("上传失败: " + file.name));
      }
    }, 1000 + Math.random() * 10);
  });
}

const files = [
  { name: "a.png" },
  { name: "b.jpg" },
  { name: "c.gif" },
  { name: "d.jpeg" },
  { name: "e.webp" },
];
const limit = 2;

/**
 * 批量上传文件，并发控制
 * @param {File[]} files - 文件数组
 * @param {number} limit - 最大并发数
 * @returns {Promise<*>} - 返回一个Promise，resolve时为所有文件的上传结果数组（按原顺序）
 */
function uploadFiles(files, limit) {
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error("files must be a non-empty array");
  }

  if (typeof limit !== "number") {
    throw new TypeError("limit must be a number");
  }

  if (!limit || limit <= 0) limit = 1;

  let completeNum = 0,
    nextIndex = 0,
    results = new Array(files.length).fill(null);

  return new Promise((resolve) => {
    const runTask = async () => {
      if (nextIndex >= files.length) return;

      // 这里使用了闭包来保存当前的任务索引
      // 这样可以确保每个任务都能正确地引用到它对应的文件
      // 同时对nextIndex进行自增，这样就能保证每次调用runTask时都能获取到下一个文件
      const currentIndex = nextIndex++;
      upload(files[currentIndex])
        .then(
          (res) => {
            results[currentIndex] = res;
          },
          (err) => {
            results[currentIndex] = err;
          }
        )
        .finally(() => {
          completeNum++;

          if (completeNum === files.length) {
            resolve(results);
          } else {
            runTask();
          }
        });
    };

    for (let i = 0; i < Math.min(limit, files.length); i++) {
      runTask();
    }
  });
}

//====== 测试区域开始 ======
uploadFiles(files, limit).then((res) => {
  console.log(res);
});
//====== 测试区域结束 ======
