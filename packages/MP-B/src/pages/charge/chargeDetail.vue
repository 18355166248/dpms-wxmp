<template>
  <view class="chargeContentDetail">
    <view class="paymentTitle">账单号：BO636202010270009</view>
    <view class="listChargeDetail">
      <view class="listTitle">松动牙拔出</view>
      <view class="listLine grey">
        <view>$950.00&nbsp;&nbsp;&nbsp;× 2（颗） </view>
        <view>$950.00 </view>
      </view>
      <view class="listLine">
        <view>应收金额：</view>
        <view> $950.00</view>
      </view>
      <view class="listLineBottom">
        <view>医生：季冰宇</view>
        <view>护士：季冰宇</view>
        <view>其他：季冰宇</view>
      </view>
      <view class="lineHr"></view>
    </view>
    <view class="listChargeDetail">
      <view class="listTitle">松动牙拔出</view>
      <view class="listLine grey">
        <view>$950.00&nbsp;&nbsp;&nbsp;× 2（颗） </view>
        <view>$950.00 </view>
      </view>
      <view class="listLine">
        <view>应收金额：</view>
        <view> $950.00</view>
      </view>
      <view class="listLineBottom">
        <view>医生：季冰宇</view>
        <view>护士：季冰宇</view>
        <view>其他：季冰宇</view>
      </view>
      <view class="lineHr"></view>
    </view>
    <view class="listChargeTotal">
      <view class="line">
        <view>总计应收金额</view>
        <view>$950.00 </view>
      </view>
      <view class="line">
        <view>整单折扣</view>
        <view>100%</view>
      </view>
      <view class="lineTotal">
        <view style="display: flex;"
          >应收金额：<view
            style="color: red; font-size: 36rpx; line-height: 36rpx;"
            >$950.00</view
          ></view
        >
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
      data: {},
    }
  },
  mounted() {
    // console.log(this.billSettlementArray)
  },
  methods: {},
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
