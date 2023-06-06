<template>
  <!-- 库存搜索 -->
  <view class="container">
    <search
      type="inventory"
      storgeKey="inventory"
      detailPath="/pages/warehouse/inventory/inventoryDetail"
    />
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
