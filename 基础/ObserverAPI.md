### 浏览器原生 Observer API 对比与应用场景综述

在现代前端开发中，Observer（观察者）模式在浏览器 API 中有多种体现，除了常见的 `MutationObserver`，还有以下 Observer 类型：
| Observer 名称           | 监听内容/能力                  | 常见用途/场景                        | 兼容性           |
| ----------------------- | ------------------------------ | ------------------------------------ | ---------------- |
| MutationObserver        | DOM 结构、属性、文本变化       | 动态组件、虚拟 DOM、表单自动保存等   | 高（现代浏览器） |
| IntersectionObserver    | 元素与视口交集（可见性）       | 懒加载、广告曝光、无限滚动、动画触发 | 高               |
| ResizeObserver          | 元素尺寸变化                   | 响应式布局、画布自适应、图表自适应   | 高               |
| PerformanceObserver     | 性能指标事件（如长任务、资源） | 性能分析、监控、Web Vitals           | 高               |
| AnimationObserver*      | 动画状态变化                   | 动画同步、复杂动画控制               | 仅实验/非标准    |
| MutationEvent（已废弃） | DOM 变动事件                   | 早期 DOM 变动监听（不推荐）          | 低，已废弃       |

> *注：AnimationObserver 目前并不是标准 API，只存在于部分 Polyfill 或第三方库中。常见动画事件可以通过 requestAnimationFrame 或动画事件（如 animationend、transitionend）处理。

### 主要 Observer 简要介绍与代码示例

#### 1. MutationObserver

监听 DOM 树的结构变化、属性变化或文本内容变化，是实现高级 UI 框架和数据绑定的基础。

```js
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    console.log('DOM changed:', mutation);
  });
});
observer.observe(document.body, { childList: true, subtree: true });
```

---

#### 2. IntersectionObserver

检测目标元素与其祖先元素或视口的交叉状态变化。常用于图片懒加载、广告曝光、触发动画等场景。

```js
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('元素进入视口:', entry.target);
    }
  });
});
io.observe(document.querySelector('#target'));
```

---

#### 3. ResizeObserver

监听元素内容区域或边框区域的尺寸变化。适用于响应式 UI、自适应组件、实时图表等。

```js
const ro = new ResizeObserver(entries => {
  for (let entry of entries) {
    console.log('元素尺寸变化:', entry.contentRect);
  }
});
ro.observe(document.querySelector('#resize-target'));
```

---

#### 4. PerformanceObserver

可监听各类性能条目（如 `longtask`, `resource`, `paint` 等），帮助开发者分析和优化页面性能。

```js
const po = new PerformanceObserver((list, observer) => {
  list.getEntries().forEach(entry => {
    console.log('性能条目:', entry);
  });
});
po.observe({ entryTypes: ['resource', 'longtask', 'paint'] });
```

##### 性能指标相关补充及代码示例

PerformanceObserver 可用于采集 Web Vitals 及关键性能指标，包括但不限于：

- **First Contentful Paint (FCP)**：页面内容首次渲染时间

  ```js
  const fcpObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        console.log('FCP:', entry.startTime);
      }
    }
  });
  fcpObserver.observe({ type: 'paint', buffered: true });
  ```

- **Largest Contentful Paint (LCP)**：最大内容渲染时间

  ```js
  const lcpObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('LCP:', entry.startTime, entry);
    }
  });
  lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  ```

- **First Input Delay (FID)**：首次输入延迟

  ```js
  const fidObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('FID:', entry.processingStart - entry.startTime, entry);
    }
  });
  fidObserver.observe({ type: 'first-input', buffered: true });
  ```

- **Cumulative Layout Shift (CLS)**：累积布局偏移

  ```js
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        console.log('CLS累加:', clsValue, entry);
      }
    }
  });
  clsObserver.observe({ type: 'layout-shift', buffered: true });
  ```

- **Long Tasks**：长任务检测，发现主线程卡顿

  ```js
  const longTaskObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('长任务:', entry.startTime, entry.duration, entry);
    }
  });
  longTaskObserver.observe({ entryTypes: ['longtask'] });
  ```

> 性能优化建议：结合 PerformanceObserver 实时监控页面性能，配合后台埋点可实现全链路性能追踪与优化。
>
> *关于buffered: true的作用：让新的Observer能够接收到在它创建之前已经记录下来的性能条目，使用后observer 会立即收到“缓冲区”中已存在的（即在 observer 创建前产生的）相关性能条目*

| 指标名称                                | 合格范围（优秀） | 需改进              | 不合格（差） |
| --------------------------------------- | ---------------- | ------------------- | ------------ |
| Largest Contentful Paint (LCP)          | ≤ 2.5 秒         | 2.5 秒 ~ 4 秒       | > 4 秒       |
| First Input Delay (FID)                 | ≤ 100 毫秒       | 100 毫秒 ~ 300 毫秒 | > 300 毫秒   |
| Cumulative Layout Shift (CLS)           | ≤ 0.1            | 0.1 ~ 0.25          | > 0.25       |
| Interaction to Next Paint (INP)         | ≤ 200 毫秒       | 200 毫秒 ~ 500 毫秒 | > 500 毫秒   |
| Time to First Byte (TTFB)（推荐性指标） | ≤ 0.8 秒         | 0.8 秒 ~ 1.8 秒     | > 1.8 秒     |
| First Contentful Paint (FCP)            | ≤ 1.8 秒         | 1.8 ~ 3.0 秒        | > 3.0 秒     |

---

#### 5. MutationEvent（已废弃，不推荐）

早期 DOM 变动监听方法，已废弃，仅用于兼容极老旧代码。

```js
document.body.addEventListener('DOMNodeInserted', function(event) {
  console.log('节点被插入:', event.target);
});
```

---

### 更详细对比

| Observer             | 监听内容 | 典型场景               | 触发频率         | 兼容性 |
| -------------------- | -------- | ---------------------- | ---------------- | ------ |
| MutationObserver     | DOM变更  | 动态页面、富文本编辑器 | 高频（批量回调） | 高     |
| IntersectionObserver | 可见性   | 懒加载、曝光分析       | 低~中（可调节）  | 高     |
| ResizeObserver       | 尺寸变化 | 响应式组件、图表       | 高频（批量回调） | 高     |
| PerformanceObserver  | 性能数据 | 性能分析、监控         | 高频（依赖指标） | 高     |

### 参考文档

- [MDN: MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)
- [MDN: IntersectionObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver)
- [MDN: ResizeObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver)
- [MDN: PerformanceObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceObserver)
- [Google Web Vitals 指标](https://web.dev/vitals/)

- https://web.dev/vitals/)