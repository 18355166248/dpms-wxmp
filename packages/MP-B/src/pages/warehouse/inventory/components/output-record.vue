<template>
  <view class="output-record">
    <view class="output-record-list" v-if="pagination.records.length">
      <view
        class="output-record-list-item"
        v-for="(item, index) in pagination.records"
        :key="index"
      >
        <view class="output-record-list-item-main">
          <view class="time">{{ item.confirmTimeStr }}</view>
          <view class="type">{{ item.outputInventoryTypeStr }}</view>
          <view class="amount">{{
            item.outputInventoryNum | thousandFormatter(0, '-')
          }}</view>
        </view>
      </view>
    </view>
    <loadMore v-if="pagination.records.length" :status="statusText" />
    <empty v-else disabled />
  </view>
</template>
<script>
import loadMore from '@/components/load-more/load-more.vue'
import empty from '@/components/empty/empty.vue'
import goodAPI from '@/APIS/warehouse/good.api.js'
export default {
  components: { loadMore, empty },
  props: {
    merchandiseId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      pagination: {
        total: 0,
        current: 1,
        pages: 1,
        records: [],
      },
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
  async created() {
    const res = await this.getGoodOutputRecord()
    this.pagination = res
  },
  methods: {
    async getGoodOutputRecord(params) {
      this.loading = true
      const res = await goodAPI.getGoodOutputRecord({
        ...params,
        merchandiseId: this.merchandiseId,
        size: 20,
      })
      this.loading = false
      let { current, pages, records, total } = res.data
      return { current, pages, records, total }
    },
    async loadMore() {
      if (this.pagination.current >= this.pagination.pages) {
        this.statusText = 'noMore'
        return false
      }
      this.statusText = 'loading'
      let _current = (this.pagination.current += 1)
      let params = { current: _current }
      const res = await this.getGoodOutputRecord(params)
      this.statusText = 'more'
      let newRecords = this.pagination.records.concat(res.records)
      let { total, current, pages } = res
      this.pagination = { records: newRecords, total, current, pages }
    },
  },
}
</script>
<style lang="scss" scoped>
.output-record {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  &-list {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    &-item {
      width: 100%;
      height: 96rpx;
      box-sizing: border-box;
      padding: 0 32rpx;
      border-bottom: 1rpx solid #e5e5e5;
      &-main {
        width: 100%;
        height: 100%;
        display: inline-flex;
        justify-content: space-between;
        align-items: center;
        font-size: 28rpx;
        .time {
          width: 254rpx;
        }
        .type {
          width: 212rpx;
          padding-left: 32rpx;
        }
        .time,
        .type {
          color: #191919;
        }
        .amount {
          width: 220rpx;
          text-align: right;
          color: #fa8c16;
        }
      }
    }
  }
}
</style>
