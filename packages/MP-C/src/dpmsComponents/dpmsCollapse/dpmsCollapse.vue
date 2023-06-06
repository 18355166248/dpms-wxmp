<template>
  <view class="dpms-collapse">
    <slot />
  </view>
</template>
<script>
export default {
  name: 'dpmsCollapse',
  props: {
    // 是否开启手风琴效果
    accordion: {
      type: [Boolean, String],
      default: false,
    },
  },
  data() {
    return {}
  },
  provide() {
    return {
      collapse: this,
    }
  },
  created() {
    this.childrens = []
  },
  methods: {
    onChange() {
      let activeItem = []
      this.childrens.forEach((vm, index) => {
        if (vm.isOpen) {
          activeItem.push(vm.nameSync)
        }
      })
      this.$emit('change', activeItem)
    },
  },
}
</script>
<style lang="scss" scoped>
.dpms-collapse {
  /* #ifndef APP-NVUE */
  width: 100%;
  display: flex;
  /* #endif */
  /* #ifdef APP-NVUE */
  flex: 1;
  /* #endif */
  flex-direction: column;
  background-color: $dpms-bg-color;
}
</style>
