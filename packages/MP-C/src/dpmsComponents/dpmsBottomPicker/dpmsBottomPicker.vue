<template>
  <div class="modal" v-show="visible">
    <div class="mask" @click="$emit('update:visible', false)"></div>
    <div class="inner">
      <div class="close" v-if="needCloseBtn" @click="close">{{ closeTxt }}</div>
      <div class="head">{{ title }}</div>
      <div class="body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    title: String,
    needCloseBtn: {
      type: Boolean,
      default: false,
    },
    closeTxt: {
      type: String,
      default: '关闭',
    },
  },
  data() {
    return {}
  },
  methods: {
    close() {
      this.$emit('close')
      this.$emit('update:visible', false)
    },
  },
}
</script>

<style lang="scss" scoped>
.modal {
  position: relative;
  z-index: 10000;
  .mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  .inner {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    .close {
      position: absolute;
      top: 34rpx;
      right: 24rpx;
      font-size: 36rpx;
      color: #5cbb89;
    }
    .head {
      background: white;
      border-radius: 24rpx 24rpx 0 0;
      line-height: 112rpx;
      text-align: center;
      border-bottom: solid 1rpx rgba(0, 0, 0, 0.15);
      font-size: 36rpx;
    }
    .body {
      background: white;
      padding: 32rpx 24rpx;
      overflow: auto;
      max-height: 80vh;
    }
  }
}
</style>
