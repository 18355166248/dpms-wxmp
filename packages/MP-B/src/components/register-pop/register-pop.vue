<template>
  <u-modal
    v-model="showRegister"
    class="registerModal"
    :show-title="false"
    confirm-text="关闭"
    confirm-color="#5cbb89"
    @confirm="onConfirm"
  >
    <view class="slot-content">
      <view class="title">
        <view class="iconfont icon-warning warn"></view>
        <view style="width: 24rpx;"></view>
        <view class="titleTex"
          >患者本次挂号已产生就诊数据，删除后才能{{ title }}</view
        >
      </view>
      <view class="contentStyle">
        <view class="rowText">
          <view class="contentText">患者姓名：</view>
          <view class="info">{{ registerItem.patientName }}</view>
        </view>
        <view class="rowText">
          <view class="contentText">挂号时间：</view>
          <view class="info">{{ registerTime }}</view>
        </view>
        <view v-if="registerItem.billingCount > 0" class="rowText">
          <view class="contentText">账单记录：</view>
          <view class="info"
            >共关联{{ registerItem.billingCount }}条已收费账单</view
          >
        </view>
        <view v-if="registerItem.electronicMedicalCount > 0" class="rowText">
          <view class="contentText">电子病历：</view>
          <view class="info"
            >共关联{{ registerItem.electronicMedicalCount }}条电子病历</view
          >
        </view>
        <view v-if="registerItem.prescriptionCount > 0" class="rowText">
          <view class="contentText">处方记录：</view>
          <view class="info"
            >共关联{{ registerItem.prescriptionCount }}条处方记录</view
          >
        </view>
        <view v-if="registerItem.imageCount > 0" class="rowText">
          <view class="contentText">影像记录：</view>
          <view class="info"
            >共关联{{ registerItem.imageCount }}条影像记录</view
          >
        </view>
        <view v-if="registerItem.disposalRecordCount > 0" class="rowText">
          <view class="contentText">处置记录：</view>
          <view class="info"
            >共关联{{ registerItem.disposalRecordCount }}条处置记录</view
          >
        </view>
        <view v-if="registerItem.technologyProcessingCount > 0" class="rowText">
          <view class="contentText">技加工申请：</view>
          <view class="info"
            >共关联{{
              registerItem.technologyProcessingCount
            }}条技加工申请单</view
          >
        </view>
      </view>
    </view>
  </u-modal>
</template>

<script>
import moment from 'moment'

export default {
  name: 'RegisterPop',
  props: {
    show: {
      type: Boolean,
    },
    title: {
      type: String,
      default: '回退',
    },
    registerItem: {
      type: Object,
    },
  },
  watch: {
    show(newVal, oldVal) {
      if (newVal === oldVal) return
      this.showRegister = newVal
      this.registerTime = moment(this.registerItem?.registerTime).format(
        'YYYY-MM-DD HH:mm',
      )
    },
  },
  data() {
    return {
      registerTime: null,
      showRegister: false,
    }
  },
  methods: {
    onConfirm() {
      this.$emit('click')
    },
  },
}
</script>

<style lang="scss" scoped>
.registerModal {
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  .slot-content {
    padding: 48rpx 48rpx 28rpx 48rpx;
    border-bottom: 1px solid #e5e5e5;
    .title {
      display: flex;
      background-color: #fdfcec;
      padding: 12rpx 48rpx 12rpx 20rpx;
      .warn {
        font-size: 40rpx;
        color: #f86e21;
      }
      .titleTex {
        font-size: 25rpx;
        color: #f86e21;
      }
    }
    .contentStyle {
      padding: 32rpx 0 8rpx;
      .rowText {
        display: flex;
        margin-bottom: 24rpx;
      }
      .contentText {
        width: 33%;
        font-size: 28rpx;
        font-family: PingFangSC, PingFangSC-Regular;
      }
      .info {
        font-size: 28rpx;
        font-weight: bold;
        font-family: PingFangSC, PingFangSC-Regular;
      }
    }
  }
}
</style>
