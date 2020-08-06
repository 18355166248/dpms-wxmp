<template>
  <div class="wrap">
    <image src="/static/logo.png" class="logo" />
    <div class="appName">小程序名称</div>
    <button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
      微信登陆
    </button>
    <button class="ghost" @click="$utils.push({ url: 'cellphone' })">
      手机号登陆
    </button>
  </div>
</template>

<script>
import loginApi from '../../APIS/login/login.api'
import { setStorage, STORAGE_KEY } from '@/utils/storage'
export default {
  methods: {
    getPhoneNumber({ detail }) {
      if (detail.encryptedData) {
        console.log(detail)
        loginApi
          .wxLogin({
            openId: this.loginData.openid,
            encryptedData: detail.encryptedData,
            iv: detail.iv,
          })
          .then((res) => {
            setStorage(STORAGE_KEY.STAFF, res.data)
            this.$utils.back()
          })
      }
    },
  },
  created() {
    wx.login({
      success: ({ code }) => {
        console.log(code)
        loginApi
          .getOpenid({ appId: 'wx00028b3b0c0f877e', code })
          .then((res) => {
            this.loginData = res.data
            setStorage(STORAGE_KEY.OPENID, res.data.openid)
          })
      },
      fail(...args) {
        console.log(args)
      },
    })
  },
}
</script>

<style lang="scss">
.wrap {
  padding-top: 96rpx;
  background: url(/static/loginbg1.png) no-repeat 0 12rpx /90rpx auto,
    url(/static/loginbg2.png) no-repeat 100% 206rpx /130rpx auto;
}
.logo {
  width: 152rpx;
  height: 152rpx;
  display: block;
  margin: 0 auto 10rpx;
}
.appName {
  font-size: 34rpx;
  color: rgba(0, 0, 0, 0.5);
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
  &.ghost {
    background: transparent;
    color: #5cbb89;
  }
}
</style>
