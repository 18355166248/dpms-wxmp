<template>
  <view class="mainWrapper">
    <view class="textControl">
      <textarea
        cols="10"
        rows="10"
        maxlength="200"
        placeholder="请输入200字以内审批通过信息"
        class="pl-32 pr-50 pt-32"
        v-model="val"
      >
      </textarea>
      <span class="numControl pr-32 pb-32">{{ val.length }}/200</span>
    </view>
    <view class="bottomBtn pv-16">
      <u-button :custom-style="confirmBtn" type="success" class="pr-32 ml-14"
        >确定</u-button
      >
      <u-button :custom-style="cancelBtn" type="success" class="pl-32"
        >取消</u-button
      >
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      val: '',
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
  methods: {},
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
