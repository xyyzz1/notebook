---
comments: true
statistics: false
---

# ⚡ JavaScript 自学笔记

## 什么是 JavaScript？

JavaScript 是一种**轻量级、解释型**的编程语言，最初由 Brendan Eich 于 1995 年创建。它是 Web 开发的三大核心技术之一（HTML、CSS、JavaScript），负责网页的**交互和动态行为**。

!!! note "JavaScript ≠ Java"
    虽然名字相似，但 JavaScript 和 Java 是两种完全不同的语言。JavaScript 最初叫 LiveScript，后来为了蹭 Java 的热度才改名。

---

## 基础语法

### 1. 变量声明

```javascript
// 现代写法（推荐）
let name = 'Alice';       // 可变变量
const PI = 3.14159;       // 常量，不可重新赋值

// 旧式写法（尽量避免）
var age = 25;             // 函数作用域，存在变量提升问题
```

!!! warning "var 的问题"
    `var` 存在变量提升（hoisting）和函数作用域等历史问题，现代 JavaScript 开发中应优先使用 `let` 和 `const`。

| 关键字 | 作用域 | 可重复声明 | 可重新赋值 | 变量提升 |
|--------|--------|------------|------------|----------|
| `var` | 函数 | ✅ | ✅ | ✅ |
| `let` | 块 | ❌ | ✅ | ❌（TDZ） |
| `const` | 块 | ❌ | ❌ | ❌（TDZ） |

### 2. 数据类型

JavaScript 有 8 种基本数据类型：

```javascript
// 原始类型
let str = 'Hello';            // string
let num = 42;                 // number
let big = 9007199254740991n;  // bigint
let isTrue = true;            // boolean
let nothing = null;           // null
let notDefined = undefined;   // undefined
let unique = Symbol('id');    // symbol

// 引用类型
let obj = { name: 'Alice' };  // object
let arr = [1, 2, 3];          // object (Array)
function foo() {}             // object (Function)
```

### 3. 运算符

```javascript
// 算术运算符
let sum = 1 + 2;        // 3
let diff = 5 - 3;       // 2
let product = 4 * 3;    // 12
let quotient = 10 / 3;  // 3.333...
let remainder = 10 % 3; // 1
let power = 2 ** 3;     // 8

// 比较运算符
console.log(5 > 3);          // true
console.log(5 === '5');      // false（严格相等）
console.log(5 == '5');       // true（宽松相等，会类型转换）

// 逻辑运算符
console.log(true && false);  // false (AND)
console.log(true || false);  // true  (OR)
console.log(!true);          // false (NOT)

// 三元运算符
let result = score >= 60 ? '及格' : '不及格';
```

!!! tip "始终使用 ==="
    建议始终使用严格相等 `===` 和 `!==`，避免 `==` 的隐式类型转换带来的意外行为。

### 4. 字符串操作

```javascript
let text = 'Hello, World!';

// 常用方法
text.length;              // 13
text.toUpperCase();       // "HELLO, WORLD!"
text.toLowerCase();       // "hello, world!"
text.includes('World');   // true
text.indexOf('World');    // 7
text.slice(0, 5);         // "Hello"
text.replace('World', 'JS'); // "Hello, JS!"
text.split(', ');         // ["Hello", "World!"]

// 模板字符串
let name = 'Alice';
let greeting = `Hi, ${name}!`;  // "Hi, Alice!"
```

### 5. 数组

```javascript
let fruits = ['apple', 'banana', 'orange'];

// 基本操作
fruits.length;                // 3
fruits[0];                    // "apple"
fruits.push('grape');         // 末尾添加
fruits.pop();                 // 末尾删除
fruits.unshift('mango');      // 开头添加
fruits.shift();               // 开头删除
fruits.indexOf('banana');     // 1

// 遍历数组
fruits.forEach((item, i) => {
  console.log(i, item);
});

// 数组方法
let numbers = [1, 2, 3, 4, 5];

numbers.map(n => n * 2);       // [2, 4, 6, 8, 10]
numbers.filter(n => n > 2);    // [3, 4, 5]
numbers.reduce((sum, n) => sum + n, 0);  // 15
numbers.find(n => n > 3);      // 4
numbers.some(n => n > 4);      // true
numbers.every(n => n > 0);     // true
```

---

## 函数

### 函数声明

```javascript
// 函数声明
function add(a, b) {
  return a + b;
}

// 函数表达式
const subtract = function(a, b) {
  return a - b;
};

// 箭头函数（ES6）
const multiply = (a, b) => a * b;
const greet = name => `Hello, ${name}`;
const square = x => {
  const result = x * x;
  return result;
};
```

### 参数处理

```javascript
// 默认参数
function greet(name = 'Guest') {
  return `Hello, ${name}!`;
}

// 剩余参数
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3, 4);  // 10

// 解构参数
function printUser({ name, age }) {
  console.log(`${name} is ${age} years old`);
}
printUser({ name: 'Alice', age: 25, city: 'NYC' });
```

### 作用域与闭包

```javascript
// 块作用域
{
  let x = 10;
  const y = 20;
  console.log(x);  // 10
}
// console.log(x);  // ReferenceError

// 闭包
function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

!!! note "闭包是什么？"
    闭包是指函数能够**记住并访问**其词法作用域，即使该函数在其作用域之外执行。它是 JavaScript 最强大的特性之一。

---

## 对象与类

### 对象字面量

```javascript
const person = {
  name: 'Alice',
  age: 25,
  greet() {
    console.log(`Hi, I'm ${this.name}`);
  },
};

// 访问属性
console.log(person.name);   // "Alice"
console.log(person['age']); // 25

// 解构
const { name, age } = person;

// 展开运算符
const updated = { ...person, age: 26, city: 'NYC' };
```

### 类（ES6）

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound.`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  speak() {
    console.log(`${this.name} barks.`);
  }
}

const dog = new Dog('Rex', 'German Shepherd');
dog.speak();  // "Rex barks."
```

---

## 异步编程

### 回调函数

```javascript
setTimeout(() => {
  console.log('1 秒后执行');
}, 1000);
```

### Promise

```javascript
// 创建 Promise
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功！');
    // reject(new Error('失败！'));
  }, 1000);
});

// 使用 Promise
promise
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log('完成'));

// Promise 静态方法
Promise.all([fetch('/api/users'), fetch('/api/posts')]);
Promise.race([fetch('/api/fast'), fetch('/api/slow')]);
Promise.allSettled([promise1, promise2]);
```

### async/await

```javascript
async function fetchUser(id) {
  try {
    const response = await fetch(`https://api.example.com/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取用户失败:', error);
    return null;
  }
}

// 调用
const user = await fetchUser(1);
```

!!! tip "错误处理"
    使用 `async/await` 时，记得用 `try...catch` 包裹 `await` 表达式来捕获潜在的错误。

---

## DOM 操作

```javascript
// 选择元素
const title = document.querySelector('h1');
const items = document.querySelectorAll('.item');
const container = document.getElementById('container');

// 修改内容
title.textContent = '新标题';
title.innerHTML = '<span>新标题</span>';

// 修改样式
title.style.color = 'blue';
title.classList.add('highlight');
title.classList.toggle('active');

// 创建元素
const div = document.createElement('div');
div.className = 'card';
div.innerHTML = '<p>Hello</p>';
container.appendChild(div);

// 事件监听
button.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('按钮被点击了！');
});

// 事件委托
list.addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    console.log('点击了:', e.target.textContent);
  }
});
```

---

## 模块化

### ES6 模块

```javascript
// math.js — 导出
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export default function multiply(a, b) { return a * b; }

// app.js — 导入
import multiply, { PI, add } from './math.js';
```

---

## 常用技巧

!!! tip "实用代码片段"

    **防抖（Debounce）** — 限制函数执行频率：
    ```javascript
    function debounce(fn, delay = 300) {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
      };
    }
    ```

    **节流（Throttle）** — 固定时间间隔执行一次：
    ```javascript
    function throttle(fn, delay = 300) {
      let last = 0;
      return (...args) => {
        const now = Date.now();
        if (now - last >= delay) {
          last = now;
          fn(...args);
        }
      };
    }
    ```

    **深拷贝**：
    ```javascript
    const deepCopy = obj => JSON.parse(JSON.stringify(obj));
    // 或使用新 API
    const copy = structuredClone(obj);
    ```

---

## 参考资源

- [MDN JavaScript 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
- [现代 JavaScript 教程](https://zh.javascript.info/)
- [ES6 入门教程（阮一峰）](https://es6.ruanyifeng.com/)
- [JavaScript 30 天编程挑战](https://javascript30.com/)
