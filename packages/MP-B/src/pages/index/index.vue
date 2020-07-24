<template>
  <view class="apptView">
    <calendar @collapseChange="collapseChange"></calendar>
    <view class="apptCardInfo">
      <view class="topGray"></view>
      <view class="curCardInfo"></view>
    </view>
    <dayTable
      :style="{ width: '100%', height: retract ? 'calc(100% - 284rpx)' : 'calc(100% - 724rpx)' }"
    ></dayTable>
  </view>
</template>

<script>
import dayTable from '../../components/dayTable/dayTable.vue'
import calendar from '../../components/calendar/calendar.vue'
// import zzxCalendar from '../../components/zzx-calendar/zzx-calendar.vue'

export default {
  data() {
    return {
      title: 'Hello',
      retract: true, // 日历展开: false 收缩: true
    }
  },
  onLoad() {
    this.show('测试')
  },
  methods: {
    collapseChange(val) {
      this.retract = val
    },
  },
  components: {
    dayTable,
    calendar,
  },
}
</script>

<style lang="scss" scoped>
page {
  width: 100%;
  height: 100%;
}
.apptView {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .apptCardInfo {
    position: relative;
    z-index: 1;
    .topGray {
      width: 100%;
      height: 16rpx;
      background-color: #f2f3f5;
    }
    .curCardInfo {
      width: 100%;
      height: 55rpx;
      box-shadow: 0 5rpx 8rpx rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
