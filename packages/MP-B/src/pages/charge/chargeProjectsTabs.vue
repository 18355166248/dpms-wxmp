<template>
  <view class="search-charge-wrap">
    <view>
      <!--tab选项-->
      <tabs
        :value="currentTab"
        :scroll="false"
        :tabs="tabList"
        field="name"
        height="96rpx"
        lineHeight="4rpx"
        activeColor="#5CBB89"
        lineColor="#5CBB89"
        lineScale="0.2"
        @change="changeTab"
      />
      <!--搜索-->
      <searchInput></searchInput>
      <!--tab内容-->
      <view class="main-container">

      </view>
    </view>
  </view>
</template>
<script>
import billAPI from '@/APIS/bill/bill.api'
import searchInput from './common/searchInput'
import { mapMutations, mapState } from 'vuex'

export default {
  name: '',
  data() {
    return {
      currentTab:0,
      tabList: [
        { name: '诊疗服务', val: 0 },
        { name: '套餐项目', val: 1 },
        { name: '销售商品', val: 2 },
      ],
    }
  },
  computed: {
    ...mapState('searchProjectStore', ['searchProjectList']),
    ...mapState('dispose', ['disposeList']),
    ...mapState('checkstand', ['chargeType', 'itemType']),
  },
  onLoad() {

  },
  onShow() {

  },
  onHide() {},
  onUnload() {},
  methods: {
    ...mapMutations('dispose', ['setDisposeList', 'setReceivableAmount']),
    changeTab(i){
      this.currentTab = this.tabList[i].val
    }
  },
  watch: {},
  components: { searchInput },
}
</script>
<style lang="scss" scoped>
.ellipsisChargeName {
  max-width: 560rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.search-charge-wrap {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  //padding-bottom: constant(safe-area-inset-bottom);
  //padding-bottom: env(safe-area-inset-bottom);

}
</style>
