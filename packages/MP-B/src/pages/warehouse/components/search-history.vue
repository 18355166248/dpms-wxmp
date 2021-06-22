<template>
  <view class="search-history">
    <view class="search-history-head">
      <text class="search-history-head-name">搜索历史</text>
      <text @click="handleClickIcon" class="iconfont icon-delete"></text>
    </view>
    <view class="search-history-list">
      <view
        class="search-history-list-item"
        v-for="(item, index) in list"
        :key="index"
        @click="handleClickItem(item)"
      >
        <text>{{ item }}</text>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleClickIcon() {
      this.$emit('on-clear')
    },
    handleClickItem(item) {
      this.$emit('on-click', item)
    },
  },
}
</script>
<style lang="scss" scoped>
.search-history {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 32rpx;
  &-head {
    width: 100%;
    margin-bottom: 16rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-name {
      font-size: 34rpx;
      color: #000000;
      font-weight: 500;
    }
    .icon-delete {
      color: rgba(0, 0, 0, 0.5);
    }
  }
  &-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    &-item {
      margin-right: 32rpx;
      margin-bottom: 32rpx;
      padding: 16rpx 24rpx;
      border-radius: 8rpx;
      background: rgba(0, 0, 0, 0.06);
      color: #595959;
      font-size: 28rpx;
    }
  }
}
</style>
