"""划线评论"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import InlineComment
from schemas import InlineCommentIn, InlineCommentOut

router = APIRouter(prefix="/api/comments", tags=["划线评论"])


@router.post("/", response_model=InlineCommentOut)
def create_comment(data: InlineCommentIn, db: Session = Depends(get_db)):
    """创建一条划线评论"""
    if len(data.comment_text.strip()) < 1:
        raise HTTPException(status_code=400, detail="评论内容不能为空")

    comment = InlineComment(
        page_url=data.page_url,
        anchor_selector=data.anchor_selector,
        start_offset=data.start_offset,
        end_offset=data.end_offset,
        selected_text=data.selected_text,
        comment_text=data.comment_text.strip(),
        user_name=data.user_name.strip() or "Anonymous",
        user_id=data.user_id,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


@router.get("/")
def list_comments(page_url: str, db: Session = Depends(get_db)):
    """获取某页面的所有划线评论"""
    comments = (
        db.query(InlineComment)
        .filter(InlineComment.page_url == page_url)
        .order_by(InlineComment.created_at.desc())
        .all()
    )
    return comments


@router.delete("/{comment_id}")
def delete_comment(comment_id: int, user_id: str, db: Session = Depends(get_db)):
    """删除自己的划线评论"""
    comment = db.query(InlineComment).filter(InlineComment.id == comment_id).first()

    if not comment:
        raise HTTPException(status_code=404, detail="评论不存在")

    if comment.user_id != user_id:
        raise HTTPException(status_code=403, detail="只能删除自己的评论")

    db.delete(comment)
    db.commit()
    return {"ok": True}
