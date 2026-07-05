# a site — 开发日志

## 2026-07-05 初始搭建

### 创建的文件

| 文件 | 说明 |
|------|------|
| `mkdocs.yml` | MkDocs 配置文件（Material 主题，暖色调配色，霞鹜文楷字体） |
| `docs/index.md` | 封面页 |
| `docs/about.md` | 个人介绍页 |
| `docs/notes/index.md` | 笔记目录页 |
| `docs/notes/markdown.md` | Markdown 自学笔记 |
| `docs/notes/html.md` | HTML 自学笔记 |
| `docs/notes/css.md` | CSS 自学笔记 |
| `docs/_css/extra.css` | 自定义样式（复古暖色调配色方案） |
| `docs/_js/extra.js` | 自定义脚本 |
| `overrides/partials/comments.html` | giscus 评论区模板 |
| `requirements.txt` | Python 依赖 |
| `.github/workflows/deploy.yml` | GitHub Actions 自动部署到 GitHub Pages |
| `.gitignore` | Git 忽略规则 |

### 参考来源

- 克隆并参考了 `https://github.com/IsshikiHugh/notebook.git` 的 MkDocs 配置和样式

### 执行的命令

```bash
# 克隆参考仓库
git clone https://github.com/IsshikiHugh/notebook.git reference_notebook

# 创建目录结构
mkdir -p docs/notes docs/_css docs/_js docs/_assets overrides/partials .github/workflows

# 安装依赖
pip install -r requirements.txt

# 本地构建测试
mkdocs build

# 初始化 Git 并提交
git init
git add -A
git commit -m "Initial commit: a site MkDocs notebook"

# 移除误添加的 reference_notebook（submodule 问题）
git rm --cached reference_notebook
git commit -m "Remove reference_notebook from tracking"
echo "reference_notebook/" >> .gitignore
git add .gitignore && git commit -m "Add reference_notebook to .gitignore"
```

### giscus 评论区配置

- 仓库: `xyyzz1/notebook`
- repo-id: `R_kgDOTN5_fg`
- category: `General`（后改为 `General`）
- category-id: `DIC_kwDOTN5_fs4DAhD5`
- 状态: 配置已更新但评论功能仍有 "Unable to create discussion" 错误，待排查

### Git 提交记录

```
90efed5 Switch giscus category to General
3b68df0 Update giscus config with real repo and category IDs
d691d79 Add reference_notebook to .gitignore
464c0dd Remove reference_notebook from tracking
cac29d7 Initial commit: a site MkDocs notebook
```

---

## 待实现功能

- [ ] 划线评论
- [ ] 引用评论
- [x] 2D 前端小人
- [ ] 博客热度排行（需后端）
- [ ] 访问次数统计与在线阅读人数统计（需后端）

---

## 2026-07-05 2D 前端小人

### 创建的文件

| 文件 | 说明 |
|------|------|
| `docs/_css/mascot.css` | 看板娘样式（CSS 绘制角色，浮动动画，响应式） |
| `docs/_js/mascot.js` | 看板娘交互（眼球追踪鼠标、点击切换对话、显示/隐藏） |

### 修改的文件

| 文件 | 变更 |
|------|------|
| `mkdocs.yml` | 添加 mascot.css 和 mascot.js 引用 |

### 功能

- 页面右下角常驻卡通看板娘
- 眼球跟随鼠标移动
- 点击切换 10 句随机对话
- 悬停显示关闭按钮，可切换显示/隐藏状态
- 移动端自动缩小适配

### 执行的命令

```bash
# 本地构建验证
mkdocs build

# 提交
git add docs/_css/mascot.css docs/_js/mascot.js mkdocs.yml
git commit -m "Add 2D mascot character with eye tracking and speech bubbles"
git push
```

### Git 提交记录

```
7c73a54 Add 2D mascot character with eye tracking and speech bubbles
90efed5 Switch giscus category to General
3b68df0 Update giscus config with real repo and category IDs
d691d79 Add reference_notebook to .gitignore
464c0dd Remove reference_notebook from tracking
cac29d7 Initial commit: a site MkDocs notebook
```
