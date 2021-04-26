<template>
  <view class="flex flex-v-center charge-type">
    <view
      class="iconfont"
      :class="[iconData.iconClass]"
      :style="{ color: iconData.color }"
    ></view>
    <view>{{ iconData.typeName }}</view>
  </view>
</template>
<script>
export default {
  name: '',
  data() {
    return {}
  },
  props: {
    iconData: {
      type: Object,
      default: function () {
        return {}
      },
    },
    iconClass: {
      type: String,
      default: '',
    },
    typeName: {
      type: String,
      default: '',
    },
  },
  computed: {},
  onLoad() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  methods: {},
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
.charge-type {
  padding-bottom: 16rpx;
  padding-left: 28rpx;
  width: 100%;
}
.iconfont {
  width: 28 rpx;
  height: 28 rpx;
  margin-right: 20rpx;
}
</style>
