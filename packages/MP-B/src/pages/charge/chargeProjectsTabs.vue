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
    <searchInput
      v-if="currentTab === 0 || currentTab === 2"
      :disabled="disabled"
      @click.native="search"
    ></searchInput>
    <view class="main-container">
      <!--诊疗服务-->
      <view v-show="currentTab === 0">
        <chargeTab0></chargeTab0>
      </view>
      <!--套餐项目-->
      <view v-show="currentTab === 1">
        <chargeTab1></chargeTab1>
      </view>
      <!--销售商品-->
      <view v-show="currentTab === 2">
        <chargeTab2></chargeTab2>
      </view>
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
import chargeTab1 from './common/chargeTab1'
import chargeTab2 from './common/chargeTab2'
export default {
  name: '',
  data() {
    return {
      currentTab: 2,
      tabList: [
        { name: '诊疗服务', val: 0 },
        { name: '套餐项目', val: 1 },
        { name: '销售商品', val: 2 },
      ],
      buttonStyle: { width: '686rpx' },
      classifyList: [],
      disabled: true,
    }
  },
  computed: {},
  onLoad() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  methods: {
    changeTab(i) {
      this.currentTab = this.tabList[i].val
    },
    //下一步
    nextStep() {},
    search() {
      console.log('search')
      if (this.currentTab === 0) {
        uni.navigateTo({
          url: `/pages/charge/searchChargeItem`,
        })
      } else {
        uni.navigateTo({
          url: `/pages/charge/searchMerchandise`,
        })
      }
    },
  },
  watch: {},
  components: { searchInput, chargeButton, chargeTab0, chargeTab1, chargeTab2 },
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
  .main-container {
    display: flex;
    flex-grow: 20;
    overflow-y: scroll;
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
