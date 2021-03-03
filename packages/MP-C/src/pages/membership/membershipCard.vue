<template>
  <view class="membership-card">
    <view class="mcard-top">
      <view
        class="mcard-card"
        :style="{
          backgroundColor: backgroundColor,
          backgroundImage: `url(${backgroundColor})`,
        }"
      >
        <view class="card-top">
          <view class="card-top-level">
            <text class="ctlevel-l"
              >VIP{{ memberDetail.memberLevel
              }}<text class="iconfont iconyonghugongxiang1"></text
            ></text>
          </view>
          <view class="card-top-name">
            <text>{{ memberDetail.memberName }}</text>
            <text v-if="memberDetail.shareMember"
              >主卡人：{{ memberDetail.shareInfo.memberName }}</text
            >
          </view>
          <view v-if="memberDetail.isExpire" class="card-top-Img">
            <image src="../../static/expire.svg"></image>
          </view>
        </view>
        <view class="card-line"></view>
        <view class="card-bottom">
          <view class="card-bottom-info">
            <view class="cbi-con">
              <text>卡号</text>
              <text>{{ memberDetail.memberCardNo }}</text>
            </view>
            <view class="cbi-con">
              <text>成长值</text>
              <text>{{ memberDetail.growthValue }}</text>
            </view>
          </view>
          <view class="card-bottom-time">
            <text>开卡时间: {{ openTime }}</text>
          </view>
        </view>
      </view>
    </view>
    <view
      v-if="
        memberDetail.whetherChooseRecharge === 1 &&
        memberDetail.rechargePlanList.length
      "
      class="mcard-mid"
    >
      <view class="mcard-mid-title">
        <text>充值方案</text>
      </view>
      <view class="mcard-mid-con">
        <view
          class="rechargeScheme"
          v-for="item in memberDetail.rechargePlanList"
          :key="item.presentationAmount"
        >
          <text
            >充值金额满{{ item.rechargeAmount.toFixed(2) }}，赠送金额{{
              item.presentationAmount.toFixed(2)
            }}</text
          >
        </view>
      </view>
    </view>
    <view v-if="memberDetail.discountType == 1" class="mcard-mid">
      <view class="mcard-mid-title">
        <text>折扣方案</text>
      </view>
      <view class="mcard-mid-con">
        <text>整单折扣{{ memberDetail.wholeOrderDiscount * 10 }}折</text>
      </view>
    </view>
    <view
      v-if="memberDetail.discountType == 2 && memberDetail.discountList.length"
      class="mcard-mid"
    >
      <view class="mcard-mid-title">
        <text>折扣方案</text>
      </view>
      <view class="mcard-mid-con">
        <view
          class="cardGiftBag"
          v-for="(item, index) in memberDetail.discountList"
          :key="index"
        >
          <view class="cardGiftBagLeft"
            >{{ item.itemName }} {{ item.discount }}折</view
          ><view class="cardGiftBagRight"
            >({{ item.number - item.useCount }}/{{ item.number }})</view
          >
        </view>
      </view>
    </view>
    <view
      v-if="
        memberDetail.whetherChooseIntegral === 1 &&
        memberDetail.integralMultiple
      "
      class="mcard-mid"
    >
      <view class="mcard-mid-title">
        <text>积分方案</text>
      </view>
      <view class="mcard-mid-con">
        <text>{{ memberDetail.integralMultiple }}倍积分</text>
      </view>
    </view>
    <view class="mcard-mid" v-if="memberDetail.couponItemList.length">
      <view class="mcard-mid-title">
        <text>开卡礼包</text>
      </view>
      <view class="mcard-mid-con">
        <view
          class="cardGiftBag"
          v-for="(item, index) in memberDetail.couponItemList"
          :key="index"
        >
          <view class="cardGiftBagLeft">{{ item.couponName }}</view
          ><view class="cardGiftBagRight"
            >({{ item.number - item.verificationNum }}/{{ item.number }})</view
          >
        </view>
      </view>
    </view>
    <view class="mcard-mid" v-if="memberDetail.memberSpecialRightList.length">
      <view class="mcard-mid-title">
        <text>专享权益项目</text>
      </view>
      <view class="mcard-mid-con">
        <view
          class="cardGiftBag"
          v-for="(item, index) in memberDetail.memberSpecialRightList"
          :key="index"
        >
          <view class="cardGiftBagLeft">{{ item.specialRightName }}</view
          ><view class="cardGiftBagRight"
            >({{ item.canUseCount }}/{{ item.rightItemNumber }})</view
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import mySelfAPI from '@/APIS/mySelf/mySelf.api'
export default {
  data() {
    return {
      memberDetail: {},
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
      backgroundImg: '',
      backgroundColor: '',
      openTime: '',
    }
  },
  created() {
    this.getmemberDetail()
  },
  methods: {
    async getmemberDetail() {
      const res = await mySelfAPI.memberDetail({})
      console.log('memberDetail', res)
      this.backgroundColor = res.data.backgroundColor
      this.backgroundImg = res.data.backgroundImg
      this.memberDetail = res.data
      let t = ''
      let times = new Date(res.data.openTime)
      let y = times.getFullYear()
      let m = times.getMonth() + 1
      let d = times.getDate()
      let h = times.getHours()
      let mm = times.getMinutes()

      let s = times.getSeconds()
      t = `${y}-${m}-${d}  ${h}:${mm < 10 ? '0' + mm : mm}:${
        s < 10 ? '0' + s : s
      }`
      this.openTime = t
    },
  },
}
</script>

<style lang="scss" scoped>
.membership-card {
  height: auto;
  min-height: 100%;
  box-sizing: border-box;
  padding: 32rpx;
  .mcard-top {
    .mcard-card {
      box-sizing: border-box;
      height: 412rpx;
      border-radius: 26rpx;
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
        position: relative;
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
        .card-top-Img {
          width: 128rpx;
          height: 98rpx;
          position: absolute;
          right: 0;
          top: 0;
          image {
            width: 128rpx;
            height: 98rpx;
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
      color: #7f7f7f;
      .cardGiftBag {
        display: flex;
        flex-direction: row;
        .cardGiftBagLeft {
          width: 70%;
        }
        .cardGiftBagRight {
          width: 30%;
          text-align: right;
        }
      }
    }
  }
}
</style>
