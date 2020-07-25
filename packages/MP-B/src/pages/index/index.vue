<template>
  <view class="apptView">
    <dpmsDrawer maskClose ref="dpmsDrawer" width="320" />

    <calendar @collapseChange="collapseChange" />

    <view class="apptCardInfo">
      <view class="topGray"></view>
      <view v-if="showSearch">
        <dpmsSearch
          showCancel
          @cancel="cancel"
          @change="change"
          @search="search"
        />
      </view>
      <view v-else class="curCardInfo">
        <view>医生: 张医生</view>
        <view class="rightCardInfo">
          <span class="iconfont icon-search" @click="showSearch = true" />
          <span class="iconfont icon-menu" @click="openDrawer" />
        </view>
      </view>
    </view>

    <view v-if="showSearch">
      <view class="tc mt-20">请输入姓名/拼音/联系电话查找患者预约记录</view>
    </view>
    <dayTable
      :class="showSearch ? 'hidden' : ''"
      :style="{
        width: '100%',
        height: retract ? 'calc(100% - 284rpx)' : 'calc(100% - 724rpx)',
      }"
    />
  </view>
</template>

<script>
// import dayTable from '../../components/dayTable/dayTable.vue'
// import calendar from '../../components/calendar/calendar.vue'
// import zzxCalendar from '../../components/zzx-calendar/zzx-calendar.vue'

export default {
  data() {
    return {
      title: 'Hello',
      retract: true, // 日历展开: false 收缩: true
      showSearch: false, // 搜索患者
    }
  },
  onLoad() {},
  methods: {
    collapseChange(val) {
      this.retract = val
    },
    cancel() {
      this.showSearch = false
    },
    search(value) {
      console.log('search', value)
    },
    change(value) {
      console.log('change', value)
    },
    openDrawer() {
      this.$refs.dpmsDrawer.open()
    },
  },
  // components: {
  //   dayTable,
  //   calendar,
  // },
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
      box-sizing: border-box;
      padding: 0 8px;
      font-size: 26rpx;
      width: 100%;
      height: 55rpx;
      line-height: 55rpx;
      box-shadow: 0 5rpx 8rpx #00000033;
      display: flex;
      justify-content: space-between;

      .rightCardInfo {
        span:first-child {
          font-size: 32rpx;
          margin-right: 10rpx;
        }
        span:last-child {
          font-size: 30rpx;
        }
      }
    }
  }
}
</style>
