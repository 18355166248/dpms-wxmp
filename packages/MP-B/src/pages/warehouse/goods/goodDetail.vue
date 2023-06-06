<template>
  <view class="detail">
    <view class="detail-info">
      <view class="detail-info-name mb16">
        <text>{{ detail.commonName }}</text>
        <text v-if="detail.merchandiseName">/{{ detail.merchandiseName }}</text>
        <text v-if="detail.aliasName">/{{ detail.aliasName }}</text>
      </view>
      <view class="mb16">
        <text class="label">物品编号：</text>
        <text class="value">{{ detail.merchandiseNo }}</text>
      </view>
      <view class="mb16">
        <text class="label">品牌：</text>
        <text class="value">{{ detail.brandName }}</text>
      </view>
      <view class="mb16">
        <text class="label">物品类型：</text>
        <text class="value">{{ detail.merchandiseTypeStr }}</text>
      </view>
      <view>
        <text class="label">规格信息：</text>
        <text class="value">{{ detail.specificationsStr }}</text>
      </view>
    </view>
    <view class="detail-item">
      <text>批准文号</text>
      <text>{{ detail.medicalInstrumentNo }}</text>
    </view>
    <view class="detail-item">
      <text>注册证号</text>
      <text>{{ detail.registrationNo }}</text>
    </view>

    <view class="detail-item">
      <text>所属分类</text>
      <text>{{ detail.merchandiseCategoryThreeName }}</text>
    </view>
    <view class="detail-item">
      <text>条形码编号</text>
      <text>{{ detail.barCode }}</text>
    </view>
    <view class="detail-item">
      <text>生产厂商</text>
      <text>{{ detail.manufacturer }}</text>
    </view>
    <view class="detail-item">
      <text>启用状态</text>
      <text>{{ detail.isEnable ? '启用' : '禁用' }}</text>
    </view>
    <view class="detail-divider">
      <text>规格信息</text>
    </view>
    <view class="detail-item">
      <text>采购单位</text>
      <text>{{ detail.purchaseUnitIdStr }}</text>
    </view>
    <view class="detail-item">
      <text>库存单位</text>
      <text>{{ detail.inventoryUnitStr }}</text>
    </view>
    <view class="detail-item">
      <text>单位进制</text>
      <text>{{ detail.unitSystem }}</text>
    </view>
  </view>
</template>
<script>
import goodAPI from '@/APIS/warehouse/good.api.js'
export default {
  data() {
    return {
      detail: {},
    }
  },
  onLoad({ merchandiseId }) {
    this.getGoodsDetail(merchandiseId)
  },
  methods: {
    async getGoodsDetail(merchandiseId) {
      const res = await goodAPI.getGoodsDetail({ merchandiseId })
      this.detail = res.data
    },
  },
}
</script>
<style lang="scss" scoped>
.mb16 {
  margin-bottom: 16rpx;
}
.detail {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  &-info {
    width: 100%;
    padding: 32rpx 0 32rpx 32rpx;
    background-color: #ffffff;
    margin-bottom: 16rpx;
    font-size: 28rpx;
    &-name {
      color: #191919;
      font-weight: 500;
    }
    .label {
      color: rgba(76, 76, 76, 0.7);
    }
    .value {
      color: rgba(25, 25, 25, 0.9);
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
