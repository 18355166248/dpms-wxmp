<template>
  <view class="membership-card">
    <view class="mcard-top">
      <view class="mcard-card">
        <view class="card-top">
          <view class="card-top-level">
            <text class="ctlevel-l">VIP1</text>
            <text class="ctlevel-r">白金会员</text>
          </view>
          <view>
            <text>主卡人</text>
          </view>
        </view>
        <view class="card-bottom">
          <view class="card-bottom-info">
            <text class="cbi-l">卡号 ZY5462020071902321</text>
            <text class="cbi-r">成长值 10</text>
          </view>
          <view class="card-bottom-time">
            <text>开卡时间L2020-07-19 17:50</text>
          </view>
        </view>
      </view>
    </view>
    <view class="mcard-mid">
      <view class="mcard-mid-title">
        <text>充值方案:</text>
      </view>
      <view class="mcard-mid-con">
        <view
          class="rechargeScheme"
          v-for="(val, idx) in rechargeScheme"
          :key="idx"
        >
          <text>{{ idx + 1 }}</text>
          <text>、</text>
          <text>{{ val }}</text>
        </view>
      </view>
    </view>
    <view class="mcard-mid">
      <view class="mcard-mid-title">
        <text>折扣方案:</text>
      </view>
      <view class="mcard-mid-con">
        <text>{{ discountScheme }}</text>
      </view>
    </view>
    <view class="mcard-mid">
      <view class="mcard-mid-title">
        <text>积分方案:</text>
      </view>
      <view class="mcard-mid-con">
        <text>{{ pointScheme }}</text>
      </view>
    </view>
    <view class="mcard-mid">
      <view class="mcard-mid-title">
        <text>开卡礼包:</text>
      </view>
      <view class="mcard-mid-con">
        <view class="cardGiftBag" v-for="(val, idx) in cardGiftBag" :key="idx">
          <view>{{ val.con }}</view>
          <view>X{{ val.count }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      rechargeScheme: [
        '充值金额满10000.00，赠送金额100.00',
        '充值金额满20000.00，赠送金额200.00',
      ],
      discountScheme: '整单折扣7.5折',
      pointScheme: '1.1倍积分',
      cardGiftBag: [
        {
          con: '洗牙7折券',
          count: 1,
        },
        {
          con: '20元代金券',
          count: 5,
        },
        {
          con: '5元代金券',
          count: 10,
        },
      ],
    }
  },
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.membership-card {
  height: 100%;
  background: rgba($color: #000000, $alpha: 0.04);
  .mcard-top {
    padding: 40rpx;
    .mcard-card {
      height: 300rpx;
      background-color: #ff9995;
      border-radius: 16rpx;
      padding: 30rpx 40rpx;
      color: #ffffff;
      .card-top {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-bottom: 1px solid #ffffff;
        padding-bottom: 20rpx;
        height: calc(50% - 20rpx);
        .card-top-level {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .ctlevel-l {
            font-size: 24rpx;
            font-weight: 600;
          }
          .ctlevel-r {
            font-weight: 600;
          }
        }
      }
      .card-bottom {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-top: 20rpx;
        height: calc(50% - 20rpx);
        .card-bottom-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 24rpx;
          font-weight: 600;
        }
        .card-bottom-time {
          font-size: 24rpx;
          font-weight: 600;
          text-align: center;
        }
      }
    }
  }
  .mcard-mid {
    padding: 40rpx 40rpx 0;
    .mcard-mid-title {
      font-size: 24rpx;
      margin-bottom: 20rpx;
    }
    .mcard-mid-con {
      font-size: 20rpx;
      .cardGiftBag {
        display: flex;
        flex-direction: row;
        view {
          width: 50%;
        }
      }
    }
  }
}
</style>
