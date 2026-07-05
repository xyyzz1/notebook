"""SQLAlchemy 数据模型"""

import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Index, UniqueConstraint
from database import Base


class PageView(Base):
    """页面访问量"""
    __tablename__ = "page_views"

    id = Column(Integer, primary_key=True, autoincrement=True)
    page_url = Column(String(512), nullable=False, index=True)
    date = Column(String(10), nullable=False)  # YYYY-MM-DD
    count = Column(Integer, nullable=False, default=0)

    __table_args__ = (
        UniqueConstraint("page_url", "date", name="uq_page_url_date"),
    )


class Like(Base):
    """点赞记录"""
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    page_url = Column(String(512), nullable=False, index=True)
    user_id = Column(String(128), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("page_url", "user_id", name="uq_page_url_user"),
    )


class InlineComment(Base):
    """划线评论"""
    __tablename__ = "inline_comments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    page_url = Column(String(512), nullable=False, index=True)
    anchor_selector = Column(String(256), nullable=False)
    start_offset = Column(Integer, nullable=False)
    end_offset = Column(Integer, nullable=False)
    selected_text = Column(Text, nullable=False)
    comment_text = Column(Text, nullable=False)
    user_name = Column(String(128), nullable=False, default="Anonymous")
    user_id = Column(String(128), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    like_count = Column(Integer, nullable=False, default=0)

    __table_args__ = (
        Index("idx_page_anchor", "page_url", "anchor_selector"),
    )
