<template>
  <!-- 库存搜索 -->
  <view>
    <search storgeKey="inventory" path="warehouse/inventory/inventoryDetail" />
  </view>
</template>
<script>
import search from '../components/search.vue'
export default {
  components: { search },
}
</script>
