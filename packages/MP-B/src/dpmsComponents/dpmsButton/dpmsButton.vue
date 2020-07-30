<template>
  <button @click="clickButton">
    {{ text }}
  </button>
</template>
<script>
export default {
  name: 'dpmsButton',
  props: { text: { type: String } },
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
