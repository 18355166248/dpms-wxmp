<template>
  <view class="tabs">
    <view class="tabs-main">
      <scroll-view scroll-x="true" class="scroll-area">
        <view class="scroll-area-list">
          <text
            class="tabs-main-item"
            :class="{ activeColor: selectvalue == item[fieldKey] }"
            v-for="(item, index) in list"
            :key="index"
            @click="handleSelect(item)"
            >{{ item[fieldName] }}</text
          >
        </view>
      </scroll-view>
    </view>
    <view class="tabs-icon"
      ><text @click="handleClickIcon" class="iconfont icon-filter"></text
    ></view>
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
  watch: {
    value() {
      this.selectvalue = this.value
    },
  },
  created() {},
  methods: {
    handleSelect(item) {
      this.selectvalue = item[this.fieldKey]
      this.$emit('on-change', item)
    },
    handleClickIcon() {
      this.$emit('on-open')
    },
  },
}
</script>
<style lang="scss" scoped>
.tabs {
  width: 100%;
  height: 80rpx;
  display: flex;
  overflow: hidden;
  border-bottom: 1rpx solid #e5e5e5;
  &-main {
    flex: 1;
    overflow: hidden;
    .scroll-area {
      width: 100%;
      height: 100%;
      white-space: nowrap;
      &-list {
        width: 100%;
        height: 100%;
        display: inline-flex;
        align-items: center;
        // white-space: nowrap;
      }
      .tabs-main-item {
        display: inline-block;
        padding: 0 16rpx;
        height: 48rpx;
        line-height: 48rpx;
        font-size: 24rpx;
        color: #595959;
        background: rgba(0, 0, 0, 0.06);
        border-radius: 8rpx;
        margin-right: 16rpx;
      }
      .activeColor {
        background-color: #5cbb89;
        color: #ffffff;
      }
    }
  }
  &-icon {
    flex-shrink: 0;
    width: 64rpx;
    height: 80rpx;
    text-align: center;
    line-height: 80rpx;
    .icon-filter {
      color: $common-color;
    }
  }
}
</style>
