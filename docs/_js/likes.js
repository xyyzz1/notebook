/**
 * a site — 点赞功能
 * 对接后端 /api/likes 接口
 */

(function () {
  'use strict';

  const API_BASE = 'http://localhost:8000';

  function getPageUrl() {
    return window.location.pathname.replace(/\/$/, '') || '/';
  }

  function getUserId() {
    let uid = localStorage.getItem('_asite_uid');
    if (!uid) {
      uid = 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      localStorage.setItem('_asite_uid', uid);
    }
    return uid;
  }

  function createLikeButton() {
    const btn = document.createElement('button');
    btn.id = '_asite_like_btn';
    btn.style.cssText = `
      display: inline-flex; align-items: center; gap: 6px;
      background: none; border: 1.5px solid #e65100; border-radius: 20px;
      padding: 6px 18px; font-size: 14px; cursor: pointer;
      color: #e65100; font-family: inherit; transition: all 0.2s;
    `;
    btn.innerHTML = '🤍 点赞 <span id="_asite_like_count">0</span>';

    btn.addEventListener('mouseenter', () => {
      btn.style.background = '#fff3e0';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'none';
    });

    btn.addEventListener('click', async () => {
      try {
        const res = await fetch(`${API_BASE}/api/likes/toggle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page_url: getPageUrl(), user_id: getUserId() }),
        });
        const data = await res.json();
        updateButton(data);
      } catch {
        // fail silently
      }
    });

    return btn;
  }

  function updateButton(data) {
    const btn = document.getElementById('_asite_like_btn');
    const count = document.getElementById('_asite_like_count');
    if (!btn || !count) return;

    count.textContent = data.total_likes;
    btn.innerHTML = data.liked
      ? `❤️ 已赞 <span id="_asite_like_count">${data.total_likes}</span>`
      : `🤍 点赞 <span id="_asite_like_count">${data.total_likes}</span>`;
  }

  // 初始化
  async function init() {
    // 插入点赞按钮到标题下方
    const title = document.querySelector('h1');
    if (!title) return;

    const btn = createLikeButton();
    // 放到阅读次数旁边
    const viewsEl = document.getElementById('_asite_views');
    if (viewsEl) {
      viewsEl.parentNode.insertBefore(btn, viewsEl.nextSibling);
      // 加个分隔
      const sep = document.createElement('span');
      sep.textContent = ' ';
      viewsEl.parentNode.insertBefore(sep, btn);
    } else {
      title.parentNode.insertBefore(btn, title.nextSibling);
    }

    // 获取点赞状态
    try {
      const res = await fetch(
        `${API_BASE}/api/likes/status?page_url=${encodeURIComponent(getPageUrl())}&user_id=${getUserId()}`
      );
      const data = await res.json();
      updateButton(data);
    } catch {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
