/**
 * a site — 划线评论
 * 选中文字 → 写评论 → 保存后端 → 文本匹配渲染高亮
 */

(function () {
  'use strict';

  const API_BASE = 'http://localhost:8001';

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

  // ============ UI 元素 ============
  const hlBtn = document.createElement('button');
  hlBtn.className = '_asite_highlight_btn';
  hlBtn.textContent = '✏️ 划线评论';
  document.body.appendChild(hlBtn);

  let activePopover = null;
  function removePopover() {
    if (activePopover) { activePopover.remove(); activePopover = null; }
  }

  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed;bottom:100px;left:50%;transform:translateX(-50%) translateY(20px);
    background:#5d4037;color:#fff;padding:10px 24px;border-radius:8px;
    font-size:14px;z-index:10004;opacity:0;transition:all .3s;
    pointer-events:none;font-family:'Noto Sans SC',sans-serif;box-shadow:0 4px 12px rgba(0,0,0,.2);
  `;
  document.body.appendChild(toast);
  let toastTimer = null;

  function showToast(msg) {
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2500);
  }

  // ============ 选中 → 划线 ============
  document.addEventListener('mouseup', (e) => {
    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim()) {
        hlBtn.style.opacity = '0'; hlBtn.style.pointerEvents = 'none';
        return;
      }
      const inGiscus = sel.anchorNode?.parentElement?.closest?.('#__comments, .giscus');
      if (inGiscus) {
        hlBtn.style.opacity = '0'; hlBtn.style.pointerEvents = 'none';
        return;
      }

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      hlBtn.style.left = `${(rect.left + rect.right) / 2 - 40 + window.scrollX}px`;
      hlBtn.style.top = `${rect.top + window.scrollY - 36}px`;
      hlBtn.style.opacity = '1'; hlBtn.style.pointerEvents = 'auto';
    }, 10);
  });

  hlBtn.addEventListener('click', async (e) => {
    e.preventDefault(); e.stopPropagation();
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) return;

    const selectedText = sel.toString().trim();
    hlBtn.style.opacity = '0'; hlBtn.style.pointerEvents = 'none';

    const comment = prompt(`💬 为划线添加评论：\n\n"${selectedText.slice(0, 80)}${selectedText.length > 80 ? '...' : ''}"`, '');
    if (!comment || !comment.trim()) return;

    const userName = localStorage.getItem('_asite_name') || prompt('你的昵称（可选）：', '') || 'Anonymous';
    if (userName) localStorage.setItem('_asite_name', userName);

    try {
      const res = await fetch(`${API_BASE}/api/comments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_url: getPageUrl(),
          anchor_selector: '',
          start_offset: 0,
          end_offset: 0,
          selected_text: selectedText,
          comment_text: comment.trim(),
          user_name: userName,
          user_id: getUserId(),
        }),
      });

      if (res.ok) {
        showToast('✅ 划线评论已保存，刷新后可见');
        // 删除旧高亮，重新渲染
        clearHighlights();
        setTimeout(loadAndRenderComments, 500);
      } else {
        const err = await res.json();
        showToast('❌ ' + (err.detail || '保存失败'));
      }
    } catch {
      showToast('⚠ 后端未连接');
    }
  });

  document.addEventListener('mousedown', (e) => {
    if (e.target !== hlBtn) { hlBtn.style.opacity = '0'; hlBtn.style.pointerEvents = 'none'; }
    removePopover();
  });
  window.addEventListener('scroll', () => {
    hlBtn.style.opacity = '0'; hlBtn.style.pointerEvents = 'none';
    removePopover();
  }, { passive: true });

  // ============ 渲染已有高亮 ============

  function clearHighlights() {
    document.querySelectorAll('._asite_highlight').forEach(el => {
      const parent = el.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
      }
    });
  }

  async function loadAndRenderComments() {
    try {
      const res = await fetch(`${API_BASE}/api/comments/?page_url=${encodeURIComponent(getPageUrl())}`);
      if (!res.ok) return;
      const comments = await res.json();
      renderHighlights(comments);
    } catch {}
  }

  function renderHighlights(comments) {
    clearHighlights();

    const article = document.querySelector('article') || document.body;
    const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, null);

    const textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    const usedRanges = []; // 防止同一段文本被多个高亮重叠

    comments.forEach(comment => {
      const searchText = comment.selected_text;
      if (!searchText || searchText.length < 2) return;

      for (const node of textNodes) {
        const nodeText = node.textContent;
        const idx = nodeText.indexOf(searchText);
        if (idx === -1) continue;

        // 检查是否已被使用
        const nodeStart = node.parentElement ? 0 : 0; // simplified
        let alreadyUsed = false;
        for (const [usedNode, usedStart, usedEnd] of usedRanges) {
          if (usedNode === node && idx < usedEnd && idx + searchText.length > usedStart) {
            alreadyUsed = true;
            break;
          }
        }
        if (alreadyUsed) continue;

        try {
          const range = document.createRange();
          range.setStart(node, idx);
          range.setEnd(node, idx + searchText.length);

          const wrapper = document.createElement('span');
          wrapper.className = '_asite_highlight';
          wrapper._comment = comment;
          wrapper.style.cssText = `
            background: linear-gradient(to top, rgba(255,171,64,.3) 0%, rgba(255,171,64,.3) 40%, transparent 40%, transparent 100%);
            cursor: pointer; border-bottom: 2px dotted #ffab40; transition: background .2s;
          `;

          wrapper.addEventListener('mouseenter', function () {
            this.style.background = 'linear-gradient(to top, rgba(255,171,64,.5) 0%, rgba(255,171,64,.5) 40%, transparent 40%, transparent 100%)';
          });
          wrapper.addEventListener('mouseleave', function () {
            this.style.background = 'linear-gradient(to top, rgba(255,171,64,.3) 0%, rgba(255,171,64,.3) 40%, transparent 40%, transparent 100%)';
          });
          wrapper.addEventListener('click', function (ev) {
            ev.stopPropagation();
            showPopover(this, comment, ev);
          });

          range.surroundContents(wrapper);
          usedRanges.push([node, idx, idx + searchText.length]);
          break; // 只匹配第一个出现
        } catch {
          // surroundContents 失败（跨元素），跳过
        }
      }
    });
  }

  function showPopover(el, comment, e) {
    removePopover();
    const popover = document.createElement('div');
    popover.className = '_asite_popover';
    popover.innerHTML = `
      <button class="_popover_close" style="position:absolute;top:4px;right:8px;background:none;border:none;cursor:pointer;font-size:14px;color:#999;">×</button>
      <div style="color:#e65100;font-style:italic;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #f0e0d0;font-size:12px;line-height:1.6;">
        "${escHtml(comment.selected_text.slice(0, 150))}${comment.selected_text.length > 150 ? '...' : ''}"
      </div>
      <div style="line-height:1.6;margin-bottom:8px;">${escHtml(comment.comment_text)}</div>
      <div style="font-size:11px;color:#999;display:flex;justify-content:space-between;">
        <span>${escHtml(comment.user_name)} · ${formatDate(comment.created_at)}</span>
        <span>❤ ${comment.like_count || 0}</span>
      </div>
    `;
    popover.style.cssText = `
      position:absolute;z-index:10002;background:#fff;border:1px solid #ffab40;
      border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.12);padding:12px 14px;
      min-width:220px;max-width:320px;font-size:13px;font-family:'Noto Sans SC',sans-serif;color:#333;
    `;

    const rect = el.getBoundingClientRect();
    popover.style.left = `${Math.min(rect.left + window.scrollX, window.innerWidth - 340)}px`;
    popover.style.top = `${rect.bottom + window.scrollY + 6}px`;

    popover.querySelector('._popover_close').addEventListener('click', () => removePopover());
    document.body.appendChild(popover);
    activePopover = popover;
  }

  function escHtml(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
  function formatDate(iso) {
    if (!iso) return ''; const d = new Date(iso);
    return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  }

  // ============ 启动 ============
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAndRenderComments);
  } else {
    loadAndRenderComments();
  }
})();
