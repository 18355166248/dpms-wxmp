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
        <view class="title">到诊人次</view>
        <view class="total">0</view>
        <view class="first">0</view>
        <view class="pre">0</view>
      </view>
      <view class="listTitle">
        <view class="title">到诊人次</view>
        <view class="total">0</view>
        <view class="first">0</view>
        <view class="pre">0</view>
      </view>
      <view class="listTitle">
        <view class="title">到诊人次</view>
        <view class="total">0</view>
        <view class="first">0</view>
        <view class="pre">0</view>
      </view>
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
  .listTitle {
    display: flex;
    font-size: 28rpx;
    font-weight: 500;
    line-height: 28px;
    padding-top: 24rpx;
  }
  .title {
    padding-left: 32rpx;
    width: 150rpx;
    text-align: right;
  }
  .total {
    width: 200rpx;
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
