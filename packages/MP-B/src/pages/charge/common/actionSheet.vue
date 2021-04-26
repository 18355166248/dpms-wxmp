<template>
  <view class="action-sheet-wrap">
    <view class="mask" @click="hideActionSheet"></view>
    <view class="action-sheet">
      <slot></slot>
      <view class="sure-text" v-if="sureText" @click="sure">{{
        sureText
      }}</view>
    </view>
  </view>
</template>
<script>
export default {
  name: '',
  data() {
    return {}
  },
  props: {
    sureText: {
      type: String,
      default: '',
    },
  },
  methods: {
    hideActionSheet() {
      this.$emit('close')
    },
    sure() {
      this.$emit('sure')
    },
  },
  components: {},
}
</script>
<style lang="scss" scoped>
.action-sheet-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
  }
  .action-sheet {
    position: relative;
    width: 100%;
    background: #f2f2f2;
    border-radius: 24rpx 24rpx 0 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    color: #191919;
    line-height: 1;
    font-size: 30rpx;
    .sure-text {
      height: 112rpx;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 16rpx;
      color: #5cbb89;
      font-size: 34rpx;
      background: #fff;
    }
  }
}
</style>
