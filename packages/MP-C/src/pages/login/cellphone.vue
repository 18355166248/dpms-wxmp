<template>
  <div class="wrap">
    <image src="/static/logo.png" class="logo" />
    <div class="appName">北吉熊DPMS</div>
    <div class="tip">请输入您的手机号，登陆或注册账号</div>
    <div class="formItem">
      <span class="iconfont icon-phone"></span>
      <input
        placeholder="请输入手机号"
        v-model="mobile"
        type="digit"
        @focus="handleFocus('mobile')"
        @blur="handleBlur('mobile')"
      />
      <span
        v-show="!!mobile && isFocus.mobile"
        class="iconfont icon-close"
        @click="mobile = ''"
      ></span>
    </div>
    <div class="formItem">
      <span class="iconfont icon-verify"></span>
      <input placeholder="请输入验证码" v-model="code" type="digit" />
      <div class="btn" :class="{ disabled: !!second }" @click="getCode">
        {{ second ? `${second}秒后再试` : '获取验证码' }}
      </div>
    </div>
    <button @click="phoneLogin">确定</button>
  </div>
</template>

<script>
import loginApi from '../../APIS/login/login.api'
import { getStorage, setStorage, STORAGE_KEY } from '@/utils/storage'
export default {
  data() {
    return {
      mobile: '',
      code: '',
      second: 0,
      isFocus: {
        mobile: false,
      },
    }
  },
  methods: {
    handleFocus(field) {
      this.$set(this.isFocus, field, true)
    },
    handleBlur(field) {
      this.$set(this.isFocus, field, false)
    },
    getCode() {
      if (!/^1[3-9]\d{9}$/.test(this.mobile))
        return this.$utils.show('请输入正确的手机号')
      if (this.second) return
      countdown.call(this, 60, (sec) => {
        this.second = sec
      })
      loginApi.getVerifyCode({ phone: this.mobile, appVersion: '1.0.0' })
    },
    async phoneLogin() {
      if (!/^1[3-9]\d{9}$/.test(this.mobile))
        return this.$utils.show('请输入正确的手机号')
      if (!/^\w{4,6}$/.test(this.code))
        return this.$utils.show('请输入至少4位验证码')
      const res = await loginApi.phoneLogin({
        mobile: this.mobile,
        code: this.code,
        openId: getStorage(STORAGE_KEY.OPENID),
      })
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
      if (getCurrentPages().slice(-2)[0].route.includes('pages/login')) {
        this.$utils.reLaunch({ url: '/pages/index/index' })
      } else {
        this.$utils.back(2)
      }
    },
  },
}
function countdown(sec, cb) {
  clearInterval(this.timer)
  if (sec > 0) {
    cb(--sec)
    this.timer = setInterval((_) => countdown.call(this, sec, cb), 1000)
  } else {
    clearInterval(this.timer)
  }
}
</script>

<style lang="scss">
.wrap {
  padding: 96rpx 32rpx 0;
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
.tip {
  font-size: 28rpx;
  color: #999999;
  margin-bottom: 24rpx;
}
.formItem {
  display: flex;
  align-items: center;
  border-bottom: solid 1rpx rgba(0, 0, 0, 0.15);
  height: 112rpx;
  .iconfont {
    margin-right: 12rpx;
    font-size: 36rpx;
    color: rgba(0, 0, 0, 0.65);
  }
  .icon-close {
    margin-right: 0;
    padding-left: 20rpx;
    color: rgba(0, 0, 0, 0.25);
  }
  input {
    flex: auto;
    color: rgba(0, 0, 0, 0.5);
    .input-placeholder {
      color: rgba(0, 0, 0, 0.25);
    }
  }
  .btn {
    color: #5cbb89;
    font-size: 34rpx;
    border-left: solid 1rpx rgba(0, 0, 0, 0.15);
    padding-left: 16rpx;
    line-height: 1;
    white-space: nowrap;
    &.disabled {
      color: #999;
    }
  }
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
  margin-top: 90rpx;
  &::after {
    border: none;
  }
  &.ghost {
    background: transparent;
    color: #5cbb89;
  }
}
</style>
