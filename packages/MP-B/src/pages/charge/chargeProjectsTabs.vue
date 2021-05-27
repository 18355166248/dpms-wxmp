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
      <view v-show="currentTab === 0" class="tab-container">
        <chargeTab0 ref="chargeTab0Ref" class="tab-Component"></chargeTab0>
      </view>
      <!--套餐项目-->
      <view v-show="currentTab === 1" class="tab-container">
        <chargeTab1 ref="chargeTab1Ref" class="tab-Component"></chargeTab1>
      </view>
      <!--销售商品-->
      <view v-show="currentTab === 2" class="tab-container">
        <chargeTab2 ref="chargeTab2Ref" class="tab-Component"></chargeTab2>
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
    <u-toast ref="uToast" />
  </view>
</template>
<script>
import billAPI from '@/APIS/bill/bill.api'
import searchInput from './common/searchInput'
import chargeButton from './common/chargeButton'
import chargeTab0 from './common/chargeTab0'
import chargeTab1 from './common/chargeTab1'
import chargeTab2 from './common/chargeTab2'
import { mapMutations, mapState } from 'vuex'
import { BigCalculate, changeTwoDecimal, numberUtils } from '@/utils/utils'
export default {
  name: '',
  data() {
    return {
      currentTab: 0,
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
  computed: {
    ...mapState('dispose', ['disposeList']),
    ...mapState('checkstand', ['billType', 'itemType']),
  },
  onLoad() {},
  onShow() {},
  methods: {
    ...mapMutations('dispose', [
      'setDisposeList',
      'setSelectedDisposeList',
      'setReceivableAmount',
    ]),
    changeTab(i) {
      this.currentTab = this.tabList[i].val
    },
    //下一步
    nextStep() {
      const list0 = this.$refs.chargeTab0Ref.getDisposeList()
      const list1 = this.$refs.chargeTab1Ref.filterPackageChargeItemList()
      const list2 = this.$refs.chargeTab2Ref.filterMerchandiseList()||[]
      let mergeList = [...list0, ...list1, ...list2]
      if (mergeList.length <= 0) {
        this.$refs.uToast.show({
          title: '请选择收费项目!',
          type: 'warning',
        })
        return false
      }
      this.handleData(mergeList)
      uni.navigateTo({
        url: '/pages/charge/chargeProjectsList',
      })
    },
    //整合和处理相关的数据给到下个页面
    handleData(list) {
      console.log(this.billType)
      let targetList = []
      let index = 0
      list.forEach((project) => {
        index += 1
        let filterData = {}
        filterData.pageSerialNo = index
        filterData.itemType = project.itemType
        filterData.itemNum = project.itemNum || 1
        filterData.salesList = project.salesList || []
        filterData.deductSign = project.isDiscountPlan
        filterData.allBillDiscount = project.allBillDiscount
        filterData.isSingleDiscount = project.isSingleDiscount
        filterData.singleDiscountLimit = project.singleDiscountLimit
        filterData.itemName =
          project.settingsChargeItemName || project.commonName
        filterData.itemCode =
          project.itemCode ||
          project.settingsChargeItemCode ||
          project.merchandiseNo
        filterData.parentItemCode =
          project.parentItemCode || project.settingsChargeTypeId || 0
        filterData.unitAmount = project.unitAmount || project.retailAmount
        const amount = changeTwoDecimal(filterData.unitAmount)
        filterData.totalAmount = amount
        filterData.singleDiscountAfterAmount = amount
        filterData.receivableAmount = amount
        filterData.unit = project.unit || project.inventoryUnitStr || ''
        targetList.push(filterData)
        console.log(filterData)
      })
      this.setSelectedDisposeList(targetList)
      this.setDisposeList(targetList)
      this.setReceivableAmount(0)
    },
    search() {
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
    overflow-y: auto;
    width: 100%;
    .tab-container {
      height: 100%;
      width: 100%;
      .tab-Component {
        display: flex;
        flex-grow: 2;
        height: 100%;
        width: 100%;
      }
    }
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
