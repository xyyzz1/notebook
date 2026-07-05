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
- [x] 引用评论
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

---

## 2026-07-05 引用评论

### 创建的文件

| 文件 | 说明 |
|------|------|
| `docs/_js/quote-comment.js` | 引用评论功能 |

### 修改的文件

| 文件 | 变更 |
|------|------|
| `mkdocs.yml` | 添加 quote-comment.js 引用 |

### 功能

- 选中任意正文文字后，上方弹出 "💬 引用" 按钮
- 点击将选中文字格式化为 Markdown 引用格式并复制到剪贴板
- 自动滚动到评论区，Toast 提示用户粘贴

### 执行的命令

```bash
mkdocs build
git add docs/_js/quote-comment.js mkdocs.yml
git commit -m "Add quote comment feature: select text to quote in comments"
git push
```

---

## 2026-07-05 FastAPI 后端 + 前后端对接

### 创建的文件

**后端 (`backend/`)**

| 文件 | 说明 |
|------|------|
| `backend/main.py` | FastAPI 主入口，CORS 配置，注册路由 |
| `backend/database.py` | SQLAlchemy 引擎 + SQLite 数据库 |
| `backend/models.py` | 数据模型：PageView, Like, InlineComment |
| `backend/schemas.py` | Pydantic 请求/响应 Schema |
| `backend/requirements.txt` | FastAPI, uvicorn, SQLAlchemy, sse-starlette |
| `backend/routers/views.py` | 访问统计 API + SSE 在线人数推送 |
| `backend/routers/likes.py` | 点赞切换 + 点赞状态 + 热度排行 |
| `backend/routers/comments.py` | 划线评论 CRUD |

**前端对接 (`docs/_js/`, `docs/_css/`)**

| 文件 | 说明 |
|------|------|
| `docs/_js/stats.js` | 页面访问记录 + SSE 在线人数显示 |
| `docs/_js/likes.js` | 点赞按钮 + 状态同步 |
| `docs/_js/inline-comments.js` | 划线评论选中/提交/渲染/显示 |
| `docs/_css/inline-comments.css` | 划线高亮 + Popover + 面板样式 |

### 修改的文件

| 文件 | 变更 |
|------|------|
| `mkdocs.yml` | 添加 stats.js, likes.js, inline-comments.js, inline-comments.css |

### 技术栈

- **后端**: FastAPI + SQLAlchemy + SQLite
- **实时**: SSE (Server-Sent Events) 推送在线人数
- **部署**: 阿里云 ECS + uvicorn

### 数据库表

| 表名 | 用途 |
|------|------|
| `page_views` | 页面访问量（按日累计） |
| `likes` | 点赞记录（用户+页面唯一约束） |
| `inline_comments` | 划线评论（锚点+偏移量定位） |

### API 端点总览

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/stats/record-view` | 记录页面访问 |
| POST | `/api/stats/heartbeat` | 在线心跳 |
| GET | `/api/stats/online-stream` | SSE 在线人数 |
| POST | `/api/likes/toggle` | 切换点赞 |
| GET | `/api/likes/status` | 点赞状态 |
| GET | `/api/likes/ranking` | 热度排行 |
| POST | `/api/comments/` | 创建划线评论 |
| GET | `/api/comments/` | 获取页面划线评论 |
| DELETE | `/api/comments/{id}` | 删除划线评论 |
| GET | `/api/health` | 健康检查 |

### 后端启动命令

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 执行的命令

```bash
mkdir -p backend/routers
mkdocs build
git add backend/ docs/_js/stats.js docs/_js/likes.js docs/_js/inline-comments.js docs/_css/inline-comments.css mkdocs.yml
git commit -m "Add FastAPI backend (views/likes/comments) and frontend integration"
git push
```

### Git 提交记录

```
e1f0d96 Add FastAPI backend (views/likes/comments) and frontend integration
83e10e2 Update changelog with quote comment feature
3414e75 Add quote comment feature: select text to quote in comments
435eff4 Update changelog with mascot feature
7c73a54 Add 2D mascot character with eye tracking and speech bubbles
90efed5 Switch giscus category to General
3b68df0 Update giscus config with real repo and category IDs
d691d79 Add reference_notebook to .gitignore
464c0dd Remove reference_notebook from tracking
cac29d7 Initial commit: a site MkDocs notebook
```
