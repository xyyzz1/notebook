"""Pydantic 请求/响应模型"""

from datetime import datetime
from pydantic import BaseModel, Field


# ===== 页面访问 =====

class PageViewOut(BaseModel):
    page_url: str
    total_views: int
    today_views: int

    model_config = {"from_attributes": True}


class HeartbeatIn(BaseModel):
    session_id: str
    page_url: str


class OnlineCountOut(BaseModel):
    online_count: int


# ===== 点赞 =====

class LikeIn(BaseModel):
    page_url: str
    user_id: str


class LikeOut(BaseModel):
    liked: bool
    total_likes: int


class RankingItem(BaseModel):
    page_url: str
    title: str
    likes: int


# ===== 划线评论 =====

class InlineCommentIn(BaseModel):
    page_url: str
    anchor_selector: str
    start_offset: int
    end_offset: int
    selected_text: str
    comment_text: str = Field(max_length=1000)
    user_name: str = Field(default="Anonymous", max_length=64)
    user_id: str


class InlineCommentOut(BaseModel):
    id: int
    page_url: str
    anchor_selector: str
    start_offset: int
    end_offset: int
    selected_text: str
    comment_text: str
    user_name: str
    user_id: str
    created_at: datetime
    like_count: int

    model_config = {"from_attributes": True}
