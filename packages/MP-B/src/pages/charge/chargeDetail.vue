<template>
  <view class="chargeContentDetail">
    <view class="paymentTitle">账单号：{{ data.billSerialNo }}</view>
    <view
      class="listChargeDetail"
      v-for="item in data.orderItemVOList"
      :key="item.billOrderItemId"
    >
      <view class="listTitle">{{ item.itemName }}</view>
      <view class="listLine grey">
        <view
          >{{ $utils.formatPrice(item.unitAmount) }}&nbsp;&nbsp;&nbsp;×
          {{ item.itemNum }}（{{ item.unit || '-' }}）
        </view>
        <view>{{ $utils.formatPrice(item.totalAmount) }} </view>
      </view>
      <view class="listLine">
        <view>应收金额：</view>
        <view> {{ $utils.formatPrice(item.receivableAmount) }}</view>
      </view>
      <view class="listLineBottom">
        <view>医生：{{ item.doctorNameStr }}</view>
        <view>护士：{{ item.nurseNameStr }}</view>
        <view>其他：{{ item.otherNameStr }}</view>
      </view>
      <view class="lineHr"></view>
    </view>
    <view class="listChargeTotal">
      <view class="line">
        <view>总计金额</view>
        <view>{{ $utils.formatPrice(data.totalAmount) }} </view>
      </view>
      <view class="line">
        <view>整单折扣</view>
        <view>{{ data.mainOrderDiscount }}%</view>
      </view>
      <view class="lineTotal">
        <view style="display: flex;"
          >应收金额：<view
            style="color: red; font-size: 36rpx; line-height: 36rpx;"
            >{{ $utils.formatPrice(data.receivableAmount) }}</view
          ></view
        >
      </view>
    </view>
  </view>
</template>

<script>
import billAPI from '@/APIS/bill/bill.api'

export default {
  data() {
    return {
      billSerialNo: '',
      data: {},
    }
  },
  onLoad(params) {
    this.billSerialNo = params.billSerialNo
    this.init()
  },
  methods: {
    init() {
      billAPI
        .orderDetail({
          billSerialNo: this.billSerialNo,
        })
        .then((res) => {
          this.data = res.data
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.chargeContentDetail {
  background: rgba(0, 0, 0, 0.04);
  height: 100vh;
}
.lineHr {
  width: 686rpx;
  height: 2rpx;
  margin-left: 32rpx;
  background: rgba(0, 0, 0, 0.1);
}
.ml-32 {
  margin-left: 32rpx;
}
.paymentTitle {
  height: 84rpx;
  margin-left: 32rpx;
  color: #595959;
  line-height: 90rpx;
  font-size: 28rpx;
}
.listChargeDetail {
  background-color: #ffffff;
  .listTitle {
    font-size: 34rpx;
    color: #191919;
    margin-left: 32rpx;
    padding-top: 30rpx;
    font-weight: 500;
  }
  .listLine {
    margin-top: 18rpx;
    display: flex;
    font-size: 28rpx;
    justify-content: space-between;
    margin-left: 32rpx;
    width: 686rpx;
  }
  .listLineBottom {
    justify-content: space-between;
    margin-top: 18rpx;
    display: flex;
    font-size: 28rpx;
    width: 686rpx;
    margin-left: 32rpx;
    color: #7f7f7f;
    margin-bottom: 32rpx;
  }
  .grey {
    color: #4c4c4c;
  }
}
.listChargeTotal {
  margin-top: 16rpx;
  background-color: #ffffff;
  .line {
    margin-left: 32rpx;
    justify-content: space-between;
    display: flex;
    width: 686rpx;
    font-size: 28rpx;
    line-height: 36rpx;
    padding-top: 20rpx;
  }
  .lineTotal {
    margin-left: 32rpx;
    justify-content: flex-end;
    display: flex;
    width: 686rpx;
    font-size: 28rpx;
    line-height: 36rpx;
    padding-top: 30rpx;
    padding-bottom: 30rpx;
  }
}
</style>
