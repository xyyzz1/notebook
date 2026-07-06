/**
 * a site — 访问统计 + 在线人数
 * 创建统一 stats bar，点赞按钮通过 likes.js 追加
 */

(function () {
  'use strict';

  const API_BASE = 'https://asite.abrdns.com:8443';

  function getPageUrl() {
    return window.location.pathname.replace(/\/$/, '') || '/';
  }

  function getSessionId() {
    let sid = localStorage.getItem('_asite_sid');
    if (!sid) {
      sid = 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      localStorage.setItem('_asite_sid', sid);
    }
    return sid;
  }

  // 创建统一 stats bar（放在 h1 下方）
  function ensureStatsBar() {
    let bar = document.getElementById('_asite_stats_bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = '_asite_stats_bar';
      bar.style.cssText = `
        display: flex; align-items: center; gap: 2px; flex-wrap: wrap;
        font-size: 13px; color: var(--md-default-fg-color--light);
        margin-bottom: 16px; padding-bottom: 8px;
        border-bottom: 1px solid var(--md-default-fg-color--lightest);
      `;
      const title = document.querySelector('h1');
      if (title && title.nextSibling) {
        title.parentNode.insertBefore(bar, title.nextSibling);
      } else if (title) {
        title.parentNode.appendChild(bar);
      }
    }
    return bar;
  }

  async function recordView() {
    try {
      const res = await fetch(`${API_BASE}/api/stats/record-view?page_url=${encodeURIComponent(getPageUrl())}`, {
        method: 'POST',
      });
      const data = await res.json();
      updateViewCounter(data);
    } catch {}
  }

  function updateViewCounter(data) {
    const bar = ensureStatsBar();
    let el = document.getElementById('_asite_views');
    if (!el) {
      el = document.createElement('span');
      el.id = '_asite_views';
      bar.appendChild(el);
    }
    el.textContent = `👁 ${data.total_views} 次阅读 · 今日 ${data.today_views}`;
  }

  // ====== 在线人数 SSE ======
  function startOnlineListener() {
    try {
      const evtSource = new EventSource(`${API_BASE}/api/stats/online-stream`);
      evtSource.addEventListener('online_count', (e) => {
        const data = JSON.parse(e.data);
        updateOnlineCounter(data.online_count);
      });
      evtSource.onerror = () => {};
    } catch {}
  }

  function updateOnlineCounter(count) {
    const bar = ensureStatsBar();
    let el = document.getElementById('_asite_online');
    if (!el) {
      const sep = document.createElement('span');
      sep.textContent = ' · ';
      bar.appendChild(sep);

      el = document.createElement('span');
      el.id = '_asite_online';
      bar.appendChild(el);
    }
    el.textContent = `🟢 ${count} 在线`;
  }

  // ====== 心跳 ======
  function sendHeartbeat() {
    fetch(`${API_BASE}/api/stats/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: getSessionId() }),
    }).catch(() => {});
  }

  function startHeartbeat() {
    sendHeartbeat(); // 立即发送第一次心跳
    setInterval(sendHeartbeat, 30000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      recordView();
      startOnlineListener();
      startHeartbeat();
    });
  } else {
    recordView();
    startOnlineListener();
    startHeartbeat();
  }
})();
