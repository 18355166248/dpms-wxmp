<template>
  <view class="good-details" @click="onClick">
    <view class="good-details-main">
      <view class="good-name">
        <text>{{ detail.commonName }}</text>
        <text v-if="detail.merchandiseName">/{{ detail.merchandiseName }}</text>
        <text v-if="detail.aliasName">/{{ detail.aliasName }}</text>
      </view>
      <view class="mt16" v-if="!mode"
        ><text class="text-label">物品编号：</text
        ><text class="text-value">{{ detail.merchandiseNo }}</text></view
      >
      <view class="mt16" v-if="type === 'good'"
        ><text class="text-label">品牌：</text
        ><text class="text-value">{{ detail.brandName }}</text></view
      >
      <view class="mt16" v-if="!mode && type === 'good'"
        ><text class="text-label">物品类型：</text
        ><text class="text-value">{{ detail.merchandiseTypeStr }}</text></view
      >
      <!-- 物品展示 -->
      <view class="mt16"
        ><text class="text-label">规格信息：</text
        ><text class="text-value">{{ detail.specificationsStr }}</text></view
      >
      <!-- 库存展示 -->
      <view class="mt16" v-if="type === 'inventory' || mode"
        ><text class="text-label">可用库存：</text>
        <text class="text-value available">{{
          detail.inventoryNum | thousandFormatter(0, '')
        }}</text>
        <text class="text-value available">{{
          `${detail.inventoryUnitStr || ''}`
        }}</text>
      </view>
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
    mode: {
      type: String,
      default: '',
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
  height: auto;
  padding: 32rpx 32rpx 0 32rpx;
  font-size: 28rpx;
  box-sizing: border-box;
  position: relative;
  background-color: #ffffff;
  &-main {
    width: 100%;
    padding-bottom: 32rpx;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.15);
    position: relative;
    z-index: 2;
  }
  .good-name {
    color: #191919;
    font-weight: 500;
  }
  .mt16 {
    margin-top: 16rpx;
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
    width: 80rpx;
    height: 112rpx;
  }
  .select_mode {
    position: absolute;
    top: 50%;
    right: 34rpx;
    transform: translateY(-50%);
  }
  .available {
    color: #fa8c16;
  }
}
</style>
