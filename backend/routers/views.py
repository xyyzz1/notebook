"""页面访问统计 + 在线人数（SSE）"""

import asyncio
import datetime
import json
import time
import hashlib
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, Request
from sse_starlette.sse import EventSourceResponse
from database import get_db
from models import PageView
from sqlalchemy import func

router = APIRouter(prefix="/api/stats", tags=["访问统计"])

# 在线用户心跳表（内存）
_online_users: dict[str, float] = {}  # session_id -> last_heartbeat_ts
_cleanup_lock = asyncio.Lock()


def _cleanup_expired():
    """清理超过 60 秒无心跳的用户"""
    now = time.time()
    expired = [sid for sid, ts in _online_users.items() if now - ts > 60]
    for sid in expired:
        del _online_users[sid]


@router.post("/record-view")
def record_view(page_url: str, db: Session = Depends(get_db)):
    """记录一次页面访问"""
    today = datetime.date.today().isoformat()

    record = (
        db.query(PageView)
        .filter(PageView.page_url == page_url, PageView.date == today)
        .first()
    )

    if record:
        record.count += 1
    else:
        record = PageView(page_url=page_url, date=today, count=1)
        db.add(record)

    db.commit()

    # 获取总访问量
    total = (
        db.query(func.sum(PageView.count))
        .filter(PageView.page_url == page_url)
        .scalar()
    ) or 0

    return {
        "page_url": page_url,
        "total_views": total,
        "today_views": record.count,
    }


@router.post("/heartbeat")
def heartbeat(data: dict, db: Session = Depends(get_db)):
    """心跳上报，维持在线状态"""
    sid = data.get("session_id", "")
    if not sid:
        return {"online_count": 0}

    _online_users[sid] = time.time()
    _cleanup_expired()

    return {"online_count": len(_online_users)}


@router.get("/online-stream")
async def online_stream(request: Request, db: Session = Depends(get_db)):
    """SSE 实时推送在线人数"""
    def event_generator():
        while True:
            if await request.is_disconnected():
                break

            _cleanup_expired()
            count = len(_online_users)
            yield {
                "event": "online_count",
                "data": json.dumps({"online_count": count}),
            }
            time.sleep(5)

    return EventSourceResponse(event_generator())
