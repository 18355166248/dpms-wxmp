<template>
  <view class="select-charge-wrap">
    <!--搜索-->
    <view class="search-input">
      <view class="iconfont icon-search"></view>
      <input
        type="text"
        :placeholder="'请输入项目名称或拼音快速搜索'"
        placeholder-style="color:#bfbfbf"
        @input="searchProject($event.detail.value)"
        class="input"
      />
    </view>
    <!--选择项目-->
    <view class="projects-wrap">
      <!--有数据-->
      <view v-if="searchResultList.length > 0">
        <view
          class="item"
          v-for="(item, index) in searchResultList"
          :key="index"
        >
          <view class="left-infos">
            <view>{{
              item.settingsChargeItemName || item.settingsChargeTypeName
            }}</view>
            <span>{{
              item.settingsChargeItemCode || item.settingsChargeTypeCode
            }}</span>
          </view>
          <view class="right-infos">
            <span v-if="item.unitAmount">{{
              item.unitAmount | thousandFormatter(2, '￥')
            }}</span>
            <view class="checkBox">
              <dpmsCheckbox shape="square" v-model="item.checked">
              </dpmsCheckbox>
            </view>
          </view>
        </view>
      </view>
      <!--无数据-->
      <view v-else>
        <empty :disabled="true" text="暂无数据"></empty>
      </view>
    </view>
    <view class="bottom-wrap">
      <chargeButton type="solid" :buttonStyle="buttonStyle" @click="complete"
        >完成
      </chargeButton>
    </view>
  </view>
</template>
<script>
import billAPI from '@/APIS/bill/bill.api'
import chargeButton from './common/chargeButton'
import { mapMutations } from 'vuex'
export default {
  name: '',
  data() {
    return {
      classifyList: [],
      buttonStyle: { width: '686rpx' },
      searchResultList: [],
    }
  },
  computed: {},
  onLoad() {
    this.searchProject('')
  },
  onShow() {},
  onHide() {},
  onUnload() {},
  methods: {
    ...mapMutations('searchProjectStore', ['setSearchProjectList']),
    complete() {
      let list = this.searchResultList.filter((item) => item.checked)
      this.setSearchProjectList(list)
      uni.navigateBack()
    },
    searchProject(searchVal) {
      billAPI
        .searchChargeType({
          settingsChargeTypeName: searchVal || '',
        })
        .then((res) => {
          if (res.data?.length > 0) {
            this.handleResult(res.data)
          } else {
            this.handleResult([])
          }
        })
        .catch((err) => {
          this.handleResult([])
        })
    },
    //搜索
    handleResult(list) {
      if (list && list.length > 0) {
        list.forEach((item) => {
          item.checked = false
        })
        this.searchResultList = list
      } else {
        this.searchResultList = []
      }
    },
  },
  watch: {},
  components: { chargeButton },
}
</script>
<style lang="scss" scoped>
.select-charge-wrap {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;

  .search-input {
    margin: 16rpx 32rpx;
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 8rpx;
    padding: 0 28rpx;

    .icon-search {
      margin-right: 20rpx;
      color: #bfbfbf;
      width: 32rpx;
      height: 32rpx;
    }

    .input {
      width: 600rpx;
      height: 76rpx;
      font-size: 28rpx;
    }
  }

  .projects-wrap {
    font-size: 30rpx;
    line-height: 30rpx;
    flex-grow: 2;
    overflow-y: scroll;
    .item {
      padding: 32rpx;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      background: #fff;
      .left-infos {
        display: flex;
        width: 356rpx;
        font-size: 28rpx;
        color: #191919;
        line-height: 1;
        flex-direction: column;

        view {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-height: 1.4;
        }

        span {
          font-size: 24rpx;
          color: #595959;
          padding-top: 8rpx;
        }
      }

      .right-infos {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .checkBox {
          margin-left: 64rpx;
        }
      }
    }
  }

  .bottom-wrap {
    padding: 16rpx 32rpx;
    display: flex;
    justify-content: space-between;
    background: #fff;
    border-top: 1rpx solid #e5e5e5;
  }
}
</style>
