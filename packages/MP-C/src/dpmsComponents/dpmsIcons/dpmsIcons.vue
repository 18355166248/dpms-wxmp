<template>
  <span
    :class="['iconfont', type]"
    :style="{ fontSize: size + 'rpx', color: color }"
  ></span>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#000',
    },
    type: {
      type: String,
      required: true,
    },
    size: {
      type: [String, Number],
      default: 32,
    },
  },
}
</script>

<style></style>
