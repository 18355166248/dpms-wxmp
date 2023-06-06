<template>
  <view
    v-if="visibleSync"
    :class="{ 'dpms-drawer--visible': showDrawer }"
    class="dpms-drawer"
    @touchmove.stop.prevent="clear"
  >
    <view
      class="dpms-drawer__mask"
      :class="{ 'dpms-drawer__mask--visible': showDrawer && mask }"
      @tap="close('mask')"
    />
    <view
      class="dpms-drawer__content"
      :class="{
        'dpms-drawer--right': rightMode,
        'dpms-drawer--left': !rightMode,
        'dpms-drawer__content--visible': showDrawer,
      }"
      :style="{ width: drawerWidth + 'rpx' }"
    >
      <scroll-view class="h100" scroll-y>
        <slot />
      </scroll-view>
    </view>
  </view>
</template>

<script>
/**
 * Drawer 抽屉
 * @property {Boolean} mask = [true | false] 是否显示遮罩
 * @property {Boolean} maskClose = [true | false] 点击遮罩是否关闭
 * @property {Boolean} mode = [left | right]
 *  @value left 左侧
 *  @value right 右侧
 */
export default {
  name: 'dpmsDrawer',
  props: {
    // 显示模式（左、右），只在初始化生效
    mode: {
      type: String,
      default: 'right',
    },
    // 蒙层是否显示
    mask: {
      type: Boolean,
      default: true,
    },
    // 点击遮罩是否关闭
    maskClose: {
      type: Boolean,
      default: true,
    },
    width: {
      type: Number,
      default: 624,
    },
  },
  data() {
    return {
      visibleSync: false, // 控制抽屉显示
      showDrawer: false,
      rightMode: false,
      watchTimer: null,
      drawerWidth: this.width,
    }
  },
  created() {
    // 多终端处理(暂不需要)

    // #ifndef APP-NVUE
    this.drawerWidth = this.width
    // #endif
    this.rightMode = this.mode
  },
  methods: {
    clear() {},
    close(type) {
      // 抽屉尚未完全关闭或遮罩禁止点击时不触发以下逻辑
      if ((type === 'mask' && !this.maskClose) || !this.visibleSync) return
      this._change('showDrawer', 'visibleSync', false)
    },
    open() {
      // 处理重复点击打开的事件
      if (this.visibleSync) return
      this._change('visibleSync', 'showDrawer', true)
    },
    _change(param1, param2, status) {
      this[param1] = status
      if (this.watchTimer) {
        clearTimeout(this.watchTimer)
      }
      this.watchTimer = setTimeout(
        () => {
          this[param2] = status
          this.$emit('change', status)
        },
        status ? 50 : 300,
      )
    },
  },
}
</script>

<style lang="scss" scoped>
$drawer-width: 624rpx;
$dpms-bg-color-mask: rgba(0, 0, 0, 0.3);
$dpms-bg-color: #fff;

.dpms-drawer {
  /* #ifndef APP-NVUE */
  display: block;
  /* #endif */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 999;
}

.dpms-drawer__content {
  height: 100%;
  overflow: hidden;
  /* #ifndef APP-NVUE */
  display: block;
  /* #endif */
  position: absolute;
  top: 0;
  width: $drawer-width;
  bottom: 0;
  background-color: $dpms-bg-color;
  transition: transform 0.3s ease;
}

.dpms-drawer--left {
  left: 0;
  /* #ifdef APP-NVUE */
  transform: translateX(-$drawer-width);
  /* #endif */
  /* #ifndef APP-NVUE */
  transform: translateX(-100%);
  /* #endif */
}

.dpms-drawer--right {
  right: 0;
  /* #ifdef APP-NVUE */
  transform: translateX($drawer-width);
  /* #endif */
  /* #ifndef APP-NVUE */
  transform: translateX(100%);
  /* #endif */
}

.dpms-drawer__content--visible {
  transform: translateX(0);
}

.dpms-drawer__mask {
  /* #ifndef APP-NVUE */
  display: block;
  /* #endif */
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: $dpms-bg-color-mask;
  transition: opacity 0.3s;
}

.dpms-drawer__mask--visible {
  /* #ifndef APP-NVUE */
  display: block;
  /* #endif */
  opacity: 1;
}
</style>
