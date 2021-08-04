<template>
  <view class="search-wrap">
    <view class="row">
      <view class="iconfont icon-search"></view>
      <input placeholder="搜索随访人" @input="handleChange" />
      <text @click="handleCancel">取消</text>
    </view>
    <view class="result-list" v-if="result.length > 0">
      <view
        class="item"
        v-for="(item, index) in result"
        :key="index"
        @click="handleSetStaff(item)"
        >{{ item.staffName }}</view
      >
    </view>
    <empty :disabled="true" v-else text="暂无数据" />
  </view>
</template>
<script>
import followupAPI from '@/APIS/followup/followup.api.js'
import followConfigData from './Data.js'
import empty from '@/components/empty/empty.vue'

const { BACKFILTERMODAL } = followConfigData
export default {
  data() {
    return {
      keyword: '',
      result: [],
      staffName: '',
    }
  },
  created() {
    followupAPI.getFollowupNodeList()
  },
  onLoad(options) {},
  methods: {
    handleCancel() {
      uni.redirectTo({
        url: `/pages/followup/home?staffName=${this.staffName}`,
      })
    },
    handleChange(e) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.keyword = e.detail.value
        followupAPI
          .getStaffList({
            keyword: this.keyword,
          })
          .then((res) => {
            this.result = res.data.slice(0, 3) || []
          })
      }, 200)
    },
    handleSetStaff(item) {
      this.staffName = item.staffName
      uni.redirectTo({
        url: `/pages/followup/home?staffName=${item.staffName}&staffId=${item.staffId}`,
      })
    },
  },
}
</script>
<style lang="scss" scoped>
page {
  width: 100%;
  height: 100%;
}
view {
  box-sizing: border-box;
}

.search-wrap {
  width: 100%;
  height: 100vh;
  background: #fff;
  padding: 32rpx 0;

  .row {
    padding: 0 32rpx;
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .iconfont {
      position: absolute;
      color: #b2b2b2;
      left: 63rpx;
    }
    input {
      padding-left: 80rpx;
      width: 598rpx;
      height: 72rpx;
      opacity: 1;
      background: #ffffff;
      border: 1rpx solid #d9d9d9;
      border-radius: 8rpx;
      box-sizing: border-box;
      font-size: 28rpx;
      font-family: PingFangSC, PingFangSC-Regular;
      // color: #bfbfbf;
    }
    > text {
      font-size: 28rpx;
      font-family: PingFangSC, PingFangSC-Regular;
      color: #4c4c4c;
    }
  }

  .result-list {
    margin-top: 32rpx;
    .item {
      padding: 0 56rpx;
      border-bottom: 1rpx solid #e5e5e5;
      width: 750rpx;
      height: 96rpx;
      line-height: 96rpx;
      font-size: 28rpx;
      font-family: PingFangSC, PingFangSC-Regular;
      color: #191919;
    }
  }
}
</style>
