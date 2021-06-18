<template>
  <view class="increase-record">
    <scroll-view
      scroll-y="true"
      class="increase-record-list"
      @scrolltolower="loadMore"
      v-if="pagination.records.length"
    >
      <view
        class="increase-record-list-item"
        v-for="(item, index) in pagination.records"
        :key="index"
      >
        <text class="time">{{ item.confirmTime }}</text>
        <text class="amount">{{ item.adjustNum }}</text>
      </view>
      <loadMore :status="statusText" />
    </scroll-view>
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
        merchandiseId: this.merchandiseId,
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
  padding: 32rpx;
  &-list {
    width: 100%;
    height: 100%;
    &-item {
      width: 100%;
      height: 96rpx;
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
      .time,
      .type {
        font-size: 28rpx;
        color: #191919;
      }
      .amount {
        font-size: 28rpx;
        color: #fa8c16;
      }
    }
  }
}
</style>
