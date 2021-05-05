<template>
  <u-modal
    v-model="show"
    :show-title="false"
    confirm-text="我知道了"
    confirm-color="#5CBB89"
    @confirm="onConfirm"
  >
    <view class="slot-content" v-if="payResult.length > 0">
      <view class="item" v-for="(item, index) in payResult" :key="index">
        <view class="amount-wrap">
          <view class="type-name">{{ item.transactionChannelName }}</view>
          <view class="amount">{{
            item.paymentAmount | thousandFormatter(2, '￥')
          }}</view>
        </view>
        <view
          class="success"
          :class="Number(item.payStatus) === 1 ? 'success' : 'error'"
        >
          {{ Number(item.payStatus) === 1 ? '成功' : '失败' }}
        </view>
      </view>
    </view>
  </u-modal>
</template>
<script>
export default {
  name: '',
  data() {
    return {
      show: false,
      payResult: [],
    }
  },
  methods: {
    open(payResult) {
      this.payResult = payResult || []
      this.show = true
    },
    onConfirm() {
      this.$emit('confirm')
    },
  },
  components: {},
}
</script>
<style lang="scss" scoped>
//
.slot-content {
  padding: 48rpx;
  border-bottom: 1rpx solid #e5e5e5;

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 32rpx;

    .amount-wrap {
      display: flex;
      font-size: 34rpx;
      color: #191919;

      .type-name {
        color: #595959;
        width: 150rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        padding-right: 60rpx;
      }

      .amount {
        color: #191919;
        font-weight: 500;
      }
    }

    .success {
      color: #5cbb89;
    }

    .error {
      color: #fa5151;
    }
  }

  .item:last-child {
    padding-bottom: 0;
  }
}
</style>
