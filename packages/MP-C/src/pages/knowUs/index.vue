<template>
  <scroll-view class="knowUs" scroll-y>
    <view class="knowUs-title">
      <text>$机构名称</text>
    </view>
    <view class="knowUs-img">
      <img
        mode="scaleFit"
        src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1930662946,3376692344&fm=26&gp=0.jpg"
      />
    </view>
    <view class="store">
      <view class="storeContent">
        <view class="storeTop">
          <text class="storeTitle">门店</text>
          <view class="storeBtn" @click="toUrl('/pages/docAptmt/docAptmt')">
            更多 >
          </view>
        </view>
        <view class="storeList" v-for="s in storeList" :key="s.institutionId">
          <view class="storeCard">
            <view class="storeCardTitle">
              {{ s.institutionName }} &nbsp;&nbsp;&nbsp;
              {{ s.institutionPhoneNumber }}
            </view>
            <view class="storeCardAddress">
              <span class="iconfont icon-location"></span>
              {{ s.institutionAddress }}
            </view>
            <view class="storeCardTime">
              <span class="iconfont icon-time"></span>
              {{ s.institutionAddress }}
            </view>
            <view class="storeCardAptmt">预 约</view>
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
import institutionAPI from '@/APIS/institution/institution.api'
const medicalInstitution = uni.getStorageSync('medicalInstitution')
export default {
  data() {
    return {
      storeList: [],
      introduceImgs: [
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596709833912&di=e299594afa60fbe4f85ba148f288abf9&imgtype=0&src=http%3A%2F%2Ft8.baidu.com%2Fit%2Fu%3D1484500186%2C1503043093%26fm%3D79%26app%3D86%26f%3DJPEG%3Fw%3D1280%26h%3D853',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596709833911&di=5a1df450608f0065f3745609d8eacf4f&imgtype=0&src=http%3A%2F%2Ft9.baidu.com%2Fit%2Fu%3D3363001160%2C1163944807%26fm%3D79%26app%3D86%26f%3DJPEG%3Fw%3D1280%26h%3D830',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596709894913&di=943388c61c02031888537b3ef1817928&imgtype=0&src=http%3A%2F%2Ft9.baidu.com%2Fit%2Fu%3D2266751744%2C4253267866%26fm%3D79%26app%3D86%26f%3DJPEG%3Fw%3D1280%26h%3D854',
      ],
    }
  },
  onLoad() {
    this.init()
  },
  methods: {
    init() {
      institutionAPI
        .getStoreList({
          medicalInstitutionId: medicalInstitution.medicalInstitutionId || 1,
        })
        .then((res) => {
          this.storeList = res.data.institutionList
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
  padding: 40rpx 20rpx;
  .knowUs-title {
    text-align: center;
    font-size: 60rpx;
    font-weight: 600;
    margin-bottom: 40rpx;
  }
  .knowUs-img {
    margin-bottom: 40rpx;
    img {
      width: 100%;
    }
  }
  .store {
    margin-top: 16rpx;
  }
  .storeTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .storeTitle {
    font-size: 36rpx;
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
  .knowUs-introduce {
    margin-top: 40rpx;
    width: 730rpx;
    img {
      width: 345rpx;
      height: 300rpx;
      margin-bottom: 20rpx;
      margin-right: 20rpx;
    }
  }
}
</style>
