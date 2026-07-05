/**
 * a site — 每日新闻
 * 前端直调 free RSS-to-JSON API，无需后端
 * 数据源: RSS feeds → api.rss2json.com 转换
 */

(function () {
  'use strict';

  // ====== 新闻源配置（RSS 地址） ======
  const NEWS_SOURCES = [
    {
      name: '36氪',
      rss: 'https://36kr.com/feed',
      icon: '📰',
    },
    {
      name: '少数派',
      rss: 'https://sspai.com/feed',
      icon: '📱',
    },
    {
      name: 'InfoQ',
      rss: 'https://www.infoq.cn/feed',
      icon: '💡',
    },
  ];

  function isHomePage() {
    const path = window.location.pathname.replace(/\/$/, '');
    return path === '' || path === '/' || path === '/notebook';
  }

  function createNewsSection() {
    // 只在首页显示
    if (!isHomePage()) return;

    const container = document.querySelector('article.md-content__inner');
    if (!container) return;

    const section = document.createElement('div');
    section.id = '_asite_news';
    section.innerHTML = `
      <hr>
      <h2>📡 今日快讯</h2>
      <div id="_asite_news_list" style="font-size:14px;line-height:2;">
        <p style="color:#999;">加载中...</p>
      </div>
      <p style="font-size:11px;color:#aaa;margin-top:8px;">
        数据来源：36氪 / 少数派 / 知乎每日精选  ·  每小时更新
      </p>
    `;

    container.appendChild(section);
    fetchNews();
  }

  async function fetchNews() {
    const list = document.getElementById('_asite_news_list');
    if (!list) return;

    let allItems = [];

    for (const source of NEWS_SOURCES) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const res = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.rss)}`,
          { signal: controller.signal }
        );
        clearTimeout(timeout);
        if (!res.ok) continue;
        const data = await res.json();
        if (data.items) {
          data.items.slice(0, 5).forEach(item => {
            allItems.push({
              title: item.title,
              link: item.link,
              source: source.name,
              icon: source.icon,
              pubDate: new Date(item.pubDate),
            });
          });
        }
      } catch {
        // 某个源失败，跳过
      }
    }

    // 按时间排序，取最新 15 条
    allItems.sort((a, b) => b.pubDate - a.pubDate);
    allItems = allItems.slice(0, 15);

    if (allItems.length === 0) {
      list.innerHTML = '<p style="color:#999;">今日快讯暂不可用，请稍后再试。</p>';
      return;
    }

    const today = new Date();
    list.innerHTML = allItems
      .map(item => {
        const timeStr = formatTime(item.pubDate);
        return `<div style="margin-bottom:4px;">
          ${item.icon} <a href="${item.link}" target="_blank" rel="noopener" style="color:var(--md-accent-fg-color--light);">${escapeHtml(item.title)}</a>
          <span style="color:#aaa;font-size:11px;">— ${item.source} ${timeStr}</span>
        </div>`;
      })
      .join('');
  }

  function formatTime(date) {
    if (!date || isNaN(date.getTime())) return '';
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    return `${days}天前`;
  }

  function escapeHtml(text) {
    const tmp = document.createElement('div');
    tmp.textContent = text;
    return tmp.innerHTML;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createNewsSection);
  } else {
    createNewsSection();
  }
})();
