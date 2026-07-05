---
comments: true
statistics: false
---

# 🔧 Git 自学笔记

## 什么是 Git？

Git 是一个**分布式版本控制系统**，由 Linus Torvalds 于 2005 年创建。它可以记录文件的变更历史，方便多人协作开发，是现代软件开发中不可或缺的工具。

!!! note "核心理念"
    Git 的核心理念是：**快照，而非差异**。

    每次提交（commit），Git 都会保存整个项目的完整快照，而不是只记录文件之间的差异。这让分支、合并等操作变得非常高效。

---

## Git 工作流程

### 三个区域

Git 有三个核心区域：

```text
工作目录 (Working Directory)
    ↓ git add
暂存区 (Staging Area / Index)
    ↓ git commit
本地仓库 (Local Repository)
    ↓ git push
远程仓库 (Remote Repository)
```

### 文件状态

| 状态 | 说明 |
|------|------|
| Untracked | 新文件，未被 Git 追踪 |
| Modified | 已追踪的文件被修改 |
| Staged | 修改已添加到暂存区 |
| Committed | 已提交到本地仓库 |

使用 `git status` 查看当前文件状态。

---

## 基础命令

### 1. 初始化与克隆

```bash
# 在当前目录初始化一个 Git 仓库
git init

# 克隆远程仓库到本地
git clone https://github.com/user/repo.git

# 克隆指定分支
git clone -b branch-name https://github.com/user/repo.git
```

### 2. 查看状态与历史

```bash
# 查看工作区状态
git status

# 查看提交历史
git log

# 简洁的单行历史
git log --oneline

# 图形化分支历史
git log --oneline --graph --all

# 查看某次提交的详细信息
git show <commit-hash>

# 查看文件变更差异
git diff
git diff --staged  # 查看已暂存的差异
```

!!! tip "实用别名"
    可以在 `~/.gitconfig` 中设置别名，提升效率：
    ```ini
    [alias]
      lg = log --oneline --graph --all
      st = status
      co = checkout
      br = branch
      ci = commit
    ```

### 3. 添加与提交

```bash
# 添加指定文件到暂存区
git add file.txt

# 添加所有修改的文件
git add .

# 交互式添加（选择性地暂存部分修改）
git add -p

# 提交暂存区内容
git commit -m "commit message"

# 提交所有已追踪文件的修改（跳过 git add）
git commit -am "commit message"

# 修改最近一次提交
git commit --amend
```

!!! warning "注意"
    `git commit --amend` 会修改提交历史，**不要**对已推送到远程的提交使用该命令。

### 4. 分支操作

```bash
# 查看所有分支
git branch

# 创建新分支
git branch feature-login

# 切换分支
git checkout feature-login
# 或使用较新命令
git switch feature-login

# 创建并切换到新分支
git checkout -b feature-login
# 或
git switch -c feature-login

# 删除分支
git branch -d feature-login

# 强制删除未合并的分支
git branch -D feature-login
```

### 5. 合并与变基

```bash
# 将指定分支合并到当前分支
git merge feature-login

# 将当前分支变基到指定分支
git rebase main
```

!!! note "merge vs rebase"
    | | merge | rebase |
    |------|-------|--------|
    | 原理 | 创建一个新的合并提交 | 将提交"移植"到目标分支上 |
    | 历史 | 保留完整的分支历史 | 产生线性的提交历史 |
    | 适用 | 公共分支合并 | 个人分支整理 |
    | 风险 | 低 | 可能产生冲突需要逐个解决 |

---

## 远程操作

### 添加与查看远程仓库

```bash
# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin https://github.com/user/repo.git

# 修改远程仓库地址
git remote set-url origin https://github.com/user/new-repo.git
```

### 推送与拉取

```bash
# 推送当前分支到远程
git push origin main

# 首次推送并设置上游分支
git push -u origin main

# 拉取远程更新并合并
git pull

# 拉取远程更新但不自动合并
git fetch

# 查看远程分支
git branch -r
```

!!! tip "pull vs fetch"
    `git pull` = `git fetch` + `git merge`
    
    建议先用 `git fetch` 查看远程更新，再决定是否合并。

---

## 撤销操作

```bash
# 撤销工作区修改（恢复为最近一次提交的状态）
git checkout -- file.txt
# 或
git restore file.txt

# 取消暂存（从暂存区移出）
git reset HEAD file.txt
# 或
git restore --staged file.txt

# 撤销最近一次提交（保留修改）
git reset --soft HEAD~1

# 撤销最近一次提交（丢弃修改）
git reset --hard HEAD~1

# 创建一个新提交来撤销之前的提交（安全，不改变历史）
git revert <commit-hash>
```

!!! danger "危险操作"
    `git reset --hard` 会**永久删除**未提交的修改，使用前务必确认！

---

## 储藏（Stash）

```bash
# 暂存当前工作进度
git stash

# 带说明的暂存
git stash save "WIP: working on login feature"

# 查看储藏列表
git stash list

# 恢复最近一次储藏（保留 stash）
git stash apply

# 恢复最近一次储藏（删除 stash）
git stash pop

# 恢复指定储藏
git stash apply stash@{2}

# 删除指定储藏
git stash drop stash@{1}
```

!!! tip "适用场景"
    当你在一个分支上工作到一半，需要切换到另一个分支处理紧急问题时，可以用 `git stash` 暂存进度。

---

## 标签（Tag）

```bash
# 创建轻量标签
git tag v1.0.0

# 创建附注标签
git tag -a v1.0.0 -m "version 1.0.0"

# 查看标签列表
git tag

# 推送标签到远程
git push origin v1.0.0

# 推送所有标签
git push origin --tags
```

---

## .gitignore

在项目根目录创建 `.gitignore` 文件，指定不需要追踪的文件：

```gitignore
# 依赖目录
node_modules/
__pycache__/

# 环境变量文件
.env
.env.local

# 构建产物
dist/
build/
*.pyc

# IDE 配置
.vscode/
.idea/

# 系统文件
.DS_Store
Thumbs.db
```

---

## 常用工作流

### Git Flow

```text
main        ●──────●──────────●──────
            │      │          │
develop     ●──────●────●─────●──────
            │      │    │
feature/    ●──────●    │
                        │
release/                ●────●
```

- **main**：生产环境分支
- **develop**：开发分支
- **feature/**：功能开发分支
- **release/**：发布准备分支
- **hotfix/**：紧急修复分支

### GitHub Flow（简化版）

1. 从 `main` 创建功能分支
2. 在功能分支上开发和提交
3. 提交 Pull Request
4. 代码审查
5. 合并到 `main`
6. 部署

---

## 冲突解决

当两个分支修改了同一文件的同一部分，合并时会产生冲突：

```text
<<<<<<< HEAD
当前分支的修改
=======
合并进来的分支的修改
>>>>>>> feature-branch
```

解决步骤：

1. 运行 `git status` 查看冲突文件
2. 打开冲突文件，找到 `<<<<<<<` / `=======` / `>>>>>>>` 标记
3. 选择保留的内容，删除标记
4. `git add` 标记为已解决
5. `git commit` 完成合并

!!! tip "减少冲突的策略"
    - 频繁拉取远程更新
    - 保持分支的生命周期尽可能短
    - 小步提交，及时合并
    - 团队成员之间保持沟通

---

## 实践建议

!!! success "最佳实践"
    1. **提交信息要有意义** — 说清楚做了什么，为什么这样做
    2. **一次提交只做一件事** — 便于回顾和回滚
    3. **分支命名规范** — 如 `feature/xxx`、`fix/xxx`、`docs/xxx`
    4. **提交前先 diff** — `git diff --staged` 确认要提交的内容
    5. **不要提交敏感信息** — 使用 `.gitignore` 和 `.env` 管理
    6. **频繁推送** — 防止本地代码丢失

### 提交信息模板

```text
<type>: <subject>

<body>

<footer>
```

常用 type：

| type | 用途 |
|------|------|
| feat | 新功能 |
| fix | 修复 Bug |
| docs | 文档变更 |
| style | 代码格式（不影响功能） |
| refactor | 重构 |
| test | 添加测试 |
| chore | 构建/工具变更 |

---

## 参考资源

- [Pro Git（中文版）](https://git-scm.com/book/zh/v2)
- [Git 官方文档](https://git-scm.com/docs)
- [Learn Git Branching](https://learngitbranching.js.org/) — 交互式 Git 学习工具
- [GitHub Docs](https://docs.github.com/zh)
- [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)
