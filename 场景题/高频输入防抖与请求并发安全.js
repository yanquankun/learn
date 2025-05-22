/**
 * 你在开发一个搜索框组件，用户每输入一个字符就需要向后端发起一次搜索请求，后端接口为 searchAPI(keyword): Promise<string[]>，它会返回一个字符串数组作为搜索建议。实现bindSearch函数
 * 要求：
 * 1.实现输入防抖，只有用户停止输入 debounceTime 毫秒后才发起请求。
 * 2.任意时刻，只有最后一次输入对应的请求结果会被 onResult 回调（即防止并发返回乱序导致的脏数据）。
 */

function searchAPI(keyword) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([keyword + "1", keyword + "2", keyword + "3"]);
    }, Math.random() * 1000 + 100); // 随机延迟
  });
}

/**
 * 绑定输入框实时搜索和防抖逻辑
 * @param {HTMLInputElement} input - 传入的原生 input 元素
 * @param {function} onResult - 每次获得新搜索结果后调用，参数为结果数组
 * @param {number} debounceTime - 防抖延迟时间（毫秒）
 */
function bindSearch(input, onResult, debounceTime) {
  if (!(input instanceof HTMLInputElement)) {
    throw new TypeError("input must be an HTMLInputElement");
  }

  if (typeof onResult !== "function") {
    throw new TypeError("onResult must be a function");
  }

  if (typeof debounceTime !== "number") {
    throw new TypeError("debounceTime must be a number");
  }

  debounceTime = Math.max(debounceTime, 50);

  let timer = null,
    lastRequestId = 0; // 记录最后一次请求的id，防止接口返回乱序时，拿到的结果不是最新的

  const handleInput = (e) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(async () => {
      // 这里使用了闭包来保存当前的请求id
      const curReqId = ++lastRequestId;
      const keyword = e.target.value.trim();
      if (!keyword) {
        onResult([]); // 如果输入为空，直接返回空数组
        return;
      }
      searchAPI(keyword)
        .then((result) => {
          // 采用竞态机制，只处理最后一次请求的结果
          if (curReqId === lastRequestId) {
            onResult(result);
          }
        })
        .catch((error) => {
          onResult(error);
        })
        .finally(() => {
          timer = null;
        });
    }, debounceTime);
  };

  input.removeEventListener("input", handleInput); // 移除之前的事件监听器，避免重复绑定
  input.addEventListener("input", handleInput);
}
