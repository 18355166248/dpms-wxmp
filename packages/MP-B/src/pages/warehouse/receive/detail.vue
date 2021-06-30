<template>
  <view class="receive">
    <view class="receive-head">
      <view class="receive-head-status"
        >领用状态：{{ detail.receiveStatus }}</view
      >
    </view>
    <view class="receive-main">
      <scroll-view class="scroll-area" scroll-y="true">
        <view class="receive-main-goods">
          <view class="receive-main-goods-list">
            <view
              class="receive-main-goods-list-item"
              v-for="(item, index) in detail.receiveOrderItemVOList"
              :key="index"
            >
              <view>{{ item.commonName }}</view>
              <view
                ><text class="label">规格信息：</text
                ><text class="value">{{ item.specificationsStr }}</text></view
              >
              <view
                ><text class="label">领用数量：</text
                ><text class="value">{{
                  `${item.receiveNum}${item.inventoryUnitStr}`
                }}</text></view
              >
            </view>
          </view>
        </view>
        <view class="receive-main-info">
          <view class="receive-main-info-item">
            <view class="label">领用单号</view>
            <view class="value">{{ detail.merchandiseReceiveOrderNo }}</view>
          </view>
          <view class="receive-main-info-item">
            <view class="label">开单时间</view>
            <view class="value">{{ detail.lastUpdateTime | filterTime }}</view>
          </view>
          <view class="receive-main-info-item">
            <view class="label">领用单位</view>
            <view class="value">{{
              `(${detail.receiveDeptType})${detail.receiveDeptName}`
            }}</view>
          </view>
          <view class="receive-main-info-item">
            <view class="label">开单人</view>
            <view class="value">{{ detail.createStaffName }}</view>
          </view>
          <view class="receive-main-info-item">
            <view class="label">物品种类</view>
            <view class="value">合计80件</view>
          </view>
          <view class="receive-main-info-item">
            <view class="label">领用说明</view>
            <view class="value"
              >多久啊看见的拉开讲道理卡德加拉克的多久啊逻辑的辣三丁对进垃圾堆上课啦</view
            >
          </view>
        </view>
      </scroll-view>
      <view class="receive-main-action">
        <view class="edit_btn">修改</view>
        <view class="submit_btn">提交申请</view>
      </view>
    </view>
  </view>
</template>
<script>
import receiveAPI from '@/APIS/warehouse/receive.api.js'
export default {
  data() {
    return {
      merchandiseReceiveOrderId: null,
      detail: {},
    }
  },
  onLoad({ merchandiseReceiveOrderId }) {
    this.merchandiseReceiveOrderId = merchandiseReceiveOrderId
    this.getReceiveDetail(merchandiseReceiveOrderId)
  },
  methods: {
    async getReceiveDetail(merchandiseReceiveOrderId) {
      const res = await receiveAPI.getReceiveDetail({
        merchandiseReceiveOrderId,
      })
      this.detail = res.data
    },
  },
}
</script>
<style lang="scss" scoped>
.receive {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f5f5f5;
  position: relative;
  > view {
    box-sizing: inherit;
  }
  &-head {
    width: 100%;
    height: 178rpx;
    padding: 0 24rpx;
    background-color: $common-color;
    border-bottom-left-radius: 40rpx;
    border-bottom-right-radius: 40rpx;
    &-status {
      padding: 0 24rpx;
      height: 56rpx;
      line-height: 56rpx;
      background-color: #fefcec;
      color: #f86e21;
      font-size: 24rpx;
    }
  }
  &-main {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    padding-top: 78rpx;
    display: flex;
    flex-direction: column;
    .scroll-area {
      flex: 1;
    }
    &-action {
      box-sizing: border-box;
      width: 100%;
      height: 180rpx;
      padding: 0 32rpx;
      background-color: #ffffff;
      display: flex;
      justify-content: space-between;
      padding-top: 16rpx;
      .edit_btn,
      .submit_btn {
        width: 335rpx;
        height: 80rpx;
        border-radius: 42rpx;
        text-align: center;
        line-height: 80rpx;
        font-size: 36rpx;
        font-weight: 400;
      }
      .edit_btn {
        border: 2rpx solid #5cbb89;
        background-color: #ffffff;
        color: #5cbb89;
      }
      .submit_btn {
        background-color: #5cbb89;
        color: #ffffff;
      }
    }
    &-goods {
      box-sizing: border-box;
      width: 100%;
      padding: 0 24rpx;
      > view {
        box-sizing: inherit;
      }
      &-list {
        padding: 0 24rpx;
        background-color: #ffffff;
        border-radius: 8rpx;
        &-item {
          padding: 24rpx 0;
          border-bottom: 1rpx solid rgba(0, 0, 0, 0.15);
          font-size: 28rpx;
          view:nth-child(1) {
            font-weight: 500;
            color: #191919;
          }
          view:nth-child(2) {
            margin: 16rpx 0;
          }
        }

        &-item:last-child {
          border-bottom: none;
        }
      }
    }
    &-info {
      box-sizing: border-box;
      width: 100%;
      background-color: #ffffff;
      padding-left: 24rpx;
      margin-top: 32rpx;
      &-item {
        box-sizing: inherit;
        width: 100%;
        height: 104rpx;
        padding-right: 24rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1rpx solid rgba(0, 0, 0, 0.15);
        view:first-child {
          flex-shrink: 0;
        }
        view:last-child {
          flex: 1;
          padding-left: 24rpx;
          text-align: right;
        }
      }
    }
    .label {
      color: #4c4c4c;
    }
    .value {
      color: #191919;
    }
  }
}
</style>
