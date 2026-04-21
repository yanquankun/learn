/**
 * 题目：实现一个可暂停的并发任务调度器
 *
 * 题目要求：
 * 1. 实现 createScheduler(limit)
 * 2. 最多同时执行 limit 个异步任务
 * 3. 通过 add(task) 添加任务
 *    - task 是一个无参函数
 *    - 调用 task() 后返回 Promise
 * 4. add(task) 需要返回一个 Promise
 *    - 该 Promise 表示“这个任务自身”的执行结果
 * 5. 调度器需要提供两个方法：
 *    - pause()：暂停调度
 *    - resume()：恢复调度
 * 6. 注意任务原子性：
 *    - 已经开始执行的任务不能中断
 *    - pause() 只能阻止后续任务继续启动
 * 7. 所有任务都要按照添加顺序进入调度队列
 * 8. 某个任务执行失败时：
 *    - 只影响该任务自己的结果
 *    - 不影响后续任务继续执行
 *
 * 你需要补全下面的 createScheduler(limit)。
 */

/**
 * 实现一个可暂停的并发任务调度器
 *
 * @param {number} limit 最大并发数，limit >= 1
 * @returns {{
 *   add: (task: () => Promise<any>) => Promise<any>,
 *   pause: () => void,
 *   resume: () => void
 * }}
 */
function createScheduler(limit) {
  if (typeof limit !== "number" || limit < 1) {
    throw new Error("limit must be a number and greater than 0");
  }

  const taskQueue = [];
  // 当前正在执行的任务数
  let runningCount = 0;
  // 是否暂停：默认false，表示调度器初始状态为运行
  let isPaused = false;

  const runTask = async () => {
    const taskInfo = taskQueue.shift();

    if (!taskInfo) return;

    const { task, resolve, reject } = taskInfo;

    runningCount++;
    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      runningCount--;
      if (!isPaused && taskQueue.length) {
        runTask();
      }
    }
  };

  return {
    add(task) {
      return new Promise((resolve, reject) => {
        // 维护所有任务的队列
        taskQueue.push({ task, resolve, reject });

        if (!isPaused && runningCount < limit) {
          runTask();
        }
      });
    },
    pause() {
      isPaused = true;
    },
    resume() {
      isPaused = false;
      // 补满调度队列：runningCount < limit
      while (taskQueue.length && runningCount < limit) {
        runTask();
      }
    },
  };
}

/* =========================
 * 测试工具
 * ========================= */

function timeout(time, value, shouldReject = false) {
  return () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldReject) {
          reject(value);
        } else {
          resolve(value);
        }
      }, time);
    });
}

/* =========================
 * 测试用例 1：基础并发控制
 * ========================= */

console.log("===== 测试用例1：基础并发控制 =====");

const scheduler1 = createScheduler(2);
const start1 = Date.now();

scheduler1.add(timeout(1000, "A")).then((res) => {
  console.log("done:", res, Date.now() - start1);
});

scheduler1.add(timeout(500, "B")).then((res) => {
  console.log("done:", res, Date.now() - start1);
});

scheduler1.add(timeout(300, "C")).then((res) => {
  console.log("done:", res, Date.now() - start1);
});

scheduler1.add(timeout(400, "D")).then((res) => {
  console.log("done:", res, Date.now() - start1);
});

/**
 * 期望现象：
 * - 一开始只会同时执行 2 个任务
 * - A 和 B 先启动
 * - B 大约 500ms 完成后，C 才开始
 * - C 大约 800ms 完成
 * - A 大约 1000ms 完成后，D 才开始
 * - D 大约 1400ms 完成
 *
 * 可能接近的输出：
 * done: B 500+
 * done: C 800+
 * done: A 1000+
 * done: D 1400+
 *
 * 注意：
 * - 输出顺序应体现“并发上限=2”
 * - 不是按 add 的顺序完成，而是按执行时间 + 调度时机完成
 */

/* =========================
 * 测试用例 2：暂停与恢复
 * ========================= */

setTimeout(() => {
  console.log("\n===== 测试用例2：暂停与恢复 =====");

  const scheduler2 = createScheduler(2);
  const start2 = Date.now();

  scheduler2.add(timeout(1000, "task1")).then((res) => {
    console.log("res:", res, Date.now() - start2);
  });

  scheduler2.add(timeout(1200, "task2")).then((res) => {
    console.log("res:", res, Date.now() - start2);
  });

  scheduler2.add(timeout(300, "task3")).then((res) => {
    console.log("res:", res, Date.now() - start2);
  });

  scheduler2.add(timeout(300, "task4")).then((res) => {
    console.log("res:", res, Date.now() - start2);
  });

  setTimeout(() => {
    console.log("pause");
    scheduler2.pause();
  }, 200);

  setTimeout(() => {
    console.log("resume");
    scheduler2.resume();
  }, 2000);
}, 2000);

/**
 * 期望现象：
 * - task1 和 task2 会先启动
 * - 200ms 时 pause() 被调用
 * - 但 task1 / task2 已经启动，因此不会被中断
 * - task3 / task4 不会自动启动，要等 resume() 后才继续启动
 *
 * 可能接近的输出：
 * pause
 * res: task1 1000+
 * res: task2 1200+
 * resume
 * res: task3 2300+
 * res: task4 2500+   // 或 2300+，取决于你恢复时一次补几个任务
 *
 * 核心检查点：
 * - pause 不会中断运行中任务
 * - pause 后不会继续补位新任务
 * - resume 后会继续按并发规则调度剩余任务
 */

/* =========================
 * 测试用例 3：单任务失败不影响后续任务
 * ========================= */

setTimeout(() => {
  console.log("\n===== 测试用例3：单任务失败不影响后续任务 =====");

  const scheduler3 = createScheduler(2);

  scheduler3.add(timeout(500, "ok1")).then(
    (res) => console.log("success:", res),
    (err) => console.log("fail:", err),
  );

  scheduler3.add(timeout(300, "error2", true)).then(
    (res) => console.log("success:", res),
    (err) => console.log("fail:", err),
  );

  scheduler3.add(timeout(200, "ok3")).then(
    (res) => console.log("success:", res),
    (err) => console.log("fail:", err),
  );
}, 5000);

/**
 * 期望现象：
 * - 前两个任务先启动
 * - 第二个任务 300ms 时失败
 * - 失败后第三个任务仍然应该被调度执行
 * - 第一个任务成功
 * - 第三个任务成功
 *
 * 可能接近的输出：
 * fail: error2
 * success: ok1
 * success: ok3
 *
 * 核心检查点：
 * - add(task) 返回的 Promise 要正确 reject / resolve
 * - 某个任务失败后，调度器不能卡死
 * - 后续任务仍然能继续执行
 */
