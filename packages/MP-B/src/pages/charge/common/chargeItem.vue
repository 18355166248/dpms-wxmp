<template>
  <view class="charge-amount">
    <view class="flex flex-v-center">
      <view v-if="amountData.format" class="amount">{{
        amountData.amount | thousandFormatter(2, '￥')
      }}</view>
      <view v-else class="amount">{{ amountData.amount }}</view>
      <slot></slot>
    </view>
    <view class="des">{{ amountData.name }}</view>
  </view>
</template>
<script>
export default {
  name: '',
  data() {
    return {}
  },
  props: {
    amountData: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  computed: {},
  onLoad() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  methods: {},
  watch: {
    watchData: {
      handler(newVal, oldVal) {},
      deep: true,
      immediate: true,
    },
  },
  components: {},
}
</script>
<style lang="scss" scoped>
.charge-amount {
  font-size: 30rpx;
  color: #595959;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 90rpx;
  justify-content: space-around;
  position: relative;
  width: 100%;

  .amount {
    font-size: 28rpx;
    color: #191919;
    font-weight: 500;
    line-height: 36rpx;
  }
  .des {
    color: #8c8c8c;
    font-size: 28rpx;
    font-weight: 400;
    line-height: 36rpx;
  }
}
</style>
