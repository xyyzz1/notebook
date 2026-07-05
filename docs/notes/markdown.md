---
comments: true
statistics: false
---

# 📄 Markdown 自学笔记

## 什么是 Markdown？

Markdown 是一种**轻量级标记语言**，由 John Gruber 于 2004 年创建。它允许人们使用易读易写的纯文本格式编写文档，然后转换成有效的 HTML 文档。

!!! note "核心理念"
    Markdown 的设计理念是：**易读易写**。

    一份 Markdown 文档在未经渲染的情况下，也应该能够像纯文本一样正常阅读。

---

## 基础语法

### 1. 标题

使用 `#` 号标记标题，支持 1~6 级标题：

```markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
```

!!! tip "最佳实践"
    - `#` 后面建议加一个空格
    - 一级标题通常用于文章标题，一个文档最好只有一个一级标题

### 2. 段落与换行

Markdown 中，段落由一个或多个连续的文本行组成，段落之间用**空行**分隔：

```markdown
这是第一段。

这是第二段。
```

行尾加两个空格可以实现<br>强制换行（不产生新段落）。

### 3. 强调

```markdown
*斜体文本*     或   _斜体文本_
**粗体文本**   或   __粗体文本__
***粗斜体文本*** 或  ___粗斜体文本___
~~删除线文本~~
```

效果演示：

- *斜体文本*
- **粗体文本**
- ***粗斜体文本***
- ~~删除线文本~~

### 4. 列表

#### 无序列表

使用 `-`、`*` 或 `+` 作为列表标记：

```markdown
- 第一项
- 第二项
  - 嵌套子项
  - 另一个嵌套子项
- 第三项
```

#### 有序列表

使用数字加 `.` 号：

```markdown
1. 第一项
2. 第二项
   1. 嵌套子项
   2. 另一个嵌套子项
3. 第三项
```

!!! tip "提示"
    有序列表中的数字不需要按顺序排列，Markdown 会自动纠正。但建议从 `1.` 开始以保持源码可读性。

#### 任务列表

```markdown
- [x] 已完成任务
- [ ] 未完成任务
- [ ] 待办事项
```

### 5. 链接

```markdown
[链接文本](https://example.com)
[带标题的链接](https://example.com "鼠标悬停时显示的标题")
<https://example.com>  <!-- 自动链接 -->
```

参考式链接：

```markdown
[Google][1] 和 [GitHub][2]

[1]: https://google.com
[2]: https://github.com
```

### 6. 图片

```markdown
![替代文本](https://example.com/image.png)
![替代文本](https://example.com/image.png "图片标题")
```

!!! warning "注意"
    图片的语法和链接类似，只是前面多了一个 `!`。

### 7. 代码

#### 行内代码

使用反引号包裹：`` `print("Hello World")` `` → `print("Hello World")`

#### 代码块

使用三个反引号（或三个波浪号），并指定语言：

````markdown
```python
def hello():
    print("Hello, World!")
    return True
```
````

效果：

```python
def hello():
    print("Hello, World!")
    return True
```

!!! tip "代码块支持的语言"
    Markdown 代码块支持非常多的编程语言语法高亮，如：`python`、`javascript`、`html`、`css`、`java`、`cpp`、`bash` 等。

### 8. 引用

```markdown
> 这是一级引用
>> 这是二级嵌套引用
>>> 这是三级嵌套引用
```

效果：

> 这是一级引用
>> 这是二级嵌套引用
>>> 这是三级嵌套引用

!!! note "用途"
    引用通常用于：
    - 引用他人的话或文章
    - 强调重点内容
    - 创建提示框效果

### 9. 分割线

使用三个或更多的 `---`、`***` 或 `___`：

```markdown
---
***
___
```

---

### 10. 表格

```markdown
| 左对齐 | 居中对齐 | 右对齐 |
| :--- | :---: | ---: |
| 内容 | 内容 | 内容 |
| 数据 | 数据 | 数据 |
```

| 左对齐 | 居中对齐 | 右对齐 |
| :--- | :---: | ---: |
| 内容 | 内容 | 内容 |
| 数据 | 数据 | 数据 |

---

## 扩展语法

!!! abstract "说明"
    以下语法属于 Markdown 的扩展语法，并非所有 Markdown 编辑器都支持。MkDocs Material 主题对这些语法有良好的支持。

### 脚注

```markdown
这是一段带脚注的文本[^1]。

[^1]: 这是脚注的内容。
```

### 缩写

```markdown
*[HTML]: Hyper Text Markup Language
```

### 表情符号

```markdown
:smile: :heart: :thumbsup:
```

:smile: :heart: :thumbsup:

### 高亮标记

```markdown
==这是高亮的文本==
```

### 定义列表

```markdown
术语
: 术语的定义说明
```

---

## MkDocs Material 专属扩展

### Admonition（提示框）

```markdown
!!! note "标题"
    这是一个带标题的 note 提示框。

!!! warning
    这是一个不带标题的 warning 提示框。
```

!!! note "标题"
    这是一个带标题的 note 提示框。

!!! warning
    这是一个不带标题的 warning 提示框。

**支持的 Admonition 类型：**

| 类型 | 用途 |
|------|------|
| `note` | 笔记/说明 |
| `info` | 信息 |
| `tip` | 技巧/提示 |
| `success` | 成功 |
| `question` | 问题 |
| `warning` | 警告 |
| `failure` | 失败 |
| `danger` | 危险 |
| `bug` | Bug |
| `example` | 示例 |
| `quote` | 引用 |
| `abstract` | 摘要 |

### 可折叠内容

```markdown
??? info "点击展开"
    这是被隐藏的内容，点击才能看到！
```

### 代码注解

````markdown
```python
def foo(x):  # (1)
    return x * 2  # (2)
```

1. 定义一个名为 `foo` 的函数，接受参数 `x`
2. 返回 `x` 的两倍
````

### Tab 切换

````markdown
=== "Python"
    ```python
    print("Hello")
    ```

=== "JavaScript"
    ```javascript
    console.log("Hello");
    ```
````

---

## 实用技巧

!!! tip "编辑工具推荐"
    | 工具 | 类型 | 特点 |
    |------|------|------|
    | **VS Code** | 编辑器 | 强大的 Markdown 预览和扩展 |
    | **Typora** | 专用编辑器 | 所见即所得，颜值高 |
    | **Obsidian** | 笔记软件 | 双向链接，知识图谱 |
    | **Notion** | 在线协作 | 功能全面，团队友好 |

!!! success "学习建议"
    1. 先从基础语法开始，边学边练
    2. 用 Markdown 写笔记来练习 Markdown（学以致用）
    3. 逐步掌握扩展语法
    4. 找到适合自己工作流的编辑器

---

## 参考资源

- [Markdown 官方指南](https://www.markdownguide.org/)
- [MkDocs Material 文档](https://squidfunk.github.io/mkdocs-material/)
- [GitHub Flavored Markdown Spec](https://github.github.com/gfm/)
