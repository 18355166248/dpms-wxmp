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
          ><text @click="handleCancleHis">取消</text></view
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
      <view class="goods-main-one" v-if="oneCategoryList.length">
        <scroll-view scroll-x="true" style="width: 100%; height: 100%;">
          <view
            class="goods-main-one-tag"
            :class="{
              activeColor: oneCategoryId == item.merchandiseCategoryId,
              underline: oneCategoryId == item.merchandiseCategoryId,
            }"
            v-for="item in oneCategoryList"
            :key="item.merchandiseCategoryId"
            @click="changeOneCategory(item)"
            >{{ item.merchandiseCategoryName }}</view
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
      <view class="goods-main-list" v-if="pagination.records.length">
        <scroll-view
          scroll-y="true"
          class="goods-main-list-scroll"
          show-scrollbar="true"
          :lower-threshold="100"
          @scrolltolower="loadMore"
        >
          <view v-for="(item, index) in pagination.records" :key="index">
            <checkBox
              v-model="item.checked"
              :disabled="!item.isEnable || !item.availableNum"
              @on-change="handleSelect(item)"
              :mode="mode"
            >
              <goodsInfo
                :type="type"
                :detail="item"
                @on-click="goToDetail(item.merchandiseId)"
              />
            </checkBox>
          </view>
          <view class="loadMore">
            <loadMore :status="statusText" />
          </view>
        </scroll-view>
      </view>
      <empty v-else disabled />
    </view>
    <view class="select_action" v-if="mode == 'select'">
      <view class="select_action_text"
        >已选择{{ applyGoods.length }}种物品</view
      >
      <view class="select_action_btn" @click="goToReceiveApply">确认</view>
    </view>
    <uni-drawer ref="showRight" mode="right" :mask-click="true" :width="302">
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
import { mapMutations, mapState } from 'vuex'
import tabs from '@/components/tabs/tabs.vue'
import History from '@/utils/history.util.js'
import goodAPI from '@/APIS/warehouse/good.api.js'
import tabScroll from './tabsScroll.vue'
import goodsInfo from './goods-info.vue'
import expandFilter from './expand-filter.vue'
import searchHistory from './search-history.vue'
import loadMore from '@/components/load-more/load-more.vue'
import empty from '@/components/empty/empty.vue'
import checkBox from '@/components/checkbox/checkbox.vue'
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
    tabs,
    checkBox,
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
    mode: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isFirstShow: true, // 是否是第一次进入搜索区域, 默认是
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
    ...mapState('warehouse', ['applyGoods']),
    goodIds() {
      if (this.applyGoods.length) {
        return this.applyGoods.map((e) => e.merchandiseId)
      } else {
        return []
      }
    },
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
    ...mapMutations('warehouse', ['selectGood']),
    // 查询物品
    async getGoodsList(params) {
      this.loading = true
      const res = await goodAPI.getGoodsList({ ...params, getCategory: true })
      this.loading = false
      let { records, total, current, pages, categoryList } = res.data
      this.oneCategoryList = []
      let arr = all.concat(categoryList)
      this.oneCategoryList.push(...arr)
      let list = records.length
        ? records.map((e) => {
            return { ...e, checked: this.goodIds.indexOf(e.merchandiseId) >= 0 }
          })
        : []
      return { records: list, total, current, pages }
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
        merchandiseName: this.merchandiseName || null,
      })
      this.pagination = res
      this.scrollTop = 100
      this.$nextTick(() => {
        this.scrollTop = 0
      })
    },
    // 点击第二层级
    async changeTwoCategory(item) {
      this.twoCategoryId = item.merchandiseCategoryId
      // 切换二级分类时,清除已选的三级分类
      this.threeCategoryId = 0
      this.threeCategoryList = this.twoCategoryList
        .filter((e) =>
          item.merchandiseCategoryId
            ? e.merchandiseCategoryId == item.merchandiseCategoryId
            : e.merchandiseCategoryId,
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
        merchandiseName: this.merchandiseName || null,
      })
      this.pagination = res
      this.scrollTop = 100
      this.$nextTick(() => {
        this.scrollTop = 0
      })
    },
    // 点击第三层级
    async changeThreeCategory({ id, parentId }) {
      this.threeCategoryId = id
      this.twoCategoryId = parentId
      this.$refs.showRight.close()
      const res = await this.getGoodsList({
        merchandiseCategoryId:
          this.threeCategoryId || this.twoCategoryId || this.oneCategoryId,
        merchandiseName: this.merchandiseName || null,
      })
      this.pagination = res
      this.scrollTop = 100
      this.$nextTick(() => {
        this.scrollTop = 0
      })
    },
    openDrawer() {
      this.$refs.showRight.open()
    },
    async confirm() {
      this.showHistory = false
      // 查询过后 就不再是第一次进入
      this.isFirstShow = false
      // 搜索后清空数据
      this.twoCategoryList = []
      this.threeCategoryList = []
      this.oneCategoryId = 0
      this.twoCategoryId = 0
      this.threeCategoryId = 0
      // 点击搜素后, 将搜索词添加到历史记录中
      this.history.add(this.merchandiseName)
      let params = { merchandiseName: this.merchandiseName || null }
      const res = await this.getGoodsList(params)
      this.pagination = res
    },
    // 处理 搜索界面点击取消
    handleCancleHis() {
      // 隐藏搜索
      if (this.isFirstShow) {
        this.$dpmsUtils.back()
      } else {
        // this.showHistory = false
        this.confirm()
      }
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
    handleSelect(item) {
      this.selectGood(item)
    },
    // 跳转详情页
    goToDetail(merchandiseId) {
      if (this.mode !== 'select') {
        this.$dpmsUtils.push({
          url: `${this.detailPath}?merchandiseId=${merchandiseId}`,
        })
      }
    },
    // 跳转领用申请
    goToReceiveApply() {
      this.$dpmsUtils.back(2)
      // this.$dpmsUtils.push({
      //   url: '/pages/warehouse/receive/apply',
      // })
    },
  },
}
</script>
<style lang="scss" scoped>
.goods {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  // 顶部搜索区域
  &-search {
    width: 100%;
    height: 140rpx;
    flex-shrink: 0;
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
          color: #bfbfbf;
        }
        input {
          flex: 1;
          color: rgba(25, 25, 25, 0.9);
          padding-right: 16rpx;
        }
        input::placeholder {
          color: #bfbfbf;
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
  // 历史记录区域
  .search-history {
    // widows: 100%;
    // height: 100%;
    flex: 1;
  }
  &-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    &-one {
      width: 100%;
      height: 95rpx;
      flex-shrink: 0;
      line-height: 95rpx;
      white-space: nowrap;
      background-color: #ffffff;
      &-tag {
        display: inline-block;
        text-align: center;
        padding: 0rpx 24rpx;
        font-size: 30rpx;
        color: #191919;
        font-weight: 400;
      }
      .activeColor {
        color: $common-color;
        font-weight: 500;
      }
      .underline {
        position: relative;
      }
      .underline::before {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        content: '';
        width: 60rpx;
        height: 4rpx;
        background-color: $common-color;
      }
    }
    &-two {
      flex-shrink: 0;
      background-color: #ffffff;
      margin-top: 1rpx;
    }
    &-list {
      flex: 1;
      margin-top: 14rpx;
      box-sizing: border-box;
      overflow: hidden;
      &-scroll {
        width: 100%;
        height: 100%;
        // background-color: #ffffff;
        .loadMore {
          width: 100%;
          height: 80rpx;
          background-color: #f5f5f5;
        }
      }
    }
  }
  .select_action {
    box-sizing: border-box;
    width: 100%;
    height: 160rpx;
    padding: 32rpx;
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    // align-items: center;
    font-size: 28rpx;
    .select_action_text {
      color: #191919;
    }
    .select_action_btn {
      width: 120rpx;
      height: 56rpx;
      text-align: center;
      line-height: 56rpx;
      color: #ffffff;
      background: #5cbb89;
      border-radius: 28rpx;
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
