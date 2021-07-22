<template>
  <!-- 物品列表 -->
  <view class="container">
    <goodList
      :mode="mode"
      :scopeSupplyList="scopeSupplyList"
      :type="type"
      :isShow="isShow"
      searchPath="/pages/warehouse/goods/searchGood"
      detailPath="/pages/warehouse/goods/goodDetail"
    />
  </view>
</template>
<script>
import goodList from '../components/good-list.vue'
import { mapMutations } from 'vuex'
export default {
  components: { goodList },
  data() {
    return {
      mode: '',
      scopeSupplyList: '',
      isShow: 2,
      type: 'good',
    }
  },
  onUnload() {
    this.setApplyGoods([])
  },
  onLoad({ mode, scopeSupplyList, isShow, type }) {
    this.mode = mode
    this.isShow = isShow
    this.type = type || 'good'
    this.scopeSupplyList = scopeSupplyList
      .split('')
      .toString()
      .replaceAll(',', ';')
  },
  methods: {
    ...mapMutations('warehouse', ['setGoodList', 'setApplyGoods']),
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
