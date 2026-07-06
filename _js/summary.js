/**
 * a site — AI 文章摘要（DeepSeek）
 * 在每篇笔记开头插入"AI 摘要"按钮，点击调用后端 DeepSeek API
 */

(function () {
  'use strict';

  const API_BASE = 'https://asite.abrdns.com:8443';

  // 只在笔记详情页显示（排除封面和关于页）
  function shouldShow() {
    const path = window.location.pathname;
    // 排除首页、about、notes index
    if (path === '/' || path === '/notebook/' || path === '/notebook') return false;
    if (path.includes('/about/') || path.includes('/about')) return false;
    if (path === '/notes/' || path === '/notebook/notes/' || path === '/notebook/notes') return false;
    return true;
  }

  function createSummaryBox() {
    if (!shouldShow()) return;

    const article = document.querySelector('article.md-content__inner');
    if (!article) return;

    // 获取文章内容
    const h1 = article.querySelector('h1');
    const title = h1 ? h1.textContent : document.title;
    const contentEl = article.cloneNode(true);

    // 移除脚本、样式等非内容元素
    contentEl.querySelectorAll('script, style, .md-source-file, #_asite_summary_box').forEach(el => el.remove());

    const fullContent = contentEl.textContent || '';

    // 创建摘要框
    const box = document.createElement('div');
    box.id = '_asite_summary_box';
    box.style.cssText = `
      background: #fff9f4;
      border: 1.5px solid #ffab40;
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 24px;
      font-size: 14px;
      font-family: 'Noto Sans SC', sans-serif;
      transition: all 0.3s;
    `;
    box.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;cursor:pointer;" id="_asite_summary_header">
        <span style="font-weight:600;color:#e65100;">🤖 AI 摘要</span>
        <button id="_asite_summary_btn" style="
          background:#ffab40;color:#fff;border:none;border-radius:4px;
          padding:4px 14px;font-size:13px;cursor:pointer;font-family:inherit;
        ">生成摘要</button>
      </div>
      <div id="_asite_summary_content" style="margin-top:12px;line-height:1.8;color:#5d4037;display:none;"></div>
    `;

    // 插入到 h1 后面
    if (h1 && h1.nextSibling) {
      h1.parentNode.insertBefore(box, h1.nextSibling);
    } else if (article.firstChild) {
      article.insertBefore(box, article.firstChild.nextSibling);
    } else {
      article.appendChild(box);
    }

    // 绑定点击事件
    document.getElementById('_asite_summary_btn').addEventListener('click', async () => {
      const btn = document.getElementById('_asite_summary_btn');
      const content = document.getElementById('_asite_summary_content');

      btn.textContent = '生成中...';
      btn.disabled = true;
      content.style.display = 'block';
      content.innerHTML = '<span style="color:#999;">⏳ AI 正在分析文章...</span>';

      try {
        const res = await fetch(`${API_BASE}/api/summary/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content: fullContent }),
        });

        if (!res.ok) {
          const err = await res.json();
          content.innerHTML = `<span style="color:#e53935;">❌ ${err.detail || '生成失败'}</span>`;
          btn.textContent = '重新生成';
          btn.disabled = false;
          return;
        }

        const data = await res.json();
        content.innerHTML = data.summary.replace(/\n/g, '<br>');
        btn.textContent = '重新生成';
        btn.disabled = false;
      } catch {
        content.innerHTML = '<span style="color:#e53935;">❌ 后端未连接，请确保 API 服务已启动</span>';
        btn.textContent = '重试';
        btn.disabled = false;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createSummaryBox);
  } else {
    createSummaryBox();
  }
})();
