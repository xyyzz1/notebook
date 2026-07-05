/**
 * a site — live2d-widget 看板娘配置
 * 使用 stevenjoezhang/live2d-widget
 */

(function () {
  'use strict';

  // 在 autoload.js 加载前设置配置
  window.L2DwidgetConfig = {
    model: {
      jsonPath:
        'https://unpkg.com/live2d-widget-model-shizuku@latest/assets/shizuku.model.json',
      scale: 1,
    },
    display: {
      position: 'right',
      width: 150,
      height: 300,
      hOffset: 0,
      vOffset: -20,
    },
    mobile: {
      show: true,
      scale: 0.5,
    },
    react: {
      opacityDefault: 0.8,
      opacityOnHover: 0.3,
    },
  };
})();
