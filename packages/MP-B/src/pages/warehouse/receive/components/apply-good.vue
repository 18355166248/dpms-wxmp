<template>
  <view class="apply">
    <view class="apply-good">
      <view class="title">
        <text>{{ info.commonName }}</text>
        <text v-if="info.merchandiseName">/{{ info.merchandiseName }}</text>
        <text v-if="info.aliasName">/{{ info.aliasName }}</text>
      </view>
      <view class="mt16">
        <text class="label">品牌：</text>
        <text>{{ info.brandName || '-' }}</text>
      </view>
      <view class="mt16">
        <text class="label">规格信息：</text>
        <text>{{ info.specificationsStr || '-' }}</text>
      </view>
      <view class="mt16">
        <text class="label">可用库存：</text>
        <!-- | thousandFormatter(0, '') -->
        <text>{{
          info.availableNum || info.inventoryNum || 0 | thousandFormatter(0, '')
        }}</text>
        <text>{{ info.inventoryUnitStr }}</text>
      </view>
      <view class="mt16">
        <slot />
      </view>
    </view>
    <view class="apply-icon">
      <text class="iconfont icon-delete" @click="handleDelete"></text>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {}
  },
  methods: {
    handleDelete() {
      this.$emit('on-clear')
    },
  },
}
</script>
<style lang="scss" scoped>
.apply {
  box-sizing: border-box;
  width: 100%;
  height: auto;
  padding: 32rpx 32rpx 32rpx 0;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.15);
  color: #191919;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
  &-icon {
    color: rgba(0, 0, 0, 0.5);
  }
  .title {
    font-weight: 500;
    font-size: 28rpx;
  }
  .label {
    color: #4c4c4c;
  }
  .mt16 {
    margin-top: 16rpx;
  }
}
</style>
