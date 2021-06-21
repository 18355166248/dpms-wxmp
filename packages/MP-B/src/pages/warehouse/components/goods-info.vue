<template>
  <view class="good-details" @click="onClick">
    <view class="good-name mb16">
      <text>{{ detail.commonName }}</text>
      <text v-if="detail.merchandiseName">/{{ detail.merchandiseName }}</text>
      <text v-if="detail.aliasName">/{{ detail.aliasName }}</text>
    </view>
    <view class="mb16"
      ><text class="text-label">物品编号：</text
      ><text class="text-value">{{ detail.merchandiseNo }}</text></view
    >
    <view class="mb16" v-if="type === 'good'"
      ><text class="text-label">品牌：</text
      ><text class="text-value">{{ detail.brandName }}</text></view
    >
    <view class="mb16" v-if="type === 'good'"
      ><text class="text-label">物品类型：</text
      ><text class="text-value">{{ detail.merchandiseTypeStr }}</text></view
    >
    <!-- 物品展示 -->
    <view class="mb16"
      ><text class="text-label">规格类型：</text
      ><text class="text-value">{{ detail.specificationsStr }}</text></view
    >
    <!-- 库存展示 -->
    <view class="mb16" v-if="type === 'inventory'"
      ><text class="text-label">可用库存：</text>
      <text class="text-value available">{{
        `${detail.inventoryNum || 0} ${detail.inventoryUnitStr || ''}`
      }}</text>
    </view>
    <image
      v-if="!detail.isEnable"
      class="disable-img"
      src="../../../static/disable.png"
    />
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
    type: {
      type: String,
      default: 'good', // good 物品  inventory 库存
    },
  },
  methods: {
    onClick() {
      this.$emit('on-click')
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
  box-sizing: border-box;
  position: relative;
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
  .disable-img {
    position: absolute;
    top: 32rpx;
    right: 0;
    width: 40rpx;
    height: 56rpx;
  }
  .available {
    color: #fa8c16;
  }
}
</style>
