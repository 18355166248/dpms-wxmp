<template>
  <scroll-view class="knowUs" scroll-y>
    <view class="knowUs-title">
      <text>详情介绍</text>
    </view>
    <view class="knowUs-detail">
      <rich-text nodes="{{introduceDetail}}"></rich-text>
    </view>
    <view class="store">
      <view class="storeContent">
        <view class="storeTop">
          <text class="storeTitle">可用门店</text>
        </view>
        <view class="storeList" v-for="s in storeList" :key="s.institutionId">
          <view class="storeCard">
            <view class="storeCardTitle">
              {{ s.institutionName }} &nbsp;&nbsp;&nbsp;
              {{ s.institutionPhoneNumber || '' }}
            </view>
            <View class="storeCardAddress">
              <span class="iconfont icon-location"></span>
              {{ s.institutionAddress }}
            </View>
            <view class="storeCardTime">
              <span class="iconfont icon-time"></span>
              {{ s.institutionAddress }}
            </view>
            <view
              class="storeCardAptmt"
              @click="
                toUrl(
                  '/pages/projAptmt/projAptmt?appointmentInstitutionId=' +
                    s.appointmentInstitutionId,
                )
              "
            >
              预 约
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="knowUs-introduce">
      <img mode="scaleToFill" v-for="src in introduceImgs" :src="src" />
    </view>
  </scroll-view>
</template>

<script>
import introduceAPI from '@/APIS/introduce/introduce.api'
const medicalInstitution = uni.getStorageSync('medicalInstitution')
export default {
  data() {
    return {
      introduceDetail: '',
      storeList: [],
      introduceImgs: [],
    }
  },
  onLoad() {
    this.init()
  },
  methods: {
    init() {
      introduceAPI
        .getIntroduceInfo({
          medicalInstitutionId: medicalInstitution.medicalInstitutionId || 1,
        })
        .then((res) => {
          if (res.code === 0) {
            this.introduceImgs = res.data.introduceImageUrls || []
            this.introduceDetail = res.data.detailIntroduction || ''
          }
        })

      introduceAPI
        .getStoreList({
          medicalInstitutionId: medicalInstitution.medicalInstitutionId || 1,
        })
        .then((res) => {
          if (res.code === 0) {
            this.storeList = res.data.institutionList
          }
        })
    },
  },
}
</script>

<style lang="scss" scoped scroll-y>
.knowUs {
  box-sizing: border-box;
  height: 100%;
  background: rgba($color: #000000, $alpha: 0.04);
  padding: 32rpx 24rpx;
  .knowUs-title {
    font-size: 34rpx;
    font-family: PingFangSC, PingFangSC-Medium;
    margin-bottom: 32rpx;
  }
  .knowUs-detail {
    margin-bottom: 48rpx;
  }
  .store {
  }
  .storeTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .storeTitle {
    font-size: 34rpx;
    font-family: PingFangSC, PingFangSC-Medium;
  }
  .storeBtn {
    font-size: 28rpx;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.5);
  }
  .storeList {
    margin-top: 32rpx;
  }
  .storeCard {
    background: url(https://medcloud.oss-cn-shanghai.aliyuncs.com/dental/saas/mini-app/icon.png)
      no-repeat;
    background-size: 160rpx 120rpx;
    height: 186rpx;
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
    display: flex;
    justify-content: center;
    align-items: center;
    width: 130rpx;
    height: 56rpx;
    background: #ffffff;
    border: 2rpx solid #5cbb89;
    border-radius: 28rpx;
    font-size: 28rpx;
    font-family: PingFangSC, PingFangSC-Regular;
    text-align: center;
    color: #5cbb89;
    position: relative;
    top: -78rpx;
    left: 546rpx;
  }
  .knowUs-introduce {
    margin-top: 48rpx;
    width: 716rpx;
    img {
      width: 344rpx;
      height: 260rpx;
      margin-bottom: 14rpx;
      margin-right: 14rpx;
    }
  }
}
</style>
