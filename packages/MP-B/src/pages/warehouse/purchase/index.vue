<template>
  <view class="purchase">
    <view class="purchase-search">
      <view class="purchase-search-input">
        <text class="iconfont icon-search"></text>
        <input
          v-if="mode == 'search'"
          focus
          confirm-type="search"
          @focus="handleFocus"
          v-model="appReceiveOrderNo"
          @confirm="confirm"
          placeholder="采购单号"
        />
        <text v-else class="ml-20" @click="goToSearch">采购单号</text>
      </view>
      <view class="purchase-search-action">
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
    <view class="purchase-history" v-if="showHistory && mode == 'search'">
      <searchHistory
        :list="historyList"
        @on-click="selectHistory"
        @on-clear="clearHistory"
      />
    </view>
    <view class="purchase-main" v-else>
      <view class="purchase-main-status">
        <view class="purchase-main-status-list">
          <scroll-view
            scroll-x="true"
            style="width: 100%; height: 100%;"
            :lower-threshold="100"
            :scroll-top="scrollTop"
          >
            <template v-for="item in statusMap">
              <view
                :class="{ underline: form.purchaseStatus == item.value }"
                class="purchase-main-status-item"
                :key="item.value"
                v-if="item.value != 4"
                @click="changeStatus(item.value)"
                >{{ item.name }}</view
              >
            </template>
          </scroll-view>
        </view>
        <view class="purchase-main-status-icon" @click="openDrawer">
          <text class="iconfont icon-filter"></text>
        </view>
      </view>
      <view class="purchase-main-date">
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
      <view class="purchase-main-list" v-if="pagination.records.length">
        <scroll-view
          scroll-y="true"
          style="width: 100%; height: 100%;"
          :lower-threshold="100"
          @scrolltolower="loadMore"
          :scroll-top="scrollTop"
        >
          <view
            class="purchase-main-list-item"
            v-for="(item, index) in pagination.records"
            :key="index"
            @click="goToDetail(item.merchandisePurchaseOrderId)"
          >
            <purchase-info :detail="item" />
          </view>
          <loadMore :status="statusText" />
        </scroll-view>
      </view>
      <empty v-else disabled />
    </view>
    <uni-drawer ref="showRight" mode="right" :mask-click="true" :width="250">
      <view class="drawer">
        <view class="drawer-head">
          <text>筛选</text>
        </view>
        <view class="drawer-main">
          <scroll-view scroll-y="true" style="width: 100%; height: 100%;">
            <view class="drawer-main-title">入库状态</view>
            <view class="drawer-main-list">
              <text
                class="tag"
                :class="{
                  activeTag: form.purchaseInventoryStatus == item.value,
                }"
                v-for="item in inputWarehouseStatus"
                :key="item.value"
                @click="changeTypeStatus('inventory', item.value)"
                >{{ item.name }}</text
              >
            </view>
            <view class="drawer-main-title">结算状态</view>
            <view class="drawer-main-list">
              <text
                class="tag"
                :class="{
                  activeTag: form.purchaseSettlementStatus == item.value,
                }"
                v-for="item in settlementStatus"
                :key="item.value"
                @click="changeTypeStatus('settlement', item.value)"
                >{{ item.name }}</text
              >
            </view>
            <view class="drawer-main-title">供应商</view>
            <view class="drawer-main-list">
              <text
                class="tag"
                :class="{
                  activeTag:
                    form.merchandiseSupplierId == item.merchandiseSupplierId,
                }"
                v-for="item in supplierList"
                :key="item.merchandiseSupplierId"
                @click="
                  changeTypeStatus('supplier', item.merchandiseSupplierId)
                "
                >{{ item.merchandiseSupplierName }}</text
              >
            </view>
          </scroll-view>
        </view>
        <view class="drawer-footer">
          <view @click="handleReset">重置</view>
          <view @click="handleSearch">确认</view>
        </view>
      </view>
    </uni-drawer>
  </view>
</template>
<script>
import {
  purchaseStatusArray,
  inputWarehouseStatus,
  settlementStatus,
} from '../enum'
import purchaseInfo from '../components/purchase-info.vue'
import purchaseAPI from '@/APIS/warehouse/purchase.api.js'
import loadMore from '@/components/load-more/load-more.vue'
import empty from '@/components/empty/empty.vue'
import moment from 'moment'
import History from '@/utils/history.util.js'
import searchHistory from '../components/search-history.vue'

const all = { name: '全部', value: 0 }

export default {
  components: { purchaseInfo, loadMore, empty, searchHistory },
  props: {
    mode: {
      type: String,
      default: '', // search 区分领用搜索
    },
  },
  data() {
    return {
      inputWarehouseStatus: [all, ...inputWarehouseStatus],
      settlementStatus: [all, ...settlementStatus],
      statusMap: [all, ...purchaseStatusArray()],
      date: moment().format('YYYY-MM'),
      startDate: '',
      endDate: moment().format('YYYY-MM'),
      form: {
        orderNo: null,
        beginTimeMillis: null,
        endTimeMillis: null,
        purchaseStatus: 0, // 采购状态
        purchaseInventoryStatus: 0, // 入库状态
        purchaseSettlementStatus: 0, // 结算状态
        merchandiseSupplierId: 0, // 供应商
      },
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
      history: new History('purchase', [], 10),
      appReceiveOrderNo: '', // 搜索关键字
      supplierList: [], // 供应商列表
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
  created() {
    this.getSupplierList()
    // 搜索页 进行 搜索历史数据初始化
    if (this.mode) {
      this.historyList = this.history.getHistory()
    }
  },
  methods: {
    setDate(date) {
      this.date = date
    },
    openDrawer() {
      this.$refs.showRight.open()
    },
    // 切换状态
    async changeStatus(val) {
      this.scrollTop = 50
      this.form.purchaseStatus = val
      let beginTimeMillis = moment(
        this.date + '-01' + ' ' + '00:00:00',
      ).valueOf()
      // 所选月份的最后一天
      let endTimeMillis = moment(
        moment(this.date + '-01')
          .endOf('month')
          .format('YYYY-MM-DD') +
          ' ' +
          '23:59:59',
      ).valueOf()
      this.form.beginTimeMillis = beginTimeMillis
      this.form.endTimeMillis = endTimeMillis
      const res = await this.getPurchaseList(this.form)
      this.pagination = res
      this.$nextTick(() => {
        this.scrollTop = 0
      })
    },
    // 切换日期选择
    async changeDate(event) {
      this.date = event.target.value
      let beginTimeMillis = moment(
        this.date + '-01' + ' ' + '00:00:00',
      ).valueOf()
      // 所选月份的最后一天
      let endTimeMillis = moment(
        moment(this.date + '-01')
          .endOf('month')
          .format('YYYY-MM-DD') +
          ' ' +
          '23:59:59',
      ).valueOf()
      this.form.beginTimeMillis = beginTimeMillis
      this.form.endTimeMillis = endTimeMillis
      const res = await this.getPurchaseList(this.form)
      this.pagination = res
    },
    goToSearch() {
      this.$dpmsUtils.push({
        url: `/pages/warehouse/purchase/search?date=${this.date}`,
      })
    },
    // 搜索
    async confirm() {
      this.showHistory = false
      // 查询过后 就不再是第一次进入
      this.isFirstShow = false
      this.history.add(this.appReceiveOrderNo)
      let beginTimeMillis = moment(
        this.date + '-01' + ' ' + '00:00:00',
      ).valueOf()
      // 所选月份的最后一天
      let endTimeMillis = moment(
        moment(this.date + '-01')
          .endOf('month')
          .format('YYYY-MM-DD') +
          ' ' +
          '23:59:59',
      ).valueOf()
      this.form.purchaseStatus = 0
      this.form.beginTimeMillis = beginTimeMillis
      this.form.endTimeMillis = endTimeMillis
      const res = await this.getPurchaseList(this.form)
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
    async getPurchaseList(params) {
      let params_copy = JSON.parse(JSON.stringify(params))
      for (const key in params_copy) {
        params_copy[key] = params_copy[key] || null
      }
      this.loading = true
      const res = await purchaseAPI.getPurchaseList({
        ...params_copy,
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
      let beginTimeMillis = moment(
        this.date + '-01' + ' ' + '00:00:00',
      ).valueOf()
      // 所选月份的最后一天
      let endTimeMillis = moment(
        moment(this.date + '-01')
          .endOf('month')
          .format('YYYY-MM-DD') +
          ' ' +
          '23:59:59',
      ).valueOf()
      this.form.beginTimeMillis = beginTimeMillis
      this.form.endTimeMillis = endTimeMillis
      let params = {
        current: _current,
        ...this.form,
      }
      const res = await this.getPurchaseList(params)
      let newRecords = this.pagination.records.concat(res.records)
      let { total, current, pages } = res
      this.pagination = { records: newRecords, total, current, pages }
    },
    // 跳转领用申请
    creatReceiveOrder() {
      this.$dpmsUtils.push({ url: '/pages/warehouse/purchase/apply' })
    },
    // 跳转领用详情
    goToDetail(merchandisePurchaseOrderId) {
      this.$dpmsUtils.push({
        url: `/pages/warehouse/purchase/detail?merchandisePurchaseOrderId=${merchandisePurchaseOrderId}`,
      })
    },
    // 获取供应商
    async getSupplierList() {
      const res = await purchaseAPI.getSupplierList()
      this.supplierList = [
        { merchandiseSupplierId: 0, merchandiseSupplierName: '全部' },
        ...res.data,
      ]
    },
    changeTypeStatus(type, value) {
      switch (type) {
        case 'inventory':
          this.form.purchaseInventoryStatus = value
          break
        case 'settlement':
          this.form.purchaseSettlementStatus = value
          break
        case 'supplier':
          this.form.merchandiseSupplierId = value
          break
      }
    },
    handleReset() {
      this.form.purchaseSettlementStatus = 0
      this.form.merchandiseSupplierId = 0
      this.form.purchaseInventoryStatus = 0
    },
    async handleSearch() {
      this.$refs.showRight.close()
      const res = await this.getPurchaseList(this.form)
      this.pagination = res
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
.purchase {
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
      background-color: #ffffff;
      display: flex;
      &-list {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
      }
      &-icon {
        flex-shrink: 0;
        width: 80rpx;
        height: 96rpx;
        text-align: center;
        line-height: 96rpx;
        color: $common-color;
      }
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
.drawer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  > view {
    box-sizing: inherit;
  }
  &-head {
    flex-shrink: 0;
    width: 100%;
    height: 107rpx;
    text-align: center;
    line-height: 107rpx;
    color: #191919;
    font-size: 36rpx;
    font-weight: 500;
    border-bottom: 1rpx solid #e5e5e5;
  }
  &-main {
    flex: 1;
    overflow: hidden;
    padding-left: 32rpx;
    &-title {
      padding: 32rpx 0;
      font-size: 30rpx;
      font-weight: 400;
      color: #191919;
    }
    &-list {
      display: flex;
      flex-wrap: wrap;
      border-bottom: 1rpx solid #e5e5e5;
      .tag {
        display: inline-block;
        padding: 16rpx;
        background: rgba(0, 0, 0, 0.06);
        border-radius: 8rpx;
        font-size: 24rpx;
        color: #595959;
        margin: 0 16rpx 16rpx 0;
      }
      .activeTag {
        background-color: $common-color;
        color: #ffffff;
      }
    }
  }
  &-footer {
    flex-shrink: 0;
    width: 100%;
    padding: 32rpx 32rpx 80rpx 32rpx;
    display: flex;
    justify-content: space-between;
    > view {
      width: 200rpx;
      height: 56rpx;
      text-align: center;
      line-height: 56rpx;
      border-radius: 28rpx;
      font-size: 28rpx;
    }
    view:first-child {
      border: 1rpx solid $common-color;
      color: $common-color;
    }
    view:last-child {
      background-color: $common-color;
      color: #ffffff;
    }
  }
}
</style>
