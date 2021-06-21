<template>
  <view class="goods">
    <view class="goods-search">
      <view class="goods-search-main">
        <view class="goods-search-main-input">
          <text @click="handleClickIcon" class="iconfont icon-search"></text>
          <input
            focus
            @focus="handleFocus"
            ref="merchandiseName"
            placeholder="物品编码、物品名称、生产厂商"
            confirm-type="search"
            v-model="merchandiseName"
            @confirm="confirm"
          />
        </view>
        <view v-if="showHistory" class="goods-search-main-cancel"
          ><text @click="showHistory = false">取消</text></view
        >
      </view>
    </view>
    <!-- 搜索历史 -->
    <view class="search-history" v-if="showHistory">
      <searchHistory
        :list="historyList"
        @on-click="selectHistory"
        @on-clear="clearHistory"
      />
    </view>
    <!-- 主体内容展示 -->
    <view class="goods-main" v-else>
      <!-- 一级分类 -->
      <view class="goods-main-one">
        <scroll-view scroll-x="true" style="width: 100%; height: 100%;">
          <text
            class="goods-main-one-tag"
            :class="{
              activeColor: oneCategoryId == item.merchandiseCategoryId,
            }"
            v-for="item in oneCategoryList"
            :key="item.merchandiseCategoryId"
            @click="changeOneCategory(item)"
            >{{ item.merchandiseCategoryName }}</text
          >
        </scroll-view>
      </view>
      <!-- 二级分类 -->
      <view
        class="goods-main-two"
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
      <!-- 列表数据展示 -->
      <view class="goods-main-list">
        <scroll-view
          scroll-y="true"
          style="height: 100%;"
          show-scrollbar="true"
          @scrolltolower="loadMore"
          v-if="pagination.records.length"
        >
          <view v-for="(item, index) in pagination.records" :key="index">
            <goodsInfo
              :detail="item"
              @on-click="goToDetail(item.merchandiseId)"
            />
          </view>
          <loadMore :status="statusText" />
        </scroll-view>
        <empty v-else disabled />
      </view>
    </view>
    <uni-drawer ref="showRight" mode="right" :mask-click="true" :width="343">
      <view class="drawer-title">
        <text>筛选</text>
      </view>
      <view class="drawer-oneCategoryname">
        <text>{{ oneCategoryName }}</text>
      </view>
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
import History from '@/utils/history.util.js'
import goodAPI from '@/APIS/warehouse/good.api.js'
import tabScroll from './tabsScroll.vue'
import goodsInfo from './goods-info.vue'
import expandFilter from './expand-filter.vue'
import searchHistory from './search-history.vue'
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
    tabScroll,
    goodsInfo,
    expandFilter,
    searchHistory,
    loadMore,
    empty,
  },
  props: {
    type: {
      type: String,
    },
    // 点击物品信息跳转的路径path
    detailPath: {
      type: String,
    },
    storgeKey: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      oneCategoryName: '全部',
      showHistory: true,
      oneCategoryId: 0,
      twoCategoryId: 0,
      threeCategoryId: 0,
      oneCategoryList: [],
      twoCategoryList: [],
      threeCategoryList: [],
      historyList: [],
      merchandiseName: '',
      pagination: {
        total: 0,
        current: 1,
        pages: 1,
        records: [],
      },
      history: new History(this.storgeKey, [], 10),
      loading: false,
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
  created() {
    this.historyList = this.history.getHistory()
  },
  mounted() {},
  methods: {
    // 获取物品分类
    // async getCategoryList() {
    //   const res = await goodAPI.getCategoryList()
    //   let arr = all.concat(res.data)
    //   this.oneCategoryList.push(...arr)
    // },
    // 查询物品
    async getGoodsList(params) {
      this.loading = true
      const res = await goodAPI.getGoodsList({ ...params, getCategory: true })
      this.loading = false
      let { records, total, current, pages, categoryList } = res.data
      this.oneCategoryList = []
      let arr = all.concat(categoryList)
      this.oneCategoryList.push(...arr)
      return { records, total, current, pages }
    },
    // 加载更多
    async loadMore() {
      if (this.pagination.current >= this.pagination.pages) {
        return false
      }
      let _current = (this.pagination.current += 1)
      let params = {
        current: _current,
        merchandiseName: this.merchandiseName,
        merchandiseCategoryId: null,
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
      const res = await this.getGoodsList({
        merchandiseCategoryId: this.oneCategoryId || null,
        merchandiseName: this.merchandiseName || null,
      })
      this.pagination = res
    },
    // 点击第二层级
    async changeTwoCategory(item) {
      this.twoCategoryId = item.merchandiseCategoryId
      // 切换二级分类时,清除已选的三级分类
      this.threeCategoryId = 0
      // 点击的如果是二级分类的全部, 按已选的一级分类查询
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
        merchandiseName: this.merchandiseName || null,
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
        merchandiseName: this.merchandiseName || null,
      })
      this.pagination = res
    },
    openDrawer() {
      this.$refs.showRight.open()
    },
    async confirm() {
      this.showHistory = false
      // 点击搜素后, 将搜索词添加到历史记录中
      this.history.add(this.merchandiseName)
      let params = { merchandiseName: this.merchandiseName || null }
      const res = await this.getGoodsList(params)
      this.pagination = res
    },
    // 点击历史记录
    selectHistory(value) {
      this.merchandiseName = value
      this.confirm()
    },
    // 清除历史记录
    clearHistory() {
      this.history.remove()
      this.historyList = []
    },
    handleFocus() {
      this.historyList = this.history.getHistory()
      this.showHistory = true
    },
    // 跳转详情页
    goToDetail(merchandiseId) {
      this.$utils.push({
        url: `${this.detailPath}?merchandiseId=${merchandiseId}`,
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.goods {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  &-search {
    width: 100%;
    height: 140rpx;
    padding: 1rpx 0;
    background-color: $common-color;
    &-main {
      width: 686rpx;
      height: 76rpx;
      margin: 0 auto;
      margin-top: 32rpx;
      display: flex;
      &-input {
        flex: 1;
        background-color: #ffffff;
        border-radius: 8rpx;
        display: inline-flex;
        align-items: center;
        .icon-search {
          margin: 0 16rpx;
        }
        input {
          flex: 1;
          padding-right: 16rpx;
        }
      }
      &-cancel {
        margin-left: 24rpx;
        color: #ffffff;
        height: 76rpx;
        line-height: 76rpx;
      }
    }
  }
  &-main {
    width: 100%;
    height: calc(100% - 142rpx);
    overflow: hidden;
    &-one {
      width: 100%;
      height: 115rpx;
      line-height: 95rpx;
      white-space: nowrap;
      background-color: #ffffff;
      .activeColor {
        color: $common-color;
        border-bottom: 4rpx solid $common-color;
      }
      &-tag {
        display: inline-block;
        text-align: center;
        padding: 8rpx 24rpx;
        font-size: 30rpx;
        color: #191919;
      }
    }
    &-two {
      background-color: #ffffff;
      padding-left: 16rpx;
      margin-top: 1rpx;
    }
    &-list {
      width: 100%;
      margin-top: 14rpx;
      height: calc(100% - 96rpx - 80rpx);
      box-sizing: border-box;
      overflow: hidden;
      background-color: #ffffff;
      padding: 24rpx;
      .noMore {
        // width: 100%;
        text-align: center;
        padding: 32rpx 0;
        font-size: 28rpx;
        color: #7f7f7f;
        background-color: #f5f5f5;
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
  }
  .drawer-oneCategoryname {
    width: 100%;
    padding-left: 32rpx;
    height: 113rpx;
    line-height: 113rpx;
    font-size: 30rpx;
    color: #191919;
    font-weight: 500;
    border-bottom: 1rpx solid #e5e5e5;
  }
  .drawer-right {
    padding-left: 32rpx;
  }
}
</style>
