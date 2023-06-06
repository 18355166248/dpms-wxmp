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
      <view v-if="errInfo.length === 0">{{ errData.approveReason || '' }}</view>
      <template v-else>
        <view>{{ errInfo[0] }}</view>
        <view
          style="
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          "
          >{{ errInfo[1] }}</view
        >
        <view>{{ errInfo[2] }}</view>
      </template>
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
      errInfo: [],
    }
  },
  methods: {
    open(errData, params) {
      this.show = true
      this.errData = errData
      this.params = params
      if (
        errData &&
        errData.approveReason &&
        errData.approveReason.indexOf('单项折扣的值是') > -1 &&
        errData.approveReason.indexOf('匹配到规则') > -1
      ) {
        this.errInfo = [
          '单项折扣的值是',
          errData.approveReason.substring(
            7,
            errData.approveReason.indexOf('匹配到规则'),
          ),
          errData.approveReason.substring(
            errData.approveReason.indexOf('匹配到规则'),
          ),
        ]
      } else {
        this.errInfo = []
      }
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
  // word-break: break-all;
}
</style>
