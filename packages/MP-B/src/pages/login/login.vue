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
        @onDisList="isLoading = false"
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
      isLoading: false,
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
  onLoad() {
    uni.showShareMenu()
  },
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
          this.$store.commit(
            'workbenchStore/setMedicalInstitution',
            medicalInstitution,
          )
          this.$store.commit('workbenchStore/setStaff', staff)
          this.getEnums()
        })
        .catch((res) => {
          this.isLoading = false
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
    openSelect() {
      this.validate((err, fileds) => {
        if (err) {
          this.$utils.show(err[0].message)
          return
        }

        // 判断是否单体
        this.isLoading = true
        systemAPI
          .getInstitutionList({ memberCode: this.loginForm.memberCode })
          .then((res) => {
            const { institutionChainType, medicalInstitutionId } = res.data
            if (institutionChainType === 1) {
              this.login({ id: medicalInstitutionId })
            } else {
              this.$refs.selectMedicalInstitution.show()
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
