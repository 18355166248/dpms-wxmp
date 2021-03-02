<template>
  <view class="content">
    <view class="list">
      <view class="listTitle">
        <view class="datetime"
          ><view class="iconfont icon-time-circle"></view> 2020-10-12
          12:30</view
        >
        <view class="pending">待收费</view>
      </view>
      <view class="lineHr"></view>
      <view class="listContent">
        <view class="listLine">
          <view class="ml-32">普通收费</view>
          <view class="totalFee">总计金额：$950.00 </view>
        </view>
        <view class="listLine">
          <view class="ml-32">北极熊南京分店</view>
          <view class="chargeFee"
            >应收金额：
            <view class="feeRed">$950.00</view>
          </view>
        </view>
        <view class="listLine">
          <view class="ml-32 remark"
            >备注：备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注</view
          >
        </view>
        <view class="listLine">
          <view class="ml-32 date">创建时间：2021-09-08 10:20:30</view>
          <view class="user">季冰宇</view>
        </view>
      </view>
    </view>
    <view class="list">
      <view class="listTitle">
        <view class="datetime"
          ><view class="iconfont icon-time-circle"></view> 2020-10-12
          12:30</view
        >
        <view class="refund">待退费</view>
      </view>
      <view class="lineHr"></view>
      <view class="listContent">
        <view class="listLine">
          <view class="ml-32">普通收费</view>
          <view class="totalFee">总计金额：$950.00 </view>
        </view>
        <view class="listLine">
          <view class="ml-32">北极熊南京分店</view>
          <view class="chargeFee"
            >应退金额：
            <view class="feeGreen">$950.00</view>
          </view>
        </view>
        <view class="listLine">
          <view class="ml-32 remark"
            >备注：备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注</view
          >
        </view>
        <view class="listLine">
          <view class="ml-32 date">创建时间：2021-09-08 10:20:30</view>
          <view class="user">季冰宇</view>
        </view>
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
          uni.hideLoading()
        })
        .catch((res) => {
          uni.hideLoading()
        })
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
.line {
  width: 80%;
  height: 2rpx;
  background: rgba(0, 0, 0, 0.15);
  margin-left: 10%;
}
.ml-32 {
  margin-left: 32rpx;
}
.list {
  background-color: #fff;
  margin-bottom: 20rpx;
  margin-top: 16rpx;
  height: 410rpx;
  .listTitle {
    height: 84rpx;
    display: flex;
    align-items: center;
  }
  .datetime {
    display: flex;
    width: 400rpx;
    align-items: center;
    font-size: 28rpx;
    color: #595959;
  }
  .icon-time-circle {
    margin-left: 28rpx;
    margin-right: 14rpx;
  }
  .pending {
    width: 116rpx;
    height: 40rpx;
    background: #fff7e6;
    border: 2rpx solid #fa8c16;
    border-radius: 6rpx;
    text-align: center;
    color: #fa8c16;
    line-height: 40rpx;
    font-size: 28rpx;
    margin-left: 202rpx;
  }
  .refund {
    width: 116rpx;
    height: 40rpx;
    background: #f6ffed;
    border: 2rpx solid #52c41a;
    border-radius: 6rpx;
    text-align: center;
    color: #52c41a;
    line-height: 40rpx;
    font-size: 28rpx;
    margin-left: 202rpx;
  }
  .listContent {
    height: 204rpx;
  }
  .listLine {
    margin-top: 24rpx;
    display: flex;
    font-size: 28rpx;
  }
  .totalFee {
    margin-left: 86px;
    float: right;
    width: 400rpx;
    text-align: right;
    font-size: 28rpx;
  }
  .chargeFee {
    margin-left: 90rpx;
    width: 400rpx;
    font-size: 28rpx;
    line-height: 48rpx;
    display: flex;
    justify-content: flex-end;
  }
  .feeRed {
    font-size: 34rpx;
    color: #fa5151;
  }
  .feeGreen {
    font-size: 34rpx;
    color: #52c41a;
  }
  .remark {
    height: 72rpx;
    width: 690rpx;
    overflow: hidden;
    color: #595959;
  }
  .user {
    color: #595959;
    text-align: right;
    width: 200rpx;
    margin-left: 40rpx;
  }
  .date {
    color: #595959;
    width: 440rpx;
  }
}
</style>
