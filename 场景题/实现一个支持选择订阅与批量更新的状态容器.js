/**
 * 题目：实现一个支持选择订阅与批量更新的状态容器
 *
 * 题目要求：
 * 1. 实现 createStore(initialState)
 * 2. initialState 必须是一个非 null 的普通对象，不能是数组
 * 3. 返回的对象需要包含：
 *    - getState(): 获取当前完整状态
 *    - setState(updater): 更新状态
 *    - subscribe(selector, listener, options?): 订阅状态中的某一部分
 *    - batch(fn): 批量更新
 *
 * 4. setState(updater) 的 updater 支持两种形式：
 *    - 对象：例如 setState({ count: 1 })
 *    - 函数：例如 setState((prev) => ({ count: prev.count + 1 }))
 *
 * 5. 状态更新规则：
 *    - 采用浅合并
 *    - 即 setState({ a: 1 }) 只更新 a，不替换整个 state
 *    - 如果 updater 函数返回 undefined / 非对象 / 数组，本题中可视为“不更新”
 *
 * 6. subscribe(selector, listener, options?) 要求：
 *    - selector: (state) => any，用于选出订阅的数据
 *    - listener: (newValue, oldValue) => void
 *    - 这里的 newValue / oldValue 都是 selector 的结果，不是整个 state
 *    - 每次 subscribe 都应创建一个独立订阅，即使多个订阅复用了同一个 selector 函数引用，也不能互相覆盖
 *
 * 7. 普通订阅（options.immediate !== true）要求：
 *    - 订阅建立时，应以“当前 selector(state) 的结果”作为后续比较基线
 *    - 也就是说，第一次无关字段更新不能误触发订阅
 *
 * 8. immediate 订阅要求：
 *    - options.immediate 为 true 时，订阅后需要立刻触发一次 listener
 *    - 第一次触发时：
 *      - newValue = selector(currentState)
 *      - oldValue = undefined
 *    - 但订阅内部的后续比较基线，仍然应以当前 selector(state) 为准
 *
 * 9. 触发规则：
 *    - 只有当 selector(state) 的结果发生变化时，才触发对应 listener
 *    - 比较使用 Object.is
 *
 * 10. batch(fn) 要求：
 *    - batch(fn) 是同步 API
 *    - fn 执行期间，允许多次 setState
 *    - fn 执行期间不应立即通知订阅者
 *    - fn 执行结束后，应在 batch(fn) 返回前，同步完成统一通知
 *    - 不允许把通知延迟到微任务或宏任务中
 *    - 批量更新期间，如果某个订阅值多次变化，最终只通知一次
 *    - listener 拿到的是：
 *      - oldValue = batch 开始前该 selector 的旧值
 *      - newValue = batch 结束后的最终值
 *
 * 11. batch(fn) 的异常处理：
 *    - 如果 fn 抛错，异常继续向外抛出
 *    - 但内部 batching 状态必须正确恢复，不能卡死
 *    - 本题不强制要求抛错后仍然触发通知
 *
 * 12. unsubscribe 要求：
 *    - subscribe 需要返回一个取消订阅函数
 *    - 调用后，该订阅者不应再收到通知
 *    - 重复调用 unsubscribe 不应报错
 *
 * 13. getState() 说明：
 *    - 本题只要求返回当前状态
 *    - 不强制要求做深拷贝或只读保护
 */

/**
 * 实现一个支持选择订阅与批量更新的状态容器
 *
 * @param {Record<string, any>} initialState
 * @returns {{
 *   getState: () => Record<string, any>,
 *   setState: (updater: Record<string, any> | ((prevState: Record<string, any>) => Record<string, any> | void)) => void,
 *   subscribe: (
 *     selector: (state: Record<string, any>) => any,
 *     listener: (newValue: any, oldValue: any) => void,
 *     options?: { immediate?: boolean }
 *   ) => () => void,
 *   batch: (fn: () => void) => void
 * }}
 */
function createStore(initialState) {
  const isObject = (value) => {
    return typeof value === "object" && value !== null;
  };

  if (!isObject(initialState) || Array.isArray(initialState)) {
    throw new Error("initialState must be an object not null or array");
  }

  // 订阅者映射
  const subMap = new Map();
  let state = { ...initialState },
    isBatching = false;

  const shallowMerge = (target, source) => {
    return { ...target, ...source };
  };

  const notifySubscribers = () => {
    subMap.forEach(
      ({ subSymbolTag, selector, listener, perState }, _, self) => {
        const newState = selector(state);
        const oldState = selector(perState);
        if (!Object.is(newState, oldState)) {
          listener(selector(state), selector(perState));
          self.set(subSymbolTag, {
            subSymbolTag,
            selector,
            listener,
            perState: state,
          });
        }
      },
    );
  };

  return {
    getState() {
      return {
        ...state,
      };
    },
    setState(updater) {
      if (typeof updater === "function") {
        const newState = updater(state);
        if (isObject(newState) && !Array.isArray(newState)) {
          state = shallowMerge(state, newState);
        }
      } else {
        state = shallowMerge(state, updater);
      }

      // 通知订阅者
      !isBatching && notifySubscribers();
    },
    subscribe(selector, listener, options = {}) {
      if (typeof selector !== "function") {
        throw new Error("selector must be a function");
      }

      if (typeof listener !== "function") {
        throw new Error("listener must be a function");
      }

      // 使用Symbol作为订阅者的唯一标识，避免使用selector作为标识，因为selector可能被修改
      const subSymbolTag = Symbol(selector.toString());

      subMap.set(subSymbolTag, {
        subSymbolTag,
        selector,
        listener,
        perState: state,
      });

      if (options.immediate) {
        listener(selector(state), undefined);
        subMap.set(subSymbolTag, {
          subSymbolTag,
          selector,
          listener,
          perState: state,
        });
      }

      return () => {
        subMap.has(subSymbolTag) && subMap.delete(subSymbolTag);
      };
    },
    batch(fn) {
      if (typeof fn !== "function") {
        throw new Error("fn must be a function");
      }

      isBatching = true;
      try {
        fn();
      } finally {
        isBatching = false;
      }

      notifySubscribers();
    },
  };
}

/* =========================
 * 测试用例 1：基础 getState / setState / 浅合并
 * ========================= */

console.log("===== 测试用例1：基础 getState / setState / 浅合并 =====");

const store1 = createStore({
  count: 0,
  name: "mint",
  info: { city: "LA" },
});

console.log("init:", store1.getState());

store1.setState({ count: 1 });
console.log("after set count:", store1.getState());

store1.setState((prev) => ({
  count: prev.count + 1,
  name: prev.name + "_x",
}));
console.log("after fn update:", store1.getState());

/**
 * 期望现象：
 * - 初始状态正确返回
 * - setState({ count: 1 }) 只更新 count，不丢失其他字段
 * - setState(fn) 能基于前一个状态继续更新
 *
 * 可能接近的输出：
 * init: { count: 0, name: 'mint', info: { city: 'LA' } }
 * after set count: { count: 1, name: 'mint', info: { city: 'LA' } }
 * after fn update: { count: 2, name: 'mint_x', info: { city: 'LA' } }
 */

/* =========================
 * 测试用例 2：选择订阅，只在选中值变化时触发
 * ========================= */

console.log("\n===== 测试用例2：选择订阅，只在选中值变化时触发 =====");

const store2 = createStore({
  count: 0,
  text: "hello",
  flag: false,
});

const logs2 = [];

const unsubscribe2 = store2.subscribe(
  (state) => state.count,
  (newValue, oldValue) => {
    logs2.push([newValue, oldValue]);
    console.log("count changed:", newValue, oldValue);
  },
);

store2.setState({ text: "world" }); // 不应触发
store2.setState({ count: 1 }); // 应触发
store2.setState({ count: 1 }); // 不应触发
store2.setState((prev) => ({ count: prev.count + 1 })); // 应触发

console.log("logs2:", logs2);

unsubscribe2();

/**
 * 期望现象：
 * - 修改 text 时，不应触发 count 订阅
 * - count 从 0 -> 1 时触发一次
 * - count 从 1 -> 1 时不触发
 * - count 从 1 -> 2 时再触发一次
 *
 * 可能接近的输出：
 * count changed: 1 0
 * count changed: 2 1
 * logs2: [ [1, 0], [2, 1] ]
 */

/* =========================
 * 测试用例 3：immediate 订阅
 * ========================= */

console.log("\n===== 测试用例3：immediate 订阅 =====");

const store3 = createStore({
  user: { id: 1, name: "A" },
  ready: false,
});

const logs3 = [];

const unsubscribe3 = store3.subscribe(
  (state) => state.ready,
  (newValue, oldValue) => {
    logs3.push([newValue, oldValue]);
    console.log("ready changed:", newValue, oldValue);
  },
  { immediate: true },
);

store3.setState({ ready: true });

console.log("logs3:", logs3);

unsubscribe3();

/**
 * 期望现象：
 * - subscribe 时立即触发一次 listener
 * - 第一次 immediate 触发时，newValue 为当前值 false，oldValue 为 undefined
 * - 后续 ready 从 false -> true，再触发一次
 *
 * 可能接近的输出：
 * ready changed: false undefined
 * ready changed: true false
 * logs3: [ [false, undefined], [true, false] ]
 */

/* =========================
 * 测试用例 4：batch 批量更新只通知一次
 * ========================= */

console.log("\n===== 测试用例4：batch 批量更新只通知一次 =====");

const store4 = createStore({
  count: 0,
  text: "a",
});

const logs4 = [];

store4.subscribe(
  (state) => state.count,
  (newValue, oldValue) => {
    logs4.push([newValue, oldValue]);
    console.log("batch count changed:", newValue, oldValue);
  },
);

store4.batch(() => {
  store4.setState({ count: 1 });
  store4.setState({ text: "b" });
  store4.setState((prev) => ({ count: prev.count + 1 }));
  store4.setState({ count: 2 });
});

console.log("final state:", store4.getState());
console.log("logs4:", logs4);

/**
 * 期望现象：
 * - batch 内多次 setState，不应立即逐次通知
 * - batch 结束后，只通知一次
 * - oldValue 是 batch 前的 count，即 0
 * - newValue 是 batch 结束后的最终 count，即 2
 *
 * 可能接近的输出：
 * batch count changed: 2 0
 * final state: { count: 2, text: 'b' }
 * logs4: [ [2, 0] ]
 */

/* =========================
 * 测试用例 5：多个订阅者、取消订阅、重复取消订阅
 * ========================= */

console.log("\n===== 测试用例5：多个订阅者、取消订阅、重复取消订阅 =====");

const store5 = createStore({
  count: 0,
  text: "init",
});

const logs5Count = [];
const logs5Text = [];

const unsubCount = store5.subscribe(
  (state) => state.count,
  (newValue, oldValue) => {
    logs5Count.push([newValue, oldValue]);
    console.log("count sub:", newValue, oldValue);
  },
);

const unsubText = store5.subscribe(
  (state) => state.text,
  (newValue, oldValue) => {
    logs5Text.push([newValue, oldValue]);
    console.log("text sub:", newValue, oldValue);
  },
);

store5.setState({ count: 1 }); // 只触发 count
store5.setState({ text: "next" }); // 只触发 text

unsubCount();
unsubCount(); // 重复取消，不应报错

store5.setState({ count: 2 }); // count 不应再触发
store5.setState({ text: "final" }); // text 仍应触发

console.log("logs5Count:", logs5Count);
console.log("logs5Text:", logs5Text);

unsubText();

/**
 * 期望现象：
 * - count 与 text 订阅互不影响
 * - 取消 count 订阅后，再修改 count 不应触发
 * - 重复调用 unsubscribe 不应报错
 *
 * 可能接近的输出：
 * count sub: 1 0
 * text sub: next init
 * text sub: final next
 * logs5Count: [ [1, 0] ]
 * logs5Text: [ ['next', 'init'], ['final', 'next'] ]
 */

/* =========================
 * 这道题的价值和意义是什么？
 * ========================= */

/**
 * 这道题考察的是“状态管理系统”的最核心骨架能力。
 *
 * 为什么出这道题：
 * 1. 前端工程里，很多复杂页面都不是单纯的组件渲染问题，而是状态如何组织、更新、派发的问题。
 * 2. 这题能逼着你真正理解：
 *    - 状态更新和视图响应之间的关系
 *    - 为什么要有 selector
 *    - 为什么要做变化比较
 *    - 为什么 batch 可以减少无意义通知和重复渲染
 * 3. 它不是八股题，而是一个非常典型的“把抽象概念落到代码实现”的手写题。
 *
 * 在常见技术栈里的实际应用：
 *
 * 1. React 生态
 *    - Redux / Zustand / useSyncExternalStore 这类状态库，本质上都离不开：
 *      - 状态快照
 *      - 订阅
 *      - 选择器
 *      - 更新后的通知派发
 *    - React 组件性能优化里，经常会做“按 selector 订阅”和“减少无效渲染”。
 *
 * 2. Vue 生态
 *    - Vue 的响应式系统虽然底层实现不同，但本质上也在做：
 *      - 依赖收集
 *      - 状态变化后的派发
 *      - 只让真正依赖变更的地方响应
 *    - Pinia / Vuex 的 store 设计，也有非常相似的状态组织思想。
 *
 * 3. 业务工程场景
 *    - 表单引擎、低代码平台、配置化平台、编辑器类产品里，经常需要：
 *      - 一个中心状态源
 *      - 不同模块各自订阅自己关心的那部分状态
 *      - 批量更新时减少通知次数
 *    - 例如：
 *      - 画布编辑器的元素属性面板
 *      - 配置平台中的 JSON/表单联动
 *      - 工作流节点编辑器中的局部状态刷新
 *
 * 4. 性能优化场景
 *    - 当页面状态很大时，如果每次更新都全量通知，会带来大量无意义计算和渲染。
 *    - selector + Object.is + batch，这三个组合就是非常典型的性能优化基础能力。
 *
 * 这道题真正的训练价值：
 * - 不是让你背 store API
 * - 而是训练你是否真正理解“状态系统为什么这样设计”
 * - 写明白这题后，再去看 Redux、Zustand、Pinia、Vue 响应式源码，会清楚很多。
 */
