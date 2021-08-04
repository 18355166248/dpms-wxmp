<template>
  <button
    @click="clickButton"
    :disabled="disabled"
    :loading="loading"
    :class="[type === 'solid' ? 'solid' : 'border']"
    :style="[buttonStyle]"
  >
    <slot>新建</slot>
  </button>
</template>
<script>
export default {
  name: '',
  props: {
    text: {
      type: String,
      default: '新建',
    },
    type: {
      type: String,
      default: 'solid',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    buttonStyle: {
      type: Object,
      default: function () {
        return {}
      },
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
  width: 336rpx;
  height: 80rpx;
  border-radius: 40rpx;
  font-size: 36rpx;
  font-weight: 400;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.solid {
  background: #5cbb89;
  color: #ffffff;
}
.border {
  background: #ffffff;
  color: #5cbb89;
  border: 2rpx solid #5cbb89;
}
</style>
