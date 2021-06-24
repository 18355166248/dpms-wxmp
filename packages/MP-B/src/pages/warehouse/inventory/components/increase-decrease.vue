<template>
  <view class="increase-record">
    <view class="increase-record-list" v-if="pagination.records.length">
      <view
        class="increase-record-list-item"
        v-for="(item, index) in pagination.records"
        :key="index"
      >
        <view class="increase-record-list-item-main">
          <text class="time">{{
            item.confirmTime | filterTime('YYYY-MM-DD HH:mm')
          }}</text>
          <text class="amount"
            >{{ item.increaseOrDecreaseType == 1 ? '+' : '-'
            }}{{ item.adjustNum | thousandFormatter(0, '') }}</text
          >
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
    const res = await this.getIncreaseDecreaseRecord()
    this.pagination = res
  },
  methods: {
    async getIncreaseDecreaseRecord(params) {
      this.loading = true
      const res = await goodAPI.getIncreaseDecreaseRecord({
        ...params,
        merchandiseIds: this.merchandiseId,
        size: 20,
      })
      this.loading = false
      let { current, pages, records, total } = res.data
      return { current, pages, records, total }
    },
    async loadMore() {
      if (this.pagination.current >= this.pagination.pages) {
        return false
      }
      let _current = (this.pagination.current += 1)
      let params = { current: _current }
      const res = await this.getIncreaseDecreaseRecord(params)
      let newRecords = this.pagination.records.concat(res.records)
      let { total, current, pages } = res
      this.pagination = { records: newRecords, total, current, pages }
    },
  },
}
</script>
<style lang="scss" scoped>
.increase-record {
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
          color: #191919;
        }
        .amount {
          color: #fa8c16;
        }
      }
    }
  }
}
</style>
