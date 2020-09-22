<template>
  <scroll-view scroll-y class="myCouponPage">
    <div class="tab">
      <div :class="{active: tab === 1}" @click="tabClick(1)">未使用</div>
      <div :class="{active: tab === 2}" @click="tabClick(2)">已使用</div>
      <div :class="{active: tab === 3}" @click="tabClick(3)">已失效</div>
    </div>
    <div class="coupons" v-if="coupons">
      <div class="box" v-for="(c, i) in coupons" :key="i">
        <couponsCard
          :item="c"
          :couponsImgSrc="c.cardImage"
          :title="c.couponName"
          :content="c.subtitle"
          :couponsTypeName="c.couponTypeName"
          :remainingDays="c.effectiveDays"
          :verifiStatusName="c.verifiStatusName"
          :effectiveEndTimeStr="getEffectiveEndTime(c)"
          :notice="c.useIntro"
          :noticeMatter="c.attentions"
          :useCouponsType="tab"
        />
      </div>
    </div>
    <div v-if="coupons && !coupons.length">
      <empty :text="`暂无${tab === 1 && '未使用' || tab === 2 && '已使用' || tab === 3 && '已失效'}优惠券`" disabled></empty>
    </div>
  </scroll-view>
</template>

<script>
import couponsCard from '@/businessComponents/couponsCard/couponsCard'
import couponApi from '@/APIS/coupon/coupon.api'
import { mapState } from 'vuex'
import customerAPI from '@/APIS/customer/customer.api'
import {getStorage, STORAGE_KEY,} from '@/utils/storage'
import moment from 'moment'
const enums = uni.getStorageSync('enums')

const EFFECTIVE_TIME_TYPE_ENUM = enums.EffectiveTimeType
export default {
  components: {
    couponsCard,
  },
  data() {
    return {
      tab: 1, coupons: null,
    }
  },
  computed: {
    ...mapState('loginStore', ['MEDICALINSTITUTION']),
  },
  methods: {
    tabClick(tab) {
      this.tab = tab
      this.getCoupons()
    },
    getEffectiveEndTime(item) {
      if (item.effectiveTimeType === EFFECTIVE_TIME_TYPE_ENUM.DAY.value) {
        return `领取当日起${item.effectiveDays}天内可用`
      }
      if (item.effectiveTimeType === EFFECTIVE_TIME_TYPE_ENUM.NEXT_DAY.value) {
        return `领取次日起${item.effectiveDays}天内可用`
      }
      if (
        item.effectiveTimeType === EFFECTIVE_TIME_TYPE_ENUM.DEFINITE_DATE.value
      ) {
        return `有效期至：${moment(item.effectiveEndTime).format('YYYY.MM.DD')}`
      }

      return ''
    },
    async getCoupons() {
      uni.showLoading({
        title: '数据加载中',
        mask: true,
      })
      const userRes = await customerAPI.userDetail({ userId: getStorage(STORAGE_KEY.STAFF).id })
      const res = await couponApi.getCoupons({
        medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
        memberId: userRes.data.memberId,
        status: this.tab
      })
      setTimeout(() => uni.hideLoading(), 300)
      this.coupons = res.data.map(d => ({
        ...d,
        effectiveDate: moment(d.effectiveEndTime).format('YYYY.MM.DD')
      }))
    }
  },
  created() {
    this.getCoupons()
  }
}
</script>

<style lang="scss" scoped>
.myCouponPage{
  height: 100vh;
  background: #f5f5f5;
  .tab{
    display: flex;
    line-height: 76rpx;
    background: white;
    justify-content: space-evenly;
    color: rgba(0,0,0,0.65);
    font-size: 28rpx;
    font-weight: 500;
    .active{
      color: #5cbb89;
      position: relative;
      &::before{
        content: '';
        position: absolute;
        width: 58rpx;
        height: 4rpx;
        background: #5cbb89;
        border-radius: 2rpx;
        top: 100%;
        left: 50%;
        transform: translate(-50%);
      }
    }
  }
  .coupons{
    padding: 32rpx 24rpx;
    padding-bottom: 0;
    .box{
      margin-bottom: 32rpx;
    }
  }
}
</style>