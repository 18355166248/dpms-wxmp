<template>
  <view class="bg">
    <view class="status_bar"></view>
    <view class="content">
      <button
        class="submit"
        type="default"
        :loading="isLoading"
        :disabled="isLoading"
        @click="toWxLogin"
      >
        微信一键登录
      </button>
      <button class="pasLogin" type="default" @click="toPasLogin">
        账号密码登录
      </button>

      <selectMedicalInstitution
        ref="selectMedicalInstitution"
        :memberCode="loginForm.memberCode"
        :username="loginForm.username"
        :loginType="1"
        @confirm="login"
        @onHide="hide"
      ></selectMedicalInstitution>
    </view>
  </view>
</template>

<script>
import _ from 'lodash'
import AsyncValidator from 'async-validator'
import systemAPI from '@/APIS/system.api'
import authAPI from '@/APIS/auth/auth.api'
import appointmentAPI from 'APIS/appointment/appointment.api'
import { setStorage, getStorage, STORAGE_KEY } from '@/utils/storage'

export default {
  data() {
    return {
      isLoading: false,
      institutionList: [],
      loginInstitutionList: [],
      loginFormFocusFlag: {
        memberCode: false,
        username: false,
        password: false,
      },
      loginForm: {
        memberCode: getStorage(STORAGE_KEY.LOGIN_INFO)
          ? getStorage(STORAGE_KEY.LOGIN_INFO).memberCode
          : '',
        username: getStorage(STORAGE_KEY.LOGIN_INFO)
          ? getStorage(STORAGE_KEY.LOGIN_INFO).username
          : '',
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
  onLoad() {
    uni.showShareMenu({
      title: '北吉熊口腔',
      content: '医疗服务云',
    })
  },
  onUnload() {
    this.isLoading = false
  },
  methods: {
    clearForLoginForm(field) {
      this.loginForm[field] = ''
    },
    handleBlur(field) {
      this.$set(this.loginFormFocusFlag, field, false)
    },
    handleFocus(field) {
      this.$set(this.loginFormFocusFlag, field, true)
    },
    login(val) {
      wx.login({
        success: ({ code }) => {
          systemAPI
            .getLoginWxCode({
              code,
              institutionId: val.id,
            })
            .then((res) => {
              const { _token, medicalInstitution, staff } = res.data
              setStorage(STORAGE_KEY.ACCESS_TOKEN, _token)
              // medicalInstitution.memberCode = this.loginForm.memberCode
              this.$store.commit(
                'workbenchStore/setMedicalInstitution',
                medicalInstitution,
              )
              this.$store.commit('workbenchStore/setStaff', staff)
              this.getLoginInfo(medicalInstitution, staff, _token)
              this.getApptSetting()
              this.getMenu(_token)
              this.getEnums()
            })
            .catch((res) => {
              this.isLoading = false
            })
        },
        fail(...args) {
          console.log(args)
        },
      })
    },
    //获得枚举
    getEnums() {
      systemAPI.getDataDict().then((res) => {
        setStorage(STORAGE_KEY.ENUMS, res.data)
        this.$dpmsUtils.reLaunch({
          url: '/pages/home/home',
        })
      })
    },
    //设置登陆信息
    getLoginInfo(medicalInstitution, staff, _token) {
      systemAPI
        .getLoginInfo({
          _token,
        })
        .then((res) => {
          this.$store.commit(
            'workbenchStore/setMedicalInstitution',
            Object.assign(medicalInstitution, res.data.medicalInstitution),
          )
          this.$store.commit(
            'workbenchStore/setStaff',
            Object.assign(staff, res.data.staff),
          )
        })
        .catch((res) => {
          this.isLoading = false
        })
    },
    //获得菜单
    getMenu(_token) {
      systemAPI
        .menuAll({
          _token,
        })
        .then((res) => {
          const { data } = res
          this.$store.commit('workbenchStore/setMenu', data)
        })
        .catch((res) => {
          this.isLoading = false
        })
    },
    // 获取预约视图设置
    getApptSetting() {
      appointmentAPI
        .getSetting()
        .then((res) => {
          const { data } = res
          this.$store.commit('workbenchStore/setApptSetting', data)
        })
        .catch((res) => {
          this.isLoading = false
        })
    },
    toWxLogin() {
      // 获取用户信息
      wx.getUserProfile({
        desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          this.getMedicalInstitution()
        },
        fail: (err) => {
          uni.showToast({
            icon: 'none',
            title: '获取信息失败',
          })
        },
      })
    },
    // 获取机构信息
    getMedicalInstitution() {
      this.isLoading = true
      setStorage(STORAGE_KEY.LOGIN_TYPE, 1)
      systemAPI
        .getInstitutionListScrm()
        .then((res) => {
          const { medicalInstitutionType, medicalInstitutionId } = res.data[0]
          if (
            medicalInstitutionType === 2 &&
            (res.data.length > 1 ||
              (res.data[0].children && res.data[0].children.length > 0))
          ) {
            this.$refs.selectMedicalInstitution.show()
          } else {
            this.login({ id: medicalInstitutionId })
          }
        })
        .catch((res) => {
          this.isLoading = false
        })
    },
    toPasLogin() {
      wx.navigateTo({
        url: '/pages/login/pasLogin',
      })
    },
    validate(callback) {
      let validator = new AsyncValidator(this.rules)

      validator.validate(this.loginForm, (errors, fields) => {
        _.isFunction(callback) && callback(errors, fields)
      })
    },
    hide(option) {
      // 选择诊所的时候loading效果不能消失
      if (option && option.type === 'select') return
      this.isLoading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.bg {
  height: 100%;
  background: #fff;
}
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
  background: #5cbb8a;
}
.content {
  height: 100%;
  padding: 470rpx 56rpx 0;
  background: #fff
    url('https://medcloud.oss-cn-shanghai.aliyuncs.com/dental/saas/mini-app/logo.png')
    no-repeat 0 0;
  background-size: contain;

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
      position: relative;
      padding-right: 90rpx;
    }
    .btn-clear {
      position: absolute;
      right: 0;
      z-index: 2;
      width: 80rpx;
      height: 100rpx;
      text-align: right;
      .iconfont {
        opacity: 0.25;
      }
    }
    .iconfont {
      font-size: 40rpx;
      color: #000;
      opacity: 0.65;
    }
    input {
      width: 100%;
    }
  }
}
.submit {
  margin-top: 252rpx;
  height: 100rpx;
  background: #5cbb89;
  font-size: 40rpx;
  color: #fff;
}
.pasLogin {
  margin-top: 64rpx;
  height: 100rpx;
  background: #fff;
  font-size: 40rpx;
  color: #5cbb89;
  border: 2rpx solid #5cbb89;
}
</style>
