<template>
  <!-- 物品搜索 -->
  <view class="container">
    <search
      :mode="mode"
      :scopeSupplyList="scopeSupplyList"
      :type="type"
      :isShow="isShow"
      storgeKey="goods"
      detailPath="/pages/warehouse/goods/goodDetail"
    />
  </view>
</template>
<script>
import search from '../components/search.vue'
export default {
  components: { search },
  data() {
    return {
      mode: '',
      isShow: 1,
      type: 'good',
      scopeSupplyList: '',
    }
  },
  onLoad({ mode, isShow, scopeSupplyList, type }) {
    this.mode = mode
    this.isShow = isShow
    this.type = type || 'good'
    this.scopeSupplyList = scopeSupplyList
  },
}
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
