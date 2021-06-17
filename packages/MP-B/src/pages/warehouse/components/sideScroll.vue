<template>
  <view class="s-main">
    <view
      class="s-main-item"
      :class="{ activeColor: selectvalue == item[fieldKey] }"
      v-for="(item, index) in list"
      :key="index"
      @click="handleSelect(item)"
      >{{ item[fieldName] }}</view
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
    list: {
      type: Array,
      required: true,
      default: () => [],
    },
    fieldKey: {
      type: String,
      default: 'id',
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
      this.selectvalue = item[this.fieldKey]
      this.$emit('on-change', item)
    },
  },
}
</script>
<style lang="scss" scoped>
.s-main {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  overflow-y: scroll;
  font-size: 30rpx;
  &-item {
    width: 100%;
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
    font-size: 26rpx;
  }
  .activeColor {
    background-color: #ffffff;
    color: #5cbb89;
  }
}
</style>
