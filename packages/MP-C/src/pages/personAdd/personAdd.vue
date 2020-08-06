<template>
  <div style="height: 100%; background: rgba(0, 0, 0, 0.04);">
    <div class="hint">
      提示：请如实填写就诊人员信息，如因信息维护产生的后果自行负责。
    </div>
    <div class="personInfo">
      <dpmsCellInput
        title="姓名"
        v-model="form.personnelName"
        placeholder="请输入姓名"
      />
      <dpmsEnumsPicker
        title="性别"
        v-model="form.gender"
        enumsKey="Gender"
        placeholder="请选择性别"
        headerText="选择性别"
        isLink
      />
      <dpmsDatePicker
        title="出生日期"
        mode="date"
        placeholder="请选择出生日期"
        v-model="form.birthday"
        :end="endDate"
      />
      <dpmsEnumsPicker
        title="联系电话标签"
        v-model="form.contactLabel"
        placeholder="请选择联系电话标签"
        enumsKey="ContactLabel"
      />
      <dpmsCellInput
        type="number"
        title="联系电话"
        v-model="form.mobile"
        placeholder="请输入联系电话"
        @change="phone"
      />
      <div class="info" v-show="needAuthCode">
        <dpmsCellInput type="number" title="验证码" v-model="form.authCode" />
        <span
          class="getAuthCode"
          :class="{ disabled: !!second }"
          @click="getCode"
          >{{ second ? `${second}秒后再试` : '获取验证码' }}</span
        >
      </div>
      <dpmsCellPicker
        title="默认人员"
        placeholder="是否设置为默认人员"
        v-model="form.defaultPersonnel"
        :list="defaultType"
      />
    </div>
    <div class="btn" @click="submit">
      <button>确认</button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import customerAPI from '@/APIS/customer/customer.api'
import { getStorage, setStorage, STORAGE_KEY } from '@/utils/storage'

export default {
  data() {
    return {
      endDate: moment().format('YYYY-MM-DD'),
      male: ['男', '女'],
      second: 0,
      defaultType: [
        { label: '开', value: true },
        { label: '关', value: false },
      ],
      needAuthCode: true,
      form: {
        personnelName: '',
        gender: '',
        birthday: '',
        mobile: '',
        contactLabel: '',
        authCode: '',
        defaultPersonnel: null,
        userId: getStorage(STORAGE_KEY.STAFF).id,
        id: '',
        personnelId: '',
      },
    }
  },
  created() {},
  methods: {
    getCode() {
      console.log('------------------')
      if (!/^1[3-9]\d{9}$/.test(this.form.mobile))
        return this.$utils.show('请输入正确的手机号')
      if (this.second) return
      this.countdown.call(this, 60, (sec) => {
        this.second = sec
      })
      customerAPI.sentSms({ mobile: this.form.mobile }).then((res) => {
        console.log(res)
      })
    },
    countdown(sec, cb) {
      clearInterval(this.timer)
      if (sec > 0) {
        cb(--sec)
        this.timer = setInterval(
          (_) => this.countdown.call(this, sec, cb),
          1000,
        )
      } else {
        clearInterval(this.timer)
      }
    },
    submit() {
      if ((this.form.defaultPersonnel = '开')) {
        this.form.defaultPersonnel = true
      } else {
        this.form.defaultPersonnel = false
      }
      customerAPI
        .creatCustomer(this.form)
        .then((res) => {
          console.log('1111111111', res)
        })
        .catch((error) => {
          console.log('form', this.form)
        })
    },
    phone() {
      if ((this.form.mobile.length = 11)) {
        customerAPI
          .needVerify({
            userId: getStorage(STORAGE_KEY.STAFF).id,
            mobile: this.form.mobile,
          })
          .then((res) => {
            console.log(res)
            this.needAuthCode = res.data
          })
      }
    },
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
  .getAuthCode {
    position: absolute;
    top: 44rpx;
    right: 40rpx;
    display: inline-block;
    color: #5cbb89;
    font-size: 34rpx;
    z-index: 999;
    font-weight: 400rpx;
    padding-left: 15rpx;
    border-left: 2rpx rgba(0, 0, 0, 0.15) solid;
    &.disabled {
      color: #999;
      z-index: 0;
    }
  }
}
</style>
