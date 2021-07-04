<template>
  <view class="receive">
    <receiveSearch mode="search" />
  </view>
</template>
<script>
import receiveSearch from './index.vue'
export default {
  components: { receiveSearch },
  data() {
    return {}
  },
}
</script>
<style lang="scss" scoped>
.receive {
  width: 100%;
  height: 100%;
}
</style>
