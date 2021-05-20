<template>
  <div class="bill-details-wrapper">
    <view class="filter">
      <view class="uni-list-cell">
        <view @click="openCalendar" class="left">
          {{ dateFilterText }}
          <view class="iconfont icon-closed"></view>
        </view>
      </view>
      <view class="uni-list-cell">
        <view
          :class="['left', isFilter ? 'right' : '']"
          @click.native="onFilterClick"
        >
          {{ isFilter ? '已按条件筛选' : '筛选'}}
          <view class="iconfont icon-filter"></view>
        </view>
      </view>
      <uni-calendar
        ref="calendar"
        :insert="false"
        :range="true"
        @confirm="confirmCalendar"
      />
    </view>
  </div>
</template>

<script>
export default {
  name: 'billDetails',
  data() {
    return {
      dateFilterText: '今天'
    }
  },
  methods: {
    onFilterClick() {
      const filter = JSON.stringify(['patientInfo','billOrderNo','doctorIds','consultantIds','parentChargeTypeIds'])
      this.$utils.push({
        url: `/pages/finance-report/filter?filter=${filter}`,
      })
    },
    openCalendar() {
      this.$refs.calendar.open()
    },
    confirmCalendar() {

    },
  }
};
</script>

<style lang="scss" scoped>
.bill-details-wrapper {
  background: rgba(0, 0, 0, 0.04);
  overflow-y: auto;
  .filter {
    background: #ffffff;
    height: 80rpx;
    display: flex;
    .uni-list-cell {
      width: 50vw;
      .left {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      }
      .right {
        color: #5cbb89;
      }
      .iconfont {
        font-size: 28rpx;
        margin-left: 20rpx;
      }
    }
  }
  .content {
    margin-top: 1.5vh;
    background: #ffffff;
    height: calc(98.5vh - 80rpx);
  }
}
</style>
