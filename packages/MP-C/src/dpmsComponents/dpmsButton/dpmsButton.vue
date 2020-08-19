<template>
  <button
    @click="clickButton"
    :disabled="disabled"
    :loading="loading"
    :class="[
      type === 'primary' ? 'dpms-button-primary' : '',
      { disabled: disabled },
    ]"
  >
    {{ text }}
  </button>
</template>
<script>
export default {
  name: 'dpmsButton',
  props: {
    text: {
      type: String,
      default: '保存',
    },
    type: {
      type: String,
      default: 'primary',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    clickButton() {
      this.$emit('click')
    },
  },
}
</script>

<style lang="scss" scoped>
button {
  width: 620rpx;
  height: 78rpx;
  line-height: 78rpx;
  border-radius: 8rpx;
  font-size: 36rpx;
  font-weight: 400;
  text-align: center;
  background: #fff;
  border: 2rpx solid #5cbb89;
  color: #5cbb89;
  &.disabled {
    background: #fff;
    border: 2rpx solid #5cbb89;
    color: #5cbb89;
  }
}
.dpms-button-primary {
  background: #5cbb89;
  border: none;
  color: #ffffff;
  &.disabled {
    background: #5cbb89;
    border: none;
    color: #ffffff;
  }
  &::after {
    border: none;
  }
}
</style>
