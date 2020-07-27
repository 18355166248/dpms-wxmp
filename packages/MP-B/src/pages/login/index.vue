<template>
  <div class="content">
    <img src alt />
    <div class="login">
      <van-field
        left-icon="friends"
        placeholder="请输入会员名"
        :value="loginForm.memberCode"
        @input="loginForm.memberCode = $event.mp.detail"
      />
      <van-field
        left-icon="manager"
        placeholder="请输入用户名"
        :value="loginForm.username"
        @input="loginForm.username = $event.mp.detail"
      />
      <van-field
        type="password"
        left-icon="lock"
        placeholder="请输入密码"
        :value="loginForm.password"
        @input="loginForm.password = $event.mp.detail"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" @click="onSubmit">登录</van-button>
      </div>
    </div>

    <selectMedicalInstitution ref="selectMedicalInstitution" />
  </div>
</template>

<script>
import selectMedicalInstitution from '../../components/selectMedicalInstitution/selectMedicalInstitution.vue'

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
      this.$refs.selectMedicalInstitution.showTree()
      console.log('memberCode', this.loginForm.memberCode)
    },
  },
  components: {
    selectMedicalInstitution,
  },
}
</script>

<style lang="scss" scoped></style>
