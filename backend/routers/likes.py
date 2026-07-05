"""点赞 + 热度排行"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Like

router = APIRouter(prefix="/api/likes", tags=["点赞"])


@router.post("/toggle")
def toggle_like(data: dict, db: Session = Depends(get_db)):
    """切换点赞状态（点赞 / 取消点赞）"""
    page_url = data.get("page_url", "")
    user_id = data.get("user_id", "")

    if not page_url or not user_id:
        return {"liked": False, "total_likes": 0}

    existing = (
        db.query(Like)
        .filter(Like.page_url == page_url, Like.user_id == user_id)
        .first()
    )

    if existing:
        db.delete(existing)
        db.commit()
        liked = False
    else:
        like = Like(page_url=page_url, user_id=user_id)
        db.add(like)
        db.commit()
        liked = True

    total = (
        db.query(func.count(Like.id))
        .filter(Like.page_url == page_url)
        .scalar()
    ) or 0

    return {"liked": liked, "total_likes": total}


@router.get("/status")
def get_like_status(page_url: str, user_id: str, db: Session = Depends(get_db)):
    """获取某用户对某页面的点赞状态"""
    liked = (
        db.query(Like)
        .filter(Like.page_url == page_url, Like.user_id == user_id)
        .first()
        is not None
    )

    total = (
        db.query(func.count(Like.id))
        .filter(Like.page_url == page_url)
        .scalar()
    ) or 0

    return {"liked": liked, "total_likes": total}


@router.get("/count")
def get_like_count(page_url: str, db: Session = Depends(get_db)):
    """获取某页面的点赞总数"""
    total = (
        db.query(func.count(Like.id))
        .filter(Like.page_url == page_url)
        .scalar()
    ) or 0

    return {"page_url": page_url, "total_likes": total}


@router.get("/ranking")
def get_ranking(db: Session = Depends(get_db)):
    """获取点赞排行（全部页面按点赞数降序）"""
    results = (
        db.query(Like.page_url, func.count(Like.id).label("cnt"))
        .group_by(Like.page_url)
        .order_by(func.count(Like.id).desc())
        .limit(20)
        .all()
    )

    return [
        {"page_url": row.page_url, "likes": row.cnt}
        for row in results
    ]
