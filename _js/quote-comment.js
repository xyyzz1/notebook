/**
 * a site — 引用评论
 * 选中文字后弹出引用按钮，将选中内容以 Markdown 引用格式复制到剪贴板
 * 纯前端实现，无需后端
 */

(function () {
  'use strict';

  // 创建引用按钮
  const quoteBtn = document.createElement('button');
  quoteBtn.className = 'quote-btn';
  quoteBtn.innerHTML = '💬 引用';
  quoteBtn.style.cssText = `
    position: absolute;
    z-index: 10000;
    background: #ffab40;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 4px 10px;
    font-size: 13px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease;
    font-family: 'Noto Sans SC', sans-serif;
  `;
  document.body.appendChild(quoteBtn);

  // 创建 Toast 提示
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 120px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: #5d4037;
    color: #fff;
    padding: 10px 24px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 10001;
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
    font-family: 'Noto Sans SC', sans-serif;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  `;
  document.body.appendChild(toast);

  let toastTimer = null;

  function showToast(message) {
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2500);
  }

  // 获取选中文字及其页面位置
  function getSelectionInfo() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      return null;
    }

    const text = selection.toString().trim();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    return {
      text,
      top: rect.top + window.scrollY,
      bottom: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      right: rect.right + window.scrollX
    };
  }

  // 格式化引用文本
  function formatQuote(text) {
    return text
      .split('\n')
      .map(line => `> ${line}`)
      .join('\n');
  }

  // 滚动到评论区
  function scrollToComments() {
    const commentsSection = document.getElementById('__comments');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // giscus 可能还在加载，滚动到底部
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  }

  // 鼠标松开时显示/隐藏引用按钮
  document.addEventListener('mouseup', (e) => {
    // 延迟一下等 selection 稳定
    setTimeout(() => {
      const info = getSelectionInfo();

      if (!info) {
        quoteBtn.style.opacity = '0';
        quoteBtn.style.pointerEvents = 'none';
        return;
      }

      // 排除已在评论区内的选择
      const selection = window.getSelection();
      if (selection && selection.anchorNode) {
        const inComments = selection.anchorNode.parentElement?.closest('#__comments') ||
                          selection.anchorNode.parentElement?.closest('.giscus');
        if (inComments) {
          quoteBtn.style.opacity = '0';
          quoteBtn.style.pointerEvents = 'none';
          return;
        }
      }

      // 定位按钮（选中文字上方中间）
      const btnLeft = (info.left + info.right) / 2 - 30;
      const btnTop = info.top - 36;

      quoteBtn.style.left = `${btnLeft}px`;
      quoteBtn.style.top = `${btnTop}px`;
      quoteBtn.style.opacity = '1';
      quoteBtn.style.pointerEvents = 'auto';
    }, 10);
  });

  // 点击引用按钮
  quoteBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const info = getSelectionInfo();
    if (!info) return;

    const quotedText = formatQuote(info.text);
    const fullQuote = `${quotedText}\n\n`;

    try {
      await navigator.clipboard.writeText(fullQuote);
      showToast('✅ 引用已复制，请在评论区粘贴（Ctrl+V）');
    } catch {
      showToast('⚠ 复制失败，请手动复制选中文字');
    }

    // 隐藏按钮
    quoteBtn.style.opacity = '0';
    quoteBtn.style.pointerEvents = 'none';

    // 滚动到评论区
    setTimeout(() => scrollToComments(), 300);
  });

  // 点击其他区域隐藏按钮
  document.addEventListener('mousedown', (e) => {
    if (e.target !== quoteBtn) {
      quoteBtn.style.opacity = '0';
      quoteBtn.style.pointerEvents = 'none';
    }
  });

  // 页面滚动时隐藏按钮
  window.addEventListener('scroll', () => {
    quoteBtn.style.opacity = '0';
    quoteBtn.style.pointerEvents = 'none';
  }, { passive: true });
})();
