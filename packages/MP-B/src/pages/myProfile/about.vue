<template>
  <view class="content">
    <view class="top">
      <image class="logo" src="../../static/icon-logo.png" />
      <view class="h1">北吉熊</view>
      <view>版本信息 V1.0.0</view>
    </view>
    <view class="phone">
      <view>客服电话</view>
      <view class="num">021-69979997</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  created() {},
  methods: {},
}
</script>

<style>
page {
  background-color: #fff;
}
</style>
<style lang="scss" scoped>
.content {
  text-align: center;
  padding-top: 96rpx;
  color: rgba(0, 0, 0, 0.9);
  .top {
    font-size: 26rpx;

    margin-bottom: 144rpx;
    image {
      width: 152rpx;
      height: 152rpx;
      margin-bottom: 32rpx;
    }
    .h1 {
      font-size: 40rpx;
      line-height: 48rpx;
      font-weight: bold;
      margin-bottom: 8rpx;
    }
  }
  .phone {
    font-size: 28rpx;
    line-height: 36rpx;
    .num {
      font-size: 34rpx;
      margin-top: 16rpx;
    }
  }
}
</style>
