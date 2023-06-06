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
    <view class="horizontal-scroll">
      <view class="fixed-content">
        <view class="th"></view>
        <view class="td">预约人次</view>
        <view class="td">到诊人次</view>
        <view class="td">到诊率</view>
        <view class="td">成交人次</view>
        <view class="td">现金收款</view>
        <view class="td">营业收入</view>
      </view>
      <view class="scroll-content">
        <scroll-view class="scroll-view_w" scroll-x style="width: 94%;">
          <view class="item">
            <view class="th">总计</view>
            <view class="td">{{ data.appointmentNum || 0 }}</view>
            <view class="td">{{ data.registerNum || 0 }}</view>
            <view class="td">{{ data.rateOfRegister || 0 }}</view>
            <view class="td">{{ data.doneNum || 0 }}</view>
            <view class="td">{{ formatPriceDecimal(data.cashRevenue) }}</view>
            <view class="td">{{
              formatPriceDecimal(data.operatingRevenue)
            }}</view>
          </view>
          <view class="item" v-for="(item, index) in data.detail" :key="index">
            <view class="th">{{ item.detailName }}</view>
            <view class="td">{{ item.appointmentNum }}</view>
            <view class="td">{{ item.registerNum }}</view>
            <view class="td">{{ item.rateOfRegister }}</view>
            <view class="td">{{ item.doneNum }}</view>
            <view class="td">{{ formatPriceDecimal(item.cashRevenue) }}</view>
            <view class="td">{{
              formatPriceDecimal(item.operatingRevenue)
            }}</view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
import moment from 'moment'
import { formatPriceDecimal } from '../../utils/price.util'
import billAPI from '@/APIS/bill/bill.api'

export default {
  data() {
    return {
      formatPriceDecimal: formatPriceDecimal,
      pickerValue: moment().format('YYYY-MM-DD'),
      data: {
        // detail: [{}, {}],
        detail: [],
      },
      dataSourceDetail: [
        {
          id: 1,
          detailName: '初诊',
          appointmentNum: 0,
          registerNum: 0,
          rateOfRegister: 0,
          doneNum: 0,
          cashRevenue: 0,
          operatingRevenue: 0,
        },
        {
          id: 2,
          detailName: '复诊',
          appointmentNum: 0,
          registerNum: 0,
          rateOfRegister: 0,
          doneNum: 0,
          cashRevenue: 0,
          operatingRevenue: 0,
        },
      ],
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
      uni.showLoading({
        title: '数据加载中',
        mask: true,
      })
      billAPI
        .appointmentList({
          appointmentDate: moment(date).format('x'),
        })
        .then((res) => {
          if (!!res.data.detail) {
            this.data = res.data
          } else {
            this.data = {
              detail: this.dataSourceDetail,
            }
          }
          uni.hideLoading()
        })
        .catch((res) => {
          uni.hideLoading()
        })
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

.horizontal-scroll {
  padding-bottom: 32rpx;
  overflow: hidden;
  background-color: #fff;
}

.fixed-content {
  float: left;
  width: 30%;
}

.scroll-content {
  float: left;
  width: 70%;
}

.scroll-view_w {
  width: 90%;
  white-space: nowrap;
}

.scroll-view_w .item {
  min-width: 70px;
  display: inline-block;
}

.horizontal-scroll .th {
  background: #fff;
  padding: 24rpx 32rpx 0 32rpx;
  text-align: right;
  font-size: 28rpx;
  font-weight: 500;
  height: 28rpx;
  line-height: 28rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.horizontal-scroll .td {
  background: #fff;
  padding: 24rpx 32rpx 0 32rpx;
  font-size: 28rpx;
  font-weight: 300;
  line-height: 30rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.horizontal-scroll .fixed-content .td,
.horizontal-scroll .fixed-content .th {
  text-align: left;
}
.horizontal-scroll .scroll-view_w .td {
  text-align: right;
}
</style>
