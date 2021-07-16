<template>
  <view class="purchase-info">
    <view class="purchase-info-head">
      <view>{{ detail.merchandisePurchaseOrderNo }}</view>
      <view class="purchase-info-head-status">
        <text
          class="round"
          :style="{ background: receiveStatusColor[detail.purchaseStatus] }"
        ></text>
        <text :style="{ color: receiveStatusColor[detail.purchaseStatus] }"
          >{{ purchaseStatus[detail.purchaseStatus] }}
        </text>
      </view>
    </view>
    <view class="purchase-info-goods">
      <text class="value"
        >共{{
          detail.merchandiseTotal || 0 | thousandFormatter(0, '')
        }}种物品，合计{{
          detail.merchandiseItemTotal || 0 | thousandFormatter(0, '')
        }}件</text
      >
    </view>
    <view class="purchase-info-total">
      <text class="label">采购总金额：</text>
      <text class="value">{{
        detail.purchaseTotalAmount || 0 | thousandFormatter(2)
      }}</text>
    </view>
    <view class="label">
      <text>(整单折扣：</text>
      <text>{{ 0 | thousandFormatter(2) }}</text>
      <text>，</text>
      <text>整单运费：</text>
      <text>{{ 0 | thousandFormatter(2) }}</text>
      <text>)</text>
    </view>
    <view class="purchase-info-desc">
      <view class="label">供应商：</view>
      <view class="value">{{ detail.merchandiseSupplierName || '-' }}</view>
    </view>
  </view>
</template>
<script>
import { purchaseStatus, receiveStatusColor } from '../enum'
export default {
  props: {
    detail: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      purchaseStatus,
      receiveStatusColor,
    }
  },
}
</script>
<style lang="scss" scoped>
.purchase-info {
  box-sizing: border-box;
  width: 100%;
  height: auto;
  padding: 32rpx 24rpx;
  background-color: #ffffff;
  border-radius: 8rpx;
  min-height: 300rpx;
  > view {
    box-sizing: inherit;
  }
  &-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text:first-child {
      color: #000000;
      font-size: 34rpx;
      font-weight: 500;
    }
    text:last-child {
      color: #fa8c16;
      font-size: 28rpx;
    }
    &-status {
      position: relative;
      .round {
        margin-right: 12rpx;
        display: inline-block;
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
      }
    }
  }
  &-total {
    margin-top: 32rpx;
  }
  &-desc {
    display: flex;
    view:first-child {
      flex-shrink: 0;
    }
  }
  .label {
    color: #4c4c4c;
    font-size: 28rpx;
  }
  .value {
    font-size: 28rpx;
    color: #191919;
    word-break: break-all;
  }
  .m24 {
    margin: 0 24rpx;
  }
}
</style>
