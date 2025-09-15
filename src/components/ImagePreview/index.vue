<template>
  <el-image
      :src="`${realSrc}`"
      fit="cover"
      :style="`width:${realWidth};height:${realHeight};`"
      :preview-src-list="realSrcList"
      preview-teleported
      ref="imageRef"
      @click="handleClick"
  >
    <template #error>
      <div class="image-slot">
        <el-icon><picture-filled /></el-icon>
      </div>
    </template>
  </el-image>
</template>

<script setup>
import { isExternal } from "@/utils/validate";
import { ref, computed, onMounted, nextTick } from 'vue';

const props = defineProps({
  src: {
    type: String,
    default: ""
  },
  width: {
    type: [Number, String],
    default: ""
  },
  height: {
    type: [Number, String],
    default: ""
  },
  initialIndex: {  // 新增初始索引属性
    type: Number,
    default: 0
  }
});

const imageRef = ref(null);
let viewer = null;

// 处理滑动切换的核心逻辑
const initSwipeHandler = () => {
  if (!imageRef.value) return;

  // 监听预览框打开（通过watch监听预览状态）
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'style') {
        const viewerEl = document.querySelector('.el-image-viewer__wrapper');
        if (viewerEl && !viewer) {
          initViewerEvents(viewerEl);
        }
      }
    });
  });

  // 观察预览框是否出现
  nextTick(() => {
    const previewEl = document.querySelector('.el-image-viewer');
    if (previewEl) {
      observer.observe(previewEl, { attributes: true });
    }
  });
};

// 初始化预览器事件
const initViewerEvents = (wrapper) => {
  let startX = 0;
  let isMouseDown = false;

  // 获取预览器实例（通过DOM查找当前索引）
  const getViewerInfo = () => {
    const indicators = document.querySelectorAll('.el-image-viewer__indicators li');
    const currentIndex = Array.from(indicators).findIndex(li => li.classList.contains('is-active'));
    const urlList = realSrcList.value;
    return {
      currentIndex,
      urlList,
      prev: () => {
        if (currentIndex > 0) {
          document.querySelector('.el-image-viewer__btn--left')?.click();
        }
      },
      next: () => {
        if (currentIndex < urlList.length - 1) {
          document.querySelector('.el-image-viewer__btn--right')?.click();
        }
      }
    };
  };

  // 触摸开始
  wrapper.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  // 触摸结束
  wrapper.addEventListener('touchend', (e) => {
    if (!startX) return;
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX;
    const viewer = getViewerInfo();

    // 滑动距离超过50px触发切换
    if (diffX > 50) {
      viewer.prev();
    } else if (diffX < -50) {
      viewer.next();
    }
    startX = 0;
  }, { passive: true });

  // 鼠标按下
  wrapper.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isMouseDown = true;
  });

  // 鼠标释放
  wrapper.addEventListener('mouseup', (e) => {
    if (!isMouseDown) return;
    const endX = e.clientX;
    const diffX = endX - startX;
    const viewer = getViewerInfo();

    if (diffX > 50) {
      viewer.prev();
    } else if (diffX < -50) {
      viewer.next();
    }

    startX = 0;
    isMouseDown = false;
  });

  // 鼠标离开
  wrapper.addEventListener('mouseleave', () => {
    isMouseDown = false;
  });

  viewer = true; // 标记已初始化
};

// 点击图片时确保正确打开预览
const handleClick = () => {
  if (imageRef.value && realSrcList.value.length) {
    imageRef.value.showPreview = true;
    nextTick(initSwipeHandler); // 打开后初始化滑动事件
  }
};

// 计算属性保持不变
const realSrc = computed(() => {
  if (!props.src) return '';
  const srcList = props.src.split(",");
  // 根据初始索引获取对应的图片
  const real_src = srcList[props.initialIndex] || srcList[0];
  return isExternal(real_src)
      ? real_src
      : import.meta.env.VITE_APP_BASE_API + real_src;
});

const realSrcList = computed(() => {
  if (!props.src) return [];
  return props.src.split(",")
      .map(item => isExternal(item)
          ? item
          : import.meta.env.VITE_APP_BASE_API + item
      );
});

const realWidth = computed(() =>
    typeof props.width === "string" ? props.width : `${props.width}px`
);

const realHeight = computed(() =>
    typeof props.height === "string" ? props.height : `${props.height}px`
);

// 组件挂载后初始化
onMounted(() => {
  nextTick(initSwipeHandler);
});
</script>

<style lang="scss" scoped>
.el-image {
  border-radius: 5px;
  background-color: #ebeef5;
  box-shadow: 0 0 5px 1px #ccc;

  :deep(.el-image__inner) {
    transition: all 0.3s;
    cursor: pointer;
    &:hover {
      transform: scale(1.2);
    }
  }

  :deep(.image-slot) {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: #909399;
    font-size: 30px;
  }

  // 增强预览器滑动动画
  :deep(.el-image-viewer__img) {
    transition: transform 0.3s ease-out, opacity 0.3s ease-out !important;
  }

  // 优化导航按钮显示
  :deep(.el-image-viewer__btn--left, .el-image-viewer__btn--right) {
    opacity: 1 !important;
    transition: all 0.2s;
    &:hover {
      transform: scale(1.1);
    }
  }
}

</style>