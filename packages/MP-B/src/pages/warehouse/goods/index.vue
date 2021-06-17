<template>
  <view class="container">
    <view class="container-top">
      <view class="container-top-input" @click="goToSearch">
        <text class="iconfont icon-search"></text>
        <text class="input-placeholder">物品编码、物品名称、生产厂商</text>
      </view>
    </view>
    <view class="goods">
      <view class="goods-left">
        <sideScroll
          fieldKey="merchandiseCategoryId"
          fieldName="merchandiseCategoryName"
          :value="0"
          :list="oneCategoryList"
          @on-change="changeOneCategory"
        />
      </view>
      <view class="goods-main">
        <view
          class="goods-main-top"
          v-if="twoCategoryList.length || oneCategoryId"
        >
          <tabScroll
            fieldKey="merchandiseCategoryId"
            fieldName="merchandiseCategoryName"
            :value="0"
            :list="twoCategoryList"
            @on-change="changeTwoCategory"
            @on-open="openDrawer"
          />
        </view>
        <view class="goods-main-list">
          <scroll-view scroll-y="true" style="height: 100%;">
            <view v-for="(item, index) in goodList" :key="index">
              <goodsInfo :detail="item" />
            </view>
          </scroll-view>
        </view>
      </view>
    </view>
    <uni-drawer ref="showRight" mode="right" :mask-click="false" :width="350">
      <scroll-view class="drawer-right" style="height: 100%;" scroll-y="true">
        <expandFilter
          fieldKey="merchandiseCategoryId"
          fieldName="merchandiseCategoryName"
          :parentId="twoCategoryId"
          :list="twoCategoryList"
          @on-change="changeThreeCategory"
        />
      </scroll-view>
    </uni-drawer>
  </view>
</template>
<script>
import sideScroll from '../components/sideScroll.vue'
import tabScroll from '../components/tabsScroll.vue'
import expandFilter from '../components/expand-filter.vue'
import goodsInfo from '../components/goods-info.vue'
import goodAPI from '@/APIS/warehouse/good.api.js'

const all = [
  {
    merchandiseCategoryId: 0,
    merchandiseCategoryName: '全部',
    children: [],
  },
]

export default {
  components: { sideScroll, tabScroll, expandFilter, goodsInfo },
  data() {
    return {
      oneCategoryId: null,
      twoCategoryId: null,
      threeCategoryId: null,
      oneCategoryList: [],
      twoCategoryList: [],
      threeCategoryList: [],
      goodList: [],
    }
  },
  onLoad() {
    this.getCategoryList()
    this.getGoodsList()
  },
  methods: {
    // 获取物品分类
    async getCategoryList() {
      const res = await goodAPI.getCategoryList()
      let arr = all.concat(res.data)
      this.oneCategoryList.push(...arr)
    },
    // 查询物品
    async getGoodsList(merchandiseCategoryId, current = 1, size = 10) {
      const res = await goodAPI.getGoodsList({
        merchandiseCategoryId,
        current,
        size,
      })
      this.goodList = res.data.records
    },
    // 点击第一层级
    changeOneCategory(item) {
      this.oneCategoryId = item.merchandiseCategoryId || null
      // 切换一级分类时,清空已选的二级和三级分类
      this.twoCategoryId = this.threeCategoryId = null
      this.twoCategoryList = item.children.length
        ? all.concat(item.children)
        : []
      this.getGoodsList(this.oneCategoryId)
    },
    // 点击第二层级
    changeTwoCategory(item) {
      this.twoCategoryId = item.merchandiseCategoryId || null
      // 切换二级分类时,清除已选的三级分类
      this.threeCategoryId = null
      this.threeCategoryList = item.children || []
      // 点击的如果是二级分类的全部, 按已选的一级分类查询
      this.getGoodsList(this.twoCategoryId || this.oneCategoryId)
    },
    // 点击第三层级
    changeThreeCategory(id) {
      this.threeCategoryId = id || null
      this.getGoodsList(this.threeCategoryId)
      this.$refs.showRight.close(
        this.threeCategoryId || this.twoCategoryId || this.oneCategoryId,
      )
    },
    // 前往搜索页面
    goToSearch() {
      this.$refs.showRight.open()
      this.$utils.push({ url: 'warehouse/goods/searchGood' })
    },
    openDrawer() {
      this.$refs.showRight.open()
    },
    closeDrawer() {
      this.$refs.showRight.close()
    },
  },
}
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  &-top {
    width: 100%;
    height: 140rpx;
    background-color: $common-color;
    padding: 1rpx;
    &-input {
      width: 686rpx;
      margin: 0 auto;
      margin-top: 32rpx;
      height: 78rpx;
      line-height: 78rpx;
      background-color: #ffffff;
      border-radius: 4rpx;
      color: #bfbfbf;
      font-size: 28rpx;
      padding-left: 16rpx;
      .input-placeholder {
        padding-left: 20rpx;
        vertical-align: middle;
      }
    }
  }
  .goods {
    width: 100%;
    // height: 100%;
    height: calc(100% - 142rpx);
    display: flex;
    background-color: #ffffff;
    color: #4c4c4c;
    &-left {
      width: 192rpx;
      height: 100%;
      flex-shrink: 0;
      padding-right: 32rpx;
    }
    &-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      &-top {
        padding-top: 10rpx;
      }
      &-list {
        flex: 1;
        overflow-y: hidden;
      }
    }
  }
  .drawer-right {
    padding-left: 32rpx;
  }
}
</style>
