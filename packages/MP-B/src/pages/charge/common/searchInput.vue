<template>
  <!--搜索-->
  <view class="search-input">
    <view class="iconfont icon-search"></view>
    <input
      type="text"
      :placeholder="'请输入项目名称或拼音快速搜索'"
      placeholder-style="color:#bfbfbf"
      @input="searchProject($event.detail.value)"
      class="input"
      :disabled="disabled"
    />
  </view>
</template>
<script>
export default {
  name: '',
  data() {
    return {}
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
  onLoad() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  methods: {
    searchProject(searchVal) {
      this.$emit('onSearch', searchVal)
    },
  },
  watch: {},
  components: {},
}
</script>
<style lang="scss" scoped>
.search-input {
  margin: 16rpx 32rpx;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 8rpx;
  padding: 0 28rpx;

  .icon-search {
    margin-right: 20rpx;
    color: #bfbfbf;
    width: 32rpx;
    height: 32rpx;
  }

  .input {
    width: 600rpx;
    height: 76rpx;
    font-size: 28rpx;
  }
}
</style>
