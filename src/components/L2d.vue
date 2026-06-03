<template>
  <div class="live2d" ref="live2dRef"></div>
</template>

<script setup lang="ts">
// import { initLive2D } from './run'
import { onMounted, ref } from 'vue'
const live2dRef = ref<HTMLElement>()

onMounted(() => {
  initLive2D(live2dRef.value)
})

// Recommended to use absolute path for live2d_path parameter
// live2d_path 参数建议使用绝对路径
// const live2d_path = 'https://fastly.jsdelivr.net/npm/live2d-widgets@1.0.0-rc.6/dist/';
const modulePath = '/2d/'

// Method to encapsulate asynchronous resource loading
// 封装异步加载资源的方法
function loadExternalResource(
  url: string,
  type: 'css' | 'js',
): Promise<string> {
  return new Promise((resolve, reject) => {
    let tag: HTMLLinkElement | HTMLScriptElement | null = null

    if (type === 'css') {
      tag = document.createElement('link')
      tag.rel = 'stylesheet'
      tag.href = url
    } else if (type === 'js') {
      tag = document.createElement('script')
      tag.type = 'module'
      tag.src = url
    }
    if (tag) {
      tag.onload = () => resolve(url)
      tag.onerror = () => reject(url)
      document.head.appendChild(tag)
    }
  })
}

let imageHooked = false

async function initLive2D(element?: HTMLElement): Promise<void> {
  //   const modulePath = '/2d/'
  // 如果担心手机上显示效果不佳，可以根据屏幕宽度来判断是否加载
  // if (screen.width < 768) return;
  // 避免图片资源跨域问题
  if (!imageHooked) {
    const OriginalImage = window.Image
    window.Image = function (...args: any[]) {
      const img = new OriginalImage(...(args as any))
      img.crossOrigin = 'anonymous'
      return img
    } as any
    window.Image.prototype = OriginalImage.prototype
    imageHooked = true
  }
  //
  await Promise.all([
    loadExternalResource(modulePath + 'waifu.css', 'css'),
    loadExternalResource(modulePath + 'waifu-tips.js', 'js'),
  ])

  window.initWidget({
    element: element,
    waifuPath: modulePath + 'waifu-tips.json',
    cubism2Path: modulePath + 'live2d.min.js',
    cubism5Path: modulePath + 'live2dcubismcore.min.js',
    tools: [
      'hitokoto',
      'asteroids',
      'switch-model',
      'switch-texture',
      'photo',
      'info',
      'quit',
    ],
    logLevel: 'warn',
    drag: false,
  })
}
</script>
