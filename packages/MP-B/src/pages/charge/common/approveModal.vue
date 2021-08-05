<template>
  <u-modal
    v-model="show"
    confirm-color="#5CBB89"
    show-cancel-button="true"
    @confirm="onConfirm"
    @cancel="onCancel"
    title="收费审批确认"
  >
    <view class="slot-content" v-if="errData">
      <view>{{ errData.approveReason || '' }}</view>
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
      errData: {},
      params: {},
    }
  },
  methods: {
    open(errData, params) {
      this.show = true
      this.errData = errData
      this.params = params
    },

    onConfirm() {
      billAPI.commitApprove(this.params).then((res) => {
        if (res?.code === 0) {
          this.$emit('confirm')
        }
      })
    },

    onCancel() {
      this.$emit('cancel')
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
