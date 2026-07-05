/**
 * a site — 点赞功能
 * 只在笔记详情页显示（非首页、关于页、目录页）
 */

(function () {
  'use strict';

  const API_BASE = 'http://47.99.61.217:8001';

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

  function isNotePage() {
    const path = getPageUrl();
    // 排除封面、关于、目录页
    if (path === '' || path === '/' || path === '/notebook' || path === '/notebook/') return false;
    if (path.endsWith('/about') || path.endsWith('/about/')) return false;
    if (path === '/notes' || path === '/notes/' || path === '/notebook/notes' || path === '/notebook/notes/') return false;
    return true;
  }

  async function init() {
    if (!isNotePage()) return;

    // 等待 stats.js 创建 _asite_stats_bar
    await waitForStatsBar();

    const btn = createLikeButton();
    const bar = document.getElementById('_asite_stats_bar');
    if (bar) {
      const sep = document.createElement('span');
      sep.textContent = ' · ';
      sep.style.cssText = 'color:var(--md-default-fg-color--lighter);font-size:13px;';
      bar.appendChild(sep);
      bar.appendChild(btn);
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

  function waitForStatsBar() {
    return new Promise((resolve) => {
      if (document.getElementById('_asite_stats_bar')) {
        resolve();
        return;
      }
      const observer = new MutationObserver(() => {
        if (document.getElementById('_asite_stats_bar')) {
          observer.disconnect();
          resolve();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      // 最多等 3 秒
      setTimeout(() => { observer.disconnect(); resolve(); }, 3000);
    });
  }

  function createLikeButton() {
    const wrapper = document.createElement('span');
    wrapper.id = '_asite_like_wrapper';
    wrapper.style.cssText = 'font-size:13px;';

    const btn = document.createElement('button');
    btn.id = '_asite_like_btn';
    btn.style.cssText = `
      background: none; border: none; cursor: pointer;
      color: var(--md-default-fg-color--light); font-size: 13px;
      font-family: inherit; padding: 0; transition: color 0.2s;
    `;
    btn.innerHTML = '🤍 <span id="_asite_like_count">0</span> 赞';

    btn.addEventListener('mouseenter', () => { btn.style.color = '#e65100'; });
    btn.addEventListener('mouseleave', () => {
      const liked = btn.dataset.liked === '1';
      btn.style.color = liked ? '#e65100' : 'var(--md-default-fg-color--light)';
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
      } catch {}
    });

    wrapper.appendChild(btn);
    return wrapper;
  }

  function updateButton(data) {
    const btn = document.getElementById('_asite_like_btn');
    const count = document.getElementById('_asite_like_count');
    if (!btn || !count) return;

    count.textContent = data.total_likes;
    btn.dataset.liked = data.liked ? '1' : '0';

    if (data.liked) {
      btn.innerHTML = `❤️ <span id="_asite_like_count">${data.total_likes}</span> 赞`;
      btn.style.color = '#e65100';
    } else {
      btn.innerHTML = `🤍 <span id="_asite_like_count">${data.total_likes}</span> 赞`;
      btn.style.color = 'var(--md-default-fg-color--light)';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
