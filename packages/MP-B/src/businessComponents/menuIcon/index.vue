<template>
  <view :style="[mergeMenuStyle]" class="menu-icon">
    <dpmsIcons :color="iconColor" :type="icon" :size="fontSize" />
    <view class="close-wrap" v-if="showCloseIcon" @touchstart.stop="close">
      <dpmsIcons color="#e64040" type="icon-close" size="42" />
    </view>
  </view>
</template>
<script>
export default {
  name: '',
  data() {
    return {}
  },
  props: {
    icon: {
      type: String,
      default: '',
    },
    fontSize: {
      type: Number,
      default: 60,
    },
    iconColor: {
      type: String,
      default: '#fff',
    },
    menuStyle: {
      type: Object,
      default: function () {
        return {}
      },
    },
    showCloseIcon: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    mergeMenuStyle() {
      const defaultStyle = {
        width: '112rpx',
        height: '112rpx',
        borderRadius: '40rpx',
      }
      return Object.assign(defaultStyle, this.menuStyle)
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
  watch: {
    watchData: {
      handler(newVal, oldVal) {},
      deep: true,
      immediate: true,
    },
  },
  components: {},
}
</script>
<style lang="scss" scoped>
.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.close-wrap {
  position: absolute;
  right: -16rpx;
  top: -16rpx;
  width: 48rpx;
  height: 48rpx;
  opacity: 1;
  background: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
