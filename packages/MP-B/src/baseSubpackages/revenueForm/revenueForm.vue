<template>
  <view class="content">
    <tabs
      v-model="current"
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

    <promotion v-if="currentTab === 1" />
    <diagnosis v-if="currentTab === 0" />
  </view>
</template>

<script>
import moment from 'moment'
import tabs from '@/components/tabs/tabs.vue'
import promotion from './promotion'
import diagnosis from './diagnosis'

export default {
  components: {
    tabs,
    promotion,
    diagnosis,
  },
  data() {
    return {
      current: 0,
      tabs: [
        { name: '营收日报表', val: 0 },
        { name: '到诊日报表', val: 1 },
        { name: '预约日报表', val: 2 },
      ],
      currentTab: 0,
    }
  },
  methods: {
    changeTab(i) {
      this.currentTab = this.tabs[i].val
    },
  },
}
</script>

<style lang="scss" scoped></style>
