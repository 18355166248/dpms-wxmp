<template>
  <button @click="clickButton">
    保存
  </button>
</template>
<script>
export default {
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
  background: #5cbb89;
  border-radius: 8rpx;
  font-size: 36rpx;
  font-weight: 400;
  text-align: center;
  color: #ffffff;
}
</style>
