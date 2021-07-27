<template>
  <view class="search-wrap">
    <view class="row">
      <view class="iconfont icon-search"></view>
      <input placeholder="搜索随访人" @input="handleChange" />
      <text @click="handleCancel">取消</text>
    </view>
    <view class="result-list">
      <view class="item" v-for="(item, index) in result" :key="index">{{
        item.staffName
      }}</view>
    </view>
  </view>
</template>
<script>
import followupAPI from '@/APIS/followup/followup.api.js'
export default {
  data() {
    return {
      keyword: '',
      result: [],
    }
  },
  created() {
    followupAPI.getFollowupNodeList()
  },
  methods: {
    handleCancel() {},
    handleChange(e) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.keyword = e.detail.value
        followupAPI
          .getStaffList({
            keyword: this.keyword,
          })
          .then((res) => {
            this.result = res.data || []
          })
      }, 500)
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
  padding: 32rpx;

  .row {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .iconfont {
      position: absolute;
      color: #b2b2b2;
      left: 31rpx;
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
      color: #bfbfbf;
    }
    > text {
      font-size: 28rpx;
      font-family: PingFangSC, PingFangSC-Regular;
      color: #4c4c4c;
    }
  }

  .result-list {
    .item {
    }
  }
}
</style>
