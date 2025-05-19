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

## 主要 Observer 简要介绍

### 1. IntersectionObserver
检测目标元素与其祖先元素或视口的交叉状态变化。常用于图片懒加载、广告曝光、触发动画等场景。

### 2. ResizeObserver
监听元素内容区域或边框区域的尺寸变化。适用于响应式 UI、自适应组件、实时图表等。

### 3. PerformanceObserver
可监听各类性能条目（如 `longtask`, `resource`, `paint` 等），帮助开发者分析和优化页面性能。

### 4. MutationObserver
监听 DOM 树的结构变化、属性变化或文本内容变化，是实现高级 UI 框架和数据绑定的基础。

---

## 更详细对比

| Observer             | 监听内容 | 典型场景               | 触发频率         | 兼容性 |
| -------------------- | -------- | ---------------------- | ---------------- | ------ |
| MutationObserver     | DOM变更  | 动态页面、富文本编辑器 | 高频（批量回调） | 高     |
| IntersectionObserver | 可见性   | 懒加载、曝光分析       | 低~中（可调节）  | 高     |
| ResizeObserver       | 尺寸变化 | 响应式组件、图表       | 高频（批量回调） | 高     |
| PerformanceObserver  | 性能数据 | 性能分析、监控         | 高频（依赖指标） | 高     |

## 参考文档

- [MDN: MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)
- [MDN: IntersectionObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver)
- [MDN: ResizeObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver)
- [MDN: PerformanceObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceObserver)