<template>
  <!-- 物品搜索 -->
  <view class="container">
    <search
      :mode="mode"
      :scopeSupplyList="scopeSupplyList"
      type="good"
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
      scopeSupplyList: '',
    }
  },
  onLoad({ mode, isShow, scopeSupplyList }) {
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
