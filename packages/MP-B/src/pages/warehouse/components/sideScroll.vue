<template>
  <view class="s-main">
    <view
      class="s-main-item"
      :style="{ background: selectvalue == item.id ? activeColor : 'none' }"
      v-for="(item, index) in data"
      :key="index"
      @click="handleSelect(item)"
      >{{ item.name }}</view
    >
  </view>
</template>
<script>
export default {
  props: {
    value: {
      type: String || Number,
      default: null,
    },
    // 列表数据源
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
    // 激活颜色
    activeColor: {
      type: String,
      default: 'red',
    },
    fieldKey: {
      type: String,
      default: 'key',
    },
    fieldName: {
      type: String,
      default: 'name',
    },
  },
  data() {
    return {
      selectvalue: this.value,
    }
  },
  methods: {
    handleSelect(item) {
      this.selectvalue = item.id
      this.$emit('on-chang', item)
    },
  },
}
</script>
<style lang="scss" scoped>
.s-main {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  &-item {
    width: 100%;
    height: 160rpx;
    text-align: center;
    line-height: 160rpx;
    font-size: 26rpx;
  }
}
</style>
