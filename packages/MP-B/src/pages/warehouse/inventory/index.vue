<template>
  <!-- 库存列表 -->
  <view class="container">
    <goodList
      type="inventory"
      searchPath="/pages/warehouse/inventory/inventorySearch"
      detailPath="/pages/warehouse/inventory/inventoryDetail"
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
