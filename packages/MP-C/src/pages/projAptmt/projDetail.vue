<template>
  <scroll-view class="content" scroll-y>
    <view class="store">
      <view class="storeContent">
        <text class="storeTitle">门店</text>
        <view class="storeBtn">更多 ></view>
        <view class="storeList">
          <view class="storeCard">
            <view class="storeCardTitle">XXXXXX门诊 201-5432090</view>
            <view class="storeCardAddress"
              ><span class="iconfont icon-location"></span>
              上海市桂林路23号</view
            >
            <view class="storeCardTime"
              ><span class="iconfont icon-time"></span>
              周二~周日，9:00-21:00</view
            >
            <view class="storeCardAptmt">预 约</view>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import institutionAPI from '@/APIS/institution/institution.api'

export default {
  data() {
    return {
      projList: [],
      selectedValue: {},
      filterStoreList: [],
      keyWord: '',
      currentPage: 1,
      total: 0,
    }
  },
  onLoad() {
    this.init()
    this.emitPullDownRefresh()
  },
  onPullDownRefresh() {
    this.currentPage = 1
    this.loadData()
  },
  onReachBottom() {
    if (this.projList.length < this.total) {
      this.current += 1
      this.loadData()
    }
  },

  methods: {
    init() {
      institutionAPI
        .getFilterStoreList({
          medicalInstitutionId: medicalInstitution.medicalInstitutionId,
        })
        .then((res) => {
          this.projList = res.data
        })
    },
    loadData() {
      institutionAPI
        .getInnerProjList({
          medicalInstitutionId: medicalInstitution.medicalInstitutionId,
          filterInstitutionId: this.selectedValue.filterInstitutionId,
          searchParam: keyWord,
          current: this.currentPage,
          size: 10,
        })
        .then((res) => {
          this.projList = res.data.itemList
          this.total = res.data.total
        })
    },
    onFilterOption(e) {
      this.selectedValue = e.target.value
    },
    emitPullDownRefresh() {
      uni.startPullDownRefresh()
    },
  },
  computed: {
    pickerText() {
      return this.filterStoreList[this.selectedValue].institutionName
    },
  },
  components: {},
}
</script>

<style>
.content {
  margin: 0 auto;
  height: 100%;
}
.store {
  height: 464rpx;
  margin-top: 16rpx;
}
.storeContent {
  width: 684rpx;
  height: 36rpx;
  margin-left: 32rpx;
}
.storeTitle {
  width: 72rpx;
  height: 44rpx;
  font-size: 36rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  line-height: 44rpx;
}
.storeBtn {
  height: 36rpx;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: right;
  color: rgba(0, 0, 0, 0.5);
  padding-top: 10rpx;
  float: right;
}
.storeList {
  width: 700rpx;
  margin-top: 32rpx;
}
.storeCard {
  background: url(https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596003351254&di=d7cde5f423850f119e915ffee9da5bae&imgtype=0&src=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_match%2F0%2F12017084876%2F0.jpg)
    no-repeat;
  background-size: 160rpx 120rpx;
  height: 186rpx;
  width: 700rpx;
  background-position: 460rpx 0rpx;
  border-radius: 8rpx;
  box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.09);
}
.storeCardTitle {
  width: 450rpx;
  height: 42rpx;
  font-size: 34rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  text-align: left;
  color: rgba(0, 0, 0, 0.9);
  line-height: 42rpx;
  padding-top: 24rpx;
  padding-left: 24rpx;
}
.storeCardAddress {
  height: 36rpx;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  text-align: left;
  color: rgba(0, 0, 0, 0.5);
  line-height: 36rpx;
  padding-top: 16rpx;
  padding-left: 24rpx;
}
.storeCardTime {
  height: 36rpx;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  text-align: left;
  color: rgba(0, 0, 0, 0.5);
  line-height: 36rpx;
  padding-top: 8rpx;
  padding-left: 24rpx;
}
.storeCardAptmt {
  width: 130rpx;
  height: 56rpx;
  background: #ffffff;
  border: 2rpx solid #5cbb89;
  border-radius: 28rpx;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  text-align: center;
  color: #5cbb89;
  line-height: 48rpx;
  position: relative;
  top: -78rpx;
  left: 546rpx;
}
</style>
