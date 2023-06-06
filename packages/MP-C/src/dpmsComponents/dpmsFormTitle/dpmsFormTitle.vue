<template>
  <div class="title">{{ title }}</div>
</template>

<script>
export default {
  name: 'dpmsFormTitle',
  props: { title: { type: String } },
}
</script>

<style scoped>
.title {
  width: 100%;
  height: 82rpx;
  line-height: 82rpx;
  background: rgba(0, 0, 0, 0.04);
  text-indent: 32rpx;
  font-size: 28rpx;
  font-weight: 400;
  text-align: left;
  color: rgba(0, 0, 0, 0.5);
}
</style>
