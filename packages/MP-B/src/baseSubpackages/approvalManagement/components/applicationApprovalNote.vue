<template>
  <view class="mainWrapper">
    <view class="textControl">
      <textarea
        cols="10"
        rows="11"
        maxlength="200"
        placeholder="请输入200字以内审批信息"
        class="pl-32 pr-50 pt-32"
        v-model="val"
      >
      </textarea>
      <span class="numControl pr-32 pb-32">{{ val.length }}/200</span>
    </view>
    <view class="bottomBtn pv-16">
      <u-button
        :custom-style="confirmBtn"
        type="success"
        class="pr-32 ml-14"
        @click="submit"
        >确定</u-button
      >
      <u-button
        :custom-style="cancelBtn"
        type="success"
        class="pl-32"
        @click="cancelSubmit"
        >取消</u-button
      >
    </view>
  </view>
</template>

<script>
import approvalApi from '@/APIS/approval/approval.api'
export default {
  data() {
    return {
      val: '',
      records: {},
      confirmBtn: {
        width: '336rpx',
        height: '80rpx',
        background: '#5cbb89',
        borderRadius: '42rpx',
      },
      cancelBtn: {
        width: '336rpx',
        height: '80rpx',
        background: '#ffffff',
        color: '#5cbb89',
        border: '2rpx solid #5cbb89',
        borderRadius: '40rpx',
      },
    }
  },
  onLoad(options) {
    this.records = JSON.parse(options.data)
    this.records.status = options.applicationStatus
  },
  methods: {
    submit() {
      approvalApi
        .updateApprovalStatus({
          businessId: this.records.businessId,
          instanceId: this.records.instanceId,
          approveResult: Number(this.records.status),
          approveComment: this.val,
          approveTypeId: this.records.approveTypeId,
        })
        .then(
          setTimeout(() => {
            wx.navigateBack()
          }, 300),
        )
    },
    cancelSubmit() {
      wx.navigateBack()
    },
  },
  onHide() {
    this.val = ''
  },
}
</script>

<style lang="scss" scoped>
.mainWrapper {
  background: #f5f5f5;
  .textControl {
    background: #ffffff;
    width: 100%;
    textarea {
      box-sizing: border-box;
    }
    > textarea {
      width: 100%;
    }
    .numControl {
      display: flex;
      flex-direction: row-reverse;
      height: 42rpx;
      font-weight: 400;
      text-align: left;
      color: rgba(0, 0, 0, 0.25);
      line-height: 42rpx;
    }
  }
  .bottomBtn {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    background: #ffffff;
    display: flex;
    flex-direction: row-reverse;
    position: fixed;
    bottom: 0;
    height: 180rpx;
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
