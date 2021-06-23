<template>
  <view class="chargeForm" @touchstart="touchStart" @touchend="touchEnd">
    <tabs
      :value="currentTab"
      :scroll="false"
      :tabs="tabs"
      field="name"
      height="76rpx"
      lineHeight="4rpx"
      activeColor="#5CBB89"
      lineColor="#5CBB89"
      lineScale="0.2"
      @change="changeTab"
    />
    <charge v-if="currentTab === 0" class="charge" />
    <pending
      v-if="currentTab === 1"
      :patientId="patientId"
      :customerId="customerId"
    />
    <charged
      v-if="currentTab === 2"
      :patientId="patientId"
      :customerId="customerId"
    />
    <payment v-if="currentTab === 3" :patientId="patientId" />
  </view>
</template>

<script>
import tabs from '@/components/tabs/tabs.vue'
import charge from './charge'
import pending from './pending'
import charged from './charged'
import payment from './payment'
import institutionAPI from 'APIS/institution/institution.api'
import { mapMutations } from 'vuex'

export default {
  components: {
    tabs,
    charge,
    pending,
    charged,
    payment,
  },
  data() {
    return {
      tabs: [
        { name: '收费', val: 0 },
        { name: '待处理账单', val: 1 },
        { name: '已收费账单', val: 2 },
        { name: '支付记录', val: 3 },
      ],
      currentTab: 0,
      touchStartX: 0, // 触屏起始点x
      touchStartY: 0, // 触屏起始点y
      patientId: 0,
      customerId: 0,
      memberId: 0,
    }
  },
  onLoad(params) {
    this.patientId = Number(params.patientId)
    this.customerId = Number(params.customerId)
    this.currentTab = Number(params.tab) || 0

    // 存储到patient store中
    if (params.isqywx) {
      const currentIds = {
        patientId: this.patientId,
        customerId: this.customerId,
      }
      if (this.memberId) {
        currentIds.memberId = this.memberId
      }
      this.setPatientDetail(currentIds)
      wx.hideHomeButton()
    }

    this.init()
  },
  onReachBottom() {
    // if (this.currentTab === 0) {
    //   return uni.$emit('refreshCharge')
    // }
    if (this.currentTab === 1) {
      return uni.$emit('refreshPending')
    }
    if (this.currentTab === 2) {
      return uni.$emit('refreshCharged')
    }
    if (this.currentTab === 3) {
      return uni.$emit('refreshPayment')
    }
  },
  methods: {
    ...mapMutations('patient', ['setPatientDetail']),
    init() {
      institutionAPI
        .getStaffListByPositionFromAllInstitution({
          workStatus:
            this.$dpmsUtils.getEnums('StaffStatus')?.STAFF_STATUS_AT_WORK_NAME
              ?.value || 1,
          position: this.$dpmsUtils.getEnums('StaffPosition')?.DOCTOR?.value || 2,
        })
        .then((res) => {
          res?.data?.unshift({ staffId: 0, staffName: '全部医生' })
          uni.setStorageSync('allDoctorList', res.data)
        })
      institutionAPI.getStaffs().then((res) => {
        res?.data?.unshift({ staffId: 0, staffName: '全部收费人' })
        uni.setStorageSync('allStaffList', res.data)
      })
    },
    changeTab(i) {
      this.currentTab = this.tabs[i].val
    },
    /**
     * 触摸开始
     **/
    touchStart(e) {
      this.touchStartX = e.touches[0].clientX
      this.touchStartY = e.touches[0].clientY
    },
    /**
     * 触摸结束
     **/
    touchEnd(e) {
      let deltaX = e.changedTouches[0].clientX - this.touchStartX
      let deltaY = e.changedTouches[0].clientY - this.touchStartY
      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX >= 0) {
          this.currentTab =
            this.currentTab === 0 ? this.tabs.length - 1 : this.currentTab - 1
        } else {
          this.currentTab =
            this.currentTab === this.tabs.length - 1 ? 0 : this.currentTab + 1
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.chargeForm {
  background: rgba(0, 0, 0, 0.04);
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .charge {
    display: flex;
    flex-grow: 2;
    position: relative;
    z-index: 2000;
  }
}
</style>
