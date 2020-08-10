<template>
  <view class="membership-card">
    <view class="mcard-top">
      <view class="mcard-card">
        <view class="card-top">
          <view class="card-top-level">
            <text class="ctlevel-l">VIP1</text>
            <text class="ctlevel-r">白金会员</text>
          </view>
          <view class="card-top-name">
            <text>孙小小</text>
            <text>主卡人</text>
          </view>
        </view>
        <view class="card-line"></view>
        <view class="card-bottom">
          <view class="card-bottom-info">
            <view class="cbi-con">
              <text>卡号</text>
              <text>ZY5462020071902321</text>
            </view>
            <view class="cbi-con">
              <text>成长值</text>
              <text>1200</text>
            </view>
          </view>
          <view class="card-bottom-time">
            <text>开卡时间: 2020-07-19 17:50</text>
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
  box-sizing: border-box;
  padding: 32rpx;
  background: rgba($color: #000000, $alpha: 0.04);
  .mcard-top {
    .mcard-card {
      box-sizing: border-box;
      height: 412rpx;
      background: url(https://medcloud.oss-cn-shanghai.aliyuncs.com/dental/saas/mini-app/card-bg.png)
        no-repeat;
      padding: 48rpx 48rpx 32rpx 48rpx;
      color: #ffffff;
      font-family: PingFangSC, PingFangSC-Medium;
      .card-top {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-bottom: 32rpx;
        height: calc(50% - 1px);
        .card-top-level {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .ctlevel-l {
            font-size: 28rpx;
          }
          .ctlevel-r {
            font-size: 28rpx;
          }
        }
        .card-top-name {
          text:nth-child(1) {
            font-size: 48rpx;
            margin-right: 32rpx;
          }
          text:nth-child(2) {
            font-size: 28rpx;
            font-family: PingFangSC, PingFangSC-Regular;
          }
        }
      }
      .card-line {
        height: 1px;
        background-color: #ffffff;
      }
      .card-bottom {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-top: 32rpx;
        height: calc(50% - 1px);
        .card-bottom-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 28rpx;
          .cbi-con {
            text:nth-child(1) {
              margin-right: 16rpx;
            }
          }
        }
        .card-bottom-time {
          font-size: 24rpx;
          text-align: center;
          font-family: PingFangSC, PingFangSC-Regular;
        }
      }
    }
  }
  .mcard-mid {
    margin-top: 48rpx;
    .mcard-mid-title {
      font-size: 34rpx;
      margin-bottom: 8rpx;
      font-family: PingFangSC, PingFangSC-Medium;
    }
    .mcard-mid-con {
      font-size: 28rpx;
      font-family: PingFangSC, PingFangSC-Regular;
      opacity: 0.65;
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
