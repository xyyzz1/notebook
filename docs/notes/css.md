---
comments: true
statistics: false
---

# 📄 CSS 自学笔记

## 什么是 CSS？

**CSS**（Cascading Style Sheets，层叠样式表）是一种用来为 HTML 文档添加样式的**样式表语言**。它控制着网页的**外观和布局**。

!!! note "一句话理解"
    如果说 HTML 是房子的**结构**，那么 CSS 就是房子的**装修和装饰**。

---

## CSS 的三种引入方式

### 1. 行内样式（Inline）

```html
<p style="color: red; font-size: 20px;">这是一个红色段落</p>
```

!!! warning "不推荐"
    行内样式和内容混在一起，难以维护，**尽量避免使用**。

### 2. 内部样式表（Internal）

```html
<head>
    <style>
        p {
            color: red;
            font-size: 20px;
        }
    </style>
</head>
```

### 3. 外部样式表（External）— 推荐

```html
<head>
    <link rel="stylesheet" href="style.css">
</head>
```

```css
/* style.css */
p {
    color: red;
    font-size: 20px;
}
```

!!! success "最佳实践"
    使用**外部样式表**，将样式和结构分离，便于维护和复用。

---

## CSS 选择器

选择器用来**选择**你想要设置样式的 HTML 元素。

### 基础选择器

```css
/* 1. 元素选择器 — 选择所有指定标签 */
p {
    color: blue;
}

/* 2. 类选择器 — 选择所有具有指定 class 的元素 */
.highlight {
    background-color: yellow;
}

/* 3. ID 选择器 — 选择具有指定 id 的唯一元素 */
#header {
    font-size: 32px;
}

/* 4. 通配符选择器 — 选择所有元素 */
* {
    margin: 0;
    padding: 0;
}
```

### 组合选择器

```css
/* 后代选择器 — 选择所有后代元素 */
article p {
    line-height: 1.8;
}

/* 子选择器 — 只选择直接子元素 */
ul > li {
    list-style: none;
}

/* 相邻兄弟选择器 — 紧接在后的兄弟元素 */
h1 + p {
    font-size: 18px;
}

/* 通用兄弟选择器 — 后面的所有兄弟元素 */
h1 ~ p {
    color: gray;
}
```

### 属性选择器

```css
/* 具有指定属性的元素 */
[title] {
    cursor: help;
}

/* 属性值匹配 */
[type="text"] {
    border: 1px solid #ccc;
}

/* 属性值包含 */
[class*="card"] {
    border-radius: 8px;
}

/* 属性值开头 */
[href^="https"] {
    color: green;
}

/* 属性值结尾 */
[src$=".png"] {
    border: none;
}
```

### 伪类选择器

```css
/* 鼠标悬停 */
a:hover {
    color: orange;
    text-decoration: underline;
}

/* 获得焦点 */
input:focus {
    outline: 2px solid blue;
}

/* 第一个子元素 */
li:first-child {
    font-weight: bold;
}

/* 最后一个子元素 */
li:last-child {
    border-bottom: none;
}

/* 第 n 个子元素 */
li:nth-child(2n) {
    background-color: #f5f5f5;
}

/* 第 n 个同类型元素 */
p:nth-of-type(odd) {
    color: #666;
}

/* 非指定选择器 */
button:not(.primary) {
    opacity: 0.7;
}
```

### 伪元素选择器

```css
/* 元素前插入内容 */
.note::before {
    content: "📌 ";
}

/* 元素后插入内容 */
.note::after {
    content: " *";
    color: red;
}

/* 首字母 */
p::first-letter {
    font-size: 200%;
    font-weight: bold;
}

/* 首行 */
p::first-line {
    color: blue;
}

/* 选中文本样式 */
::selection {
    background: #ffb7b7;
    color: white;
}
```

---

## 选择器优先级（权重）

当多个样式规则作用于同一个元素时，按以下优先级决定最终样式：

```
!important > 行内样式(1000) > ID(100) > Class(10) > 元素(1) > 通配符(0)
```

!!! example "优先级计算示例"
    ```css
    /* 权重: 1 */
    p { color: black; }

    /* 权重: 10 */
    .intro { color: blue; }

    /* 权重: 100 */
    #main { color: red; }

    /* 权重: 111 */
    #main p.intro { color: green; }

    /* 权重: 10000 — 尽量避免使用 */
    p { color: orange !important; }
    ```

!!! warning "关于 `!important`"
    `!important` 会打破正常的优先级规则，应**尽量避免使用**。过度使用会让样式难以调试。

---

## 盒模型（Box Model）

每个 HTML 元素都可以看作一个盒子：

```
┌─────────────────────────────┐
│          margin             │
│   ┌─────────────────────┐   │
│   │       border        │   │
│   │   ┌─────────────┐   │   │
│   │   │   padding   │   │   │
│   │   │ ┌─────────┐ │   │   │
│   │   │ │ content │ │   │   │
│   │   │ └─────────┘ │   │   │
│   │   └─────────────┘   │   │
│   └─────────────────────┘   │
└─────────────────────────────┘
```

```css
.box {
    /* 内容 */
    width: 300px;
    height: 200px;

    /* 内边距 */
    padding: 20px;

    /* 边框 */
    border: 2px solid #333;

    /* 外边距 */
    margin: 10px;
}
```

!!! tip "box-sizing"
    默认的盒模型 `box-sizing: content-box` 中，`width` 只指内容宽度。推荐使用 `box-sizing: border-box`，让 `width` 包含 padding 和 border：

    ```css
    * {
        box-sizing: border-box;
    }
    ```


---

## 布局

### 1. 正常流（Normal Flow）

默认的布局方式。块级元素从上到下排列，行内元素从左到右排列。

```css
.block {
    display: block;  /* 独占一行 */
}

.inline {
    display: inline; /* 不换行，宽高不生效 */
}

.inline-block {
    display: inline-block; /* 不换行，宽高生效 */
}

.hidden {
    display: none; /* 隐藏元素，不占空间 */
}
```

### 2. Flexbox 弹性布局

Flexbox 是一维布局模型，非常适合在**一个方向**（行或列）上排列元素：

```css
.container {
    display: flex;
    flex-direction: row;        /* 主轴方向: row | column */
    justify-content: center;    /* 主轴对齐: flex-start | center | flex-end | space-between | space-around | space-evenly */
    align-items: center;        /* 交叉轴对齐: stretch | flex-start | center | flex-end | baseline */
    flex-wrap: wrap;            /* 是否换行: nowrap | wrap | wrap-reverse */
    gap: 20px;                  /* 间距 */
}

.item {
    flex: 1;                    /* 伸缩比例 */
}

/* 固定宽度的侧边栏 + 自适应主体 */
.sidebar {
    flex: 0 0 250px;  /* 不伸缩，固定 250px */
}
.main {
    flex: 1;           /* 占据剩余空间 */
}
```

!!! example "Flexbox 常用场景"
    - 导航栏的水平排列
    - 卡片列表的自适应布局
    - 垂直居中
    - 等高列布局

### 3. Grid 网格布局

Grid 是二维布局模型，适合**行和列同时控制**的复杂布局：

```css
.container {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr; /* 三列，中间列是两倍宽 */
    grid-template-rows: auto 1fr auto;   /* 三行 */
    gap: 20px;                           /* 行列间距 */
}

/* 元素跨列 */
.header {
    grid-column: 1 / -1; /* 从第 1 列跨越到最后一列 */
}

/* 经典页面布局 */
.container {
    display: grid;
    grid-template-areas:
        "header  header  header"
        "sidebar main    aside"
        "footer  footer  footer";
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.aside   { grid-area: aside; }
.footer  { grid-area: footer; }
```

### Flexbox vs Grid

| 特性 | Flexbox | Grid |
|------|---------|------|
| 维度 | 一维（行或列） | 二维（行和列） |
| 方向 | 内容驱动 | 布局驱动 |
| 使用场景 | 导航栏、卡片排列、居中对齐 | 页面整体布局、复杂网格 |
| 兼容性 | IE11+ | IE11+（部分） |

!!! tip "选择建议"
    - **一维排列**用 Flexbox（如导航栏、列表）
    - **二维布局**用 Grid（如整体页面结构）
    - 两者可以**嵌套使用**

### 4. 定位 Position

```css
/* 静态定位（默认） */
.static { position: static; }

/* 相对定位 — 相对于自身原位置偏移 */
.relative {
    position: relative;
    top: 10px;
    left: 20px;
}

/* 绝对定位 — 相对于最近的定位祖先 */
.absolute {
    position: absolute;
    top: 0;
    right: 0;
}

/* 固定定位 — 相对于视口 */
.fixed {
    position: fixed;
    bottom: 20px;
    right: 20px;
}

/* 粘性定位 — 滚动到一定位置后固定 */
.sticky {
    position: sticky;
    top: 0;
}
```

---

## 颜色与背景

```css
.element {
    /* 颜色表示方式 */
    color: red;                     /* 颜色名称 */
    color: #ff0000;                /* 十六进制 */
    color: rgb(255, 0, 0);        /* RGB */
    color: rgba(255, 0, 0, 0.5);  /* RGB + 透明度 */
    color: hsl(0, 100%, 50%);     /* HSL */

    /* 背景 */
    background-color: #f5f5f5;
    background-image: url("bg.jpg");
    background-size: cover;        /* 覆盖整个区域 */
    background-position: center;
    background-repeat: no-repeat;

    /* 渐变 */
    background: linear-gradient(to right, red, blue);
    background: radial-gradient(circle, yellow, green);

    /* 简写 */
    background: #f5f5f5 url("bg.jpg") center/cover no-repeat;
}
```

---

## 文本与字体

```css
.text {
    /* 字体 */
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 16px;
    font-weight: bold;          /* normal | bold | 100-900 */
    font-style: italic;
    line-height: 1.6;           /* 行高，常用倍数 */
    letter-spacing: 0.05em;     /* 字间距 */
    word-spacing: 0.1em;        /* 词间距 */

    /* 文本 */
    text-align: center;         /* left | center | right | justify */
    text-decoration: underline; /* none | underline | line-through */
    text-transform: uppercase;  /* none | uppercase | lowercase | capitalize */
    text-indent: 2em;           /* 首行缩进 */
    white-space: nowrap;        /* 不换行 */
    overflow: hidden;           /* 溢出隐藏 */
    text-overflow: ellipsis;    /* 溢出省略号 */
}
```

---

## 响应式设计

### 视口设置

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 媒体查询

```css
/* 手机端 */
@media (max-width: 768px) {
    .container {
        flex-direction: column;
    }
    .sidebar {
        display: none;
    }
}

/* 平板端 */
@media (min-width: 769px) and (max-width: 1024px) {
    .container {
        grid-template-columns: 1fr 1fr;
    }
}

/* 桌面端 */
@media (min-width: 1025px) {
    .container {
        max-width: 1200px;
        margin: 0 auto;
    }
}
```

### 响应式单位

```css
.responsive {
    width: 80%;          /* 相对父元素 */
    max-width: 1200px;   /* 最大宽度 */
    font-size: clamp(16px, 2vw, 24px); /* 最小16px，最大24px，之间随视口缩放 */
    padding: 1rem;       /* 相对根元素字体大小 */
    height: 100vh;       /* 视口高度 */
}
```

---

## 过渡与动画

### 过渡 Transition

```css
.button {
    background-color: blue;
    color: white;
    padding: 10px 20px;
    /* 属性名  持续时间  缓动函数  延迟 */
    transition: background-color 0.3s ease 0s;
}

.button:hover {
    background-color: darkblue;
}

/* 多属性过渡 */
.card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

### 动画 Animation

```css
/* 定义动画 */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 更精细的关键帧 */
@keyframes pulse {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.1); }
    100% { transform: scale(1); }
}

/* 应用动画 */
.element {
    animation: fadeIn 0.5s ease forwards;
}

.loading {
    animation: pulse 1.5s ease infinite;
}
```

---

## CSS 变量（自定义属性）

```css
:root {
    --primary-color: #3498db;
    --secondary-color: #2ecc71;
    --text-color: #333;
    --spacing-unit: 8px;
    --border-radius: 4px;
}

.button {
    background-color: var(--primary-color);
    color: white;
    padding: calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 3);
    border-radius: var(--border-radius);
}

.button--secondary {
    background-color: var(--secondary-color);
}

/* 带默认值 */
.element {
    color: var(--custom-color, #333); /* 如果 --custom-color 未定义则用 #333 */
}
```

!!! tip "CSS 变量的优势"
    - 统一管理颜色、间距等设计参数
    - 动态修改（JavaScript 可以修改 CSS 变量）
    - 支持主题切换

---

## 实用技巧

!!! tip "垂直居中大全"
    ```css
    /* Flexbox 居中（推荐，最简单） */
    .parent {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* Grid 居中 */
    .parent {
        display: grid;
        place-items: center;
    }

    /* 绝对定位 + transform（兼容性好） */
    .child {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    ```

!!! tip "常用 CSS Reset"
    ```css
    *,
    *::before,
    *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    ```

---

## 学习建议

!!! success "CSS 学习路线"
    1. 掌握选择器和优先级
    2. 理解盒模型
    3. 学会 Flexbox 和 Grid 布局
    4. 掌握响应式设计（媒体查询）
    5. 学习过渡和动画
    6. 了解预处理语言（Sass / Less）
    7. 看优秀的网站，用 F12 研究它们的 CSS

!!! abstract "推荐资源"
    - [MDN CSS 教程](https://developer.mozilla.org/zh-CN/docs/Web/CSS)
    - [CSS-Tricks](https://css-tricks.com/) — Flexbox 和 Grid 的图解指南
    - [Flexbox Froggy](https://flexboxfroggy.com/) — 通过游戏学习 Flexbox
    - [Grid Garden](https://cssgridgarden.com/) — 通过游戏学习 Grid
    - [CSS Diner](https://flukeout.github.io/) — 通过游戏学习选择器

---

## 参考资源

- [MDN Web Docs - CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS)
- [W3Schools CSS Tutorial](https://www.w3schools.com/css/)
- [CSS-Tricks A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [CSS-Tricks A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
