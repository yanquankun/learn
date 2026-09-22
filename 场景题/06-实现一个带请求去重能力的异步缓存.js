/**
 * 题目：实现一个带请求去重能力的异步缓存
 *
 * 题目要求：
 * 1. 实现 createAsyncCache(fetcher, options)
 * 2. fetcher 是一个异步函数，签名为：
 *    (key) => Promise<any>
 * 3. 返回的对象需要包含：
 *    - get(key): Promise<any>
 *    - invalidate(key): void
 *    - clear(): void
 * 4. 要求支持“请求去重”：
 *    - 当同一个 key 的请求正在进行中时
 *    - 多次调用 get(key)
 *    - 只能触发一次 fetcher(key)
 *    - 所有调用方都共享同一个 Promise 结果
 * 5. 要求支持“结果缓存”：
 *    - 某个 key 成功获取结果后，后续再次 get(key)
 *    - 在缓存未失效前，直接返回缓存结果
 *    - 不能再次调用 fetcher
 * 6. 要求支持缓存过期：
 *    - options.ttl 表示缓存有效时长（单位 ms）
 *    - 如果 ttl <= 0，则表示结果不缓存，但“请求进行中”的去重仍然要生效
 * 7. 失败结果不能缓存：
 *    - 如果 fetcher(key) reject
 *    - 下次再次 get(key) 时，应该重新请求
 * 8. invalidate(key) 只删除某个 key 的缓存
 * 9. clear() 清空全部缓存
 *
 * 你需要补全下面的 createAsyncCache(fetcher, options)。
 */

/**
 * 实现一个带请求去重能力的异步缓存
 *
 * @param {(key: string) => Promise<any>} fetcher
 * @param {{ ttl?: number }} [options]
 * @returns {{
 *   get: (key: string) => Promise<any>,
 *   invalidate: (key: string) => void,
 *   clear: () => void
 * }}
 */
function createAsyncCache(fetcher, options = {}) {
  if (typeof fetcher !== "function") {
    throw Error(`fetcher must be a function`);
  }

  let { ttl = 0 } = options;
  ttl = Math.max(0, ttl);

  // 请求缓存，缓存fetcher结果和上次时间
  const cacheMap = new Map();
  // 进行中的请求，保证同一个key的请求只有一个会执行
  const inFlightMap = new Map();

  return {
    get(key) {
      const now = +new Date();
      const cache = cacheMap.get(key);

      // 1. 命中有效缓存
      if (cache && cache.expireTime > now) {
        return Promise.resolve(cache.value);
      }

      // 2. 命中进行中的请求
      if (inFlightMap.has(key)) {
        return inFlightMap.get(key);
      }

      // 3. 未命中缓存，创建新的请求
      let promise;
      promise = new Promise((resolve, reject) => {
        fetcher(key).then(
          (res) => {
            if (ttl > 0) {
              cacheMap.set(key, {
                value: res,
                expireTime: now + ttl,
              });
            } else {
              cacheMap.delete(key);
            }

            inFlightMap.delete(key);
            resolve(res);
          },
          (error) => {
            inFlightMap.delete(key);
            cacheMap.delete(key);
            reject(error);
          },
        );
      });

      // 4. 将请求添加到进行中的请求映射中
      // 多个同样的key进行get请求时，这里会保证只有第一次进入fetcher的请求会执行
      // 后续的请求会返回第一次的promise结果
      inFlightMap.set(key, promise);
      return promise;
    },
    invalidate(key) {
      cacheMap.delete(key);
    },
    clear() {
      cacheMap.clear();
    },
  };
}

/* =========================
 * 测试工具
 * ========================= */

function createFetcher(delay = 300) {
  let callCount = 0;

  const fetcher = (key) => {
    callCount++;
    const currentCall = callCount;

    console.log(`[fetch start] key=${key}, callCount=${currentCall}`);

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`[fetch end] key=${key}, callCount=${currentCall}`);
        resolve(`data:${key}:${currentCall}`);
      }, delay);
    });
  };

  fetcher.getCallCount = () => callCount;

  return fetcher;
}

function createRejectFetcher(delay = 300) {
  let callCount = 0;

  const fetcher = (key) => {
    callCount++;
    const currentCall = callCount;

    console.log(`[fetch start] key=${key}, callCount=${currentCall}`);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(`[fetch fail] key=${key}, callCount=${currentCall}`);
        reject(`error:${key}:${currentCall}`);
      }, delay);
    });
  };

  fetcher.getCallCount = () => callCount;

  return fetcher;
}

/* =========================
 * 测试用例 1：同 key 并发请求去重
 * ========================= */

console.log("===== 测试用例1：同 key 并发请求去重 =====");

const fetcher1 = createFetcher(500);
const cache1 = createAsyncCache(fetcher1, { ttl: 2000 });

Promise.all([
  cache1.get("user_1"),
  cache1.get("user_1"),
  cache1.get("user_1"),
]).then((res) => {
  console.log("results:", res);
  console.log("fetch count:", fetcher1.getCallCount());
});

/**
 * 期望现象：
 * - 同一个 key=user_1，虽然并发调用了 3 次 get
 * - 但 fetcher 只能真正执行 1 次
 * - 3 个结果应该完全相同
 *
 * 可能接近的输出：
 * [fetch start] key=user_1, callCount=1
 * [fetch end] key=user_1, callCount=1
 * results: [ 'data:user_1:1', 'data:user_1:1', 'data:user_1:1' ]
 * fetch count: 1
 */

/* =========================
 * 测试用例 2：成功结果缓存
 * ========================= */

setTimeout(() => {
  console.log("\n===== 测试用例2：成功结果缓存 =====");

  const fetcher2 = createFetcher(300);
  const cache2 = createAsyncCache(fetcher2, { ttl: 2000 });

  cache2.get("profile").then((res) => {
    console.log("first:", res);
  });

  setTimeout(() => {
    cache2.get("profile").then((res) => {
      console.log("second:", res);
      console.log("fetch count:", fetcher2.getCallCount());
    });
  }, 700);
}, 1200);

/**
 * 期望现象：
 * - 第一次 get("profile") 会触发真实请求
 * - 第二次在 ttl 内再次 get("profile")，直接命中缓存
 * - fetcher 总调用次数仍然是 1
 *
 * 可能接近的输出：
 * [fetch start] key=profile, callCount=1
 * [fetch end] key=profile, callCount=1
 * first: data:profile:1
 * second: data:profile:1
 * fetch count: 1
 */

/* =========================
 * 测试用例 3：缓存过期后重新请求
 * ========================= */

setTimeout(() => {
  console.log("\n===== 测试用例3：缓存过期后重新请求 =====");

  const fetcher3 = createFetcher(200);
  const cache3 = createAsyncCache(fetcher3, { ttl: 500 });

  cache3.get("order_1").then((res) => {
    console.log("first:", res);
  });

  setTimeout(() => {
    cache3.get("order_1").then((res) => {
      console.log("second(after ttl):", res);
      console.log("fetch count:", fetcher3.getCallCount());
    });
  }, 1000);
}, 3000);

/**
 * 期望现象：
 * - 第一次请求会正常拉取
 * - 由于 ttl=500ms
 * - 1000ms 后再次请求时，缓存已经失效
 * - 应该重新调用 fetcher
 *
 * 可能接近的输出：
 * [fetch start] key=order_1, callCount=1
 * [fetch end] key=order_1, callCount=1
 * first: data:order_1:1
 * [fetch start] key=order_1, callCount=2
 * [fetch end] key=order_1, callCount=2
 * second(after ttl): data:order_1:2
 * fetch count: 2
 */

/* =========================
 * 测试用例 4：失败结果不能缓存
 * ========================= */

setTimeout(() => {
  console.log("\n===== 测试用例4：失败结果不能缓存 =====");

  const fetcher4 = createRejectFetcher(200);
  const cache4 = createAsyncCache(fetcher4, { ttl: 2000 });

  cache4.get("article_1").then(
    (res) => console.log("first success:", res),
    (err) => console.log("first fail:", err),
  );

  setTimeout(() => {
    cache4.get("article_1").then(
      (res) => console.log("second success:", res),
      (err) => {
        console.log("second fail:", err);
        console.log("fetch count:", fetcher4.getCallCount());
      },
    );
  }, 500);
}, 5000);

/**
 * 期望现象：
 * - 第一次请求失败
 * - 失败结果不能缓存
 * - 第二次再次 get("article_1") 时，必须重新发起请求
 *
 * 可能接近的输出：
 * [fetch start] key=article_1, callCount=1
 * [fetch fail] key=article_1, callCount=1
 * first fail: error:article_1:1
 * [fetch start] key=article_1, callCount=2
 * [fetch fail] key=article_1, callCount=2
 * second fail: error:article_1:2
 * fetch count: 2
 */

/* =========================
 * 测试用例 5：invalidate 与 clear
 * ========================= */

setTimeout(() => {
  console.log("\n===== 测试用例5：invalidate 与 clear =====");

  const fetcher5 = createFetcher(200);
  const cache5 = createAsyncCache(fetcher5, { ttl: 3000 });

  cache5.get("k1").then((res) => {
    console.log("k1 first:", res);

    cache5.get("k1").then((res2) => {
      console.log("k1 second:", res2);

      cache5.invalidate("k1");

      cache5.get("k1").then((res3) => {
        console.log("k1 third after invalidate:", res3);

        cache5.get("k2").then((res4) => {
          console.log("k2 first:", res4);

          cache5.clear();

          Promise.all([cache5.get("k1"), cache5.get("k2")]).then((res5) => {
            console.log("after clear:", res5);
            console.log("fetch count:", fetcher5.getCallCount());
          });
        });
      });
    });
  });
}, 7000);

/**
 * 期望现象：
 * 1. k1 第一次请求 => 真实请求，callCount=1
 * 2. k1 第二次请求 => 命中缓存，callCount 仍为 1
 * 3. invalidate("k1") 后，再请求 k1 => 重新请求，callCount=2
 * 4. 请求 k2 => 真实请求，callCount=3
 * 5. clear() 后，k1 和 k2 的缓存都被清空
 * 6. 再次请求 k1、k2 => 都应重新请求，最终 callCount=5
 *
 * 可能接近的输出：
 * [fetch start] key=k1, callCount=1
 * [fetch end] key=k1, callCount=1
 * k1 first: data:k1:1
 * k1 second: data:k1:1
 * [fetch start] key=k1, callCount=2
 * [fetch end] key=k1, callCount=2
 * k1 third after invalidate: data:k1:2
 * [fetch start] key=k2, callCount=3
 * [fetch end] key=k2, callCount=3
 * k2 first: data:k2:3
 * [fetch start] key=k1, callCount=4
 * [fetch start] key=k2, callCount=5
 * [fetch end] key=k1, callCount=4
 * [fetch end] key=k2, callCount=5
 * after clear: [ 'data:k1:4', 'data:k2:5' ]
 * fetch count: 5
 */
