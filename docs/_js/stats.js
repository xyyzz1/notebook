/**
 * a site — 访问统计 + 在线人数
 * 对接后端 /api/stats 接口
 */

(function () {
  'use strict';

  // ====== 配置：后端地址（部署时改为你的阿里云服务器地址）======
  const API_BASE = 'http://localhost:8001';

  function getPageUrl() {
    // 返回相对路径作为页面标识，如 /notes/markdown/
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

  // ====== 记录页面访问 ======
  async function recordView() {
    try {
      const res = await fetch(`${API_BASE}/api/stats/record-view?page_url=${encodeURIComponent(getPageUrl())}`, {
        method: 'POST',
      });
      const data = await res.json();
      updateViewCounter(data);
    } catch {
      // 后端不可用时静默失败
    }
  }

  function updateViewCounter(data) {
    let el = document.getElementById('_asite_views');
    if (!el) {
      el = document.createElement('span');
      el.id = '_asite_views';
      el.style.cssText = 'font-size:13px;color:var(--md-default-fg-color--light);margin-left:12px;';
      // 插入到页面标题下方
      const title = document.querySelector('h1');
      if (title) {
        title.parentNode.insertBefore(el, title.nextSibling);
      }
    }
    el.textContent = `👁 ${data.total_views} 次阅读 · 今日 ${data.today_views}`;
  }

  // ====== 在线人数 SSE ======
  let onlineEl = null;

  function startOnlineListener() {
    const evtSource = new EventSource(`${API_BASE}/api/stats/online-stream`);

    evtSource.addEventListener('online_count', (e) => {
      const data = JSON.parse(e.data);
      updateOnlineCounter(data.online_count);
    });

    evtSource.onerror = () => {
      // SSE 连接失败，可能后端未启动
    };
  }

  function updateOnlineCounter(count) {
    if (!onlineEl) {
      onlineEl = document.createElement('span');
      onlineEl.id = '_asite_online';
      onlineEl.style.cssText = 'font-size:13px;color:var(--md-default-fg-color--light);margin-left:8px;';

      const viewsEl = document.getElementById('_asite_views');
      if (viewsEl) {
        viewsEl.parentNode.insertBefore(onlineEl, viewsEl.nextSibling);
      } else {
        const title = document.querySelector('h1');
        if (title) title.parentNode.insertBefore(onlineEl, title.nextSibling);
      }
    }
    onlineEl.textContent = `· 🟢 ${count} 人在线`;
  }

  // ====== 心跳 ======
  function startHeartbeat() {
    setInterval(async () => {
      try {
        await fetch(`${API_BASE}/api/stats/heartbeat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: getSessionId() }),
        });
      } catch {}
    }, 30000);
  }

  // ====== 启动 ======
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
