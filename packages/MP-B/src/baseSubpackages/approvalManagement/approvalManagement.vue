<template>
  <view class="mainWrapper">
    <view class="topBar mb-18">
      <tabs
        style="width: 100%;"
        height="96rpx"
        v-model="activeTab"
        :scroll="false"
        :tabs="['我发起的', '我审核的']"
        color="#5cbb89"
        activeColor="#5cbb89"
        lineColor="#5cbb89"
        lineHeight="4rpx"
        lineRadius="2rpx"
        fontSize="30rpx"
        lineScale="0.2"
        @change="changeTab"
      ></tabs>
    </view>
    <requestApplied v-if="currentTab === 0"></requestApplied>
    <requestReview v-if="currentTab === 1"></requestReview>
  </view>
</template>

<script>
import tabs from '@/components/tabs/tabs'
import requestApplied from '@/baseSubpackages/approvalManagement/components/requestApplied'
import requestReview from '@/baseSubpackages/approvalManagement/components/requestReview'

export default {
  data() {
    return {
      show: false,
      activeTab: 0,
      currentTab: 0,
    }
  },
  components: {
    tabs,
    requestApplied,
    requestReview,
  },
  methods: {
    changeTab(index) {
      this.currentTab = index
    },
  },
}
</script>

<style lang="scss" scoped>
.mainWrapper {
  background: #f5f5f5;
  /deep/ .u-input__right-icon {
    line-height: 76rpx;
    padding-right: 10rpx;
  }
  /deep/ .u-input__input {
    height: 76rpx;
    padding-left: 10rpx;
  }
}
</style>
