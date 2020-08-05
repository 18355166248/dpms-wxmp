<template>
  <div style="height: 100%; background: rgba(0, 0, 0, 0.04);">
    <div class="hint">
      提示：请如实填写就诊人员信息，如因信息维护产生的后果自行负责。
    </div>
    <div class="personInfo">
      <dpmsCellInput title="姓名" v-model="form.name" />
      <div class="info">
        <dpmsEnumsPicker
          title="性别"
          v-model="form.gender"
          enumsKey="Gender"
          isLink
        />
        <span class="iconfont icon-right"></span>
      </div>
      <div class="info">
        <dpmsDatePicker
          title="出生日期"
          mode="date"
          v-model="form.birthday"
          :end="endDate"
        />
        <span class="iconfont icon-right"></span>
      </div>
      <div class="info">
        <dpmsEnumsPicker
          title="联系电话标签"
          v-model="form.contactLabel"
          enumsKey="ContactLabel"
        />
        <span class="iconfont icon-right"></span>
      </div>
      <dpmsCellInput type="number" title="联系电话" v-model="form.mobile" />
      <dpmsCellInput type="number" title="验证码" v-model="form.authCode" />
      <div class="info">
        <dpmsEnumsPicker title="默认人员" v-model="form.default" />
        <span class="iconfont icon-right"></span>
      </div>
    </div>
    <div class="btn">
      <button>确认</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      endDate: moment().format('YYYY-MM-DD'),
      form: {
        name: '',
        gender: '',
        birthday: '',
        mobile: '',
        contactLabel: '',
        authCode: '',
        default: '',
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.hint {
  box-sizing: border-box;
  height: 98rpx;
  padding: 13rpx 24rpx;
  background: #fff7e6;
  color: #faad14;
  font-size: 26rpx;
  font-weight: 400;
}
.personInfo {
  background: white;
}
.btn {
  padding: 0 64rpx;
  button {
    border-radius: 8px;
    border: none;
    font-size: 36rpx;
    background: #5cbb89;
    color: #fff;
    margin-top: 56rpx;
  }
}
.info {
  position: relative;
  .icon-right {
    position: absolute;
    top: 44rpx;
    right: 40rpx;
    color: rgba(0, 0, 0, 0.25);
  }
}
</style>
