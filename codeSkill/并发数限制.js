/**
 * 2024-03-07 11:04:46
 * @author Mint.Yan
 * @description 封装请求数并发方法
 * @param {Array<any>} taskList 任务列表
 * @param {number} max 最大并发数
 * @returns {Promise<Array<any>>}
 */
const mutilRequest = (taskList, max) => {
  if (!Array.isArray(taskList) || typeof max !== "number" || max < 0) {
    throw Error("参数不合法");
  }
  return new Promise((resolve) => {
    // 返回结果
    const result = [];
    // 完成数
    let resolveCount = 0;
    // 下次推入任务的index
    let nextIndex;

    const _runTask = async (task, index) => {
      if (!task || index >= taskList.length) return;
      try {
        const res = await task();
        result[index] = res;
      } catch (error) {
        result[index] = error;
      } finally {
        resolveCount++;
        _runTask(taskList[nextIndex], nextIndex);
        nextIndex++;
      }
      //   console.log(index, result);
      if (resolveCount == taskList.length) {
        resolve(result);
      }
    };

    // 只推入max范围内的任务
    for (let i = 0; i < Math.min(taskList.length, max); i++) {
      nextIndex = i + 1;
      _runTask(taskList[i], i);
    }
  });
};
//====== 测试区域开始 ======
const taskList = [];
for (let i = 1; i <= 20; i++) {
  taskList.push(async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${i}`
    );
    const resBody = await response.json();
    return resBody;
  });
}
mutilRequest(taskList, 3).then((res) => {
  console.log(res);
});
// Promise {<pending>}
// VM7943:33 1 (2) [empty, {…}]
// VM7943:33 0 (2) [{…}, {…}]
// VM7943:33 2 (3) [{…}, {…}, {…}]
// VM7943:33 4 (5) [{…}, {…}, {…}, empty, {…}]
// VM7943:33 3 (5) [{…}, {…}, {…}, {…}, {…}]
// VM7943:33 5 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
// VM7943:33 8 (9) [{…}, {…}, {…}, {…}, {…}, {…}, empty × 2, {…}]
// VM7943:33 6 (9) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, empty, {…}]
// VM7943:33 7 (9) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
// VM7943:33 10 (11) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, empty, {…}]
// VM7943:33 9 (11) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
// VM7943:33 11 (12) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
// VM7943:33 12 (13) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
// VM7943:33 14 (15) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, empty, {…}]
// VM7943:33 13 (15) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
// VM7943:33 15 (16) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
// VM7943:33 16 (17) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
// VM7943:33 17 (18) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
// VM7943:33 18 (19) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
// VM7943:33 19 (20) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
// VM7943:58 (20) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
//====== 测试区域结束 ======
