<template>
  <view class="request-error" :style="{ background: bg }">
    <text class="request-error-text">{{
      msg ? msg : '您的手机网络好像不太流畅哦~'
    }}</text>
    <button class="request-error-btn" @click="onClick()">
      重新加载
    </button>
  </view>
</template>

<script>
export default {
  name: 'RequestError',
  props: {
    msg: {
      type: String,
    },
    bg: {
      type: String,
      default: 'none',
    },
  },
  methods: {
    onClick() {
      this.$emit('click')
    },
  },
}
</script>

<style lang="scss" scoped>
.request-error {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  padding-top: 40%;

  background: #fff;
  &-text {
    color: #666;
  }
  &-btn {
    width: 30%;
    height: 52rpx;
    line-height: 52rpx;
    margin-top: 30rpx;
    text-align: center;
    background: $dpms-color-primary;
    color: #fff;
    border-radius: 5rpx;
    font-size: 28rpx;
  }
}
</style>
