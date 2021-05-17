<template>
  <view class="search-charge-wrap">
    <!--搜索-->
    <view class="search-input" @click="search">
      <view class="iconfont icon-search"></view>
      <input
        type="text"
        :placeholder="'请输入项目名称或拼音快速搜索'"
        placeholder-style="color:#bfbfbf"
        class="input"
        disabled
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
            <view class="ellipsisChargeName">{{
              item.settingsChargeTypeName
            }}</view>
            <view class="icon-wrap">
              <view class="iconfont iconup1" v-if="item.open"></view>
              <view class="iconfont icondown1" v-else></view>
            </view>
          </view>
          <view class="children" v-if="item.open">
            <!--一级和二级分类-->
            <view
              class="project"
              v-for="project in item.children"
              :key="project.settingsChargeTypeId"
            >
              <view class="ellipsisChargeName">{{
                project.settingsChargeTypeName
              }}</view>
              <view class="checkBox">
                <dpmsCheckbox
                  shape="square"
                  v-model="project.checked"
                  @change="handleData"
                >
                </dpmsCheckbox>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
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
    ...mapState('checkstand', ['chargeType', 'itemType']),
  },
  onLoad() {
    this.getChargeTypes()
  },
  onShow() {
    const mergeList = [...this.searchProjectList, ...this.disposeList]
    if (this.classifyList.length > 0) {
      this.chargeTypesMerge(mergeList)
    }
  },
  onHide() {},
  onUnload() {},
  methods: {
    ...mapMutations('dispose', ['setDisposeList', 'setReceivableAmount']),
    //获取一级和二级分类
    getChargeTypes() {
      billAPI
        .getChargeTypes()
        .then((res) => {
          if (res?.data.length > 0) {
            this.handleClassifyList(res.data, 'children')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //处理列表数据
    handleClassifyList(list, key) {
      list.forEach((item) => {
        item.open = false
        if (item[key].length > 0) {
          item[key].forEach((project) => {
            project.checked = false
          })
        }
      })
      this.classifyList = list
    },
    //合并数据 从搜索页面回来 或者从收费项目清单页面回来
    chargeTypesMerge(mergeList) {
      this.classifyList.forEach((item) => {
        if (this.checkParentTypeId(item.settingsChargeTypeId, mergeList)) {
          item.open = true
          item.children.forEach((charge) => {
            charge.checked = !!this.checkTypeId(
              charge.settingsChargeTypeId,
              mergeList,
            )
          })
        } else {
          item.open = false
          item.children.forEach((item) => {
            item.checked = false
          })
        }
      })
    },
    //判断一级分类是否被选中
    checkParentTypeId(id, list) {
      for (let i = 0; i < list.length; i++) {
        const parentId =
          list[i].settingsChargeTypeParentId || list[i].parentChargeTypeId
        if (parentId === id) {
          return true
        }
      }
    },
    //判断一级分类的id
    checkTypeId(id, list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].settingsChargeTypeId === id) {
          return true
        }
      }
    },
    //切换分类
    toggleClassify(item) {
      item.open = !item.open
    },
    //搜索框聚焦
    search() {
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
        return false
      }
      uni.navigateTo({
        url: '/pages/charge/chargeProjectsList',
      })
    },
    //处理数据给收费项目清单页面
    handleData() {
      let targetList = []
      let index = 0
      const defaultData = {
        salesList: [],
        deductSign: false,
        singleDiscountLimit: 0,
        itemNum: 1,
        itemType: this.itemType,
        singleDiscount: 100,
      }
      this.classifyList.forEach((item) => {
        let list = item.children || item.chargeItemList
        if (list && list.length > 0) {
          list.forEach((project) => {
            if (project.checked) {
              index += 1
              project.pageSerialNo = index
              project.allBillDiscount =true
              project.isSingleDiscount =false
              project.itemCode =project.settingsChargeTypeCode
              project.itemName =project.settingsChargeTypeName
              project.parentItemCode =item.settingsChargeTypeParentId
              project.totalAmount = 0
              project.singleDiscountAfterAmount = 0
              project.receivableAmount = 0
              project.unitAmount = 0
              const data = { ...defaultData, ...project }
              targetList.push(data)
            }
          })
        }
      })
      this.setDisposeList(targetList)
      this.setReceivableAmount(0)
    },
  },
  watch: {},
  components: { chargeButton },
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
.placeholder{
  color: red;
}

.search-charge-wrap {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  box-sizing: border-box;

  .search-input {
    margin: 16rpx 32rpx;
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 8rpx;
    padding: 0 28rpx;

    .icon-search {
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
    line-height: 30rpx;
    font-size: 30rpx;
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
        .icon-wrap{
          width:48rpx;
          height: 48rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 20rpx;
          .iconfont {
            color: #bfbfbf;
            width: 32rpx;
            height: 32rpx;
          }
        }

      }
    }

    .project {
      display: flex;
      align-items: center;
      padding: 32rpx 0;
      margin-left: 32rpx;
      justify-content: space-between;
      border-bottom: 2rpx solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .checkBox {
        margin-right: 28rpx;
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
