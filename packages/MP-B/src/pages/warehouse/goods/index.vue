<template>
  <!-- 物品列表 -->
  <view class="container">
    <goodList
      :mode="mode"
      :scopeSupplyList="scopeSupplyList"
      type="good"
      :isShow="isShow"
      searchPath="/pages/warehouse/goods/searchGood"
      detailPath="/pages/warehouse/goods/goodDetail"
    />
  </view>
</template>
<script>
import goodList from '../components/good-list.vue'
export default {
  components: { goodList },
  data() {
    return {
      mode: '',
      scopeSupplyList: '',
      isShow: 2,
    }
  },
  onLoad({ mode, scopeSupplyList, isShow }) {
    this.mode = mode
    this.isShow = isShow
    this.scopeSupplyList = scopeSupplyList
      .split('')
      .toString()
      .replaceAll(',', ';')
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
