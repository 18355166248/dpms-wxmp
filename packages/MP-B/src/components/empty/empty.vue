<template>
  <view class="empty" :style="{ background: bg }">
    <image :src="img" mode="widthFix" class="empty-image"></image>
    <text :style="{ color: textColor }" class="empty-text">{{ text }}</text>
    <button v-if="!disabled" class="empty-btn" @click="onClick()">
      重新加载
    </button>
  </view>
</template>

<script>
export default {
  name: 'empty',
  props: {
    text: {
      type: String,
      default: '暂无数据',
    },
    disabled: {
      // 是否为禁用状态
      type: [Boolean, String],
      default: false,
    },
    bg: {
      type: String,
      default: 'none',
    },
    img: {
      type: String,
      default:
        'https://medcloud.oss-cn-shanghai.aliyuncs.com/dental/saas/mini-app/empty-img.png',
    },
    textColor: {
      type: String,
      default: '#999999',
    },
  },
  methods: {
    onClick() {
      this.$emit('click')
    },
  },
}
</script>

<style lang="scss">
.empty {
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 100%;
  padding-top: 25%;
  align-items: center;
  color: #555555;
  font-size: 24rpx;
  background: none;
  &-image {
    width: 40% !important;
    margin-bottom: 40rpx;
  }
  &-text {
    font-size: 30rpx;
    color: rgba(0, 0, 0, 0.65);
  }
  &-btn {
    width: 40%;
    height: 64rpx;
    line-height: 64rpx;
    margin-top: 30rpx;
    text-align: center;
    background: $dpms-color-primary;
    color: #fff;
    border-radius: 5rpx;
  }
}
</style>
