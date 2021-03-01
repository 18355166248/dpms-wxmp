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

    <pending v-if="currentTab === 0" />
  </view>
</template>

<script>
import moment from 'moment'
import tabs from '@/components/tabs/tabs.vue'
import pending from './pending'
import { mapState } from 'vuex'

export default {
  components: {
    tabs,
    pending,
  },
  data() {
    return {
      tabs: [
        { name: '待处理账单', val: 0 },
        { name: '已收费账单', val: 1 },
        { name: '支付记录', val: 2 },
      ],
      currentTab: 0,
      touchStartX: 0, // 触屏起始点x
      touchStartY: 0, // 触屏起始点y
    }
  },
  computed: {
    ...mapState('workbenchStore', ['menu']),
  },
  methods: {
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

<style lang="scss" scoped></style>
