<template>
  <view class="receive">
    <view class="receive-search">
      <view class="receive-search-input"
        ><text class="iconfont icon-search"></text
        ><text class="ml-20">领用物品</text></view
      >
      <view><text class="iconfont icon-plus-circle ml-20"></text></view>
    </view>
    <view class="receive-status">
      <scroll-view scroll-x="true" style="width: 100%; height: 100%;">
        <view
          :class="{ underline: currentStatus === item.value }"
          class="receive-status-item"
          v-for="item in statusMap"
          :key="item.value"
          @click="changeStatus(item.value)"
          >{{ item.name }}</view
        >
      </scroll-view>
    </view>
    <view class="receive-date">
      <picker
        mode="date"
        :value="date"
        fields="month"
        :start="startDate"
        :end="endDate"
        @change="changeDate"
      >
        <text>{{ date }}</text>
        <text class="iconfont icon-inverted-triangle"></text>
      </picker>
    </view>
    <view class="receive-list" v-if="pagination.records.length">
      <scroll-view
        scroll-y="true"
        style="width: 100%; height: 100%;"
        :lower-threshold="100"
        @scrolltolower="loadMore"
        :scroll-top="scrollTop"
      >
        <view
          class="receive-list-item"
          v-for="(item, index) in pagination.records"
          :key="index"
        >
          <receive-info :detail="item" />
        </view>
        <loadMore :status="statusText" />
      </scroll-view>
    </view>
    <empty v-else disabled />
  </view>
</template>
<script>
import receiveInfo from '../components/receive-info.vue'
import receiveAPI from '@/APIS/warehouse/receive.api.js'
import loadMore from '@/components/load-more/load-more.vue'
import empty from '@/components/empty/empty.vue'
import moment from 'moment'
const statusMap = [
  {
    name: '全部',
    value: 0,
  },
  {
    name: '待提交',
    value: 1,
  },
  {
    name: '确认中',
    value: 2,
  },
  {
    name: '执行中',
    value: 3,
  },
  {
    name: '已完成',
    value: 4,
  },
  {
    name: '已拒绝',
    value: 5,
  },
]
Object.freeze(statusMap)
export default {
  components: { receiveInfo, loadMore, empty },
  data() {
    return {
      statusMap,
      date: moment().format('YYYY-MM'),
      startDate: '',
      endDate: moment().format('YYYY-MM'),
      pagination: {
        total: 0,
        current: 1,
        pages: 1,
        records: [],
      },
      currentStatus: 0,
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
    const res = await this.getReceiveList()
    this.pagination = res
  },
  methods: {
    // 切换状态
    changeStatus(val) {
      this.currentStatus = val
    },
    // 切换日期选择
    changeDate(event) {
      this.date = event.target.value
    },
    async getReceiveList(params) {
      this.loading = true
      const res = await receiveAPI.getReceiveList({
        ...params,
        queryMerchandiseTotal: true,
      })
      this.loading = false
      let { records, total, current, pages } = res.data
      return { records, total, current, pages }
    },
    async loadMore() {
      if (this.pagination.current >= this.pagination.pages) {
        return false
      }
      let _current = (this.pagination.current += 1)
      let params = {
        current: _current,
      }
      const res = await this.getReceiveList(params)
      let newRecords = this.pagination.records.concat(res.records)
      let { total, current, pages } = res
      this.pagination = { records: newRecords, total, current, pages }
    },
  },
}
</script>
<style lang="scss" scoped>
.receive {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  > view {
    box-sizing: inherit;
  }
  &-search {
    width: 100%;
    height: 140rpx;
    background-color: $common-color;
    padding: 32rpx;
    color: #bfbfbf;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-input {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      background-color: #ffffff;
      border-radius: 8rpx;
      padding: 0 28rpx;
    }
  }
  &-status {
    width: 100%;
    height: 96rpx;
    white-space: nowrap;
    &-item {
      display: inline-block;
      padding: 0 24rpx;
      height: 96rpx;
      line-height: 96rpx;
      color: #191919;
      font-size: 30rpx;
    }
    .underline {
      position: relative;
      font-size: 30rpx;
      font-weight: 500;
      color: $common-color;
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
  &-date {
    width: 100%;
    height: 96rpx;
    background-color: #f2f2f2;
    line-height: 96rpx;
    padding-left: 24rpx;
    color: #595959;
    font-size: 34rpx;
    font-weight: 400;
  }
  &-list {
    flex: 1;
    overflow: hidden;
    background-color: #f2f2f2;
    &-item {
      padding: 0 24rpx;
      margin-bottom: 32rpx;
    }
  }
  .icon-plus-circle {
    color: #ffffff;
    font-size: 53rpx;
  }
  .icon-inverted-triangle {
    margin-left: 8rpx;
  }
}
</style>
