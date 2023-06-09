<template>
  <view class="bg">
    <view class="status_bar"></view>
    <view class="content">
      <view class="login">
        <label>
          <text class="iconfont icon-institutions mr-20" />
          <input
            placeholder="请输入会员名"
            placeholder-style="color:rgba(0,0,0,0.25)"
            v-model="loginForm.memberCode"
            @blur="handleBlur('memberCode')"
            @focus="handleFocus('memberCode')"
          />
          <view
            class="btn-clear"
            v-if="
              loginForm.memberCode.trim() !== '' &&
              loginFormFocusFlag.memberCode
            "
            @touchstart="clearForLoginForm('memberCode')"
          >
            <text class="iconfont icon-close"></text>
          </view>
        </label>
        <label>
          <text class="iconfont icon-user mr-20" />
          <input
            placeholder="请输入用户名"
            placeholder-style="color:rgba(0,0,0,0.25)"
            v-model="loginForm.username"
            @blur="handleBlur('username')"
            @focus="handleFocus('username')"
          />
          <view
            class="btn-clear"
            v-if="
              loginForm.username.trim() !== '' && loginFormFocusFlag.username
            "
            @touchstart="clearForLoginForm('username')"
          >
            <text class="iconfont icon-close"></text>
          </view>
        </label>
        <label style="position: relative;">
          <text class="iconfont icon-password mr-20" />
          <!--  ios系统 置于passward input 前面的一个textinput框会有类型错误的bug（导致不能切换第三方输入法）
           这个input不做实际用 ，仅仅隐藏起来作为一个占位-->
          <input style="position: absolute; z-index: -1;" disabled />
          <input
            password
            placeholder="请输入密码"
            placeholder-style="color:rgba(0,0,0,0.25)"
            v-model="loginForm.password"
            @blur="handleBlur('password')"
            @focus="handleFocus('password')"
          />
          <view
            class="btn-clear"
            v-if="
              loginForm.password.trim() !== '' && loginFormFocusFlag.password
            "
            @touchstart="clearForLoginForm('password')"
          >
            <text class="iconfont icon-close"></text>
          </view>
        </label>
        <button
          class="submit"
          type="default"
          :loading="isLoading"
          :disabled="isLoading"
          @click="openSelect"
        >
          登 录
        </button>
      </view>

      <selectMedicalInstitution
        ref="selectMedicalInstitution"
        :memberCode="loginForm.memberCode"
        :username="loginForm.username"
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
      authAPI
        .login({
          memberCode: this.loginForm.memberCode,
          username: this.loginForm.username,
          password: this.loginForm.password,
          _mtId: val.id,
          medicalInstitutionId: val.id,
        })
        .then((res) => {
          const { _token, medicalInstitution, staff } = res.data
          setStorage(STORAGE_KEY.LOGIN_INFO, {
            memberCode: this.loginForm.memberCode,
            username: this.loginForm.username,
          })
          setStorage(STORAGE_KEY.ACCESS_TOKEN, _token)
          medicalInstitution.memberCode = this.loginForm.memberCode
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
    openSelect() {
      this.validate((err, fileds) => {
        if (err) {
          this.$dpmsUtils.show(err[0].message)
          return
        }

        // 判断是否单体
        this.isLoading = true
        setStorage(STORAGE_KEY.LOGIN_TYPE, 2)
        // removeStorage(STORAGE_KEY.LOGIN_TYPE)
        systemAPI
          .getInstitutionListScrm({
            memberName: this.loginForm.memberCode,
            username: this.loginForm.username,
          })
          .then((res) => {
            const { medicalInstitutionType, medicalInstitutionId } = res.data[0]
            if (medicalInstitutionType === 2) {
              this.$refs.selectMedicalInstitution.show()
            } else {
              this.login({ id: medicalInstitutionId })
            }
          })
          .catch((res) => {
            this.isLoading = false
          })
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
  padding: 470rpx 32rpx 0;
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
  margin-top: 92rpx;
  height: 100rpx;
  background: #5cbb89;
  font-size: 40rpx;
  color: #fff;
}
</style>
