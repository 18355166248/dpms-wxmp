<template>
  <view class="receive">
    <view class="receive-head">
      <view class="receive-head-status"
        >领用状态：{{ receiveStatusMap[detail.receiveStatus] || '' }}</view
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
              <view>
                <text>{{ item.commonName }}</text>
                <text v-if="item.merchandiseName"
                  >/{{ item.merchandiseName }}</text
                >
                <text v-if="item.aliasName">/{{ item.aliasName }}</text>
              </view>
              <view
                ><text class="label">规格信息：</text
                ><text class="value">{{ item.specificationsStr }}</text></view
              >
              <view
                ><text class="label">领用数量：</text
                ><text class="value">{{
                  item.receiveNum | thousandFormatter(0, '')
                }}</text>
                <text>{{ item.inventoryUnitStr }}</text>
              </view>
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
            <view class="value">
              <text class="mr20"
                >({{ receiveDeptTypeMap[detail.receiveDeptType] }})</text
              >
              <text>{{ detail.receiveDeptName }}</text>
            </view>
          </view>
          <view class="receive-main-info-item">
            <view class="label">开单人</view>
            <view class="value">{{ detail.createStaffName }}</view>
          </view>
          <view class="receive-main-info-item">
            <view class="label">物品种类</view>
            <view class="value">
              <text class="mr20">{{
                detail.merchandiseTotal | thousandFormatter(0, '')
              }}</text>
              <text
                >(合计{{
                  detail.merchandiseItemTotal | thousandFormatter(0, '')
                }}件)</text
              >
            </view>
          </view>
          <view class="receive-main-info-item">
            <view class="label">领用说明</view>
            <view class="value">{{ detail.description }}</view>
          </view>
        </view>
      </scroll-view>
      <!-- 当领用状态为 待提交时 显示 -->
      <view
        class="receive-main-action"
        v-if="detail.receiveStatus == 5 || detail.receiveStatus == 6"
      >
        <view class="edit_btn" @click="handleEdit">修改</view>
        <view class="submit_btn" @click="editReceiveApplyStatus">提交申请</view>
      </view>
    </view>
  </view>
</template>
<script>
import { receiveStatusMap, receiveDeptTypeMap } from '../enum'
import receiveAPI from '@/APIS/warehouse/receive.api.js'
export default {
  data() {
    return {
      receiveStatusMap,
      receiveDeptTypeMap,
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
    handleEdit() {
      this.$dpmsUtils.replace({
        url: `/pages/warehouse/receive/apply?merchandiseReceiveOrderId=${this.detail.merchandiseReceiveOrderId}`,
      })
    },
    // 待提交状态直接提交申请, 修改状态为确认中
    async editReceiveApplyStatus() {
      let data = {
        merchandiseReceiveOrderId: this.merchandiseReceiveOrderId,
        receiveStatus: 1,
      }
      const res = await receiveAPI.editReceiveApplyStatus(data)
      if (res.code == 0) {
        uni.showToast({
          icon: 'none',
          title: '已提交',
        })
        this.getReceiveDetail(this.merchandiseReceiveOrderId)
      }
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
      overflow: hidden;
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
        white-space: pre-wrap;
        overflow: hidden;
        text-overflow: ellipsis;
        view:first-child {
          flex-shrink: 0;
        }
        view:last-child {
          flex: 1;
          padding-left: 24rpx;
          text-align: right;
          line-height: 52rpx;
          overflow: hidden;
          max-height: 104rpx;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          display: -webkit-box;
          -webkit-box-orient: vertical;
        }
      }
    }
    .label {
      color: #4c4c4c;
    }
    .value {
      color: #191919;
    }
    .mr20 {
      margin-right: 20rpx;
    }
  }
}
</style>
