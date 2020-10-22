<template>
  <scroll-view class="knowUs" scroll-y>
    <view class="knowUs-title">
      <text>{{ medicalInstitutionName }}</text>
    </view>
    <view class="knowUs-detail">
      <rich-text :nodes="introduceDetail"></rich-text>
    </view>
    <view class="store">
      <view class="storeContent">
        <view class="storeTop">
          <text class="storeTitle">可用门店</text>
        </view>
        <view class="storeList" v-for="s in storeList" :key="s.institutionId">
          <view class="storeCard">
            <view class="storeCardTitle">
              <text>{{
                s.institutionName.length > 6
                  ? s.institutionName.substring(0, 6) + `...`
                  : s.institutionName
              }}</text>
              <text style="float: right;">{{ s.institutionPhoneNumber }}</text>
            </view>
            <View class="storeCardAddress">
              <span class="iconfont icon-location"></span>
              {{
                s.institutionAddress.length > 35
                  ? s.institutionAddress.substring(0, 35) + `...`
                  : s.institutionAddress
              }}
            </View>
            <view class="storeCardTime">
              <span class="iconfont icon-time"></span>
              {{
                s.businessHours.length > 14
                  ? s.businessHours.substring(0, 14) + `...`
                  : s.businessHours
              }}
            </view>
            <view
              class="storeCardAptmt"
              v-if="s.canAppointment"
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
export default {
  data() {
    return {
      introduceDetail: '',
      storeList: [],
      introduceImgs: [],
      medicalInstitutionName: '',
    }
  },
  onShareAppMessage(res) {
    return {
      path: '/pages/knowUs/index',
    }
  },
  onLoad() {
    this.init()
  },
  methods: {
    init() {
      const medicalInstitution = uni.getStorageSync('medicalInstitution')
      // this.medicalInstitutionName =
      //   medicalInstitution.medicalInstitutionDTO.medicalInstitutionName
      introduceAPI
        .getIntroduceInfo({
          medicalInstitutionId: medicalInstitution.medicalInstitutionId || 1,
        })
        .then((res) => {
          if (res.code === 0) {
            this.introduceImgs = res.data.introduceImageUrls || []
            this.introduceDetail = res.data.detailIntroduction
              ? this.richTextHander(res.data.detailIntroduction)
              : ''
            this.medicalInstitutionName = res.data.medicalInstitutionName
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

    toUrl(url) {
      this.$utils.push({
        url,
      })
    },

    richTextHander(richText) {
      const newRichText = richText.replace(
        /(<img\s)([^>]*)(\/>)/g,
        (str, r1, r2, r3) => {
          if (r2.match(/(style=")([^"]*)(")/g)) {
            const replaceStr = r2.replace(
              /(style=")([^"]*)(")/g,
              (rstr, s1, s2, s3) => {
                return `${s1}width:100%;${s2}${s3}`
              },
            )
            return `${r1}${replaceStr}${r3}`
          } else {
            return `${r1}style="width:100%" ${r2}${r3}`
          }
        },
      )
      return newRichText
    },
  },
}
</script>

<style lang="scss" scoped scroll-y>
.knowUs {
  box-sizing: border-box;
  padding: 32rpx 24rpx;
  .knowUs-title {
    font-size: 34rpx;
    font-family: PingFangSC, PingFangSC-Medium;
    margin-bottom: 32rpx;
    text-align: center;
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
    position: relative;
    background: url(https://medcloud.oss-cn-shanghai.aliyuncs.com/dental/saas/mini-app/logo-1.png)
      no-repeat;
    background-size: 160rpx 120rpx;
    height: 216rpx;
    background-position: 460rpx 0rpx;
    border-radius: 8rpx;
    box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.09);
    background-color: #fff;
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
  .icon-location {
    position: absolute;
    left: 24rpx;
  }
  .storeCardAddress {
    height: 72rpx;
    font-size: 28rpx;
    width: 488rpx;
    text-align: left;
    color: rgba(0, 0, 0, 0.5);
    line-height: 36rpx;
    padding-top: 16rpx;
    padding-left: 62rpx;
    overflow: hidden;
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
    position: absolute;
    top: calc(50% - 30rpx);
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
  .iconfont {
    margin-right: 8rpx;
  }
}
</style>
