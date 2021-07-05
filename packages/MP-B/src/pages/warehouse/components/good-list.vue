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
            :lower-threshold="100"
            v-if="pagination.records.length"
            :scroll-top="scrollTop"
          >
            <view v-for="(item, index) in pagination.records" :key="index">
              <checkBox
                v-model="item.checked"
                :disabled="!item.isEnable || !item.availableNum"
                @on-change="handleSelect(item)"
                :mode="mode"
              >
                <goodsInfo
                  :detail="item"
                  :type="type"
                  :mode="mode"
                  @on-click="goToDetail(item.merchandiseId)"
                />
              </checkBox>
            </view>
            <view class="loadMore">
              <loadMore :status="statusText" />
            </view>
          </scroll-view>
          <empty v-else disabled />
        </view>
      </view>
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
import sideScroll from './sideScroll.vue'
import tabScroll from './tabsScroll.vue'
import expandFilter from './expand-filter.vue'
import goodsInfo from './goods-info.vue'
import goodAPI from '@/APIS/warehouse/good.api.js'
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
    sideScroll,
    tabScroll,
    expandFilter,
    goodsInfo,
    loadMore,
    empty,
    checkBox,
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
    mode: {
      type: String,
      default: '',
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
  watch: {
    goodIds() {
      this.$nextTick(() => {
        this.pagination.records.forEach((e) => {
          let flag = this.goodIds.indexOf(e.merchandiseId) >= 0
          this.$set(e, 'checked', flag)
        })
      })
    },
  },
  async created() {
    console.log('goodList获取的mode是', this.mode)
    this.getCategoryList()
    const res = await this.getGoodsList()
    this.pagination = res
  },
  methods: {
    ...mapMutations('warehouse', ['selectGood']),
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
      let arr = records.length
        ? records.map((e) => {
            return { ...e, checked: this.goodIds.indexOf(e.merchandiseId) >= 0 }
          })
        : []
      return { records: arr, total, current, pages }
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
      // scrollTop的坑, 先设置一个大于0的值, 再在dom渲染完成后, 设置为0 达到置顶的效果
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
      // 选择某个二级分类后, 三级筛选数据只有当前所选中的二级分类及对应的三级分类数据
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
      })
      this.pagination = res
      this.scrollTop = 100
      this.$nextTick(() => {
        this.scrollTop = 0
      })
    },
    // 前往搜索页面
    goToSearch() {
      this.$dpmsUtils.push({ url: `${this.searchPath}?mode=${this.mode}` })
    },
    // 选择物品
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
      this.$dpmsUtils.back(1)
      // this.$dpmsUtils.push({
      //   url: '/pages/warehouse/receive/apply',
      // })
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
  overflow: hidden;
  display: flex;
  flex-direction: column;
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
    // width: 100%;
    // height: calc(100% - 142rpx);
    flex: 1;
    overflow: hidden;
    display: flex;
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
      background-color: #ffffff;
      &-top {
        padding-top: 10rpx;
      }
      &-list {
        flex: 1;
        overflow-y: hidden;
        // .loadMore {
        //   width: 100%;
        //   height: 80rpx;
        //   background-color: #f5f5f5;
        // }
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
