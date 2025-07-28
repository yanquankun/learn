# React 各版本 Hooks 详解与新特性实例

React 自 16.8 版本引入 Hooks 以来，在不断迭代的版本中添加了更多强大的 Hooks，极大地改变了 React 组件的编写方式。本文将详细介绍 React 16、17、18 和 19 各版本中引入的 Hooks 及其特性，并提供代码示例帮助理解。

## React 16.8 - Hooks 的诞生

React 16.8 是一个里程碑版本，它首次引入了 Hooks，使函数组件拥有了类组件的大部分能力。

### 基础 Hooks

### 1. useState

useState 是最基本的 Hook，它让函数组件能够拥有自己的状态。

```jsx
import React, { useState } from 'react';

function Counter() {
  // 声明一个叫 count 的 state 变量，初始值为 0
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>你点击了 {count} 次</p>
      <button onClick={() => setCount(count + 1)}>
        点击我
      </button>
    </div>
  );
}

```

### 2. useEffect

useEffect 允许在函数组件中执行副作用操作，如数据获取、订阅或手动修改 DOM。

```jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // 相当于 componentDidMount 和 componentDidUpdate
  useEffect(() => {
    // 更新文档标题
    document.title = `你点击了 ${count} 次`;
    
    // 返回一个清除函数，相当于 componentWillUnmount
    return () => {
      document.title = 'React App';
    };
  }, [count]); // 只有当 count 改变时才会重新执行
  
  return (
    <div>
      <p>你点击了 {count} 次</p>
      <button onClick={() => setCount(count + 1)}>
        点击我
      </button>
    </div>
  );
}

```

### 3. useContext

useContext 接收一个 context 对象并返回该 context 的当前值。当 Provider 更新时，使用该 Hook 的组件会重新渲染。

```jsx
import React, { createContext, useContext, useState } from 'react';

// 创建一个 Context
const ThemeContext = createContext('light');

function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={theme}>
      <div>
        <ThemedButton />
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          切换主题
        </button>
      </div>
    </ThemeContext.Provider>
  );
}

function ThemedButton() {
  // 使用 useContext 获取当前的主题
  const theme = useContext(ThemeContext);
  
  return (
    <button style={{ 
      background: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#333'
    }}>
      我是一个主题按钮
    </button>
  );
}

```

### 额外的 Hooks

### 4. useReducer

useReducer 是 useState 的替代方案，适用于复杂状态逻辑。它接收一个 reducer 函数和初始状态，返回当前状态和 dispatch 方法。

```jsx
import React, { useReducer } from 'react';

// Reducer 函数
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  // 使用 useReducer 管理状态
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  
  return (
    <div>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
}

```

### 5. useCallback

useCallback 返回一个记忆化的回调函数，只有当依赖项改变时才会更新。这对于传递回调给子组件做性能优化很有用。

```jsx
import React, { useState, useCallback } from 'react';

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);
  
  // 只有当 count 改变时才会创建新的函数
  const handleClick = useCallback(() => {
    console.log(`Current count: ${count}`);
  }, [count]); // 依赖项数组
  
  return (
    <div>
      <ChildComponent onClick={handleClick} />
      <button onClick={() => setCount(count + 1)}>更新 count</button>
      <button onClick={() => setOtherState(otherState + 1)}>更新其他状态</button>
    </div>
  );
}

// 使用 React.memo 优化子组件
const ChildComponent = React.memo(({ onClick }) => {
  console.log('ChildComponent 渲染');
  return <button onClick={onClick}>Click me</button>;
});

```

### 6. useMemo

useMemo 返回一个记忆化的值，只有当依赖项改变时才重新计算。它可以用来避免在每次渲染时都进行昂贵的计算。

```jsx
import React, { useState, useMemo } from 'react';

function Example() {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);
  
  // 昂贵的计算
  const computeExpensiveValue = (count) => {
    console.log('Computing expensive value...');
    // 模拟耗时计算
    let i = 0;
    while (i < 1000000000) i++;
    return count * 2;
  };
  
  // 使用 useMemo 缓存计算结果
  const memoizedValue = useMemo(() => computeExpensiveValue(count), [count]);
  
  return (
    <div>
      <p>Count: {count}</p>
      <p>Expensive calculation result: {memoizedValue}</p>
      <button onClick={() => setCount(count + 1)}>更新 count</button>
      <button onClick={() => setOtherState(otherState + 1)}>更新其他状态</button>
    </div>
  );
}

```

### 7. useRef

useRef 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数。useRef 的值在组件的整个生命周期内保持不变。

```jsx
import React, { useRef, useEffect } from 'react';

function TextInputWithFocusButton() {
  // 创建一个 ref
  const inputRef = useRef(null);
  
  // 点击按钮时聚焦输入框
  const focusInput = () => {
    inputRef.current.focus();
  };
  
  // 组件挂载后自动聚焦
  useEffect(() => {
    inputRef.current.focus();
  }, []); // 空依赖数组，只在挂载时执行
  
  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>聚焦输入框</button>
    </div>
  );
}

```

### 8. useImperativeHandle

useImperativeHandle 可以让父组件通过 ref 获取子组件中的数据或方法。

```jsx
import React, { useRef, useImperativeHandle, forwardRef } from 'react';

// 使用 forwardRef 转发 ref
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();
  
  // 使用 useImperativeHandle 自定义暴露给父组件的实例值
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    value: () => {
      return inputRef.current.value;
    }
  }));
  
  return <input ref={inputRef} />;
});

function Parent() {
  const fancyInputRef = useRef();
  
  const handleClick = () => {
    // 访问子组件中的方法
    fancyInputRef.current.focus();
    console.log('Input value:', fancyInputRef.current.value());
  };
  
  return (
    <div>
      <FancyInput ref={fancyInputRef} />
      <button onClick={handleClick}>获取焦点和值</button>
    </div>
  );
}

```

### 9. useLayoutEffect

useLayoutEffect 与 useEffect 函数签名相同，但它会在所有 DOM 变更后同步调用。可以使用它来读取 DOM 布局并同步触发重渲染。

```jsx
import React, { useState, useLayoutEffect, useRef } from 'react';

function Tooltip() {
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const tooltipRef = useRef();
  
  // 使用 useLayoutEffect 在 DOM 更新后立即测量高度
  useLayoutEffect(() => {
    const height = tooltipRef.current.clientHeight;
    setTooltipHeight(height);
    // 这个操作是同步的，会在浏览器绘制前执行
    // 适用于需要根据 DOM 尺寸进行调整的场景
  }, []);
  
  return (
    <div>
      <div ref={tooltipRef}>这是一个工具提示</div>
      <p>工具提示的高度是: {tooltipHeight}px</p>
    </div>
  );
}

```

### 10. useDebugValue

useDebugValue 可用于在 React 开发者工具中显示自定义 hook 的标签。

```jsx
import React, { useState, useDebugValue } from 'react';

// 自定义 Hook
function useCustomHook(initialValue) {
  const [value, setValue] = useState(initialValue);
  
  // 在 React DevTools 中显示调试值
  useDebugValue(value > 5 ? 'Big' : 'Small');
  
  return [value, setValue];
}

function DebugComponent() {
  const [value, setValue] = useCustomHook(3);
  
  return (
    <div>
      <p>值: {value}</p>
      <button onClick={() => setValue(value + 1)}>增加</button>
    </div>
  );
}

```

## React 17 中的 Hooks

React 17 是一个过渡版本，它没有添加新的 Hooks，但改进了现有 Hooks 的内部实现和稳定性。虽然没有新的 API，但它为未来的改进奠定了基础。React 17 的主要变化是事件委托机制的改变和移除事件池，这些变化间接影响了 Hooks 中事件处理的行为。

### React 17 中 Hooks 相关的变化

```jsx
// React 16 中，需要使用 e.persist() 来保持事件对象在异步回调中可用
function Button() {
  const [clicked, setClicked] = useState(false);
  
  const handleClick = (e) => {
    // 在 React 16 中，需要这样做
    e.persist();
    
    setTimeout(() => {
      console.log(e.target.tagName); // 在 React 16 中，如果没有 e.persist()，这里会是 null
      setClicked(true);
    }, 100);
  };
  
  return <button onClick={handleClick}>Click me</button>;
}

// React 17 中，不再需要 e.persist()
function Button() {
  const [clicked, setClicked] = useState(false);
  
  const handleClick = (e) => {
    // 在 React 17 中，不需要 e.persist()
    setTimeout(() => {
      console.log(e.target.tagName); // 可以正常工作
      setClicked(true);
    }, 100);
  };
  
  return <button onClick={handleClick}>Click me</button>;
}

```

## React 18 中的新 Hooks

React 18 引入了并发渲染功能，并添加了几个新的 Hooks 来支持这一特性。

### 1. useTransition

useTransition 允许将状态更新标记为非紧急的，从而避免阻塞用户界面。

```jsx
import React, { useState, useTransition } from 'react';

function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  // isPending 标志指示 transition 是否正在进行中
  // startTransition 函数用于将更新标记为非紧急
  const [isPending, startTransition] = useTransition();
  
  const handleChange = (e) => {
    // 紧急更新：立即更新输入框
    setQuery(e.target.value);
    
    // 非紧急更新：计算搜索结果可以延迟
    startTransition(() => {
      // 在真实场景中，这可能是一个昂贵的计算或网络请求
      const searchResults = performExpensiveSearch(e.target.value);
      setResults(searchResults);
    });
  };
  
  // 模拟昂贵的搜索操作
  function performExpensiveSearch(query) {
    // 假设这是一个昂贵的操作
    const items = [];
    for (let i = 0; i < 1000; i++) {
      if (query && i.toString().includes(query)) {
        items.push(i);
      }
    }
    return items.slice(0, 10); // 只返回前10个结果
  }
  
  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending ? (
        <p>Loading results...</p>
      ) : (
        <ul>
          {results.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

```

### 2. useDeferredValue

useDeferredValue 允许延迟更新一个值，类似于 debounce，但由 React 内部根据用户交互来自动调整延迟时间。

```jsx
import React, { useState, useDeferredValue } from 'react';

function SearchResults() {
  const [query, setQuery] = useState('');
  
  // 创建一个延迟版本的 query
  const deferredQuery = useDeferredValue(query);
  
  // 注意：这里使用 deferredQuery 而不是 query
  const items = performExpensiveSearch(deferredQuery);
  
  // 检查 query 和 deferredQuery 是否不同来显示加载状态
  const isStale = query !== deferredQuery;
  
  function handleChange(e) {
    setQuery(e.target.value);
  }
  
  // 模拟昂贵的搜索操作
  function performExpensiveSearch(query) {
    // 假设这是一个昂贵的操作
    const items = [];
    for (let i = 0; i < 1000; i++) {
      if (query && i.toString().includes(query)) {
        items.push(i);
      }
    }
    return items.slice(0, 10); // 只返回前10个结果
  }
  
  return (
    <div style={{ opacity: isStale ? 0.5 : 1 }}>
      <input value={query} onChange={handleChange} />
      <ul>
        {items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {isStale && <p>Updating list...</p>}
    </div>
  );
}

```

### 3. useId

useId 用于生成唯一的 ID，特别适用于服务器端渲染场景，确保客户端和服务器生成相同的 ID。

```jsx
import React, { useId } from 'react';

function FormField() {
  // 生成唯一的 ID
  const id = useId();
  
  // 使用 id 来关联标签和输入框
  return (
    <div>
      <label htmlFor={id}>用户名：</label>
      <input id={id} type="text" />
      
      {/* 可以通过附加字符串来创建相关的 ID */}
      <label htmlFor={id + '-password'}>密码：</label>
      <input id={id + '-password'} type="password" />
    </div>
  );
}

// 多个组件实例会有不同的 ID
function MultipleFields() {
  return (
    <div>
      <FormField />
      <FormField /> {/* 这个实例会有不同的 ID */}
    </div>
  );
}

```

### 4. useSyncExternalStore

useSyncExternalStore 用于订阅外部数据源，并确保在并发渲染时数据的一致性。这对于集成第三方状态管理库特别有用。

```jsx
import React, { useSyncExternalStore } from 'react';

// 一个简单的外部存储实现
const createStore = (initialState) => {
  let state = initialState;
  const listeners = new Set();
  
  const subscribe = (listener) => {
    listeners.add(listener);
    
    // 返回取消订阅的函数
    return () => listeners.delete(listener);
  };
  
  const getSnapshot = () => state;
  
  const setState = (newState) => {
    state = newState;
    listeners.forEach(listener => listener());
  };
  
  return { subscribe, getSnapshot, setState };
};

// 创建一个存储
const store = createStore({ count: 0 });

function Counter() {
  // 使用 useSyncExternalStore 从存储中读取数据
  const state = useSyncExternalStore(
    store.subscribe,      // 订阅函数
    store.getSnapshot,    // 获取当前状态的函数
    store.getSnapshot     // (可选) 服务器端使用的获取函数
  );
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => store.setState({ count: state.count + 1 })}>
        Increment
      </button>
    </div>
  );
}

```

### 5. useInsertionEffect

useInsertionEffect 是一个新的 Hook，与 useEffect 和 useLayoutEffect 类似，但它在 DOM 更新之前同步运行。它主要用于 CSS-in-JS 库，用于在渲染前注入样式。

```jsx
import React, { useInsertionEffect, useState } from 'react';

// 注意：这个 Hook 主要用于 CSS-in-JS 库的作者，而不是普通应用开发者

// 模拟一个简化的 CSS-in-JS 系统
const styles = {};

function injectStyle(rule, key) {
  if (!styles[key]) {
    // 在实际的 CSS-in-JS 库中，这里会将规则注入到 DOM 中
    styles[key] = rule;
    console.log(`Injected style: ${rule}`);
  }
}

function MyStyledComponent() {
  const [theme, setTheme] = useState('light');
  
  // 在 DOM 变更之前注入样式
  useInsertionEffect(() => {
    // 这个 hook 会在 DOM 变更之前同步执行
    // 非常适合用于注入样式
    const buttonStyle = `
      .button-${theme} {
        background-color: ${theme === 'light' ? 'white' : 'black'};
        color: ${theme === 'light' ? 'black' : 'white'};
        padding: 8px 16px;
        border-radius: 4px;
      }
    `;
    
    injectStyle(buttonStyle, `button-${theme}`);
  }, [theme]);
  
  return (
    <div>
      <button 
        className={`button-${theme}`}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Toggle Theme
      </button>
      <p>Current theme: {theme}</p>
    </div>
  );
}

```

## React 19 中的 Hooks（预览）

React 19 尚未正式发布，但一些实验性功能和新的 Hooks 已经在开发中。以下是一些可能在 React 19 中稳定的 Hooks。

### 1. useEvent（实验性）

useEvent 允许定义一个函数，该函数始终保持相同的引用，但可以访问最新的 props 和 state。它解决了 useCallback 需要频繁更新依赖项的问题。

```jsx
import React, { useState, experimental_useEvent as useEvent } from 'react';

function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');
  
  // 使用 useEvent 创建一个稳定的函数引用
  // 此函数会始终访问最新的 props 和 state
  const onSubmit = useEvent((e) => {
    e.preventDefault();
    submitComment(userId, comment);
  });
  
  // 这个组件重新渲染时，onSubmit 保持相同的引用
  // 但在调用时会访问最新的 userId 和 comment
  
  function submitComment(userId, comment) {
    // 提交评论的逻辑
    console.log(`Submitting comment "${comment}" for user ${userId}`);
  }
  
  return (
    <form onSubmit={onSubmit}>
      <textarea 
        value={comment} 
        onChange={e => setComment(e.target.value)} 
      />
      <button type="submit">发表评论</button>
    </form>
  );
}

```

### 2. use（实验性）

use Hook 是一个通用的 Hook，可以替代多个现有的 Hooks（如 useContext, useMemo 等）。它能够消费 Promise、Context 或可订阅的值。

```jsx
import React, { use, useState, createContext, Suspense } from 'react';

// 创建一个 Context
const ThemeContext = createContext('light');

// 创建一个返回 Promise 的函数
function fetchUserData(userId) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ id: userId, name: `User ${userId}` });
    }, 1000);
  });
}

function UserProfile({ userId }) {
  // 使用 use 消费一个 Promise
  // 组件会在 Promise 解决前挂起
  const userData = use(fetchUserData(userId));
  
  // 使用 use 消费一个 Context
  const theme = use(ThemeContext);
  
  return (
    <div style={{ 
      background: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#333',
      padding: '20px'
    }}>
      <h2>{userData.name}'s Profile</h2>
      <p>User ID: {userData.id}</p>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
      
      <Suspense fallback={<div>Loading user profile...</div>}>
        <UserProfile userId={123} />
      </Suspense>
    </ThemeContext.Provider>
  );
}

```

### 3. useActionState（实验性）

useActionState 是一个新的实验性 Hook，用于处理异步操作的状态。它简化了加载、成功和错误状态的管理。

```jsx
import React, { experimental_useActionState as useActionState } from 'react';

function LoginForm() {
  // login 是一个异步函数，返回用户数据或抛出错误
  async function login(formData) {
    // 模拟网络请求
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const username = formData.get('username');
    const password = formData.get('password');
    
    if (username === 'admin' && password === 'password') {
      return { username, isAdmin: true };
    } else {
      throw new Error('Invalid credentials');
    }
  }
  
  // useActionState 返回当前状态、数据、错误和一个提交函数
  const [state, result, error, submit] = useActionState(login);
  
  // state 可以是 'idle', 'pending', 'success', 'error'
  
  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="username">用户名:</label>
          <input id="username" name="username" type="text" required />
        </div>
        <div>
          <label htmlFor="password">密码:</label>
          <input id="password" name="password" type="password" required />
        </div>
        <button type="submit" disabled={state === 'pending'}>
          {state === 'pending' ? '登录中...' : '登录'}
        </button>
      </form>
      
      {state === 'success' && (
        <div style={{ color: 'green' }}>
          登录成功！欢迎 {result.username}
          {result.isAdmin && ' (管理员)'}
        </div>
      )}
      
      {state === 'error' && (
        <div style={{ color: 'red' }}>
          登录失败: {error.message}
        </div>
      )}
    </div>
  );
}

```

### 4. useOptimistic（实验性）

useOptimistic 允许立即更新 UI 以响应用户操作，同时在后台执行实际操作。这提供了更好的用户体验，特别是在网络操作中。

```jsx
import React, { useState, experimental_useOptimistic as useOptimistic } from 'react';

function LikeButton({ postId, initialLikes }) {
  const [serverLikes, setServerLikes] = useState(initialLikes);
  
  // 使用 useOptimistic 创建一个乐观的状态
  // 第一个参数是实际状态，第二个参数是状态转换函数
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    serverLikes,
    // 当用户点击时，立即更新 UI
    (currentLikes, optimisticValue) => currentLikes + optimisticValue
  );
  
  async function handleLike() {
    // 立即更新 UI（+1）
    addOptimisticLike(1);
    
    try {
      // 在后台执行实际的网络请求
      const response = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      const data = await response.json();
      
      // 请求成功后更新服务器状态
      setServerLikes(data.likes);
    } catch (error) {
      // 如果请求失败，可以回滚或显示错误
      console.error('Failed to like post:', error);
      setServerLikes(serverLikes); // 回滚到原始状态
    }
  }
  
  return (
    <div>
      <button onClick={handleLike}>
        👍 {optimisticLikes} Likes
      </button>
    </div>
  );
}

```

<aside>
**React Hooks 版本总结**

- **React 16.8:** 引入基础 Hooks（useState, useEffect, useContext）和额外 Hooks（useReducer, useCallback, useMemo, useRef, useImperativeHandle, useLayoutEffect, useDebugValue）
- **React 17:** 没有新增 Hooks，但改进了现有 Hooks 的内部实现，特别是与事件处理相关的变化
- **React 18:** 引入了并发模式相关的 Hooks（useTransition, useDeferredValue, useId, useSyncExternalStore, useInsertionEffect）
- **React 19 (预览):** 将引入更多实用的 Hooks（useEvent, use, useActionState, useOptimistic）以简化开发并提高性能
</aside>

## 如何选择合适的 Hooks

根据不同的需求场景，我们可以选择不同的 Hooks：

| **需求** | **推荐的 Hook** |
| --- | --- |
| 简单状态管理 | useState |
| 复杂状态逻辑 | useReducer |
| 执行副作用 | useEffect |
| DOM 操作 | useRef + useEffect |
| 性能优化（计算值） | useMemo |
| 性能优化（回调函数） | useCallback (React 19+: useEvent) |
| 跨组件共享状态 | useContext |
| 紧急与非紧急更新 | useTransition |
| 延迟更新非关键 UI | useDeferredValue |
| 生成唯一 ID | useId |
| 集成外部状态管理 | useSyncExternalStore |
| 乐观 UI 更新 | useOptimistic (React 19+) |

随着 React 的不断发展，Hooks 已经成为构建 React 应用的主要方式。了解每个版本中引入的新 Hooks 及其特性，能够帮助开发者编写更高效、更易维护的代码。特别是 React 18 的并发特性和 React 19 的自动优化，将使 React 应用的性能和用户体验达到新的高度。