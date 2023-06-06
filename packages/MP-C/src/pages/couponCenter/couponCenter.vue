<template>
  <scroll-view scroll-y class="scroll-view">
    <view class="couponCenterBox">
      <couponsCard
        v-for="item in couponList"
        :key="item.serialNo"
        :item="item"
        :couponsImgSrc="item.cardImage"
        :shareMember="item.shareMember"
        :shareMemberName="item.shareMemberName"
        :title="item.couponName"
        :content="item.subtitle"
        :useCouponsType="item.receiveStatus"
        :couponsTypeName="item.couponTypeName"
        :verifiStatusName="getVerifiStatusName(item)"
        :effectiveEndTimeStr="getEffectiveEndTime(item)"
        :notice="item.useIntro"
        :noticeMatter="item.attentions"
      >
        <template v-slot:draw="{ coupon }">
          <button
            v-show="coupon.receiveStatus === 1"
            class="couponsBtn"
            @click="drawCoupon(coupon)"
          >
            领取
          </button>
        </template>
      </couponsCard>
      <div v-show="showNode">
        <empty :disabled="disabled" text="暂无数据" v-on:click="reload"></empty>
      </div>
    </view>
  </scroll-view>
</template>

<script>
import moment from 'moment'
import couponsCard from '@/businessComponents/couponsCard/couponsCard.vue'
import institutionAPI from '@/APIS/institution/institution.api'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      customerId: '',
      couponList: [],
      showNode: false,
      disabled: true,
    }
  },
  components: {
    couponsCard,
  },
  computed: {
    ...mapState('loginStore', {
      MEDICALINSTITUTION: (state) => state.MEDICALINSTITUTION,
      EFFECTIVE_TIME_TYPE_ENUM: (state) => state.ENUMS.EffectiveTimeType,
      RECEIVE_STATUS_ENUM: (state) => state.ENUMS.ReceiveStatus,
    }),
  },
  watch: {
    MEDICALINSTITUTION(newVal) {
      uni.startPullDownRefresh()
    },
  },
  onLoad(params) {
    const { customerId } = params
    this.customerId = customerId

    this.init()
  },
  onPullDownRefresh() {
    this.init()
  },
  onReachBottom() {},
  methods: {
    init() {
      uni.showLoading({
        title: '数据加载中',
        mask: true,
      })

      institutionAPI
        .getCouponCenterList({
          customerId: this.customerId,
          medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
        })
        .then((res) => {
          setTimeout(() => uni.hideLoading(), 300)
          if (!!res.data.length) {
            this.showNode = false
            this.couponList = res.data
          } else {
            this.showNode = true
          }
        })
        .catch(() => {
          this.showNode = true
          this.disabled = false
        })
    },
    drawCoupon(record) {
      if (this.pending) return
      this.pending = true
      institutionAPI
        .drawCoupon({
          serialNo: record.serialNo,
          customerId: this.customerId,
          medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
        })
        .then((res) => {
          if (res.code === 0) {
            const convertList = this.couponList.map((item) => {
              if (item.serialNo === record.serialNo) {
                item.receiveStatus = this.RECEIVE_STATUS_ENUM.YES.value
              }

              return item
            })
            this.couponList = convertList
          }
        })
        .finally(() => {
          setTimeout(() => (this.pending = false), 99)
        })
    },
    getVerifiStatusName(item) {
      if (item.receiveStatus === this.RECEIVE_STATUS_ENUM.YES.value) {
        return '已领取'
      }
      return null
    },
    getEffectiveEndTime(item) {
      if (item.effectiveTimeType === this.EFFECTIVE_TIME_TYPE_ENUM.DAY.value) {
        return `领取当日起${item.effectiveDays}天内可用`
      }
      if (
        item.effectiveTimeType === this.EFFECTIVE_TIME_TYPE_ENUM.NEXT_DAY.value
      ) {
        return `领取次日起${item.effectiveDays}天内可用`
      }
      if (
        item.effectiveTimeType ===
        this.EFFECTIVE_TIME_TYPE_ENUM.DEFINITE_DATE.value
      ) {
        return `有效期至：${moment(item.effectiveEndTime).format('YYYY.MM.DD')}`
      }

      return ''
    },
    reload() {
      this.init()
    },
  },
}
</script>
<style lang="scss" scoped>
.scroll-view {
  height: 100%;
}
.couponCenterBox {
  background: #f5f5f5;
  height: 100%;
  padding: 32rpx 24rpx;
  box-sizing: border-box;
  .couponsBtn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120rpx;
    height: 48rpx;
    background-color: $common-color;
    border-radius: 28rpx;
    color: white;
    font-size: 28rpx;
    line-height: 36rpx;
    text-align: center;
    margin: 0;
    &::after {
      border: none;
    }
  }
}
</style>
