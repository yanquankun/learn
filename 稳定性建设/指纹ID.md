####  为什么要把指纹ID归到性能优化里呢？

因为我们在设计上报体系的时候，并不是一定有用户id的，这时候，我们就需要一个可以区分用户的标志，同时也可以用户登录前的行为

#### 指纹ID

通过`UserAgent、分辨率、色彩深度、系统平台、语言、触摸屏、地理位置、语言支持特性、图像特性`等这些具有较高辨析度的信息，并进行一定的计算处理，就能生成一个能唯一标识当前浏览器的值，也就是我们所说的指纹 ID

#### 通过指纹ID做什么呢？

1. **把用户在登录前和登录后的行为日志关联起来，追踪到用户的行为轨迹**
2. **不同网站利用指纹特性记录用户行为之后推荐给你曾经访问过的产品的广告**

#### 指纹ID生成方案

**FingerprintJS** 

这是一个开源的JS库，分为社区版和商用版，社区版本的识别率达到 40~60%，而商用版本的识别率则高到 99.5%

**帆布指纹识别技术**

利用Canvas在不同设备和浏览器下生成的画布具有细微差异的特点，将Canvas生态的图片转换为Hash值，从而行为用户指纹

```javascript
type FingerprintOptions = {
  font?: string
  reactStyle?: string | CanvasGradient | CanvasPattern
  contentStyle?: string | CanvasGradient | CanvasPattern
  textBaseline?: CanvasTextBaseline
}
// content: 业务名称
// options: 样式参数，用于业务自定义参数，以实现与不同项目的差异化
export const getFingerprintId = (content: string, options?: FingerprintOptions) => {
  if (!content) {
    console.error("content is empty");
    return null;
  }
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext("2d");
  // 如果不存在，则返回空值，说明不支持Canvas指纹
  if (!ctx) return null;

  const txt = content || 'geekbang';
  ctx.textBaseline = options && options.textBaseline ? options.textBaseline : "top";
  ctx.font = options && options.font ? options.font : "14px 'Arial'";

  ctx.fillStyle = options && options.reactStyle ? options.reactStyle : "#f60";
  // 先画一个60x20矩形内容
  ctx.fillRect(125, 1, 60, 20);

  ctx.fillStyle = options && options.contentStyle ? options.contentStyle : "#069";
  // 把字填充到矩形内
  ctx.fillText(txt, 2, 15);

  const b64 = canvas.toDataURL().replace("data:image/png;base64,","");
  const bin = atob(b64);
  const crc = bin2hex(bin.slice(-16,-12));
  return crc;
}
```

指纹 ID 关联全链路日志的流程：

![image-20250401170742966](https://oss.yanquankun.cn/oss-cdn/image-20250401170742966.png!watermark)

**Canvas指纹缺点**

1. 小程序不支持（小程序设置为静默登录后获取 openid作为指纹ID）
2. 强依赖Canvas能力

#### 指纹ID的局限性

1. 侵犯用户隐私性
2. 同一用户，在不同浏览器或不同端使用前端功能时，生成的指纹ID也不一样，无法做到关联分析两个指纹ID所对应的日志

---

附送 [前端全链路SDK](https://github.com/sankyutang/fontend-trace-geekbang-course/blob/main/trace-sdk/README.md)