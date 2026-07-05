"""AI 文章摘要 — DeepSeek API"""

import os
import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/summary", tags=["AI摘要"])

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1"


@router.post("/")
async def summarize(data: dict):
    """对文章内容生成 AI 摘要"""
    content = data.get("content", "")
    title = data.get("title", "")

    if not content.strip():
        raise HTTPException(status_code=400, detail="文章内容为空")

    if not DEEPSEEK_API_KEY or DEEPSEEK_API_KEY == "sk-your-api-key-here":
        raise HTTPException(status_code=503, detail="DeepSeek API Key 未配置，请在 backend/.env 中设置")

    # 截断过长的内容（DeepSeek 上下文限制）
    max_chars = 8000
    if len(content) > max_chars:
        content = content[:max_chars] + "..."

    prompt = f"""请用中文对以下文章进行简洁的总结概括，要求：

1. 用 2-4 句话概括文章核心内容
2. 列出 3-5 个关键要点（用 bullet points）
3. 总字数控制在 200 字以内

文章标题：{title}

文章内容：
{content}

请直接输出概括结果，不要加"以下是"之类的前缀。"""

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            resp = await client.post(
                f"{DEEPSEEK_BASE_URL}/chat/completions",
                headers={
                    "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "deepseek-chat",
                    "messages": [
                        {"role": "system", "content": "你是一个专业的内容总结助手，擅长用简洁清晰的中文概括文章要点。"},
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.5,
                    "max_tokens": 500,
                },
            )
            resp.raise_for_status()
            result = resp.json()
            summary = result["choices"][0]["message"]["content"]

            return {"summary": summary, "title": title}

        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=502, detail=f"DeepSeek API 错误: {e.response.status_code}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"请求失败: {str(e)}")
