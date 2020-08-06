<template>
  <view class="fixed-footer">
    <view
      class="fixed-footer__content"
      id="J_FixedFooter"
      :style="{
        backgroundColor: bgColor,
        paddingBottom: homeIndicatorHeight + 'px',
      }"
    >
      <slot></slot>
    </view>

    <view
      class="fixed-footer__placeholder"
      :style="{
        height: height + 'px',
        backgroundColor: bgColor,
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
      homeIndicatorHeight:
        this.$systemInfo.safeArea.bottom - this.$systemInfo.safeArea.height,
    }
  },
  computed: {},
  mounted() {
    const query = uni.createSelectorQuery().in(this)
    query
      .select('#J_FixedFooter')
      .boundingClientRect((data) => {
        console.log('data.height:', data.height)
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
  }
  &__placeholder {
    width: 100%;
  }
}
</style>
