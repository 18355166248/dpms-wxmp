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
          :value="oneCategoryId"
          :list="oneCategoryList"
          @on-change="changeOneCategory"
        />
      </view>
      <view class="goods-main">
        <view
          class="goods-main-top"
          v-if="twoCategoryList.length && oneCategoryId"
        >
          <tabScroll
            fieldKey="merchandiseCategoryId"
            fieldName="merchandiseCategoryName"
            :value="twoCategoryId"
            :list="twoCategoryList"
            @on-change="changeTwoCategory"
            @on-open="openDrawer"
          />
        </view>
        <view class="goods-main-list">
          <scroll-view
            scroll-y="true"
            style="height: 100%;"
            @scrolltolower="loadMore"
          >
            <view v-for="(item, index) in pagination.records" :key="index">
              <goodsInfo
                :detail="item"
                @on-click="goToDetail(item.merchandiseId)"
              />
            </view>
            <loadMore :status="statusText" />
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
          :list="threeCategoryList"
          :value="threeCategoryId"
          @on-change="changeThreeCategory"
        />
      </scroll-view>
    </uni-drawer>
  </view>
</template>
<script>
import sideScroll from './sideScroll.vue'
import tabScroll from './tabsScroll.vue'
import expandFilter from './expand-filter.vue'
import goodsInfo from './goods-info.vue'
import goodAPI from '@/APIS/warehouse/good.api.js'
import loadMore from '@/components/load-more/load-more.vue'
const all = [
  {
    merchandiseCategoryId: 0,
    merchandiseCategoryName: '全部',
    children: [],
  },
]

export default {
  components: { sideScroll, tabScroll, expandFilter, goodsInfo, loadMore },
  props: {
    // 点击物品信息跳转的路径path
    path: {
      type: String,
    },
  },
  data() {
    return {
      oneCategoryId: 0,
      twoCategoryId: 0,
      threeCategoryId: 0,
      oneCategoryList: [],
      twoCategoryList: [],
      threeCategoryList: [],
      pagination: {
        total: 0,
        current: 1,
        pages: 1,
        records: [],
      },
      statusText: 'more',
    }
  },
  async onLoad() {
    this.getCategoryList()
    const res = await this.getGoodsList()
    this.pagination = res
  },
  methods: {
    // 获取物品分类
    async getCategoryList() {
      const res = await goodAPI.getCategoryList()
      let arr = all.concat(res.data)
      this.oneCategoryList.push(...arr)
    },
    // 查询物品
    async getGoodsList(params) {
      // merchandiseCategoryId, current = 1, size = 10
      const res = await goodAPI.getGoodsList(params)
      let { records, total, current, pages } = res.data
      return { records, total, current, pages }
    },
    // 加载更多
    async loadMore() {
      if (this.pagination.current >= this.pagination.pages) {
        this.statusText = 'noMore'
        return false
      }
      this.statusText = 'loading'
      let _current = (this.pagination.current += 1)
      let merchandiseCategoryId =
        this.threeCategoryId || this.twoCategoryId || this.oneCategoryId
      let params = {
        current: _current,
        merchandiseCategoryId: merchandiseCategoryId || null,
      }
      const res = await this.getGoodsList(params)
      this.statusText = 'more'
      let newRecords = this.pagination.records.concat(res.records)
      let { total, current, pages } = res
      this.pagination = { records: newRecords, total, current, pages }
    },
    // 点击第一层级
    async changeOneCategory(item) {
      this.oneCategoryId = item.merchandiseCategoryId
      // 切换一级分类时,清空已选的二级和三级分类
      this.twoCategoryId = this.threeCategoryId = 0
      this.twoCategoryList =
        item.children && item.children.length ? all.concat(item.children) : []
      const res = await this.getGoodsList({
        merchandiseCategoryId: this.oneCategoryId || null,
      })
      this.pagination = res
    },
    // 点击第二层级
    async changeTwoCategory(item) {
      this.twoCategoryId = item.merchandiseCategoryId
      // 切换二级分类时,清除已选的三级分类
      this.threeCategoryId = 0
      this.threeCategoryList = this.twoCategoryList
        .filter((e) => e.merchandiseCategoryId)
        .map((e) => {
          return {
            ...e,
            children:
              e.children && e.children.length ? all.concat(e.children) : [],
          }
        })
      // 点击的如果是二级分类的全部, 按已选的一级分类查询
      const res = await this.getGoodsList({
        merchandiseCategoryId: this.twoCategoryId || this.oneCategoryId,
      })
      this.pagination = res
    },
    // 点击第三层级
    async changeThreeCategory(id) {
      this.threeCategoryId = id
      this.$refs.showRight.close()
      const res = await this.getGoodsList({
        merchandiseCategoryId:
          this.threeCategoryId || this.twoCategoryId || this.oneCategoryId,
      })
      this.pagination = res
    },
    // 前往搜索页面
    goToSearch() {
      this.$refs.showRight.open()
      this.$utils.push({ url: 'warehouse/goods/searchGood' })
    },
    // 跳转详情页
    goToDetail(merchandiseId) {
      this.$utils.push({ url: `${this.path}?merchandiseId=${merchandiseId}` })
    },
    openDrawer() {
      this.$refs.showRight.open()
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
