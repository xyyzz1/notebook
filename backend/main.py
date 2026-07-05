"""FastAPI 主入口"""

import os
from dotenv import load_dotenv

# 加载 .env — 必须在导入 routers 之前，因为 summary.py 模块级会读取环境变量
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import views, likes, comments, summary

# 创建所有表
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="a site API",
    description="个人笔记网站后端 — 访问统计 / 点赞排行 / 划线评论 / 在线人数 / AI摘要",
    version="1.0.0",
)

# CORS — 允许前端跨域访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "https://xyyzz1.github.io",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(views.router)
app.include_router(likes.router)
app.include_router(comments.router)
app.include_router(summary.router)


@app.get("/api/health")
def health():
    key_configured = bool(os.getenv("DEEPSEEK_API_KEY") and os.getenv("DEEPSEEK_API_KEY") != "sk-your-api-key-here")
    return {
        "status": "ok",
        "service": "a-site-api",
        "deepseek_configured": key_configured,
    }
