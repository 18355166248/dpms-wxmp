<template>
  <view class="bg">
    <view class="status_bar"></view>
    <view class="content">
      <view class="login">
        <label>
          <text class="iconfont icon-institutions" />
          <input
            placeholder="请输入会员名"
            placeholder-style="color:rgba(0,0,0,0.25)"
            v-model="loginForm.memberCode"
          />
        </label>
        <label>
          <text class="iconfont icon-user" />
          <input
            placeholder="请输入用户名"
            placeholder-style="color:rgba(0,0,0,0.25)"
            v-model="loginForm.username"
          />
        </label>
        <label>
          <text class="iconfont icon-password" />
          <input
            password
            placeholder="请输入密码"
            placeholder-style="color:rgba(0,0,0,0.25)"
            v-model="loginForm.password"
          />
        </label>
        <view class="submit">
          <button type="default" @click="$refs.selectMedicalInstitution.show()">
            登 录
          </button>
        </view>
      </view>

      <selectMedicalInstitution
        ref="selectMedicalInstitution"
        :memberCode="loginForm.memberCode"
        :username="loginForm.username"
        @confirm="login"
      ></selectMedicalInstitution>
    </view>
  </view>
</template>

<script>
import _ from 'lodash'
import AsyncValidator from 'async-validator'
import systemAPI from '@/APIS/system.api'
import authAPI from '@/APIS/auth/auth.api'
import { setStorage, STORAGE_KEY } from '@/utils/storage'
export default {
  data() {
    return {
      institutionList: [],
      loginInstitutionList: [],
      loginForm: {
        memberCode: '',
        username: '',
        password: '',
        mtId: '',
      },
      rules: {
        memberCode: {
          required: true,
          message: '请输入会员名',
        },
        username: {
          required: true,
          message: '请输入用户名',
        },
        password: {
          required: true,
          message: '请输入密码',
        },
      },
    }
  },
  onLoad() {},
  methods: {
    login(val) {
      authAPI
        .login({
          memberCode: this.loginForm.memberCode,
          username: this.loginForm.username,
          password: this.loginForm.password,
          mtId: val.id,
        })
        .then((res) => {
          const { access_token, medicalInstitution, staff } = res.data
          setStorage(STORAGE_KEY.ACCESS_TOKEN, access_token)
          setStorage(STORAGE_KEY.MEDICALINSTITUTION, medicalInstitution)
          setStorage(STORAGE_KEY.STAFF, staff)
          this.getEnums()
        })
    },
    getEnums() {
      systemAPI.getDataDict().then((res) => {
        setStorage(STORAGE_KEY.ENUMS, res.data)
        this.$utils.reLaunch({
          url: '/pages/home/home',
        })
      })
    },
    validate(callback) {
      let validator = new AsyncValidator(this.rules)

      validator.validate(this.loginForm, (errors, fields) => {
        _.isFunction(callback) && callback(errors, fields)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.bg {
  background-image: url('https://medcloud.oss-cn-shanghai.aliyuncs.com/dental/saas/mini-app/logo.png');
  background-size: contain;
  background-repeat: no-repeat;
}
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}
.content {
  padding: 432rpx 32rpx 0;
  .login {
    height: 716rpx;
    padding: 64rpx 32rpx 0;
    box-sizing: border-box;
    background: #feffff;
    border-radius: 8rpx;
    box-shadow: 0rpx 20rpx 20rpx 0rpx rgba(0, 0, 0, 0.09);
    label {
      display: flex;
      align-items: center;
      line-height: 112rpx;
      border-bottom-width: 1rpx;
      border-bottom-style: solid;
      border-bottom-color: rgba(0, 0, 0, 0.15);
    }
    text.iconfont {
      font-size: 40rpx;
      margin-right: 20rpx;
    }
    input {
      width: 100%;
    }
    .submit {
      margin-top: 92rpx;
      button {
        height: 100rpx;
        background: #5cbb89;
        font-size: 40rpx;
        color: #fff;
      }
    }
  }
}
</style>
