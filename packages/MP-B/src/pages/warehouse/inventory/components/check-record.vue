<template>
  <view class="check-record">
    <view class="check-record-list" v-if="pagination.records.length">
      <view
        class="check-record-list-item"
        v-for="(item, index) in pagination.records"
        :key="index"
      >
        <view class="check-record-list-item-main">
          <text class="time">{{ item.confirmTime | filterTime }}</text>
          <text class="amount">{{
            item.changeNum | thousandFormatter(0, '')
          }}</text>
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
      // statusText: 'more',
    }
  },
  computed: {
    statusText() {
      if (!this.pagination.current) {
        return ''
      } else if (this.pagination.current < this.pagination.pages) {
        return 'more'
      } else {
        return ''
      }
    },
  },
  async created() {
    const res = await this.getGoodCheckRecord()
    this.pagination = res
  },
  methods: {
    async getGoodCheckRecord(params) {
      const res = await goodAPI.getGoodCheckRecord({
        ...params,
        merchandiseId: this.merchandiseId,
        size: 20,
      })
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
      const res = await this.getGoodCheckRecord(params)
      this.statusText = 'more'
      let newRecords = this.pagination.records.concat(res.records)
      let { total, current, pages } = res
      this.pagination = { records: newRecords, total, current, pages }
    },
  },
}
</script>
<style lang="scss" scoped>
.check-record {
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
