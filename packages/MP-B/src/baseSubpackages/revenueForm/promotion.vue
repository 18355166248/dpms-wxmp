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
      <view class="lineHr"></view>
    </view>
    <view class="list">
      <view class="tit">现金收款</view>
      <view class="flex">
        <view class="title">总收款：</view>
        <view class="fee">{{ formatPrice(data.totalAdvance) }}</view>
      </view>
      <view class="flex">
        <view class="title">初诊现金收款：</view>
        <view class="fee">{{ formatPrice(data.firstVisitAdvance) }}</view>
      </view>
      <view class="flex">
        <view class="title">复诊现金收款：</view>
        <view class="fee">{{ formatPrice(data.nextVisitAdvance) }}</view>
      </view>
      <view style="height: 32rpx;"></view>
    </view>
    <view class="list">
      <view class="tit">营业收入</view>
      <view class="flex">
        <view class="title">总收入：</view>
        <view class="fee">{{ formatPrice(data.totalIncome) }}</view>
      </view>
      <view class="flex">
        <view class="title">初诊收入：</view>
        <view class="fee">{{ formatPrice(data.firstVisitIncome) }}</view>
      </view>
      <view class="flex">
        <view class="title">复诊收入：</view>
        <view class="fee">{{ formatPrice(data.nextVisitIncome) }}</view>
      </view>
      <view style="height: 32rpx;"></view>
    </view>
    <view class="list">
      <view class="tit">到诊统计：</view>
      <view class="flex">
        <view class="title">到诊人次：</view>
        <view class="fee">{{ data.totalVisitPerson || 0 }}</view>
      </view>
      <view class="flex">
        <view class="title">初诊人次：</view>
        <view class="fee">{{ data.firstVisitPerson || 0 }}</view>
      </view>
      <view class="flex">
        <view class="title">复诊人次：</view>
        <view class="fee">{{ data.nextVisitPerson || 0 }}</view>
      </view>
      <view style="height: 32rpx;"></view>
    </view>
    <view class="list">
      <view class="tit">到诊成交统计：</view>
      <view class="flex">
        <view class="title">成交人次：</view>
        <view class="fee">{{ data.dealPerson || 0 }}</view>
      </view>
      <view class="flex">
        <view class="title">成交率：</view>
        <view class="fee">{{ data.dealRate ? data.dealRate + '%' : 0 }}</view>
      </view>
      <view class="flex">
        <view class="title">成交单体：</view>
        <view class="fee">{{ formatPrice(data.dealAverage) }}</view>
      </view>
      <view class="flex">
        <view class="title">初诊成交人次：</view>
        <view class="fee">{{ data.firstVisitDealPerson || 0 }}</view>
      </view>
      <view class="flex">
        <view class="title">复诊成交人次：</view>
        <view class="fee">{{ data.nextVisitDealPerson || 0 }}</view>
      </view>
      <view class="flex">
        <view class="title">初诊成交率：</view>
        <view class="fee">{{
          data.firstVisitDealRate ? data.firstVisitDealRate + '%' : 0
        }}</view>
      </view>
      <view class="flex">
        <view class="title">复诊成交率：</view>
        <view class="fee">{{
          data.nextVisitDealRate ? data.nextVisitDealRate + '%' : 0
        }}</view>
      </view>
      <view class="flex">
        <view class="title">初诊单体：</view>
        <view class="fee">{{ formatPrice(data.firstVisitAverage) }}</view>
      </view>
      <view style="height: 32rpx;"></view>
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
    this.getRevenueList(this.pickerValue)
  },
  methods: {
    onChange(e) {
      this.pickerValue = e.detail.value
      this.getRevenueList(this.pickerValue)
    },
    shiftPrevDate(e) {
      e.stopPropagation()
      this.pickerValue = moment(this.pickerValue)
        .add(-1, 'days')
        .format('YYYY-MM-DD')
      this.getRevenueList(this.pickerValue)
    },
    getRevenueList(date) {
      uni.showLoading({
        title: '数据加载中',
        mask: true,
      })
      billAPI
        .revenueList({
          date: moment(date).format('x'),
        })
        .then((res) => {
          const { records } = res.data
          this.data = records.length > 0 ? records[0] : {}
        })
        .catch((res) => {})
      uni.hideLoading()
    },
    shiftNextDate(e) {
      e.stopPropagation()
      this.pickerValue = moment(this.pickerValue)
        .add(1, 'days')
        .format('YYYY-MM-DD')
      this.getRevenueList(this.pickerValue)
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
.lineHr {
  width: 686rpx;
  height: 2rpx;
  margin-left: 32rpx;
  background: rgba(0, 0, 0, 0.15);
}
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
    width: 300rpx;
    margin-left: 225rpx;
    .dateTitle {
      width: 280rpx;
      margin-left: 10rpx;
      height: 90rpx;
      line-height: 90rpx;
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
