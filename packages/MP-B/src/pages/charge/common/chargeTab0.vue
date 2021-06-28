<template>
  <!--诊疗服务-->
  <view class="container-wrap" :key="randomKey">
    <view v-if="classifyList.length > 0" class="srcoll-wrap">
      <!--一级类目列表-->
      <view class="left-scroll">
        <scroll-view
          scroll-y="true"
          class="scroll-Y"
          :style="{ height: scrollHeight }"
          :scroll-with-animation="true"
          @scroll="onLeftListScroll"
        >
          <view
            class="scroll-view-item"
            v-for="(type, index) in classifyList"
            :key="type.settingsChargeTypeId"
            :class="{ active: currentTypeId === type.settingsChargeTypeId }"
            @click="getChargeItemData(type, index)"
          >
            <view
              class="name"
              :style="{
                borderBottom:
                  currentTypeId === type.settingsChargeTypeId ||
                  index === classifyList.length - 1
                    ? 'none'
                    : '1rpx solid rgba(0,0,0,0.15)',
              }"
            >
              <view class="ellipsisChargeName">{{
                type.settingsChargeTypeName
              }}</view>
            </view>
          </view>
        </scroll-view>
      </view>
      <!--二级类目列表-->
      <view class="right-scroll">
        <scroll-view
          scroll-y="true"
          class="scroll-Y"
          :style="{ height: scrollHeight }"
          :scroll-with-animation="true"
        >
          <view class="scroll-view-item">
            <!--一级类目-->
            <view class="chargeType">
              <view class="ellipsisChargeName">{{ currentTypeName }}</view>
            </view>
            <!--二级类目-->
            <view
              class="chargeItem"
              v-for="item in chargeItemList"
              :key="item.settingsChargeItemId"
            >
              <view class="left-item">
                <view class="ellipsisChargeName name">{{
                  item.settingsChargeItemName
                }}</view>
                <view class="price">{{
                  item.unitAmount | thousandFormatter(2, '￥')
                }}</view>
              </view>
              <view class="check-box">
                <dpmsCheckbox
                  shape="square"
                  :value="item.checked"
                  @change="onCheckBoxChange($event, item)"
                >
                </dpmsCheckbox>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <view v-else>
      <empty :disabled="true" text="暂无数据"></empty>
    </view>
  </view>
</template>
<script>
import billAPI from '@/APIS/bill/bill.api'
import { mapMutations, mapState } from 'vuex'
export default {
  name: '',
  data() {
    return {
      scrollHeight: 0,
      currentIndex: 0,
      currentTypeId: '',
      currentTypeName: '洁牙项目',
      //分类列表
      classifyList: [],
      //滚动的锚点id
      scrollTypeId: '',
      //源数据
      originDataList: [],
      pageSize: 12,
      currentPage: 1,
      randomKey: Math.random(),
      chargeItemList: [],
    }
  },
  computed: {
    ...mapState('searchProjectStore', ['searchChargeList']),
    ...mapState('dispose', ['disposeList']),
    currentListLength() {
      return this.currentPage * this.pageSize
    },
  },
  created() {},
  mounted() {
    this.getChargeItems()
    this.getScrollHeight()
  },
  methods: {
    ...mapMutations('dispose', ['setDisposeList']),
    getScrollHeight() {
      uni.getSystemInfo({
        success: () => {
          let info = uni.createSelectorQuery().select('.main-container')
          info
            .boundingClientRect((data) => {
              this.scrollHeight = data.height + 'px'
            })
            .exec()
        },
      })
    },
    //获取二级和三级分类
    getChargeItems() {
      billAPI
        .getChargeItems()
        .then((res) => {
          if (res?.data.length > 0) {
            this.originDataList = res.data
            this.classifyList = this.handleClassifyList(
              res.data.slice(0, this.pageSize),
            )
            this.getChargeItemData(this.classifyList[0], this.currentIndex)
          }
        })
        .catch(() => {})
    },
    onLeftListScroll() {
      if (this.currentListLength >= this.originDataList.length) {
        return
      }
      const addList = this.handleClassifyList(
        this.originDataList.slice(
          this.currentListLength,
          this.currentListLength + this.pageSize,
        ),
      )
      this.classifyList = this.classifyList.concat(addList)
      this.currentPage += 1
    },
    getChargeItemData(item, index) {
      this.randomKey = Math.random()
      this.currentIndex = index
      this.currentTypeId = item?.settingsChargeTypeId
      this.currentTypeName = item?.settingsChargeTypeName

      this.$nextTick(() => {
        this.chargeItemList = item.chargeItemList
        this.$forceUpdate()
      })
    },
    //处理列表数据
    handleClassifyList(list, key = 'chargeItemList') {
      return list.map((item) => {
        if (item[key] && item[key].length > 0) {
          item[key].forEach((project) => {
            project.checked = false
          })
        }
        return item
      })
    },
    //选中和取消
    onCheckBoxChange(value, item) {
      item.checked = value
    },
    //合并数据
    mergeChargeList() {
      let maxIndex = 0
      if (this.searchChargeList.length > 0) {
        this.originDataList.forEach((type, index) => {
          this.searchChargeList.forEach((item) => {
            if (type.settingsChargeTypeId === item.settingsChargeTypeId) {
              if (index >= maxIndex) {
                maxIndex = index
              }
            }
          })
        })
      }
      let newPage = 1
      if (maxIndex > this.currentListLength - 1) {
        newPage = Math.floor(maxIndex / this.pageSize) + 1
      }
      const endIndex =
        this.currentListLength + (newPage - this.currentPage) * this.pageSize
      const addList = this.handleClassifyList(
        this.originDataList.slice(this.currentListLength, endIndex),
      )
      this.classifyList = this.classifyList.concat(addList)

      this.classifyList.forEach((item) => {
        item?.chargeItemList?.length > 0 &&
          item.chargeItemList.forEach((charge) => {
            if (this.checkChargeSelected(this.searchChargeList, charge)) {
              charge.checked = true
            }
          })
      })
    },
    //判断是否选中
    checkChargeSelected(list, charge) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].settingsChargeItemId === charge.settingsChargeItemId) {
          return true
        }
      }
    },
    //获取处置列表
    getDisposeList() {
      const disposeList = []
      this.classifyList.forEach((item) => {
        item?.chargeItemList?.length > 0 &&
          item.chargeItemList.forEach((charge) => {
            if (charge.checked) {
              charge.itemType = 5
              disposeList.push(charge)
            }
          })
      })
      return disposeList
    },
  },
  watch: {
    searchChargeList() {
      this.mergeChargeList()
    },
  },
  components: {},
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
.container-wrap {
  display: flex;
  flex-grow: 2;
  width: 750rpx;
  flex-flow: column;
  .srcoll-wrap {
    height: 100%;
    display: flex;
    flex-grow: 2;
  }
  .left-scroll {
    display: flex;
    width: 250rpx;
    height: 100%;
    color: #4c4c4c;
    .scroll-Y {
      .scroll-view-item {
        height: 112rpx;
        font-size: 28rpx;
        .name {
          margin: 0 32rpx;
          height: 112rpx;
          display: flex;
          align-items: center;
          border-bottom: 1rpx solid rgba(0, 0, 0, 0.15);
        }
      }
      .active {
        background: #fff;
        position: relative;
        &::after {
          position: absolute;
          content: '';
          left: 0;
          top: 0;
          width: 8rpx;
          height: 100%;
          background: #5cbb89;
        }
      }
    }
  }
  .right-scroll {
    display: flex;
    flex-grow: 2;
    height: 100%;
    background: #fff;
    width: 500rpx;
    .scroll-Y {
      .scroll-view-item {
        border-bottom: 1rpx solid rgba(0, 0, 0, 0.15);
        padding: 0 32rpx;
        .chargeType {
          font-weight: 500;
          color: #5cbb89;
          height: 112rpx;
          display: flex;
          align-items: center;
          font-size: 30rpx;
        }
        .chargeItem {
          display: flex;
          justify-content: space-between;
          box-sizing: border-box;
          padding-bottom: 32rpx;
          width: 100%;
          .left-item {
            font-size: 24rpx;
            width: 100%;
            .name {
              color: #191919;
              line-height: 36rpx;
              max-width: 400rpx;
              font-size: 28rpx;
            }
          }
        }
      }
      .scroll-view-item:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
