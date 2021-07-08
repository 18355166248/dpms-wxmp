<template>
  <!-- 物品列表 -->
  <view class="container">
    <goodList
      :mode="mode"
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
  data() {
    return {
      mode: '',
    }
  },
  onLoad({ mode }) {
    console.log('物品列表获取的参数是', mode)
    this.mode = mode
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
