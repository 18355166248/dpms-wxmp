<template>
  <view class="receive-info">
    <view class="receive-info-head">
      <view>{{ detail.merchandiseReceiveOrderNo }}</view>
      <view
        ><text :style="{ color: receiveStatusColor[detail.receiveStatus] }">{{
          receiveStatusMap[detail.receiveStatus]
        }}</text></view
      >
    </view>
    <view class="receive-info-date value">
      <text>{{ detail.lastUpdateTime | filterTime('YYYY-MM-DD') }}</text>
      <text class="m24"
        >({{ receiveDeptTypeMap[detail.receiveDeptType] }})</text
      >
      <text>{{ detail.receiveDeptName || '-' }}</text>
    </view>
    <view class="receive-info-goods">
      <text class="value"
        >共{{ detail.merchandiseTotal || 0 }}种物品，合计{{
          detail.merchandiseItemTotal || 0
        }}件</text
      >
    </view>
    <view class="receive-info-person">
      <text class="label">开单人：</text>
      <text class="value">{{ detail.createStaffName || '-' }}</text>
    </view>
    <view class="receive-info-desc">
      <view class="label">领用说明：</view>
      <view class="value">{{ detail.description || '-' }}</view>
    </view>
  </view>
</template>
<script>
import {
  receiveStatusMap,
  receiveDeptTypeMap,
  receiveStatusColor,
} from '../enum'
export default {
  props: {
    detail: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      receiveDeptTypeMap,
      receiveStatusMap,
      receiveStatusColor,
    }
  },
}
</script>
<style lang="scss" scoped>
.receive-info {
  box-sizing: border-box;
  width: 100%;
  height: auto;
  padding: 32rpx 24rpx;
  background-color: #ffffff;
  border-radius: 8rpx;
  min-height: 316rpx;
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
    }
    text:last-child {
      color: #fa8c16;
      font-size: 28rpx;
    }
  }
  &-person {
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
