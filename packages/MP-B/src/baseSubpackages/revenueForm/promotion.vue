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
      <view class="tit">现金收款</view>
      <view class="flex">
        <view class="title">总收款：</view>
        <view class="fee">¥2,262.00</view>
      </view>
      <view class="flex">
        <view class="title">初诊现金收款：</view>
        <view class="fee">¥2,262.00</view>
      </view>
      <view class="flex">
        <view class="title">复诊现金收款：</view>
        <view class="fee">¥2,262.00</view>
      </view>
      <view style="height: 32rpx;"></view>
    </view>
    <view class="list">
      <view class="tit">营业收入</view>
      <view class="flex">
        <view class="title">总收入：</view>
        <view class="fee">¥2,262.00</view>
      </view>
      <view class="flex">
        <view class="title">初诊收入：</view>
        <view class="fee">¥2,262.00</view>
      </view>
      <view class="flex">
        <view class="title">复诊收入：</view>
        <view class="fee">¥2,262.00</view>
      </view>
      <view style="height: 32rpx;"></view>
    </view>
    <view class="list">
      <view class="tit">到诊统计：</view>
      <view class="flex">
        <view class="title">到诊人次：</view>
        <view class="fee">¥2,262.00</view>
      </view>
      <view class="flex">
        <view class="title">初诊人次：</view>
        <view class="fee">¥2,262.00</view>
      </view>
      <view class="flex">
        <view class="title">复诊人次：</view>
        <view class="fee">¥2,262.00</view>
      </view>
      <view style="height: 32rpx;"></view>
    </view>
    <view class="list">
      <view class="tit">到诊成交统计：</view>
      <view class="flex">
        <view class="title">成交人次：</view>
        <view class="fee">¥2,262.00</view>
      </view>
      <view class="flex">
        <view class="title">成交率：</view>
        <view class="fee">¥2,262.00</view>
      </view>
      <view class="flex">
        <view class="title">成交单体：</view>
        <view class="fee">¥2,262.00</view>
      </view>
      <view class="flex">
        <view class="title">初诊成交人次：</view>
        <view class="fee">¥2,262.00</view>
      </view>
      <view class="flex">
        <view class="title">复诊成交人次：</view>
        <view class="fee">¥2,262.00</view>
      </view>
      <view class="flex">
        <view class="title">初诊成交率：</view>
        <view class="fee">¥2,262.00</view>
      </view>
      <view class="flex">
        <view class="title">复诊成交率：</view>
        <view class="fee">¥2,262.00</view>
      </view>
      <view class="flex">
        <view class="title">初诊单体：</view>
        <view class="fee">¥2,262.00</view>
      </view>
      <view style="height: 32rpx;"></view>
    </view>
  </view>
</template>

<script>
import moment from 'moment'

export default {
  data() {
    return {
      pickerValue: moment().format('YYYY-MM-DD'),
    }
  },
  watch: {
    value(newVal) {
      this.pickerValue = newVal
    },
  },
  methods: {
    onChange(e) {
      this.pickerValue = e.detail.value
    },
    shiftPrevDate(e) {
      e.stopPropagation()
      this.pickerValue = moment(this.pickerValue)
        .add(-1, 'days')
        .format('YYYY-MM-DD')
    },
    shiftNextDate(e) {
      e.stopPropagation()
      this.pickerValue = moment(this.pickerValue)
        .add(1, 'days')
        .format('YYYY-MM-DD')
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
  margin-bottom: 20rpx;
  .tit {
    font-size: 36rpx;
    font-weight: 500;
    text-align: left;
    color: rgba(0, 0, 0, 0.9);
    line-height: 44rpx;
    padding-left: 32rpx;
    padding-top: 20rpx;
    margin-bottom: 36rpx;
  }
  .title {
    width: 30%;
    padding-left: 32rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.7);
    line-height: 36rpx;
  }
  .fee {
    width: 70%;
    padding-right: 32rpx;
    text-align: right;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.7);
    font-size: 28rpx;
    line-height: 36rpx;
  }
}
</style>
