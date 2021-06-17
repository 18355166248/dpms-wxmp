<template>
  <view class="good-details">
    <view class="good-name mb16"
      ><text>{{ detail.commonName }}</text></view
    >
    <view class="mb16"
      ><text class="text-label">物品编号：</text
      ><text class="text-value">{{ detail.merchandiseNo }}</text></view
    >
    <view class="mb16"
      ><text class="text-label">品牌：</text
      ><text class="text-value">{{ detail.brandName }}</text></view
    >
    <view class="mb16"
      ><text class="text-label">物品类型：</text
      ><text class="text-value">{{ detail.merchandiseType }}</text></view
    >
    <view class="mb16"
      ><text class="text-label">规格类型：</text
      ><text class="text-value">{{ detail.specificationsStr }}</text></view
    >
  </view>
</template>
<script>
export default {
  props: {
    detail: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
}
</script>
<style lang="scss" scoped>
.good-details {
  width: 100%;
  padding: 32rpx 0 16rpx 0rpx;
  border-bottom: 1rpx solid #000000;
  font-size: 28rpx;
  .good-name {
    color: #191919;
    font-weight: 500;
  }
  .mb16 {
    margin-bottom: 16rpx;
  }
  .text-label {
    color: #4c4c4c;
  }
  .text-value {
    color: #191919;
  }
}
</style>
