<template>
  <div class="wrap">
    <image src="/static/logo.png" class="logo">
    <div class="appName">小程序名称</div>
    <button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信登陆</button>
    <button class="ghost" @click="flyUtil.push({url: 'cellphone'})">手机号登陆</button>
  </div>
</template>

<script>
export default {
  methods: {
    getPhoneNumber({detail}) {
      console.log(detail)
    },
  },
}
</script>

<style lang="scss">
.wrap{
  padding-top: 96rpx;
  background: url(/static/loginbg1.png) no-repeat 0 12rpx /90rpx auto, url(/static/loginbg2.png) no-repeat 100% 206rpx /130rpx auto;
}
.logo{
  width: 152rpx;
  height: 152rpx;
  display: block;
  margin: 0 auto 10rpx;
}
.appName{
  font-size: 34rpx;
  color: rgba(0,0,0,0.5);
  text-align: center;
  margin-bottom: 180rpx;
}
button {
  width: 670rpx;
  height: 100rpx;
  background: #5cbb89;
  border: solid 2rpx #5cbb89;
  border-radius: 8rpx;
  font-size: 40rpx;
  font-weight: 400;
  text-align: center;
  color: #ffffff;
  margin-bottom: 24rpx;
  &.ghost{
    background: transparent;
    color: #5cbb89;
  }
}
</style>