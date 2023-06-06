<template>
  <view class="s-main">
    <view
      class="s-main-item"
      :class="{
        activeColor: selectvalue == item[fieldKey],
        special: selectvalue == item[fieldKey],
      }"
      v-for="(item, index) in list"
      :key="index"
      @click="handleSelect(item)"
    >
      <view>{{ item[fieldName] }}</view>
    </view>
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
  ::-webkit-scrollbar {
    display: none;
  }
  &-item {
    width: 100%;
    box-sizing: border-box;
    padding: 0 16rpx;
    height: 104rpx;
    line-height: 104rpx;
    font-size: 26rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;
    display: flex;
    align-items: center;
    > view {
      line-height: 40rpx;
      overflow: hidden;
      max-height: 80rpx;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }
  }
  .special {
    position: relative;
  }
  .special::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 6rpx;
    height: 40rpx;
    border-radius: 4rpx;
    background-color: #5cbb89;
    transform: translateY(-50%);
  }
  .activeColor {
    background-color: #ffffff;
    color: #5cbb89;
  }
}
</style>
