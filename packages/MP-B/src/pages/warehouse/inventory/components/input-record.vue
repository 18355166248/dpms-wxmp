<template>
  <view class="input-record">
    <scroll-view
      scroll-y="true"
      class="input-record-list"
      @scrolltolower="loadMore"
      v-if="pagination.records.length"
    >
      <view
        class="input-record-list-item"
        v-for="(item, index) in pagination.records"
        :key="index"
      >
        <text class="time">{{ item.confirmTimeStr }}</text>
        <text class="type">{{ item.inputInventoryTypeStr }}</text>
        <text class="amount">{{
          item.inputInventoryNum | thousandFormatter(0, '+')
        }}</text>
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
    console.log('入库记录获取的参数是:', this.merchandiseId)
    const res = await this.getGoodInputRecord({ size: 20 })
    this.pagination = res
  },
  methods: {
    async getGoodInputRecord(params) {
      this.loading = true
      const res = await goodAPI.getGoodInputRecord({
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
      const res = await this.getGoodInputRecord(params)
      let newRecords = this.pagination.records.concat(res.records)
      let { total, current, pages } = res
      this.pagination = { records: newRecords, total, current, pages }
    },
  },
}
</script>
<style lang="scss" scoped>
.input-record {
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
