// 你在开发一个输入建议组件，用户在输入框输入时会向后端请求建议列表。
// 接口为 searchAPI(keyword): Promise<string[]>，返回建议字符串数组
// 要求：
// 1.实现输入防抖
// 2.竞态安全（只回调最后一次输入对应的结果）
// 3.增加本地缓存，同一个 keyword 只请求一次，后续输入同样 keyword 时直接返回缓存内容，不再发请求

const { de } = require("element-plus/es/locales.mjs");

// 4.输入为空时立即回调空数组
function searchAPI(keyword) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([keyword + "1", keyword + "2", keyword + "3"]);
    }, Math.random() * 1000 + 100); // 随机延迟
  });
}
/**
 * 绑定输入框实时搜索、缓存、防抖和竞态安全
 * @param {HTMLInputElement} input - 传入的原生 input 元素
 * @param {function} onResult - 获得新搜索结果后调用，参数为结果数组
 * @param {number} debounceTime - 防抖延迟时间（毫秒）
 */
function bindSearchWithCache(input, onResult, debounceTime) {
  if (!input || !(input instanceof HTMLInputElement)) {
    throw new Error("Invalid input element");
  }

  if (typeof onResult !== "function") {
    throw new TypeError("onResult must be a function");
  }

  if (typeof debounceTime !== "number") {
    throw new TypeError("debounceTime must be a non-negative number");
  }

  debounceTime = Math.max(50, debounceTime);

  const cache = new Map();
  let requestId = 0;
  let timeoutId = null;

  function handleInput() {
    timeoutId && clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const keyword = input.value.trim();
      if (keyword === "") {
        onResult([]);
        return;
      }

      if (cache.has(keyword)) {
        onResult(cache.get(keyword)); // 如果缓存中有结果，直接返回
        return;
      }

      const currentRequestId = ++requestId;
      searchAPI(keyword)
        .then((data) => {
          if (currentRequestId === requestId) {
            cache.set(keyword, data);
            onResult(data);
          }
        })
        .catch(() => {
          if (currentRequestId === requestId) {
            onResult([]);
          }
        });
    }, debounceTime);
  }

  input.removeEventListener("input", handleInput);
  input.addEventListener("input", handleInput);
}
