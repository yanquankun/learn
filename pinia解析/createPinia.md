**本文重点讲解Pinia的createPinia方法（也就是Pinia的入口）**

> 在讲之前，先说一个有趣的问题：
>
> ```javascript
> // main.ts 
> // 下面的代码大家可能很常见了
> // ...
> const pinia = createPinia()
> 
> // 先添加一个插件
> pinia.use(() => ({
>   route: computed(() => markRaw(router.currentRoute.value)),
> }))
> 
> const app = createApp(App)
> // app.use(pinia)
> ```
>
> 但大家发现没，如果没有`app.use(pinia)`，pinia的实例是什么呢？
>
> ![image-20250625151509978](https://oss.yanquankun.cn/oss-cdn/image-20250625151509978.png!watermark)
>
> 如图，可以看到pinia实例中的a（app instance）和p（插件数组）其实是空的
>
> ```javascript
> app.use(pinia)
> ```
>
> 而当我们加上`app.use(pinia)`后，就可以看到正常的pinia实例了
>
> ![image-20250625151640562](https://oss.yanquankun.cn/oss-cdn/image-20250625151640562.png!watermark)
>
> 这是为什么呢？不知道各位同学有没有注意过这个问题？
>
> 本文中将会给出答案😄

---

## 🔁 使用 `effectScope` 管理副作用

```javascript
const scope = effectScope(true)
```

### 为什么要用 `effectScope`？

1. **统一管理副作用**：Pinia 中会注册多个响应式状态、副作用（如 `watch`、`computed`），需要一个统一的作用域管理。
2. **隔离 Store 副作用**：通过使用独立的 `effectScope`，可以避免 Store 的副作用与组件作用域混淆。

通过 `scope.run()`，我们将所有 store 状态收集到一个响应式对象中：

```javascript
const state = scope.run(() => ref({}))
```

## 🔧 创建 `pinia` 实例对象

使用 `markRaw()` 保证该对象不会被 Vue 的响应式系统追踪。

```javascript
const pinia = markRaw({
  install(app) { ... },
  use(plugin) { ... },
  _p: [],          // 插件数组
  _a: null,        // app 实例
  _e: scope,       // effectScope 实例
  _s: new Map(),   // 所有 store 实例
  state           // 所有 store 的状态
})
```

## 🔗 `install()` 方法：与 Vue 应用集成

```
install(app: App) {
  setActivePinia(pinia)
  pinia._a = app
  app.provide(piniaSymbol, pinia)
  app.config.globalProperties.$pinia = pinia
  ...
}
```

### ✅ 关键操作解析：

- `setActivePinia(pinia)`：设置当前全局活动的 Pinia 实例，支持在组件外使用 `useStore()`。
- `provide(piniaSymbol, pinia)`：让所有组件可以通过 `inject(piniaSymbol)` 获取 pinia 实例。
- `globalProperties.$pinia`：兼容 Vue 2 的使用方式。

### 🔌 插件注册机制

```javascript
toBeInstalled.forEach(plugin => _p.push(plugin))
toBeInstalled = []
```

支持在 `app.use(pinia)` 之前调用 `pinia.use(plugin)`。

## 🔌 `use(plugin)` 方法：插件系统

```javascript
use(plugin) {
  if (!this._a) {
    toBeInstalled.push(plugin)
  } else {
    _p.push(plugin)
  }
  return this
}
```

- 如果还没 `install`，插件会被缓存在 `toBeInstalled` 中。
- 安装后再调用，直接执行。

这种设计允许你先注册插件，再挂载 app，灵活方便。

---

**通过上述的讲解，大家应该猜到答案了，这里我来统一解释下：**

先看下通过断点调试app.use(pinia)的截图：
![image-20250625152235267](https://oss.yanquankun.cn/oss-cdn/image-20250625152235267.png!watermark)
可以看到其实这里我们走到了vue源码中，这时我们再看断点的输出，可以看到这里调用了pinia的install（vue插件实现机制）方法
![image-20250625152359423](https://oss.yanquankun.cn/oss-cdn/image-20250625152359423.png!watermark)
最后在pinia的install方法中，进行了pinia的激活，并且把_a和_p进行了赋值
![image-20250625153000408](https://oss.yanquankun.cn/oss-cdn/image-20250625153000408.png!watermark)
![image-20250625153049553](https://oss.yanquankun.cn/oss-cdn/image-20250625153049553.png!watermark)
到此应该了解了开头的问题了吧~

---

附录本文的git地址：[learnPinia/createPinia](https://github.com/yanquankun/learnPinia/blob/learn/packages/pinia/src/createPinia.ts)

