<template>
  <view class="purchase">
    <purchaseSearch mode="search" ref="search" />
  </view>
</template>
<script>
import purchaseSearch from './index.vue'
export default {
  components: { purchaseSearch },
  data() {
    return {}
  },
  onLoad({ date }) {
    // console.log('接受的日期参数是', date)
    // 通过props 传值方式, 无法使子组件接收到, 因为prop 执行在 onload函数之前,暂时采取此方法解决问题
    this.$refs.search.setDate(date)
  },
}
</script>
<style lang="scss" scoped>
.purchase {
  width: 100%;
  height: 100%;
}
</style>
