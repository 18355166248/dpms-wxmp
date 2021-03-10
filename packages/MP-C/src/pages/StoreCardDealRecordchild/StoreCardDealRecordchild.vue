<template>
  <div>
    <div class="title">
      <div class="title1">时间</div>
      <div class="title2">交易类型</div>
      <div class="title3">交易记录</div>
    </div>
    <div class="inners">
      <div class="inner" v-for="item in inners" v-key="item.id">
        <div class="inner1">{{ item.createTime }}</div>
        <div class="inner2">{{ item.tradingTypeName }}</div>
        <div class="inner3">{{ item.amount }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import mySelfAPI from '@/APIS/mySelf/mySelf.api'
export default {
  name: 'StoreCardDealRecordchild',
  data() {
    return {
      zero: 0,
      inners: [],
    }
  },
  created() {
    this.getStoreCardDealRecordChild()
  },
  methods: {
    async getStoreCardDealRecordChild() {
      const res = await mySelfAPI.getStoreCardDealRecordChild({})
      let arr = []
      res.data.records.forEach((item, v, array) => {
        let t = ''
        let times = new Date(item.createTime)
        let y = times.getFullYear()
        let m = times.getMonth() + 1
        let d = times.getDate()
        let h = times.getHours()
        let mm = times.getMinutes()
        t = `${y}-${m}-${d}  ${h}:${mm < 10 ? '0' + mm : mm}`
        arr.push({
          createTime: t,
          id: item.id,
          tradingTypeName: item.tradingTypeName,
          amount: item.amount ? item.amount.toFixed(2) : this.zero.toFixed(2),
        })
      })
      this.inners = arr
    },
  },
}
</script>

<style scoped lang="scss">
.title {
  width: 750rpx;
  padding: 0 16px;
  font-size: 28rpx;
  line-height: 96rpx;
  height: 96rpx;
  background: #fff;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.15);
  .title1,
  .title2,
  .title3 {
    display: inline-block;
    line-height: 96rpx;
    height: 96rpx;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.9);
  }
  .title1 {
    width: 262rpx;
  }
  .title2 {
    width: 206rpx;
  }
  .title3 {
    width: 206rpx;
    text-align: right;
  }
}
.inners {
  background: #fff;
  padding-top: 16rpx;
  .inner {
    width: 750rpx;
    padding: 0 16px;
    font-size: 28rpx;
    line-height: 68rpx;
    height: 68rpx;
    .inner1,
    .inner2,
    .inner3 {
      display: inline-block;
      line-height: 68rpx;
      height: 68rpx;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 400;
      color: #191919;
    }
    .inner1 {
      width: 262rpx;
    }
    .inner2 {
      width: 206rpx;
    }
    .inner3 {
      width: 206rpx;
      text-align: right;
    }
  }
}
</style>
