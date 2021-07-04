<template>
  <u-modal
    v-model="show"
    confirm-color="#5CBB89"
    @confirm="onConfirm"
    @cancel="cancel"
    title="收费审批确认"
  >
    <view class="slot-content" v-if="approveData">
      <view>{{ approveData.approveReason || '' }}</view>
      <view>确认要审批吗？</view>
    </view>
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
