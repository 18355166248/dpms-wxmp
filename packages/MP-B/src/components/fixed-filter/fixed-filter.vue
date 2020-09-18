<template>
  <view id="J_fixedFilter">
    <view :class="isFixedTop && isFixed ? 'fixed' : ''">
      <slot></slot>
    </view>

    <view
      v-if="isFixedTop && isFixed"
      :style="{ height: height + 'px' }"
    ></view>
  </view>
</template>
<script>
export default {
  name: 'fixedFilter',
  props: {
    scrollTop: {
      type: Number,
      default: 0,
    },
    isFixedTop: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      height: 0,
      top: 0,
    }
  },
  computed: {
    isFixed() {
      return this.scrollTop + this.top > this.top
    },
  },
  mounted() {
    const query = uni.createSelectorQuery().in(this)
    query
      .select('#J_fixedFilter')
      .boundingClientRect((data) => {
        this.height = data.height
        this.top = data.top
      })
      .exec()
  },
}
</script>
<style lang="scss" scoped>
.fixed {
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
}
</style>
