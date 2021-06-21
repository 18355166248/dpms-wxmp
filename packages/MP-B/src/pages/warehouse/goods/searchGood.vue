<template>
  <!-- 物品搜索 -->
  <view class="container">
    <search storgeKey="goods" detailPath="/pages/warehouse/goods/goodDetail" />
  </view>
</template>
<script>
import search from '../components/search.vue'
export default {
  components: { search },
}
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
