<template>
  <view
    class="column"
    :style="{
      width: utils.addUnit(width),
    }"
  >
  </view>
</template>
<script module="utils" lang="wxs" src="./utils.wxs"></script>
<script>
const defaultProps = {
  width: {
    type: [String, Number],
    default: '',
  },
}
export default {
  props: defaultProps,
  data() {
    return {}
  },
  components: {},
}
</script>

<style lang="scss" scoped>
.column {
  position: relative;
  height: 100%;
  box-sizing: border-box;

  &::before {
    position: absolute;
    content: '';
    right: 0;
    top: 0;
    bottom: 0;
    border-right: 1px solid #e5e5e5;
    transform: scaleX(0.5);
  }
}
</style>
