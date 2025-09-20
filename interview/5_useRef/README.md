结合 React 官方文档的 useRef 手写面试题（从浅入深）
以下题目严格围绕 React 中文网 useRef 文档核心特性（引用 DOM 元素、保存跨渲染可变值、避免闭包陷阱）设计，从基础到综合逐步递进，每道题解答包含「代码逐句解释」和「特性对应文档知识点」，帮你精准匹配官方概念。
一、基础题：引用 DOM 元素（文档核心场景 1）
题目要求
实现一个组件，满足：
页面挂载后，输入框自动获取焦点（无需用户点击）；
点击 “聚焦输入框” 按钮时，再次让输入框聚焦；
点击 “获取输入值” 按钮时，在控制台打印输入框的当前内容。
解答代码
```jsx
import React, { useRef, useEffect } from 'react';

const UseRef_1 = () => {
  // 1. 创建 useRef 实例，初始值为 null（用于存储输入框 DOM 元素）
  // 文档对应：useRef(initialValue) 创建一个 ref 对象，current 属性初始为 initialValue
  const inputRef = useRef(null);

  // 2. 页面挂载后自动聚焦输入框（依赖空数组，仅执行一次）
  // 文档对应：组件挂载后，React 会将 DOM 元素赋值给 ref.current
  useEffect(() => {
    // 检查 inputRef.current 是否存在（避免 DOM 未挂载时调用方法报错）
    if (inputRef.current) {
      // 调用 DOM 原生方法 focus()，让输入框聚焦
      inputRef.current.focus();
    }
  }, []); // 空依赖：仅在组件首次渲染（挂载）后执行

  // 3. 点击按钮手动聚焦输入框
  const handleFocusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus(); // 再次调用 DOM 方法，手动触发聚焦
    }
  };

  // 4. 点击按钮获取输入框当前值
  const handleGetInputValue = () => {
    if (inputRef.current) {
      // 通过 ref.current.value 获取 DOM 元素的 value 属性（输入框内容）
      console.log('输入框当前值：', inputRef.current.value);
    }
  };

  // 5. 渲染 UI：通过 ref={inputRef} 将输入框 DOM 绑定到 inputRef
  // 文档对应：在 JSX 中用 ref 属性将 DOM 元素与 ref 对象关联
  return (
    <div style={{ padding: '20px' }}>
      <h3>useRef 引用 DOM 示例</h3>
      {/* ref={inputRef}：React 会在 DOM 挂载后，将 input 元素赋值给 inputRef.current */}
      <input
        ref={inputRef}
        type="text"
        placeholder="页面挂载后自动聚焦"
        style={{ padding: '8px', marginRight: '10px' }}
      />
      <button onClick={handleFocusInput} style={{ marginRight: '10px' }}>
        聚焦输入框
      </button>
      <button onClick={handleGetInputValue}>
        获取输入值
      </button>
    </div>
  );
}

export default UseRef_1;
```
代码逐句解释
const inputRef = useRef(null)：
创建 useRef 实例，inputRef 是一个包含 current 属性的对象，初始值为 null（文档中 “创建 ref 对象” 的基础用法）。
核心作用：后续用于存储输入框的 DOM 元素，current 属性会被 React 自动更新为对应的 DOM 节点。
useEffect(() => { ... }, [])：
空依赖数组确保副作用仅在组件挂载后执行一次（文档中 “组件挂载后操作 DOM” 的典型场景）。
inputRef.current.focus()：调用 DOM 原生 focus() 方法，让输入框聚焦 —— 此时 inputRef.current 已被 React 赋值为输入框 DOM 元素（DOM 挂载完成后）。
ref={inputRef}（JSX 中）：
这是 useRef 关联 DOM 的关键步骤（文档中 “将 ref 附加到 DOM 元素”）。
React 渲染时，会检测到 ref 属性，在 DOM 节点创建并挂载到页面后，将该节点赋值给 inputRef.current。
handleGetInputValue 函数：
通过 inputRef.current.value 获取输入框的当前内容 ——current 指向 DOM 元素，可直接访问其原生属性（如 value、style）和方法（如 focus()）。
对应文档知识点
文档章节：引用 DOM 元素
核心概念：useRef 最基础的用途是 “保存 DOM 元素引用”，让你能直接操作 DOM（如聚焦、获取值），但需避免过度操作 DOM（优先用 React 状态管理）。
二、进阶题：保存跨渲染可变值（文档核心场景 2）
题目要求
实现一个计数器组件，满足：
点击 “+1” 按钮，计数每次加 1；
点击 “启动定时器” 按钮，每 1 秒自动加 1；
点击 “停止定时器” 按钮，停止自动加 1；
用 useRef 保存定时器 ID，不使用 useState 存储定时器 ID（避免因 useState 更新触发不必要的组件渲染）。
解答代码
```jsx
import React, { useState, useRef, useEffect } from 'react';

function RefMutableValueDemo() {
  // 1. 用 useState 管理计数状态（需要触发 UI 更新）
  const [count, setCount] = useState(0);

  // 2. 用 useRef 保存定时器 ID（跨渲染保存，修改不触发组件更新）
  // 文档对应：useRef 可保存“跨渲染的可变值”，ref.current 变化不会导致组件重新渲染
  const timerRef = useRef(null);

  // 3. 手动加 1 逻辑
  const handleIncrement = () => {
    setCount(prevCount => prevCount + 1);
  };

  // 4. 启动定时器：每 1 秒自动加 1
  const handleStartTimer = () => {
    // 避免重复启动：若 timerRef.current 为 null，说明没有定时器
    if (!timerRef.current) {
      // 启动定时器，将定时器 ID 存入 timerRef.current
      timerRef.current = setInterval(() => {
        // 函数式更新：确保拿到最新的 count 值
        setCount(prevCount => prevCount + 1);
      }, 1000);
      console.log('定时器已启动');
    }
  };

  // 5. 停止定时器：清除定时器并重置 timerRef.current
  const handleStopTimer = () => {
    // 检查定时器是否存在（避免重复清除）
    if (timerRef.current) {
      // 用 timerRef.current 拿到定时器 ID，调用 clearInterval 清除
      clearInterval(timerRef.current);
      timerRef.current = null; // 重置为 null，允许下次重新启动
      console.log('定时器已停止');
    }
  };

  // 6. 组件卸载时清除定时器（避免内存泄漏）
  // 文档对应：组件卸载前，需清理用 ref 保存的资源（如定时器、事件监听）
  useEffect(() => {
    // 清理函数：组件卸载时执行
    return () => {
      handleStopTimer(); // 调用停止定时器函数，确保资源释放
    };
  }, []); // 空依赖：仅在组件卸载时执行清理

  return (
    <div style={{ padding: '20px' }}>
      <h3>当前计数：{count}</h3>
      <button onClick={handleIncrement} style={{ marginRight: '10px' }}>
        +1
      </button>
      <button onClick={handleStartTimer} style={{ marginRight: '10px' }}>
        启动定时器
      </button>
      <button onClick={handleStopTimer}>
        停止定时器
      </button>
    </div>
  );
}

export default RefMutableValueDemo;
```
代码逐句解释
const timerRef = useRef(null)：
创建 useRef 实例，用于存储定时器 ID（setInterval 返回的数字 ID）。
关键特性（文档核心）：timerRef.current 的值可以任意修改，且修改不会触发组件重新渲染 —— 这是与 useState 的本质区别（useState 更新会触发渲染）。
handleStartTimer 函数：
timerRef.current = setInterval(...)：将定时器 ID 存入 ref.current—— 此时 ref 的值变化，但组件不会重新渲染（避免不必要的性能消耗）。
if (!timerRef.current)：避免重复启动定时器（若已有活跃定时器，ref.current 不为 null，不执行启动逻辑）。
handleStopTimer 函数：
clearInterval(timerRef.current)：通过 ref.current 拿到定时器 ID，调用 clearInterval 清除定时器（文档中 “清理用 ref 保存的资源” 场景）。
timerRef.current = null：重置 ref 的值，确保下次点击 “启动定时器” 时能重新创建定时器。
组件卸载清理：
useEffect 清理函数中调用 handleStopTimer：组件卸载时，即使用户未点击 “停止定时器”，也会清除定时器，避免内存泄漏（文档中 “避免资源泄漏” 的最佳实践）。
对应文档知识点
文档章节：保存可变值
核心概念：useRef 不仅能引用 DOM，还能保存 “跨渲染的可变值”（如定时器 ID、滚动位置），其 current 属性变化不会触发组件渲染，适合存储 “不需要关联 UI 的临时状态”。
三、高阶题：避免闭包陷阱（文档进阶场景）
题目要求
修复以下 “闭包陷阱” 问题：
点击 “3 秒后打印计数” 按钮，3 秒后在控制台打印当前计数；
若 3 秒内多次点击 “+1” 按钮（如从 0 加到 3），3 秒后应打印最新的计数（3），而非点击按钮时的旧计数（0）；
必须用 useRef 解决闭包陷阱，不能修改 setTimeout 的位置。
有问题的代码（闭包陷阱）：
```jsx
// 问题：3 秒后打印的是点击按钮时的旧 count（如点击时 count=0，3 秒内加到 3，仍打印 0）
function ClosureTrap() {
  const [count, setCount] = useState(0);

  const handlePrintAfter3s = () => {
    setTimeout(() => {
      console.log('3 秒后计数：', count); // 闭包捕获的是点击时的旧值
    }, 3000);
  };

  return (
    <div>
      <p>当前计数：{count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <button onClick={handlePrintAfter3s}>3 秒后打印计数</button>
    </div>
  );
}
```
解答代码
```jsx
import React, { useState, useRef, useEffect } from 'react';

function FixClosureTrap() {
  // 1. 用 useState 管理计数状态（触发 UI 更新）
  const [count, setCount] = useState(0);

  // 2. 用 useRef 保存最新的 count 值（跨渲染同步，避免闭包陷阱）
  // 文档对应：用 ref 保存“最新值”，在闭包中读取 ref.current 而非直接读取状态
  const countRef = useRef(count);

  // 3. 同步 count 到 countRef：count 变化时，更新 countRef.current
  // 文档对应：通过 useEffect 确保 ref.current 始终与最新状态同步
  useEffect(() => {
    // 每次 count 变化（如点击+1），将最新值赋值给 countRef.current
    countRef.current = count;
    // 依赖数组：仅当 count 变化时执行同步（避免不必要的执行）
  }, [count]);

  // 4. 修复闭包陷阱：在 setTimeout 中读取 countRef.current（最新值）
  const handlePrintAfter3s = () => {
    setTimeout(() => {
      // 读取 countRef.current，而非直接读取 count（闭包捕获的旧值）
      console.log('3 秒后计数（修复后）：', countRef.current);
    }, 3000);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>useRef 避免闭包陷阱</h3>
      <p>当前计数：{count}</p>
      <button onClick={() => setCount(prev => prev + 1)} style={{ marginRight: '10px' }}>
        +1
      </button>
      <button onClick={handlePrintAfter3s}>
        3 秒后打印计数
      </button>
    </div>
  );
}

export default FixClosureTrap;
```
代码逐句解释
闭包陷阱的原因（文档关键）：
函数组件每次渲染都是独立的 “快照”，handlePrintAfter3s 中的 count 是点击按钮时的 “快照值”（闭包捕获的是该次渲染的状态）。
3 秒内 count 变化（如从 0→3），但 setTimeout 回调仍引用旧的 count（0），导致打印错误。
const countRef = useRef(count)：
创建 ref 实例，初始值为 count（0），但 ref.current 会通过 useEffect 同步为最新值。
核心作用：ref 是 “跨渲染的可变容器”，其 current 属性始终指向最新的 count 值，不受闭包快照的影响。
useEffect(() => { countRef.current = count }, [count])：
依赖数组 [count] 确保：每次 count 变化（如点击 + 1），该副作用都会执行，将最新的 count 赋值给 countRef.current。
这一步是 “同步最新值” 的关键 —— 确保 ref.current 与 UI 显示的 count 始终一致。
setTimeout 中读取 countRef.current：
不再直接读取闭包中的 count（旧值），而是读取 countRef.current（最新值）。
例如：点击按钮时 count=0，3 秒内加到 3，countRef.current 同步更新为 3，setTimeout 回调打印 3（正确值）。
对应文档知识点
文档章节：避免闭包陷阱
核心概念：当异步回调（如 setTimeout、fetch）需要访问 “最新状态” 时，直接读取状态会因闭包陷阱拿到旧值；用 useRef 保存最新状态并同步，在回调中读取 ref.current 可解决该问题。
四、综合题：结合 DOM 引用 + 可变值 + 滚动监听
题目要求
实现一个 “滚动到顶部” 组件，满足：
页面滚动时，实时在控制台打印当前滚动距离（window.scrollY）；
当滚动距离超过 300px 时，显示 “回到顶部” 按钮；否则隐藏按钮；
点击 “回到顶部” 按钮时，平滑滚动到页面顶部；
用 useRef 实现两个功能：
保存 “是否正在滚动” 的状态（避免滚动过程中重复触发滚动事件）；
引用 “回到顶部” 按钮 DOM 元素（控制按钮显示 / 隐藏的样式）。
解答代码
```jsx
import React, { useRef, useEffect } from 'react';

function ScrollToTop() {
  // 1. 用 useRef 保存两个值：
  // （1）isScrolling：标记是否正在滚动（避免重复触发滚动逻辑）
  // （2）topBtnRef：引用“回到顶部”按钮 DOM 元素（控制样式）
  const isScrollingRef = useRef(false); // 初始值：未在滚动
  const topBtnRef = useRef(null); // 初始值：按钮 DOM 未挂载

  // 2. 滚动监听逻辑：页面滚动时执行
  const handleScroll = () => {
    // 避免滚动过程中高频执行（节流效果，优化性能）
    if (isScrollingRef.current) return;

    // 标记为“正在滚动”，50ms 后重置（节流：每 50ms 执行一次）
    isScrollingRef.current = true;
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 50);

    // （1）打印当前滚动距离
    const scrollY = window.scrollY;
    console.log('当前滚动距离：', scrollY);

    // （2）控制按钮显示/隐藏：滚动距离 > 300px 显示，否则隐藏
    if (topBtnRef.current) {
      topBtnRef.current.style.display = scrollY > 300 ? 'block' : 'none';
    }
  };

  // 3. 点击按钮平滑滚动到顶部
  const handleScrollToTop = () => {
    // 调用 window.scrollTo 实现平滑滚动
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 平滑滚动（而非瞬间跳转）
    });
  };

  // 4. 组件挂载时添加滚动监听，卸载时移除（避免内存泄漏）
  useEffect(() => {
    // 添加滚动事件监听：页面滚动时触发 handleScroll
    window.addEventListener('scroll', handleScroll);

    // 清理函数：组件卸载时执行
    return () => {
      // 移除滚动监听（避免组件卸载后仍监听，导致内存泄漏）
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // 空依赖：仅在挂载/卸载时执行

  return (
    <div style={{ height: '2000px' }}> {/* 制造长页面，方便滚动 */}
      <h3 style={{ position: 'fixed', top: '20px' }}>滚动到顶部示例</h3>
      {/* 回到顶部按钮：用 ref={topBtnRef} 关联 DOM，初始隐藏 */}
      <button
        ref={topBtnRef}
        onClick={handleScrollToTop}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          padding: '10px 16px',
          display: 'none' // 初始隐藏
        }}
      >
        回到顶部
      </button>
    </div>
  );
}

export default ScrollToTop;
```
代码逐句解释
isScrollingRef = useRef(false)：
保存 “是否正在滚动” 的状态，用于实现简单节流（每 50ms 执行一次滚动逻辑，避免滚动事件高频触发导致性能问题）。
isScrollingRef.current 变化不触发渲染，适合存储 “临时控制状态”（文档中 “保存可变控制值” 的场景）。
topBtnRef = useRef(null)：
引用 “回到顶部” 按钮的 DOM 元素，用于动态修改按钮的 display 样式（显示 / 隐藏）。
在 handleScroll 中，通过 topBtnRef.current.style.display 直接操作 DOM 样式（文档中 “引用 DOM 并修改属性” 的综合场景）。
滚动监听与清理：
window.addEventListener('scroll', handleScroll)：组件挂载时添加滚动监听，实时响应页面滚动。
清理函数中移除监听：避免组件卸载后仍占用事件监听资源（文档中 “清理 DOM 事件监听” 的最佳实践）。
平滑滚动逻辑：
window.scrollTo({ top: 0, behavior: 'smooth' })：点击按钮时，调用浏览器原生方法实现平滑滚动到顶部，topBtnRef 确保按钮 DOM 能被正确引用和操作。
对应文档知识点
文档章节：useRef 综合场景
核心概念：useRef 是 “多功能容器”，可同时实现 DOM 引用、跨渲染可变值存储、闭包陷阱解决 等场景，是 React 中处理 “非状态关联数据” 的核心工具。
总结：useRef 核心特性与文档对应关系
useRef 特性	文档章节	典型场景	面试高频考点
引用 DOM 元素	引用 DOM 元素	输入框聚焦、获取 DOM 属性	如何用 useRef 实现 DOM 操作
保存跨渲染可变值	保存可变值	定时器 ID、滚动位置、节流控制	useRef 与 useState 的区别
避免闭包陷阱	避免闭包陷阱	异步回调中获取最新状态	闭包陷阱的原因与解决方案
清理资源（定时器 / 事件）	保存可变值 + 副作用清理	组件卸载时清除定时器 / 监听	如何避免内存泄漏
通过以上题目练习，可全面覆盖 useRef 的所有核心用法，且每道题都能对应到官方文档的具体概念，帮你在理解原理的同时掌握实战技巧，应对面试中的 useRef 相关问题。