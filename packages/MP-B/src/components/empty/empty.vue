<template>
  <view class="empty" :style="{ background: bg }">
    <image :src="img" mode="widthFix" class="empty-image"></image>
    <text :style="{ color: textColor }" class="empty-text">{{ text }}</text>
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
    refresh() {
      console.log('refresh !')
    },
  },
}
</script>

<style lang="scss">
.empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 128rpx;
  width: 100%;
  align-items: center;
  color: #555555;
  font-size: 24rpx;
  background: none;
  &-image {
    width: 406rpx !important;
    margin-bottom: 20rpx;
  }
  &-text {
    font-size: 24rpx;
  }
}
</style>
