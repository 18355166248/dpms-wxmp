<template>
  <u-modal
    v-model="show"
    :show-title="false"
    @confirm="onConfirm"
    @cancel="cancel"
  >
    <view class="slot-content" v-if="payResult.length > 0"> </view>
  </u-modal>
</template>
<script>
import billAPI from '@/APIS/bill/bill.api'

export default {
  name: 'approveModal',
  data() {
    return {
      show: false,
      approveData: {},
    }
  },
  methods: {
    open(approveData) {
      this.show = true
      this.approveData = approveData
    },

    onConfirm() {
      billAPI.commitApprove(approveData).then((res) => {
        if (res?.code === 0) {
          this.$emit('confirm')
        }
      })
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
}
</style>
