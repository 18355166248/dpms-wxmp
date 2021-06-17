<template>
  <view class="detail">
    <view class="detail-info">
      <view class="detail-info-name">物品名称123</view>
      <view>
        <text class="label">物品编号：</text>
        <text class="value">ISO2104521421045210</text>
      </view>
      <view>
        <text class="label">品牌：</text>
        <text class="value">ISO2104521421045210</text>
      </view>
      <view>
        <text class="label">物品类型：</text>
        <text class="value">ISO2104521421045210</text>
      </view>
    </view>

    <view class="detail-item">
      <text>医（械）准字</text>
      <text>A型*20个/包</text>
    </view>
    <view class="detail-item">
      <text>所属分类</text>
      <text>A型*20个/包</text>
    </view>
    <view class="detail-item">
      <text>条形码编号</text>
      <text>A型*20个/包</text>
    </view>
    <view class="detail-item">
      <text>生产厂商</text>
      <text>A型*20个/包</text>
    </view>
    <view class="detail-item">
      <text>启用状态</text>
      <text>A型*20个/包</text>
    </view>
    <view class="detail-divider">
      <text>规格信息</text>
    </view>
    <view class="detail-item">
      <text>采购单位</text>
      <text>包</text>
    </view>
    <view class="detail-item">
      <text>库存单位</text>
      <text>只</text>
    </view>
    <view class="detail-item">
      <text>单位进制</text>
      <text>20</text>
    </view>
  </view>
</template>
<script>
export default {}
</script>
<style lang="scss" scoped>
.detail {
  width: 100%;
  height: 100%;
  background-color: #e5e5e5;
  &-info {
    width: 100%;
    padding: 32rpx 0 32rpx 32rpx;
    background-color: #ffffff;
    margin-bottom: 16rpx;
    &-name {
      font-size: 28rpx;
      color: #191919;
    }
    .label {
      font-size: 28rpx;
      color: #4c4c4c;
    }
    .value {
      font-size: 28rpx;
      color: #191919;
    }
  }
  &-divider {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    padding-left: 32rpx;
    font-size: 28rpx;
    color: #191919;
    font-weight: 500;
  }
  &-item {
    width: 100%;
    height: 104rpx;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 32rpx;
    font-size: 30rpx;
    color: #4c4c4c;
    background-color: #ffffff;
    border-bottom: 1rpx solid #e5e5e5;
  }
}
</style>
