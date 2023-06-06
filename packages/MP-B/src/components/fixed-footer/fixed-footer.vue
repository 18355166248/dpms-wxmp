<template>
  <view class="fixed-footer">
    <view
      class="fixed-footer__content"
      id="J_FixedFooter"
      :style="{
        backgroundColor: bgColor,
      }"
    >
      <slot></slot>
    </view>

    <view
      class="fixed-footer__placeholder"
      :style="{
        height: height + 'px',
      }"
    ></view>
  </view>
</template>
<script>
export default {
  name: 'fixedFooter',
  props: {
    bgColor: {
      type: String,
      default: '#fff',
    },
  },
  data() {
    return {
      height: 0,
    }
  },
  computed: {},
  mounted() {
    const query = uni.createSelectorQuery().in(this)
    query
      .select('#J_FixedFooter')
      .boundingClientRect((data) => {
        this.height = data.height
      })
      .exec()
  },
}
</script>
<style lang="scss" scoped>
.fixed-footer {
  &__content {
    width: 100%;
    position: fixed;
    left: 0;
    bottom: var(--window-bottom);
    z-index: 10;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
  &__placeholder {
    width: 100%;
  }
}
</style>
