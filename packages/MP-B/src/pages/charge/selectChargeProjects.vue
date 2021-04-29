<template>
  <view class="search-charge-wrap">
    <!--搜索-->
    <view class="search-input">
      <view class="iconfont iconsearch"></view>
      <input
        v-model="value"
        type="text"
        :placeholder="'请输入项目名称或拼音快速搜索'"
        class="input"
        @focus="onfocus"
      />
    </view>
    <!--选择项目-->
    <view class="projects-wrap">
      <view class="list-wrap">
        <view
          class="classify"
          v-for="item in classifyList"
          :key="item.settingsChargeTypeId"
        >
          <view class="header" @click="toggleClassify(item)">
            <view>{{ item.settingsChargeTypeName }}</view>
            <view class="iconfont iconup1" v-if="item.open"></view>
            <view class="iconfont icondown1" v-else></view>
          </view>
          <view class="children" v-if="item.open">
            <view
              class="project"
              v-for="project in item.chargeItemList"
              :key="project.settingsChargeItemId"
            >
              <view>{{ project.settingsChargeItemName }}</view>
              <view class="checkBox">
                <dpmsCheckbox shape="square" v-model="project.checked">
                </dpmsCheckbox>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom-wrap">
      <chargeButton type="solid" :buttonStyle="buttonStyle" @click="nextStep"
        >下一步
      </chargeButton>
    </view>
    <u-toast ref="uToast" />
  </view>
</template>
<script>
import billAPI from '@/APIS/bill/bill.api'
import moment from 'moment'
import chargeButton from './common/chargeButton'
import { mapMutations, mapState } from 'vuex'

export default {
  name: '',
  data() {
    return {
      classifyList: [],
      buttonStyle: { width: '686rpx' },
    }
  },
  computed: {
    ...mapState('searchProjectStore', ['searchProjectList']),
    ...mapState('dispose', ['disposeList']),
  },
  onLoad() {
    this.getChargeTypes()
  },
  onShow() {
    this.mergeData()
  },
  onHide() {},
  onUnload() {},
  methods: {
    ...mapMutations('dispose', ['setDisposeList']),
    //合并数据
    mergeData() {
      const mergeList = [...this.searchProjectList, ...this.disposeList]
      if (this.classifyList.length > 0 && mergeList.length > 0) {
        mergeList.forEach((project) => {
          this.classifyList.forEach((item) => {
            if (item.settingsChargeTypeId === project.settingsChargeTypeId) {
              item.open = true
              item.chargeItemList.forEach((charge) => {
                if (
                  charge.settingsChargeItemId === project.settingsChargeItemId
                ) {
                  charge.checked = true
                }
              })
            }
          })
        })
      }
    },

    async getChargeTypes() {
      const { data } = await billAPI.getChargeTypes()
      if (data) {
        data.forEach((item) => {
          item.open = false
          if (item.chargeItemList && item.chargeItemList.length > 0) {
            item.chargeItemList.forEach((project) => {
              project.checked = false
            })
          }
        })
        this.classifyList = data || []
      }
    },
    //切换分类
    toggleClassify(item) {
      item.open = !item.open
    },
    projectChange(value, project, item) {
      console.log(value, project, item)
    },
    //搜索框聚焦
    onfocus() {
      uni.navigateTo({
        url: '/pages/charge/searchProjects',
      })
    },
    //下一步
    nextStep() {
      this.handleData()
      if (this.disposeList.length <= 0) {
        this.$refs.uToast.show({
          title: '请选择收费项目!',
          type: 'warning',
        })
        return
      }
      uni.navigateTo({
        url: '/pages/charge/chargeProjectsList',
      })
    },
    handleData() {
      let targetList = []
      let index = 0
      const defaultData = {
        salesList: [],
        deductSign: false,
        singleDiscountLimit: 0,
        itemNum: 1,
        itemType: 5,
        singleDiscount: 100,
      }
      this.classifyList.forEach((item) => {
        if (item.chargeItemList && item.chargeItemList.length > 0) {
          item.chargeItemList.forEach((project) => {
            if (project.checked) {
              index += 1
              let temp = {}
              temp.pageSerialNo = index
              temp.allBillDiscount = project.allBillDiscount
              temp.isSingleDiscount = project.isSingleDiscount
              temp.itemCode = project.settingsChargeItemCode
              temp.itemName = project.settingsChargeItemName
              temp.parentItemCode = item.settingsChargeTypeCode
              temp.totalAmount = project.unitAmount
              temp.singleDiscountAfterAmount = project.unitAmount
              temp.receivableAmount = project.unitAmount
              temp.unitAmount = project.unitAmount
              //todo 需要单位unit
              temp.unit = "盒"
              const data = { ...defaultData, ...temp }
              targetList.push(data)
            }
          })
        }
      })
      this.setDisposeList(targetList)
    },
  },
  watch: {},
  components: { chargeButton },
}
</script>
<style lang="scss" scoped>
.search-charge-wrap {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;

  .search-input {
    margin: 16rpx 32rpx;
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 8rpx;
    padding: 0 28rpx;

    .iconsearch {
      margin-right: 20rpx;
      color: #bfbfbf;
      width: 32rpx;
      height: 32rpx;
    }

    .input {
      width: 600rpx;
      height: 76rpx;
      font-size: 28rpx;
    }
  }

  .projects-wrap {
    font-size: 30rpx;
    line-height: 30rpx;
    flex-grow: 2;
    overflow-y: scroll;

    .list-wrap {
      padding: 0 0 0 32rpx;
      background: #fff;
    }

    .classify {
      &:last-child {
        border-bottom: none;
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 32rpx 0;
        border-bottom: 2rpx solid #f5f5f5;

        .iconfont {
          padding-right: 32rpx;
          color: #bfbfbf;
        }
      }
    }

    .project {
      display: flex;
      align-items: center;
      padding: 32rpx 0 32rpx 64rpx;
      justify-content: space-between;
      border-bottom: 2rpx solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .checkBox {
        padding-right: 32rpx;
      }
    }
  }

  .bottom-wrap {
    padding: 16rpx 32rpx;
    display: flex;
    justify-content: space-between;
    background: #fff;
    border-top: 1rpx solid #e5e5e5;
  }
}
</style>
