/**
 * a site — 划线评论
 * 对接后端 /api/comments 接口
 * 支持：选中文字划线 → 写评论 → 保存到后端 → 渲染高亮
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

  // ============ DOM 工具 ============

  function getAnchorSelector(node) {
    // 生成一个尽量稳定的 CSS selector，用于定位划线所在的段落
    const article = document.querySelector('article') || document.body;
    const paragraphs = article.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, blockquote, td, th, pre, figcaption');
    for (let i = 0; i < paragraphs.length; i++) {
      if (paragraphs[i] === node || paragraphs[i].contains(node)) {
        return `article p:nth-of-type(${i + 1})`;
      }
    }
    // fallback
    return 'article';
  }

  function getTextNodeOffset(parent, textNode, offset) {
    // 计算在 parent 内，从第一个文本节点到当前 textNode 的累计偏移
    let total = 0;
    const walker = document.createTreeWalker(parent, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node === textNode) {
        return total + offset;
      }
      total += node.textContent.length;
    }
    return total + offset;
  }

  function findTextAtOffset(parent, targetOffset) {
    // 根据 offset 找到对应的文本节点和位置
    const walker = document.createTreeWalker(parent, NodeFilter.SHOW_TEXT);
    let node;
    let current = 0;
    while ((node = walker.nextNode())) {
      const len = node.textContent.length;
      if (current + len >= targetOffset) {
        return { node, offset: targetOffset - current };
      }
      current += len;
    }
    return null;
  }

  // ============ 创建 UI 组件 ============

  // 划线按钮（选中文字后弹出）
  const hlBtn = document.createElement('button');
  hlBtn.className = '_asite_highlight_btn';
  hlBtn.textContent = '✏️ 划线评论';
  document.body.appendChild(hlBtn);

  // Popover（显示已有评论）
  let activePopover = null;
  function removePopover() {
    if (activePopover) { activePopover.remove(); activePopover = null; }
  }

  // Toast
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%) translateY(20px);
    background: #5d4037; color: #fff; padding: 10px 24px; border-radius: 8px;
    font-size: 14px; z-index: 10004; opacity: 0; transition: all 0.3s ease;
    pointer-events: none; font-family: 'Noto Sans SC', sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
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

  // ============ 选中文字 → 划线 ============

  document.addEventListener('mouseup', (e) => {
    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim()) {
        hlBtn.style.opacity = '0';
        hlBtn.style.pointerEvents = 'none';
        return;
      }

      // 排除评论区内的选择
      const inComments = sel.anchorNode?.parentElement?.closest?.('#__comments, .giscus');
      if (inComments) {
        hlBtn.style.opacity = '0';
        hlBtn.style.pointerEvents = 'none';
        return;
      }

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      hlBtn.style.left = `${(rect.left + rect.right) / 2 - 40 + window.scrollX}px`;
      hlBtn.style.top = `${rect.top + window.scrollY - 36}px`;
      hlBtn.style.opacity = '1';
      hlBtn.style.pointerEvents = 'auto';
    }, 10);
  });

  hlBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) return;

    const range = sel.getRangeAt(0);
    const selectedText = sel.toString().trim();
    const parent = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
      ? range.commonAncestorContainer.parentElement
      : range.commonAncestorContainer;

    const anchorSelector = getAnchorSelector(parent);
    const startOffset = getTextNodeOffset(parent, range.startContainer, range.startOffset);
    const endOffset = getTextNodeOffset(parent, range.endContainer, range.endOffset);

    // 隐藏按钮
    hlBtn.style.opacity = '0';
    hlBtn.style.pointerEvents = 'none';

    // 弹出输入框
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
          anchor_selector: anchorSelector,
          start_offset: startOffset,
          end_offset: endOffset,
          selected_text: selectedText,
          comment_text: comment.trim(),
          user_name: userName,
          user_id: getUserId(),
        }),
      });

      if (res.ok) {
        showToast('✅ 划线评论已保存');
        // 立即渲染新评论
        setTimeout(loadAndRenderComments, 500);
      } else {
        const err = await res.json();
        showToast('❌ ' + (err.detail || '保存失败'));
      }
    } catch {
      showToast('⚠ 后端未连接，请稍后再试');
    }
  });

  document.addEventListener('mousedown', (e) => {
    if (e.target !== hlBtn) {
      hlBtn.style.opacity = '0';
      hlBtn.style.pointerEvents = 'none';
    }
    removePopover();
  });

  window.addEventListener('scroll', () => {
    hlBtn.style.opacity = '0';
    hlBtn.style.pointerEvents = 'none';
    removePopover();
  }, { passive: true });

  // ============ 加载 + 渲染已有划线评论 ============

  async function loadAndRenderComments() {
    try {
      const res = await fetch(`${API_BASE}/api/comments/?page_url=${encodeURIComponent(getPageUrl())}`);
      if (!res.ok) return;
      const comments = await res.json();
      renderHighlights(comments);
    } catch {}
  }

  function renderHighlights(comments) {
    // 清除已有高亮
    document.querySelectorAll('._asite_highlight').forEach(el => {
      el.style.background = '';
      el.style.borderBottom = '';
      el.style.cursor = '';
      el.classList.remove('_asite_highlight');
      el._asiteComment = null;
    });

    const article = document.querySelector('article') || document.body;

    comments.forEach(comment => {
      const parent = article; // fallback

      // 尝试找到 anchor 元素
      // 为了简化，直接在 article 中按文本搜索高亮
      const found = findTextAtOffset(parent, comment.start_offset);
      if (!found) return;

      // 创建高亮 span
      const wrapper = document.createElement('span');
      wrapper.className = '_asite_highlight';
      wrapper._asiteComment = comment;

      // 包裹文本
      try {
        const range = document.createRange();
        const endInfo = findTextAtOffset(parent, comment.end_offset);
        if (!endInfo) return;

        range.setStart(found.node, found.offset);
        range.setEnd(endInfo.node, endInfo.offset);
        range.surroundContents(wrapper);
      } catch {
        // 跨元素选择等复杂情况，忽略
      }

      // 点击事件
      wrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        showPopover(wrapper, comment, e);
      });
    });
  }

  function showPopover(el, comment, e) {
    removePopover();

    const popover = document.createElement('div');
    popover.className = '_asite_popover';
    popover.innerHTML = `
      <button class="_popover_close">×</button>
      <div class="_popover_text">"${escapeHtml(comment.selected_text.slice(0, 120))}${comment.selected_text.length > 120 ? '...' : ''}"</div>
      <div class="_popover_comment">${escapeHtml(comment.comment_text)}</div>
      <div class="_popover_meta">
        <span>${escapeHtml(comment.user_name)} · ${formatDate(comment.created_at)}</span>
        <span>❤ ${comment.like_count || 0}</span>
      </div>
    `;

    const rect = el.getBoundingClientRect();
    popover.style.left = `${Math.min(rect.left + window.scrollX, window.innerWidth - 340)}px`;
    popover.style.top = `${rect.bottom + window.scrollY + 6}px`;

    popover.querySelector('._popover_close').addEventListener('click', () => removePopover());

    document.body.appendChild(popover);
    activePopover = popover;
  }

  function escapeHtml(text) {
    const tmp = document.createElement('div');
    tmp.textContent = text;
    return tmp.innerHTML;
  }

  function formatDate(isoString) {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  }

  // ============ 初始化 ============
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAndRenderComments);
  } else {
    loadAndRenderComments();
  }
})();
