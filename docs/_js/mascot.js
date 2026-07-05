/**
 * a site — 2D 看板娘 Mascot
 * 纯 CSS + JS，无需外部依赖
 */

(function () {
  'use strict';

  // 随机对话消息
  const messages = [
    '欢迎来到 a site！',
    '今天学习了吗？',
    '知识就是力量~',
    '加油，你可以的！',
    '来看看笔记吧！',
    '有不懂的可以留言哦~',
    '学而不思则罔',
    '温故而知新',
    '你好呀！',
    '点击我可以切换消息~'
  ];

  let msgIndex = 0;

  function getMessage() {
    const msg = messages[msgIndex];
    msgIndex = (msgIndex + 1) % messages.length;
    return msg;
  }

  // 创建 DOM 结构
  function createMascot() {
    const container = document.createElement('div');
    container.id = 'mascot-container';
    container.innerHTML = `
      <div class="mascot-body">
        <div class="mascot-head">
          <div class="mascot-eyes">
            <div class="mascot-eye mascot-eye-left"></div>
            <div class="mascot-eye mascot-eye-right"></div>
          </div>
          <div class="mascot-blush left"></div>
          <div class="mascot-blush right"></div>
          <div class="mascot-mouth"></div>
        </div>
        <div class="mascot-arm left"></div>
        <div class="mascot-arm right"></div>
        <div class="mascot-torso"></div>
        <div class="mascot-speech">你好呀！</div>
      </div>
      <button class="mascot-toggle" title="隐藏/显示">×</button>
    `;
    document.body.appendChild(container);

    const speech = container.querySelector('.mascot-speech');
    const toggleBtn = container.querySelector('.mascot-toggle');
    const body = container.querySelector('.mascot-body');
    const eyeLeft = container.querySelector('.mascot-eye-left');
    const eyeRight = container.querySelector('.mascot-eye-right');

    // 初始显示消息
    setTimeout(() => showSpeech(speech), 1000);

    // 点击角色切换消息
    body.addEventListener('click', (e) => {
      e.stopPropagation();
      speech.textContent = getMessage();
      showSpeech(speech);
    });

    // 切换显示/隐藏
    let hidden = false;
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hidden = !hidden;
      body.style.opacity = hidden ? '0.3' : '1';
      toggleBtn.textContent = hidden ? '+' : '×';
      if (hidden) {
        speech.classList.remove('show');
      }
    });

    // 眼球跟随鼠标
    document.addEventListener('mousemove', (e) => {
      const bodyRect = body.getBoundingClientRect();
      const bodyCenterX = bodyRect.left + bodyRect.width / 2;
      const bodyCenterY = bodyRect.top + bodyRect.height / 2;

      // 计算眼睛偏移（限制在 2px 内）
      const maxOffset = 2;
      const dx = Math.max(-maxOffset, Math.min(maxOffset, (e.clientX - bodyCenterX) * 0.02));
      const dy = Math.max(-maxOffset, Math.min(maxOffset, (e.clientY - bodyCenterY) * 0.02));

      eyeLeft.style.transform = `translate(${dx}px, ${dy}px)`;
      eyeRight.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    return container;
  }

  function showSpeech(speechEl) {
    speechEl.classList.add('show');
    clearTimeout(speechEl._timeout);
    speechEl._timeout = setTimeout(() => {
      speechEl.classList.remove('show');
    }, 3000);
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createMascot);
  } else {
    createMascot();
  }
})();
