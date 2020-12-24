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
      <text class="iconfont icon-arrow-left" @click="shiftPrevDate" />
      <text class="iconfont icon-arrow-right" @click="shiftNextDate" />
    </view>
    <view class="list">
      <view class="listTitle">
        <view class="title"></view>
        <view class="total">总计</view>
        <view class="first">初诊</view>
        <view class="pre">复诊</view>
      </view>
      <view class="listContent">
        <view class="title">预约人次</view>
        <view class="total">0</view>
        <view class="first">0</view>
        <view class="pre">0</view>
      </view>
      <view class="listContent">
        <view class="title">到诊人次</view>
        <view class="total">0</view>
        <view class="first">0</view>
        <view class="pre">0</view>
      </view>
      <view class="listContent">
        <view class="title">到诊率</view>
        <view class="total">0</view>
        <view class="first">0</view>
        <view class="pre">0</view>
      </view>
      <view class="listContent">
        <view class="title">成交人次</view>
        <view class="total">0</view>
        <view class="first">0</view>
        <view class="pre">0</view>
      </view>
      <view class="listContent">
        <view class="title">现金收款</view>
        <view class="total">0</view>
        <view class="first">0</view>
        <view class="pre">0</view>
      </view>
      <view class="listContent">
        <view class="title">营业收入</view>
        <view class="total">0</view>
        <view class="first">0</view>
        <view class="pre">0</view>
      </view>
      <view class="listContent">
        <view class="title">现金收款</view>
        <view class="total">0</view>
        <view class="first">0</view>
        <view class="pre">0</view>
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
      data: {},
    }
  },
  mounted() {
    this.getAppointmentList(this.pickerValue)
  },
  methods: {
    onChange(e) {
      this.pickerValue = e.detail.value
      this.getAppointmentList(this.pickerValue)
    },
    getAppointmentList(date) {
      billAPI
        .appointmentList({
          appointmentDate: moment(date).format('x'),
        })
        .then((res) => {
          console.log(res)
        })
        .catch((res) => {})
    },
    shiftPrevDate(e) {
      e.stopPropagation()
      this.pickerValue = moment(this.pickerValue)
        .add(-1, 'days')
        .format('YYYY-MM-DD')
      this.getAppointmentList(this.pickerValue)
    },
    shiftNextDate(e) {
      e.stopPropagation()
      this.pickerValue = moment(this.pickerValue)
        .add(1, 'days')
        .format('YYYY-MM-DD')
      this.getAppointmentList(this.pickerValue)
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
