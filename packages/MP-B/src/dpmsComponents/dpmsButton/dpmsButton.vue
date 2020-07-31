<template>
  <button
    @click="clickButton"
    :class="[type === 'primary' ? 'dpms-button-primary' : '']"
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
    type: String,
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
}
.dpms-button-primary {
  background: #5cbb89;
  border: none;
  color: #ffffff;
}
</style>
