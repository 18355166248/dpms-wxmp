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
            v-if="pagination.records.length"
            :scroll-top="scrollTop"
          >
            <view v-for="(item, index) in pagination.records" :key="index">
              <goodsInfo
                :detail="item"
                :type="type"
                @on-click="goToDetail(item.merchandiseId)"
              />
            </view>
            <loadMore :status="statusText" />
          </scroll-view>
          <empty v-else disabled />
        </view>
      </view>
    </view>
    <uni-drawer ref="showRight" mode="right" :mask-click="true" :width="343">
      <view class="drawer-title">
        <text>筛选</text>
      </view>
      <view class="drawer-main">
        <view class="drawer-main-oneCategoryname">
          <text>{{ oneCategoryName }}</text>
        </view>
        <scroll-view style="height: 100%;" scroll-y="true">
          <expandFilter
            fieldKey="merchandiseCategoryId"
            fieldName="merchandiseCategoryName"
            :parentId="twoCategoryId"
            :list="threeCategoryList"
            :value="threeCategoryId"
            @on-change="changeThreeCategory"
          />
        </scroll-view>
      </view>
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
import empty from '@/components/empty/empty.vue'
const all = [
  {
    merchandiseCategoryId: 0,
    merchandiseCategoryName: '全部',
    children: [],
  },
]

export default {
  components: {
    sideScroll,
    tabScroll,
    expandFilter,
    goodsInfo,
    loadMore,
    empty,
  },
  props: {
    type: {
      type: String,
    },
    searchPath: {
      type: String,
    },
    // 点击物品信息跳转的路径path
    detailPath: {
      type: String,
    },
  },
  data() {
    return {
      oneCategoryName: '全部',
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
      // statusText: 'more',
      loading: false,
      scrollTop: 0,
    }
  },
  computed: {
    statusText() {
      if (!this.loading) {
        if (this.pagination.current === this.pagination.pages) {
          return 'noMore'
        } else {
          return 'more'
        }
      } else {
        return 'loading'
      }
    },
  },
  async created() {
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
      this.loading = true
      const res = await goodAPI.getGoodsList(params)
      this.loading = false
      let { records, total, current, pages } = res.data
      return { records, total, current, pages }
    },
    // 加载更多
    async loadMore() {
      if (this.pagination.current >= this.pagination.pages) {
        return false
      }
      let _current = (this.pagination.current += 1)
      let merchandiseCategoryId =
        this.threeCategoryId || this.twoCategoryId || this.oneCategoryId
      let params = {
        current: _current,
        merchandiseCategoryId: merchandiseCategoryId || null,
      }
      const res = await this.getGoodsList(params)
      let newRecords = this.pagination.records.concat(res.records)
      let { total, current, pages } = res
      this.pagination = { records: newRecords, total, current, pages }
    },
    // 点击第一层级
    async changeOneCategory(item) {
      this.oneCategoryId = item.merchandiseCategoryId
      this.oneCategoryName = item.merchandiseCategoryName
      // 切换一级分类时,清空已选的二级和三级分类
      this.twoCategoryId = this.threeCategoryId = 0
      this.twoCategoryList =
        item.children && item.children.length ? all.concat(item.children) : []
      this.threeCategoryList = this.twoCategoryList
        .filter((e) => e.merchandiseCategoryId)
        .map((e) => {
          return {
            ...e,
            children:
              e.children && e.children.length ? all.concat(e.children) : [],
          }
        })
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
      // 选择某个二级分类后, 三级筛选数据只有当前所选中的二级分类及对应的三级分类数据
      this.threeCategoryList = this.twoCategoryList
        .filter(
          (e) =>
            e.merchandiseCategoryId &&
            e.merchandiseCategoryId == item.merchandiseCategoryId,
        )
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
      this.$dpmsUtils.push({ url: this.searchPath })
    },
    // 跳转详情页
    goToDetail(merchandiseId) {
      this.$dpmsUtils.push({
        url: `${this.detailPath}?merchandiseId=${merchandiseId}`,
      })
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
    }
    &-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-sizing: border-box;
      &-top {
        padding-top: 10rpx;
      }
      &-list {
        flex: 1;
        overflow-y: hidden;
      }
    }
  }
  .drawer-title {
    width: 100%;
    height: 109rpx;
    line-height: 109rpx;
    text-align: center;
    font-size: 36rpx;
    color: #191919;
    font-weight: 500;
    border-bottom: 1rpx solid #e5e5e5;
  }
  .drawer-main {
    width: 100%;
    box-sizing: border-box;
    padding: 0 32px;
    &-oneCategoryname {
      width: 100%;
      height: 113rpx;
      line-height: 113rpx;
      font-size: 30rpx;
      color: #191919;
      font-weight: 500;
      border-bottom: 1rpx solid #e5e5e5;
    }
  }
}
</style>
