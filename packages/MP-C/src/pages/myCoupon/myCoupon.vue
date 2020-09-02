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
          :couponsImgSrc="c.cardImage"
          :title="c.couponName"
          :content="c.subtitle"
          :couponsTypeName="c.couponTypeName"
          :remainingDays="c.effectiveDays"
          :verifiStatusName="c.verifiStatusName"
          :effectiveEndTime="c.effectiveDate"
          :notice="c.useIntro"
          :noticeMatter="c.attentions"
        />
      </div>
    </div>
    <div v-show="coupons && !coupons.length">
      <empty text="暂无未使用优惠券" disabled></empty>
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
    async getCoupons() {
      const userRes = await customerAPI.userDetail({ userId: getStorage(STORAGE_KEY.STAFF).id })
      const res = await couponApi.getCoupons({
        medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
        memberId: userRes.data.memberId,
        status: this.tab
      })
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
  background: rgba(0,0,0,0.04);
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