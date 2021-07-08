<template>
  <view class="receive">
    <view class="receive-search">
      <view class="receive-search-input">
        <text class="iconfont icon-search"></text>
        <input
          v-if="mode == 'search'"
          focus
          confirm-type="search"
          @focus="handleFocus"
          v-model="appReceiveOrderNo"
          @confirm="confirm"
          placeholder="领用单号"
        />
        <text v-else class="ml-20" @click="goToSearch">领用单号</text>
      </view>
      <view class="receive-search-action">
        <text
          class="cancle"
          v-if="showHistory && mode == 'search'"
          @click="handleCancleHis"
          >取消</text
        >
        <text
          v-if="!mode"
          class="iconfont icon-plus-circle ml-20"
          @click="creatReceiveOrder"
        ></text>
      </view>
    </view>
    <view class="receive-history" v-if="showHistory && mode == 'search'">
      <searchHistory
        :list="historyList"
        @on-click="selectHistory"
        @on-clear="clearHistory"
      />
    </view>
    <view class="receive-main" v-else>
      <view class="receive-main-status">
        <scroll-view
          scroll-x="true"
          style="width: 100%; height: 100%;"
          :lower-threshold="100"
          :scroll-top="scrollTop"
        >
          <template v-for="item in statusMap">
            <view
              :class="{ underline: currentStatus == item.value }"
              class="receive-main-status-item"
              :key="item.value"
              v-if="item.value != 4"
              @click="changeStatus(item.value)"
              >{{ item.name }}</view
            >
          </template>
        </scroll-view>
      </view>
      <view class="receive-main-date">
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
      <view class="receive-main-list" v-if="pagination.records.length">
        <scroll-view
          scroll-y="true"
          style="width: 100%; height: 100%;"
          :lower-threshold="100"
          @scrolltolower="loadMore"
          :scroll-top="scrollTop"
        >
          <view
            class="receive-main-list-item"
            v-for="(item, index) in pagination.records"
            :key="index"
            @click="goToDetail(item.merchandiseReceiveOrderId)"
          >
            <receive-info :detail="item" />
          </view>
          <loadMore :status="statusText" />
        </scroll-view>
      </view>
      <empty v-else disabled />
    </view>
  </view>
</template>
<script>
import { receiveStatusArray } from '../enum'
import receiveInfo from '../components/receive-info.vue'
import receiveAPI from '@/APIS/warehouse/receive.api.js'
import loadMore from '@/components/load-more/load-more.vue'
import empty from '@/components/empty/empty.vue'
import moment from 'moment'
import History from '@/utils/history.util.js'
import searchHistory from '../components/search-history.vue'

export default {
  components: { receiveInfo, loadMore, empty, searchHistory },
  props: {
    mode: {
      type: String,
      default: '', // search 区分领用搜索
    },
  },
  data() {
    return {
      statusMap: [{ name: '全部', value: 0 }, ...receiveStatusArray],
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
      isFirstShow: true, // 是否是第一次进入搜索区域, 默认是
      showHistory: true,
      historyList: [],
      history: new History('receive', [], 10),
      appReceiveOrderNo: '', // 搜索关键字
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
  onShow() {
    if (!this.mode) {
      this.date = moment().format('YYYY-MM')
      this.changeStatus(0)
    }
  },
  async created() {
    // 搜索页 进行 搜索历史数据初始化
    if (this.mode) {
      this.historyList = this.history.getHistory()
    }
  },
  methods: {
    setDate(date) {
      this.date = date
    },
    // 切换状态
    async changeStatus(val) {
      this.scrollTop = 50
      this.currentStatus = val

      let beginTime = moment(this.date + '-01' + ' ' + '00:00:00').valueOf()
      // 所选月份的最后一天
      let endTime = moment(
        moment(this.date + '-01')
          .endOf('month')
          .format('YYYY-MM-DD') +
          ' ' +
          '23:59:59',
      ).valueOf()
      let params = {
        receiveStatus: val || null,
        beginTime,
        endTime,
        appReceiveOrderNo: this.appReceiveOrderNo || null,
      }
      const res = await this.getReceiveList(params)
      this.pagination = res
      this.$nextTick(() => {
        this.scrollTop = 0
      })
    },
    // 切换日期选择
    async changeDate(event) {
      this.date = event.target.value
      let beginTime = moment(this.date + '-01' + ' ' + '00:00:00').valueOf()
      // 所选月份的最后一天
      let endTime = moment(
        moment(this.date + '-01')
          .endOf('month')
          .format('YYYY-MM-DD') +
          ' ' +
          '23:59:59',
      ).valueOf()
      let params = {
        beginTime,
        endTime,
        receiveStatus: this.currentStatus || null,
        appReceiveOrderNo: this.appReceiveOrderNo || null,
      }
      const res = await this.getReceiveList(params)
      this.pagination = res
    },
    goToSearch() {
      this.$dpmsUtils.push({
        url: `/pages/warehouse/receive/search?date=${this.date}`,
      })
    },
    // 搜索
    async confirm() {
      this.showHistory = false
      // 查询过后 就不再是第一次进入
      this.isFirstShow = false
      this.history.add(this.appReceiveOrderNo)
      let beginTime = moment(this.date + '-01' + ' ' + '00:00:00').valueOf()
      // 所选月份的最后一天
      let endTime = moment(
        moment(this.date + '-01')
          .endOf('month')
          .format('YYYY-MM-DD') +
          ' ' +
          '23:59:59',
      ).valueOf()
      this.currentStatus = 0
      let params = {
        appReceiveOrderNo: this.appReceiveOrderNo || null,
        receiveStatus: this.currentStatus || null,
        beginTime,
        endTime,
      }
      const res = await this.getReceiveList(params)
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
      this.appReceiveOrderNo = value
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
      let beginTime = moment(this.date + '-01' + ' ' + '00:00:00').valueOf()
      // 所选月份的最后一天
      let endTime = moment(
        moment(this.date + '-01')
          .endOf('month')
          .format('YYYY-MM-DD') +
          ' ' +
          '23:59:59',
      ).valueOf()
      let params = {
        current: _current,
        appReceiveOrderNo: this.appReceiveOrderNo || null,
        receiveStatus: this.currentStatus || null,
        beginTime,
        endTime,
      }
      const res = await this.getReceiveList(params)
      let newRecords = this.pagination.records.concat(res.records)
      let { total, current, pages } = res
      this.pagination = { records: newRecords, total, current, pages }
    },
    // 跳转领用申请
    creatReceiveOrder() {
      this.$dpmsUtils.push({ url: '/pages/warehouse/receive/apply' })
    },
    // 跳转领用详情
    goToDetail(merchandiseReceiveOrderId) {
      this.$dpmsUtils.push({
        url: `/pages/warehouse/receive/detail?merchandiseReceiveOrderId=${merchandiseReceiveOrderId}`,
      })
    },
  },
}
</script>
<style lang="scss" scoped>
scroll-view ::-webkit-scrollbar {
  width: 0;
  height: 0;
  background-color: transparent;
}
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
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      background-color: #ffffff;
      border-radius: 8rpx;
      padding: 0 28rpx;
      text:nth-child(2) {
        flex: 1;
      }
      input {
        flex: 1;
        color: rgba(25, 25, 25, 0.9);
        padding: 0 16rpx;
      }
      input::placeholder {
        color: #bfbfbf;
      }
    }
    &-action {
      flex-shrink: 0;
    }
  }
  &-history {
    flex: 1;
  }
  &-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    &-status {
      width: 100%;
      height: 96rpx;
      white-space: nowrap;
      background-color: #ffffff;
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
      padding-bottom: 32rpx;
      overflow: hidden;
      background-color: #f2f2f2;
      &-item {
        padding: 0 24rpx;
        margin-bottom: 32rpx;
      }
      &-item:last-child {
        margin-bottom: 0;
      }
    }
  }
  .cancle {
    margin-left: 12rpx;
    color: #ffffff;
    font-size: 30rpx;
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
