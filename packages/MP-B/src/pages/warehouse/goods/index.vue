<template>
  <!-- 物品列表 -->
  <view class="container">
    <goodList
      type="good"
      searchPath="/pages/warehouse/goods/searchGood"
      detailPath="/pages/warehouse/goods/goodDetail"
    />
  </view>
</template>
<script>
import goodList from '../components/good-list.vue'
export default {
  components: { goodList },
}
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
