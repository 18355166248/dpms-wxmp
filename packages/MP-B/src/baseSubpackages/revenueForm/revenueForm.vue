<template>
  <view @touchstart="touchStart" @touchend="touchEnd" style="height: 100vh;">
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

    <promotion v-if="currentTab === 0" />
    <diagnosis v-if="currentTab === 1" />
    <appointment v-if="currentTab === 2" />
  </view>
</template>

<script>
import moment from 'moment'
import tabs from '@/components/tabs/tabs.vue'
import promotion from './promotion'
import diagnosis from './diagnosis'
import appointment from './appointment'

export default {
  components: {
    tabs,
    promotion,
    diagnosis,
    appointment,
  },
  data() {
    return {
      tabs: [
        { name: '营收日报表', val: 0 },
        { name: '到诊日报表', val: 1 },
        { name: '预约日报表', val: 2 },
      ],
      currentTab: 0,
      touchStartX: 0, // 触屏起始点x
      touchStartY: 0, // 触屏起始点y
      navMap: {
        0: 2,
        1: 0,
        2: 1,
      },
    }
  },
  onLoad() {},
  methods: {
    changeTab(i) {
      this.currentTab = this.tabs[i].val
    },
    /**
     * 触摸开始
     **/
    touchStart(e) {
      // console.log('触摸开始')
      this.touchStartX = e.touches[0].clientX
      this.touchStartY = e.touches[0].clientY
    },
    /**
     * 触摸结束
     **/
    touchEnd(e) {
      // console.log('触摸结束')
      let deltaX = e.changedTouches[0].clientX - this.touchStartX
      let deltaY = e.changedTouches[0].clientY - this.touchStartY
      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX >= 0) {
          this.currentTab = this.currentTab === 0 ? 2 : this.currentTab - 1
        } else {
          this.currentTab = this.currentTab === 2 ? 0 : this.currentTab + 1
        }
      } else if (Math.abs(deltaY) > 50 && Math.abs(deltaX) < Math.abs(deltaY)) {
        if (deltaY < 0) {
          // console.log('上滑')
        } else {
          // console.log('下滑')
        }
      } else {
        // console.log('可能是误触！')
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
