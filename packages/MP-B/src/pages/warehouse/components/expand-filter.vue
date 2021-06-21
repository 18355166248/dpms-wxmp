<template>
  <view class="expand">
    <view class="expand-item" v-for="item in list" :key="item[fieldKey]">
      <view class="expand-item-head" @click="handleExpand(item[fieldKey])">
        <text>{{ item[fieldName] }}</text>
        <text
          v-if="currentParentId == item[fieldKey]"
          class="iconfont icondown1"
        ></text>
        <text v-else class="iconfont icon-arrow-right"></text>
      </view>
      <!-- v-if="currentParentId == item[fieldKey] || currentParentId == index" -->
      <template v-if="currentParentId == item[fieldKey]">
        <view
          class="expand-item-content"
          v-for="e in item.children"
          :key="e[fieldKey]"
        >
          <text
            :class="{ activeColor: currentId == e[fieldKey] }"
            class="expand-item-content-tag"
            @click="selectTag(e[fieldKey])"
            >{{ e[fieldName] }}</text
          >
        </view>
      </template>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    parentId: {
      type: String || Number,
      default: null,
    },
    list: {
      type: Array,
      default: () => [],
    },
    value: {
      type: String || Number,
      default: null,
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
      currentParentId: this.parentId,
      currentId: this.value,
    }
  },
  watch: {
    value() {
      this.currentId = this.value
    },
    parentId() {
      this.currentParentId = this.parentId
    },
    list() {
      // 默认获取第一个二级分类的id
      this.currentParentId = this.list[0][this.fieldKey]
    },
  },
  methods: {
    handleExpand(id) {
      this.currentParentId = id === this.currentParentId ? null : id
    },
    selectTag(id) {
      this.currentId = id
      this.$emit('on-change', id)
    },
  },
}
</script>
<style lang="scss" scoped>
.expand {
  width: 100%;
  &-item {
    width: 100%;
    &-head {
      width: 100%;
      box-sizing: border-box;
      height: 112rpx;
      line-height: 112rpx;
      border-bottom: 1rpx solid #e5e5e5;
      font-size: 30rpx;
      color: #191919;
      display: inline-flex;
      justify-content: space-between;
      padding-right: 58rpx;
    }
    &-content {
      padding-top: 20rpx;
      display: inline-flex;
      &-tag {
        display: inline-block;
        margin-right: 16rpx;
        padding: 8rpx 16rpx;
        background: rgba(0, 0, 0, 0.06);
        border-radius: 8rpx;
        font-size: 24rpx;
        color: #595959;
      }
      .activeColor {
        color: #ffffff;
        background-color: $common-color;
      }
    }
  }
  .icondown1 {
    font-size: 40rpx;
  }
}
</style>
