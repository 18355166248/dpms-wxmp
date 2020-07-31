<template>
  <view class="content">
    <view class="me">
      <image />
      <view class="info">
        <view class="name">张三丰</view>
        <view class="role">医生</view>
      </view>
      <view class="link">
        <text class="iconfont icon-right" />
      </view>
    </view>
    <view class="menu">
      <view class="li">
        <view>
          <text class="iconfont icon-institutions" />
          登录诊所
        </view>
        <text class="institution">泽怡</text>
      </view>
      <view class="li">
        <view>
          <text class="iconfont icon-password" />
          关于北吉熊
        </view>
      </view>
    </view>
    <button type="default" class="out">
      退出登录
    </button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: '我的',
    }
  },
  onLoad() {},
  methods: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.me {
  height: 200rpx;
  margin: 50rpx 20rpx;
  padding: 10rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  background: #feffff;
  border-radius: 8rpx;
  box-shadow: 0rpx 20rpx 20rpx 0rpx rgba(0, 0, 0, 0.09);
  image {
    width: 100rpx;
    height: 100rpx;
  }
  .info {
    flex: auto;
    padding: 0 10rpx;
    box-sizing: border-box;
    .name {
      font-weight: bold;
      margin-bottom: 10rpx;
    }
    .role {
      font-size: 24rpx;
    }
  }
  .link {
    width: 50rpx;
    text-align: center;
  }
}
.menu {
  .li {
    height: 80rpx;
    padding: 0 50rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text.iconfont {
      margin-right: 10rpx;
    }
  }
}
</style>
