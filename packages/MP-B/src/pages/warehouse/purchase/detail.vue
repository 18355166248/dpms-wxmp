<template>
  <view class="purchase">
    <view class="purchase-head">
      <view class="purchase-head-status"
        >采购状态：{{ purchaseStatus[detail.purchaseStatus] || '' }}</view
      >
    </view>
    <view class="purchase-main">
      <scroll-view class="scroll-area" scroll-y="true">
        <view class="purchase-main-goods">
          <view class="purchase-main-goods-list">
            <view
              class="purchase-main-goods-list-item"
              v-for="(item, index) in detail.merchandisePurchaseOrderItemList"
              :key="index"
            >
              <view>
                <text>{{ item.commonName || '' }}</text>
                <text v-if="item.merchandiseName"
                  >/{{ item.merchandiseName || '' }}</text
                >
                <text v-if="item.aliasName">/{{ item.aliasName || '' }}</text>
              </view>
              <view
                ><text class="label">规格信息：</text
                ><text class="value">{{
                  item.specificationsStr || ''
                }}</text></view
              >
              <view
                ><text class="label">采购数量：</text
                ><text class="value">{{
                  item.purchaseNum || 0 | thousandFormatter(0, '')
                }}</text>
                <text>{{ item.purchaseUnitIdStr || '' }}</text>
              </view>
              <view
                ><text class="label">采购单价：</text
                ><text class="value">{{
                  item.purchaseUnitAmount || 0 | thousandFormatter(2)
                }}</text>
              </view>
              <view
                ><text class="label">采购金额：</text
                ><text class="value">{{
                  item.purchaseTotalAmount || 0 | thousandFormatter(2)
                }}</text>
              </view>
              <view
                ><text class="label">备注：</text
                ><text class="value">{{ item.description || '' }}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="purchase-main-info">
          <view class="purchase-main-info-item">
            <view class="label">物品总金额</view>
            <view class="value"
              >￥{{
                detail.purchaseTotalAmount -
                detail.freightAmount +
                detail.discountAmount
              }}</view
            >
          </view>
          <view class="purchase-main-info-item">
            <view class="label">整单折扣金额</view>
            <view class="value">{{
              detail.discountAmount | thousandFormatter(2)
            }}</view>
          </view>
          <view class="purchase-main-info-item">
            <view class="label">整单运费</view>
            <view class="value">
              <text>{{ detail.freightAmount | thousandFormatter(2) }}</text>
            </view>
          </view>
          <view class="purchase-main-info-item">
            <view class="label">采购总金额</view>
            <view class="value">{{
              detail.purchaseTotalAmount | thousandFormatter(2)
            }}</view>
          </view>
          <view class="purchase-main-info-item">
            <view class="label">物品种类</view>
            <view class="value">
              <text class="mr20">{{
                detail.merchandiseTotal || 0 | thousandFormatter(0, '')
              }}</text>
              <text
                >(合计{{
                  detail.merchandiseItemTotal || 0 | thousandFormatter(0, '')
                }}件)</text
              >
            </view>
          </view>
          <view class="purchase-main-info-item">
            <view class="label">采购单号</view>
            <view class="value">{{ detail.merchandisePurchaseOrderNo }}</view>
          </view>
          <view class="purchase-main-info-item">
            <view class="label">采购负责人</view>
            <view class="value">{{ detail.confirmStaffName }}</view>
          </view>
          <view class="purchase-main-info-item">
            <view class="label">开单时间</view>
            <view class="value">{{
              detail.createTime || '' | filterTime
            }}</view>
          </view>
          <view class="description">
            <view class="label">备注</view>
            <view class="value">{{ detail.memo || '' }}</view>
          </view>
        </view>
      </scroll-view>
      <!-- 当领用状态为 待提交时 显示 -->
      <view class="purchase-main-action">
        <view class="edit_btn" @click="handleEdit">修改</view>
      </view>
    </view>
  </view>
</template>
<script>
import { purchaseStatus, receiveDeptTypeMap } from '../enum'
import purchaseAPI from '@/APIS/warehouse/purchase.api.js'
export default {
  data() {
    return {
      purchaseStatus,
      receiveDeptTypeMap,
      merchandisePurchaseOrderId: null,
      detail: {},
    }
  },
  onLoad({ merchandisePurchaseOrderId }) {
    this.merchandisePurchaseOrderId = merchandisePurchaseOrderId
    this.getPurchaseDetail(merchandisePurchaseOrderId)
  },
  methods: {
    async getPurchaseDetail(merchandisePurchaseOrderId) {
      const res = await purchaseAPI.getPurchaseDetail({
        merchandisePurchaseOrderId,
      })
      this.detail = res.data
    },
    handleEdit() {
      this.$dpmsUtils.replace({
        url: `/pages/warehouse/purchase/apply?merchandisePurchaseOrderId=${this.merchandisePurchaseOrderId}`,
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.warp {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200rpx;
  height: 180rpx;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 8rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.purchase {
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
      font-size: 30rpx;
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
      padding-top: 16rpx;
      .edit_btn {
        width: 686rpx;
        height: 80rpx;
        margin: 0 auto;
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
          font-size: 30rpx;
          view:nth-child(1) {
            font-weight: 500;
            color: #191919;
          }
          view:nth-child(2) {
            margin-top: 16rpx;
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
      font-size: 30rpx;
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
      .description {
        box-sizing: inherit;
        width: 100%;
        height: 144rpx;
        padding-right: 24rpx;
        padding-top: 32rpx;
        display: flex;
        justify-content: space-between;
        border-bottom: 1rpx solid rgba(0, 0, 0, 0.15);
        white-space: pre-wrap;
        overflow: hidden;
        view:first-child {
          flex-shrink: 0;
        }
        view:last-child {
          flex: 1;
          padding-left: 24rpx;
          text-align: right;
          overflow: hidden;
          line-height: 42rpx;
          max-height: 80rpx;
          word-break: break-all;
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
