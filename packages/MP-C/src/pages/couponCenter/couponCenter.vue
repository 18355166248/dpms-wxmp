<template>
  <scroll-view>
    <view class="couponCenterBox">
      <couponsCard>
        <template v-slot:draw>
          <button class="couponsBtn">领取</button>
        </template>
      </couponsCard>
    </view>
  </scroll-view>
</template>

<script>
import couponsCard from '@/businessComponents/couponsCard/couponsCard.vue'
import institutionAPI from '@/APIS/institution/institution.api'
import { getStorage, STORAGE_KEY } from '@/utils/storage'

export default {
  data() {
    return {
      couponList: [],
    }
  },
  components: {
    couponsCard,
  },
  onLoad(params) {
    console.log(params)
    uni.startPullDownRefresh()
  },
  onPullDownRefresh() {
    this.init()
  },
  onReachBottom() {},
  methods: {
    init() {
      const medicalInstitution = getStorage(STORAGE_KEY.MEDICALINSTITUTION)
      console.log('medicalInstitution:', medicalInstitution)
    },
  },
}
</script>
<style lang="scss" scoped>
.couponCenterBox {
  background: rgba(0, 0, 0, 0.04);
  height: 100%;
  padding: 32rpx 24rpx;
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
  }
}
</style>
