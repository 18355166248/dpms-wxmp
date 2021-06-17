<template>
  <view class="goods">
    <view class="goods-search">
      <view class="goods-search-main">
        <view class="goods-search-main-input">
          <text @click="handleClickIcon" class="iconfont icon-search"></text>
          <input
            focus
            @focus="handleFocus"
            @blur="showHistory = false"
            ref="merchandiseName"
            placeholder="物品编码、物品名称、生产厂商"
            confirm-type="“search”"
            v-model="merchandiseName"
            @confirm="confirm"
          />
        </view>
        <view v-if="showHistory" class="goods-search-main-cancel"
          ><text>取消</text></view
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
          :value="0"
          :list="twoCategoryList"
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
        >
          <view v-for="(item, index) in pagination.records" :key="index">
            <goodsInfo :detail="item" />
          </view>
          <loadMore :status="statusText" />
        </scroll-view>
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
import History from '@/utils/history.util.js'
import goodAPI from '@/APIS/warehouse/good.api.js'
import tabScroll from '../components/tabsScroll.vue'
import goodsInfo from '../components/goods-info.vue'
import expandFilter from '../components/expand-filter.vue'
import searchHistory from '../components/search-history.vue'
import loadMore from '@/components/load-more/load-more.vue'
const all = [
  {
    merchandiseCategoryId: null,
    merchandiseCategoryName: '全部',
    children: [],
  },
]

const history = new History('goods', [], 10)
export default {
  components: { tabScroll, goodsInfo, expandFilter, searchHistory, loadMore },
  data() {
    return {
      showHistory: true,
      oneCategoryId: null,
      twoCategoryId: null,
      threeCategoryId: null,
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
      statusText: 'more',
    }
  },
  onLoad() {
    this.historyList = history.getHistory()
    this.getCategoryList()
  },
  mounted() {},
  methods: {
    // 获取物品分类
    async getCategoryList() {
      const res = await goodAPI.getCategoryList()
      let arr = all.concat(res.data)
      this.oneCategoryList.push(...arr)
    },
    // 查询物品
    async getGoodsList(params) {
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
      let params = {
        current: _current,
        merchandiseName: this.merchandiseName,
        merchandiseCategoryId: null,
      }
      const res = await this.getGoodsList(params)
      this.statusText = 'more'
      let newRecords = this.pagination.records.concat(res.records)
      let { total, current, pages } = res
      this.pagination = { records: newRecords, total, current, pages }
    },
    // 点击第一层级
    changeOneCategory(item) {
      this.oneCategoryId = item.merchandiseCategoryId || null
      // 切换一级分类时,清空已选的二级和三级分类
      this.twoCategoryId = this.threeCategoryId = null
      this.twoCategoryList =
        item.children && item.children.length ? all.concat(item.children) : []
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
    openDrawer() {
      this.$refs.showRight.open()
    },
    async confirm() {
      history.add(this.merchandiseName)
      let params = { merchandiseName: this.merchandiseName }
      const res = await this.getGoodsList(params)
      this.pagination = res
    },
    // 点击历史记录
    selectHistory(value) {
      this.merchandiseName = value
      console.log(this.merchandiseName)
    },
    // 清除历史记录
    clearHistory() {
      history.remove()
      this.historyList = []
    },
    handleFocus() {
      this.showHistory = true
      this.historyList = history.getHistory()
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
      height: 95rpx;
      line-height: 95rpx;
      white-space: nowrap;
      overflow-y: scroll;
      background-color: #ffffff;
      border-bottom: 1rpx solid #cccccc;
      .activeColor {
        color: $common-color;
      }
      &-tag {
        text-align: center;
        padding: 8rpx 24rpx;
        font-size: 30rpx;
        color: #191919;
      }
    }
    &-two {
      background-color: #ffffff;
      padding-left: 16rpx;
      margin-bottom: 14rpx;
    }
    &-list {
      width: 100%;
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
}
</style>
