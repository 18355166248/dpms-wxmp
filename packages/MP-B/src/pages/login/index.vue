<template>
  <view>
    <view class="status_bar"></view>
    <view class="content">
      <view class="login">
        <label>
          <text class="iconfont icon-institutions" />
          <input placeholder="请输入会员名" v-model="loginForm.memberCode" />
        </label>
        <label>
          <text class="iconfont icon-user" />
          <input placeholder="请输入用户名" v-model="loginForm.username" />
        </label>
        <label>
          <text class="iconfont icon-password" />
          <input
            password
            placeholder="请输入密码"
            v-model="loginForm.username"
          />
        </label>
        <div style="margin: 16px;">
          <van-button round block type="info" @click="onSubmit"
            >登录</van-button
          >
        </div>
      </view>

      <selectMedicalInstitution
        ref="selectMedicalInstitution"
        :memberCode="loginForm.memberCode"
        @confirm="treeConfirm"
      ></selectMedicalInstitution>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        memberCode: 'Hello',
        username: '',
        password: '',
      },
    }
  },
  onLoad() {},
  methods: {
    onSubmit() {
      this.$refs.selectMedicalInstitution.show()
      console.log('memberCode', this.loginForm.memberCode)
    },
  },
}
</script>

<style lang="scss" scoped>
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
</style>
