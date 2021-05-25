<template>
  <!--诊疗服务-->
  <view class="container-wrap" v-if="classifyList.length >0">
    <!--一级类目列表-->
    <view class="left-scroll">
      <scroll-view
        scroll-y="true"
        class="scroll-Y"
        :style="{ height: scrollHeight }"
        :scroll-into-view="scrollTypeId"
        :scroll-with-animation="true"
      >
        <view
          class="scroll-view-item"
          v-for="(type, index) in classifyList"
          :key="type.settingsChargeTypeId"
          :class="{ active: currentTypeId === type.settingsChargeTypeId }"
          :id="`type` + type.settingsChargeTypeId"
          @click="toggleChargeType(type)"
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
        :scroll-into-view="scrollItemId"
        :scroll-with-animation="true"
        @scroll="onItemListScroll"
      >
        <view
          class="scroll-view-item"
          v-for="type in classifyList"
          :key="type.settingsChargeTypeId"
          :id="`item` + type.settingsChargeTypeId"
        >
          <!--一级类目-->
          <view class="chargeType">
            <view class="ellipsisChargeName">{{
              type.settingsChargeTypeName
            }}</view>
          </view>
          <!--二级类目-->
          <view
            class="chargeItem"
            v-for="item in type.chargeItemList"
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
</template>
<script>
import billAPI from '@/APIS/bill/bill.api'
import { mapMutations, mapState } from 'vuex';
export default {
  name: '',
  data() {
    return {
      scrollHeight: 0,
      currentTypeId: '',
      //分类列表
      classifyList: [],
      //滚动的锚点id
      scrollTypeId: '',
      scrollItemId: '',
    }
  },
  computed: {
    ...mapState('searchProjectStore', ['searchChargeList']),
    ...mapState('dispose', ['disposeList']),
  },
  created() {
  },
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
            this.classifyList = this.handleClassifyList(
              res.data,
              'chargeItemList',
            )
            this.$nextTick(() => {
              this.getChargeItemHeight(res.data)
            })
          }
        })
        .catch(() => {})
    },
    //处理列表数据
    handleClassifyList(list, key) {
      return list.map((item, index) => {
        if (item[key] && item[key].length > 0) {
          if (index === 0) {
            this.currentTypeId = item.settingsChargeTypeId
          }
          item[key].forEach((project) => {
            project.checked = false
          })
        }
        return item
      })
    },
    //切换一级目录
    toggleChargeType(item) {
      this.currentTypeId = item.settingsChargeTypeId
      this.scrollItemId = 'item' + item.settingsChargeTypeId
    },
    //选中和取消
    onCheckBoxChange(value, item) {
      item.checked = value
    },
    //右侧列表滚动
    onItemListScroll(event) {
      const scrollTop = event.detail.scrollTop
      this.classifyList.forEach((item, index) => {
        if (
          scrollTop >= item.heightArea[0] &&
          scrollTop <= item.heightArea[1]
        ) {
          this.scrollTypeId = 'type' + item.settingsChargeTypeId
          this.currentTypeId = item.settingsChargeTypeId
        }
      })
    },
    //获取一级目录所有内容的高度
    getChargeItemHeight() {
      const query = uni.createSelectorQuery().in(this)
      uni.getSystemInfo({
        success: (res) => {
          query
            .selectAll('.right-scroll .scroll-view-item')
            .boundingClientRect((data) => {
              let allItemArr = []
              data.reduce((pre, next) => {
                let itemArr = [pre, pre + next.height - 1]
                allItemArr.push(itemArr)
                return pre + next.height
              }, 0)
              allItemArr.forEach((item, index) => {
                this.classifyList[index].heightArea = item
              })
            })
            .exec()
        },
      })
    },
    //合并数据
    mergeChargeList() {
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
    getDisposeList(){
      const disposeList=[]
      this.classifyList.forEach((item) => {
        item?.chargeItemList?.length > 0 &&
        item.chargeItemList.forEach((charge) => {
          if (charge.checked){
            charge.itemType=5
            disposeList.push(charge)
          }
        })
      })
      return disposeList
    }
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
