<template>
  <div class="wrap">
    <image src="/static/logo.png" class="logo" />
    <div class="appName">北吉熊DPMS</div>
    <button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信登陆</button>
    <button class="ghost" @click="$utils.push({ url: 'cellphone' })">手机号登陆</button>
  </div>
</template>

<script>
import loginApi from '../../APIS/login/login.api'
import { setStorage, STORAGE_KEY } from '@/utils/storage'
import config from '../../config'
export default {
  data() {
    return {
      myself: null,
    }
  },
  onLoad(param) {
    console.log(param)
    if (param) {
      this.myself = param.param
    }
  },
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
            if (res.code === 0) {
              setStorage(STORAGE_KEY.STAFF, res.data)
              setStorage(STORAGE_KEY.ACCESS_TOKEN, res.data.accessToken)
              loginApi.getWhetherBindCustomer({
                userId: res.data?.id
              }).then((info) => {
                setStorage(STORAGE_KEY.CUSTOMERID, info.data?.bindedCustomerId)
                if(info.code === 0 && info.data?.need) {
                  this.$utils.reLaunch({ url: '/pages/switchUser/switchUser' })
                  return
                }
              })
            }
            if (this.myself == 'myself') {
              this.$utils.reLaunch({ url: '/pages/index/index' })
            } else {
              this.$utils.back()
            }
        })
      }
    },
  },
  created() {
    wx.login({
      success: ({ code }) => {
        console.log(code)
        loginApi.getOpenid({ appId: config.appId, code }).then((res) => {
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

<style lang="scss" scoped>
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
  color: rgba(0, 0, 0, 0.9);
  text-align: center;
  margin-bottom: 180rpx;
}
button {
  width: 670rpx;
  line-height: 78rpx;
  background: #5cbb89;
  border: solid 2rpx #5cbb89;
  border-radius: 8rpx;
  font-size: 36rpx;
  font-weight: 400;
  text-align: center;
  color: #ffffff;
  margin-bottom: 24rpx;
  &::after{
    border: none;
  }
  &.ghost {
    background: transparent;
    color: #5cbb89;
  }
}
</style>
