<template>
  <view class="content">
    <view class="date">
      <picker
        class="datePicker"
        :value="pickerValue"
        @change="onChange"
        mode="date"
      >
        <view class="dateTitle">{{ pickerValue }}</view>
      </picker>
      <text class="iconfont icon-arrow-left" />
      <view
        style="
          position: absolute;
          position: absolute;
          height: 80rpx;
          width: 80rpx;
          top: 0rpx;
          left: 178rpx;
        "
        @click="shiftPrevDate"
      ></view>
      <text class="iconfont icon-arrow-right" />
      <view
        style="
          position: absolute;
          position: absolute;
          height: 80rpx;
          width: 80rpx;
          top: 0rpx;
          right: 178rpx;
        "
        @click="shiftNextDate"
      ></view>
    </view>
    <view class="list">
      <view class="listTitle">
        <view class="title"></view>
        <view class="total">总计</view>
        <view class="first">初诊</view>
        <view class="pre">复诊</view>
      </view>
      <view class="listContent">
        <view class="title">到诊人次</view>
        <view class="total">{{ data.registerNum || 0 }}</view>
        <view class="first">{{ data.detail[0].registerNum || 0 }}</view>
        <view class="pre">{{ data.detail[1].registerNum || 0 }}</view>
      </view>
      <view class="listContent">
        <view class="title">预约到诊人次</view>
        <view class="total">{{ data.appointmentRegisterNum || 0 }}</view>
        <view class="first">{{
          data.detail[0].appointmentRegisterNum || 0
        }}</view>
        <view class="pre">{{
          data.detail[1].appointmentRegisterNum || 0
        }}</view>
      </view>
      <view class="listContent">
        <view class="title">预约到诊占比</view>
        <view class="total">{{ data.rateOfAppointmentRegister || '-' }}</view>
        <view class="first">{{
          data.detail[0].rateOfAppointmentRegister || '-'
        }}</view>
        <view class="pre">{{
          data.detail[1].rateOfAppointmentRegister || '-'
        }}</view>
      </view>
      <view class="listContent">
        <view class="title">自然到诊人次</view>
        <view class="total">{{ data.nonappointmentRegisterNum || 0 }}</view>
        <view class="first">{{
          data.detail[0].nonappointmentRegisterNum || 0
        }}</view>
        <view class="pre">{{
          data.detail[1].nonappointmentRegisterNum || 0
        }}</view>
      </view>
      <view class="listContent">
        <view class="title">自然到诊占比</view>
        <view class="total">{{
          data.rateOfNonappointmentRegister || '-'
        }}</view>
        <view class="first">{{
          data.detail[0].rateOfNonappointmentRegister || '-'
        }}</view>
        <view class="pre">{{
          data.detail[1].rateOfNonappointmentRegister || '-'
        }}</view>
      </view>
      <view class="listContent">
        <view class="title">成交人次</view>
        <view class="total">{{ data.doneNum || 0 }}</view>
        <view class="first">{{ data.detail[0].doneNum || 0 }}</view>
        <view class="pre">{{ data.detail[1].doneNum || 0 }}</view>
      </view>
      <view class="listContent">
        <view class="title">现金收款</view>
        <view class="total">{{ formatPrice(data.cashRevenue) }}</view>
        <view class="first">{{ formatPrice(data.detail[0].cashRevenue) }}</view>
        <view class="pre">{{ formatPrice(data.detail[1].cashRevenue) }}</view>
      </view>
      <view class="listContent">
        <view class="title">营业收入</view>
        <view class="total">{{ formatPrice(data.operatingRevenue) }}</view>
        <view class="first">{{
          formatPrice(data.detail[0].operatingRevenue)
        }}</view>
        <view class="pre">{{
          formatPrice(data.detail[1].operatingRevenue)
        }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import moment from 'moment'
import billAPI from '@/APIS/bill/bill.api'

export default {
  data() {
    return {
      pickerValue: moment().format('YYYY-MM-DD'),
      data: {
        detail: [{}, {}],
      },
    }
  },
  mounted() {
    this.diagnosisList(this.pickerValue)
  },
  methods: {
    onChange(e) {
      this.pickerValue = e.detail.value
      this.diagnosisList(this.pickerValue)
    },
    diagnosisList(date) {
      uni.showLoading({
        title: '数据加载中',
        mask: true,
      })
      billAPI
        .diagnosisList({
          registerDate: moment(date).format('x'),
        })
        .then((res) => {
          if (!!res.data.detail) {
            this.data = res.data
          } else {
            this.data = {
              detail: [{}, {}],
            }
          }
        })
        .catch((res) => {})
      uni.hideLoading()
    },
    shiftPrevDate(e) {
      e.stopPropagation()
      this.pickerValue = moment(this.pickerValue)
        .add(-1, 'days')
        .format('YYYY-MM-DD')
      this.diagnosisList(this.pickerValue)
    },
    shiftNextDate(e) {
      e.stopPropagation()
      this.pickerValue = moment(this.pickerValue)
        .add(1, 'days')
        .format('YYYY-MM-DD')
      this.diagnosisList(this.pickerValue)
    },
    formatPrice(money, sysmbol = '¥', places = 2) {
      const zero = `${sysmbol}0.00`

      if (isNaN(money) || money === '') return zero

      if (money && money != null) {
        money = `${money}`
        let left = money.split('.')[0] // 小数点左边部分
        let right = money.split('.')[1] // 小数点右边
        // 保留places位小数点，当长度没有到places时，用0补足。
        right = right
          ? right.length >= places
            ? '.' + right.substr(0, places)
            : '.' + right + '0'.repeat(places - right.length)
          : '.' + '0'.repeat(places)
        var temp = left
          .split('')
          .reverse()
          .join('')
          .match(/(\d{1,3})/g) // 分割反向转为字符串然后最多3个，最少1个，将匹配的值放进数组返回
        const numericalSymbols = Number(money) < 0 ? '-' : ''
        return (
          sysmbol +
          numericalSymbols +
          temp.join(',').split('').reverse().join('') +
          right
        ) // 补齐正负号和货币符号，数组转为字符串，通过逗号分隔，再分割（包含逗号也分割）反向转为字符串变回原来的顺序
      } else if (money === 0) {
        return zero
      } else {
        return zero
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.date {
  margin-top: 20rpx;
  height: 96rpx;
  background-color: #fff;
  position: relative;
  .icon-arrow-left {
    position: absolute;
    top: 28rpx;
    left: 200rpx;
  }
  .icon-arrow-right {
    position: absolute;
    right: 200rpx;
    top: 28rpx;
  }
  .datePicker {
    width: 737rpx;
    .dateTitle {
      width: 686rpx;
      margin-left: 32rpx;
      height: 90rpx;
      line-height: 90rpx;
      border-bottom: 2rpx solid rgba(0, 0, 0, 0.15);
      text-align: center;
    }
  }
}
.flex {
  display: flex;
  margin-bottom: 16rpx;
}
.line {
  width: 80%;
  height: 2rpx;
  background: rgba(0, 0, 0, 0.15);
  margin-left: 10%;
}
.list {
  background-color: #fff;
  padding-bottom: 32rpx;
  .listTitle {
    display: flex;
    font-size: 28rpx;
    font-weight: 500;
    line-height: 28rpx;
    padding-top: 24rpx;
    margin-bottom: 40rpx;
  }
  .listContent {
    display: flex;
    font-size: 28rpx;
    font-weight: 300;
    line-height: 18rpx;
    padding-top: 24rpx;
    height: 28rpx;
  }
  .title {
    padding-left: 32rpx;
    width: 200rpx;
  }
  .total {
    width: 150rpx;
    text-align: right;
  }
  .first {
    width: 200rpx;
    text-align: right;
  }
  .pre {
    width: 180rpx;
    text-align: right;
    padding-right: 32rpx;
  }
}
</style>
