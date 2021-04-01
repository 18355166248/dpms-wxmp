<template>
  <div class="myCouponPage">
    <div class="tab" :class="[`tab${tab}`]">
      <div :class="{active: tab == 1}" @click="tabClick(1)">未使用</div>
      <div :class="{active: tab == 2}" @click="tabClick(2)">已使用</div>
      <div :class="{active: tab == 3}" @click="tabClick(3)">已失效</div>
    </div>      
    <div style="height:100%" class="coupons" v-if="coupons" @change="swiperChange" 
    :current-item-id="tab">
      <!-- <div v-for="item in [1,2,3]" :key="item" :item-id="item"> -->
        <scroll-view scroll-y class="scroll">
          <div class="box" v-for="(c, i) in coupons" :key="i">
            <couponsCard
              :item="c"
              :couponsImgSrc="c.cardImage"
              :title="c.couponName"
              :content="c.subtitle"
              :shareMember="c.shareMember"
              :shareMemberName="c.shareMemberName"
              :couponsTypeName="c.couponTypeName"
              :remainingDays="c.effectiveDays"
              :verifiStatusName="c.verifiStatusName"
              :effectiveEndTimeStr="getEffectiveEndTime(c)"
              :notice="c.useIntro"
              :noticeMatter="c.attentions"
              :tabCouponsType="tab"
            />
          </div>
          <div v-if="coupons && !coupons.length">
            <empty :text="`暂无${tab == 1 && '未使用' || tab == 2 && '已使用' || tab == 3 && '已失效'}优惠券`" disabled></empty>
          </div>
        </scroll-view>
      <!-- </div> -->
    </div>
  </div>
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
    ...mapState('loginStore', {
      MEDICALINSTITUTION: state => state.MEDICALINSTITUTION,
      EFFECTIVE_TIME_TYPE_ENUM: state => state.ENUMS.EffectiveTimeType,
    }),
  },
  methods: {
    tabClick(tab) {
      this.tab = tab
      this.getCoupons()
    },
    swiperChange({detail}) {
      this.tabClick(detail.currentItemId)
    },
    getEffectiveEndTime(item) {
      return `有效期至：${moment(item.effectiveEndTime).format('YYYY.MM.DD')}`
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
        customerId: userRes.data.customerId,
        status: this.tab
      })
      setTimeout(() => uni.hideLoading(), 300)
      this.coupons = (res.data || []).map(d => ({
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
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    border-bottom: solid 1rpx #f5f5f5;
    .active{
      color: #5cbb89;
    }
    &::before{
      content: '';
      position: absolute;
      width: 58rpx;
      height: 4rpx;
      background: #5cbb89;
      border-radius: 2rpx;
      top: 100%;
      transform: translate(-50%,0);
      transition: .5s left;
    }
    &.tab1::before{
      left: 22%
    }
    &.tab2::before{
      left: 50%
    }
    &.tab3::before{
      left: 78%
    }
  }
  .coupons{
    .scroll{
      height: 100vh;
      padding-top: 106rpx;
      padding-bottom: 10rpx;
      box-sizing: border-box;
    }
    .box{
      margin-bottom: 32rpx;
      padding: 0 24rpx;
    }
  }
}
</style>
