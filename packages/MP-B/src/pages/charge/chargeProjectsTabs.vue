<template>
  <view class="search-charge-wrap">
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
    <view class="main-container">
      <!--诊疗服务-->
      <chargeTab0 v-if="currentTab===0"></chargeTab0>
      <!--套餐项目-->
      <view v-if="currentTab===1"></view>
      <!--销售商品-->
      <view v-if="currentTab===2"></view>
    </view>

    <!--下一步-->
    <view class="bottom-wrap">
      <view class="btns">
        <chargeButton type="solid" :buttonStyle="buttonStyle" @click="nextStep"
        >下一步
        </chargeButton>
      </view>
    </view>
  </view>
</template>
<script>
import billAPI from '@/APIS/bill/bill.api'
import searchInput from './common/searchInput'
import chargeButton from './common/chargeButton'
import chargeTab0 from './common/chargeTab0'
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
      buttonStyle: { width: '686rpx' },
      classifyList:[]
    }
  },
  computed: {

  },
  onLoad() {

  },
  onShow() {

  },
  onHide() {},
  onUnload() {},
  methods: {
    changeTab(i){
      this.currentTab = this.tabList[i].val
    },
  },
  watch: {},
  components: { searchInput,chargeButton,chargeTab0 },
}
</script>
<style lang="scss" scoped>
.ellipsisChargeName {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.search-charge-wrap {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  .main-container{
    display: flex;
    flex-grow: 20;
  }
  .bottom-wrap {
    background: #fff;
    border-top: 1rpx solid #e5e5e5;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    .btns {
      padding: 16rpx 32rpx;
      display: flex;
      justify-content: space-between;
    }
  }

}
</style>
