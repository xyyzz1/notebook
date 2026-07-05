---
comments: true
statistics: false
---

# 📄 HTML 自学笔记

## 什么是 HTML？

**HTML**（HyperText Markup Language，超文本标记语言）是构建网页的**标准标记语言**。它不是编程语言，而是一种用来描述网页结构的**标记语言**。

!!! note "一句话理解"
    HTML 就像是网页的**骨架**，定义了页面的结构和内容。

---

## HTML 文档基本结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的网页</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>这是我的第一个网页。</p>
</body>
</html>
```

!!! info "结构解析"
    | 标签 | 说明 |
    |------|------|
    | `<!DOCTYPE html>` | 声明文档类型为 HTML5 |
    | `<html>` | 根元素，包裹整个页面 |
    | `<head>` | 头部区域，包含元数据 |
    | `<meta charset="UTF-8">` | 设置字符编码 |
    | `<title>` | 网页标题（显示在浏览器标签上） |
    | `<body>` | 主体区域，可见内容都写在这里 |

---

## 常用标签

### 1. 标题与段落

```html
<h1>一级标题</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
<h4>四级标题</h4>
<h5>五级标题</h5>
<h6>六级标题</h6>

<p>这是一个段落。</p>
<p>这是另一个段落。</p>
```

!!! warning "注意"
    `<h1>` 到一个页面最好只用一次，用于主标题。标题标签应该按层级使用，不要跳级。

### 2. 文本格式化

```html
<strong>粗体（语义强调）</strong>
<b>粗体（仅视觉效果）</b>

<em>斜体（语义强调）</em>
<i>斜体（仅视觉效果）</i>

<mark>高亮文本</mark>
<small>小号文本</small>
<del>删除线</del>
<ins>下划线</ins>
<sub>下标</sub> 和 <sup>上标</sup>
```

!!! tip "`<strong>` vs `<b>`"
    `<strong>` 有语义含义（表示重要），`<b>` 仅是视觉上的加粗。在 SEO 和无障碍访问中，优先使用语义化标签。

### 3. 链接

```html
<!-- 外部链接 -->
<a href="https://www.example.com">访问网站</a>

<!-- 新标签页打开 -->
<a href="https://www.example.com" target="_blank">新标签打开</a>

<!-- 页内锚点 -->
<a href="#section1">跳转到第一节</a>

<!-- 邮件链接 -->
<a href="mailto:example@example.com">发送邮件</a>

<!-- 电话链接 -->
<a href="tel:+8612345678900">拨打电话</a>
```

### 4. 图片

```html
<img src="path/to/image.jpg" alt="图片描述" width="300" height="200">

<!-- 带标题的图片 -->
<figure>
    <img src="image.jpg" alt="风景照">
    <figcaption>图1：美丽的风景</figcaption>
</figure>
```

!!! warning "alt 属性很重要"
    `alt` 属性在图片加载失败时显示，也是屏幕阅读器读给视障用户的描述，同时有利于 SEO。

### 5. 列表

#### 无序列表

```html
<ul>
    <li>项目一</li>
    <li>项目二</li>
    <li>项目三</li>
</ul>
```

#### 有序列表

```html
<ol>
    <li>第一步</li>
    <li>第二步</li>
    <li>第三步</li>
</ol>
```

#### 描述列表

```html
<dl>
    <dt>HTML</dt>
    <dd>超文本标记语言，用于构建网页结构</dd>

    <dt>CSS</dt>
    <dd>层叠样式表，用于美化网页外观</dd>
</dl>
```

### 6. 表格

```html
<table border="1">
    <thead>
        <tr>
            <th>姓名</th>
            <th>年龄</th>
            <th>城市</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>张三</td>
            <td>25</td>
            <td>北京</td>
        </tr>
        <tr>
            <td>李四</td>
            <td>30</td>
            <td>上海</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td colspan="3">共 2 人</td>
        </tr>
    </tfoot>
</table>
```

### 7. 表单

```html
<form action="/submit" method="post">
    <!-- 文本输入 -->
    <label for="name">姓名：</label>
    <input type="text" id="name" name="name" placeholder="请输入姓名" required>

    <!-- 密码 -->
    <label for="password">密码：</label>
    <input type="password" id="password" name="password" required>

    <!-- 邮箱 -->
    <label for="email">邮箱：</label>
    <input type="email" id="email" name="email">

    <!-- 单选 -->
    <label><input type="radio" name="gender" value="male"> 男</label>
    <label><input type="radio" name="gender" value="female"> 女</label>

    <!-- 多选 -->
    <label><input type="checkbox" name="hobby" value="coding"> 编程</label>
    <label><input type="checkbox" name="hobby" value="reading"> 阅读</label>

    <!-- 下拉 -->
    <label for="city">城市：</label>
    <select id="city" name="city">
        <option value="beijing">北京</option>
        <option value="shanghai">上海</option>
        <option value="guangzhou">广州</option>
    </select>

    <!-- 文本域 -->
    <label for="message">留言：</label>
    <textarea id="message" name="message" rows="4" cols="50"></textarea>

    <!-- 提交按钮 -->
    <button type="submit">提交</button>
    <button type="reset">重置</button>
</form>
```

### 8. 容器元素

```html
<!-- 块级容器（用于布局） -->
<div class="container">
    <p>这是一个 div 容器</p>
</div>

<!-- 行内容器（用于文本样式） -->
<p>这是 <span style="color: red;">红色</span> 文字</p>
```

!!! info "`<div>` vs `<span>`"
    - `<div>` 是**块级元素**，独占一行，用于大块布局
    - `<span>` 是**行内元素**，不换行，用于局部样式

---

## 语义化标签

HTML5 引入了许多语义化标签，让页面结构更清晰：

```html
<!-- 旧写法：全是 div -->
<div class="header">头部</div>
<div class="nav">导航</div>
<div class="main">主体</div>
<div class="footer">底部</div>

<!-- HTML5 语义化写法 -->
<header>头部</header>
<nav>导航</nav>
<main>主体</main>
<footer>底部</footer>
```

!!! success "语义化标签的好处"
    | 好处 | 说明 |
    |------|------|
    | **可读性** | 代码更清晰，便于维护 |
    | **SEO** | 搜索引擎更容易理解页面结构 |
    | **无障碍** | 屏幕阅读器能更好地解析内容 |

### 常用语义化标签

```html
<header>      <!-- 页眉/头部区域 -->
<nav>         <!-- 导航链接区域 -->
<main>        <!-- 页面主体内容（每个页面一个） -->
<article>     <!-- 独立的文章内容 -->
<section>     <!-- 文档中的节/区块 -->
<aside>       <!-- 侧边栏/附加内容 -->
<footer>      <!-- 页脚 -->
<time>        <!-- 时间/日期 -->
<address>     <!-- 联系信息 -->
```

### 语义化页面结构示例

```html
<body>
    <header>
        <h1>我的博客</h1>
        <nav>
            <a href="/">首页</a>
            <a href="/about">关于</a>
            <a href="/contact">联系</a>
        </nav>
    </header>

    <main>
        <article>
            <h2>文章标题</h2>
            <time datetime="2026-07-05">2026年7月5日</time>
            <p>文章内容...</p>
        </article>

        <aside>
            <h3>相关文章</h3>
            <ul>
                <li><a href="#">推荐文章1</a></li>
                <li><a href="#">推荐文章2</a></li>
            </ul>
        </aside>
    </main>

    <footer>
        <p>&copy; 2026 我的博客. All rights reserved.</p>
    </footer>
</body>
```

---

## HTML 属性

属性提供了关于 HTML 元素的**额外信息**：

```html
<!-- 常用全局属性 -->
<a href="url" target="_blank" title="提示文本">链接</a>
<img src="image.jpg" alt="描述" width="300" height="200">
<input type="text" id="name" class="form-input" disabled>
<p style="color: blue;" data-custom="自定义数据">文本</p>
```

| 属性 | 说明 |
|------|------|
| `id` | 元素唯一标识符 |
| `class` | 元素类名（可多个） |
| `style` | 行内样式 |
| `title` | 鼠标悬停提示 |
| `data-*` | 自定义数据属性 |
| `hidden` | 隐藏元素 |
| `disabled` | 禁用元素 |

---

## HTML 实体

在 HTML 中，某些字符是**保留字符**，需要使用实体来表示：

| 实体 | 字符 | 说明 |
|------|------|------|
| `&lt;` | < | 小于号 |
| `&gt;` | > | 大于号 |
| `&amp;` | & | 与号 |
| `&quot;` | " | 双引号 |
| `&apos;` | ' | 单引号 |
| `&nbsp;` | (空格) | 不换行空格 |
| `&copy;` | © | 版权符号 |

---

## 学习建议

!!! tip "学习路线"
    1. 掌握基本文档结构和常用标签
    2. 理解块级元素和行内元素的区别
    3. 学会使用语义化标签构建页面
    4. 掌握表单的使用
    5. 结合 CSS 进行页面布局实践

!!! success "实践是最好的老师"
    光看不练是学不会 HTML 的！建议你：
    - 用 HTML 写一个个人的简历页面
    - 模仿一个你喜欢的网站首页
    - 学习使用浏览器的开发者工具（F12）查看网页结构

---

## 参考资源

- [MDN Web Docs - HTML](https://developer.mozilla.org/zh-CN/docs/Web/HTML)
- [W3Schools HTML Tutorial](https://www.w3schools.com/html/)
- [HTML Living Standard](https://html.spec.whatwg.org/)
