*LCP 元素标记原理*

#### LCP标记流程

1. FCP后，开始记录LCP，也就是当浏览器绘制完第一帧后开始记录
2. 创建`largest-contentful-paint`的`PerformanceEntry`对象，并标记最大内容元素，如果网页中有文本和图片，会优先显示文本，此时`PerformanceEntry`会标记最大文本元素，如`<p> <h1>`等
3. 浏览器继续渲染页面，如果最大内容发生了变更，会更新`PerformanceEntry`对象，同时更新LCP值
4. 当浏览器`视口`内容加载完后，LCP会停止记录，并以最后一次标记的LCP值作为指标值
5. 如果在视口内容未加载完前，用户进行了交互，会停止`PerformanceEntry`记录（因为用户交互可能会改变显示的内容）

![image-20250423155452351](https://oss.yanquankun.cn/oss-cdn/image-20250423155452351.png!watermark)

#### 如何确定LCP元素？

**根据指标规定，目前最大内容类型有四种：**

1. 图片元素： `<img>`是 LCP 中最常见的元素，也最常影响范围最大的元素。另外还包括 SVG 中的`<image>`元素
2. 视频元素：`<video>`元素定义的`poster`属性值或第一帧画面作为最大内容
3. 背景元素：使用css的`url()`函数背景图片样式元素
4. 文本节点：包含文本节点的块级元素

