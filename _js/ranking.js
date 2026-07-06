/**
 * a site — 热度排行
 * 在首页展示文章点赞排行
 */

(function () {
  'use strict';

  const API_BASE = 'https://asite.abrdns.com:8443';

  // URL → 文章标题映射
  const TITLE_MAP = {
    '/notebook/notes/markdown': 'Markdown 自学笔记',
    '/notebook/notes/markdown/': 'Markdown 自学笔记',
    '/notes/markdown': 'Markdown 自学笔记',
    '/notes/markdown/': 'Markdown 自学笔记',
    '/notebook/notes/html': 'HTML 自学笔记',
    '/notebook/notes/html/': 'HTML 自学笔记',
    '/notes/html': 'HTML 自学笔记',
    '/notes/html/': 'HTML 自学笔记',
    '/notebook/notes/css': 'CSS 自学笔记',
    '/notebook/notes/css/': 'CSS 自学笔记',
    '/notes/css': 'CSS 自学笔记',
    '/notes/css/': 'CSS 自学笔记',
    '/notebook/notes/git': 'Git 自学笔记',
    '/notebook/notes/git/': 'Git 自学笔记',
    '/notes/git': 'Git 自学笔记',
    '/notes/git/': 'Git 自学笔记',
    '/notebook/notes/javascript': 'JavaScript 自学笔记',
    '/notebook/notes/javascript/': 'JavaScript 自学笔记',
    '/notes/javascript': 'JavaScript 自学笔记',
    '/notes/javascript/': 'JavaScript 自学笔记',
    '/notebook/notes/python': 'Python 自学笔记',
    '/notebook/notes/python/': 'Python 自学笔记',
    '/notes/python': 'Python 自学笔记',
    '/notes/python/': 'Python 自学笔记',
  };

  function isHomePage() {
    const path = window.location.pathname.replace(/\/$/, '');
    return path === '' || path === '/' || path === '/notebook' || path === '/notebook/';
  }

  function getTitle(url) {
    return TITLE_MAP[url] || url.replace(/.*\//, '').replace(/-/g, ' ') || url;
  }

  function getUrl(path) {
    // 统一转为 /notebook/notes/xxx/ 格式
    if (!path.startsWith('/notebook')) path = '/notebook' + path;
    if (!path.endsWith('/')) path += '/';
    return path;
  }

  async function init() {
    if (!isHomePage()) return;

    const article = document.querySelector('article.md-content__inner');
    if (!article) return;

    // 等待页面内容加载完再插入
    const section = document.createElement('div');
    section.id = '_asite_ranking';
    section.innerHTML = `
      <hr>
      <h2>🏆 文章热度排行</h2>
      <div id="_asite_ranking_list" style="font-size:14px;line-height:2.2;">
        <span style="color:#999;">加载中...</span>
      </div>
    `;
    article.appendChild(section);

    try {
      const res = await fetch(`${API_BASE}/api/likes/ranking`);
      if (!res.ok) throw new Error('API error');
      const items = await res.json();

      const list = document.getElementById('_asite_ranking_list');
      if (!list) return;

      if (items.length === 0) {
        list.innerHTML = '<span style="color:#999;">暂无数据，快去给喜欢的文章点赞吧！</span>';
        return;
      }

      const medals = ['🥇', '🥈', '🥉'];
      list.innerHTML = items
        .map((item, i) => {
          const rank = i < 3 ? medals[i] : `${i + 1}.`;
          const title = getTitle(item.page_url);
          const url = getUrl(item.page_url);
          return `<div>
            ${rank} <a href="${url}" style="color:var(--md-accent-fg-color--light);">${title}</a>
            <span style="color:#aaa;font-size:12px;">— ❤ ${item.likes} 赞</span>
          </div>`;
        })
        .join('');
    } catch {
      const list = document.getElementById('_asite_ranking_list');
      if (list) list.innerHTML = '<span style="color:#999;">排行暂不可用</span>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
