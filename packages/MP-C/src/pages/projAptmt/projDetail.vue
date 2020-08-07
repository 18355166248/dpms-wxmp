<template>
  <scroll-view class="content" scroll-y>
    <view class="compDesc">
      <view class="compDescContent">
        <p class="projTitle">
          {{ item.itemName }}
        </p>
        <p class="projDesc">
          {{ item.itemBriefIntroduction }}
        </p>
      </view>
    </view>
    <view class="storeContent">
      <text class="storeTitle">可用门店</text>
      <view
        class="storeList"
        v-for="i in institutionList"
        :key="i.appointmentInstitutionId"
      >
        <view class="storeCard">
          <view class="storeCardTitle"
            >{{ i.institutionName }} &nbsp;&nbsp;&nbsp;
            {{ i.institutionPhoneNumber }}</view
          >
          <view class="storeCardAddress"
            ><span class="iconfont icon-location"></span>
            {{ i.institutionAddress }}</view
          >
          <view class="storeCardTime"
            ><span class="iconfont icon-time"></span>
            {{ i.businessHours }}</view
          >
          <view
            class="storeCardAptmt"
            v-show="i.canAppointment"
            @click="
              toUrl(
                '/pages/projAptmt/projAptmt?appointmentInstitutionId=' +
                  i.appointmentInstitutionId,
              )
            "
            >预 约</view
          >
        </view>
      </view>
    </view>
    <view class="detail">
      <text class="detailTitle">详情介绍</text>
      <view class="richText">{{ item.itemDetailIntroduction }}</view>
    </view>
    <view class="descr">
      <text class="descrTitle">温馨提示</text>
      <view class="descrContent">
        <text v-for="(t, i) in tips" :key="i"> {{ (i + 1) }}.{{ t }} </text>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import institutionAPI from '@/APIS/institution/institution.api'
import { getStorage, setStorage, STORAGE_KEY } from '@/utils/storage'
const medicalInstitution = getStorage(STORAGE_KEY.MEDICALINSTITUTION)

export default {
  data() {
    return {
      item: [],
      institutionList: [],
      tips: [],
    }
  },
  onLoad() {
    this.init()
  },
  methods: {
    init() {
      institutionAPI
        .getProjDetail({
          medicalInstitutionId: medicalInstitution.medicalInstitutionId,
          appointmentItemId: 1,
        })
        .then((res) => {
          this.institutionList = res.data.institutionList
          this.item = res.data.item
          this.tips = res.data.tips
        })
    },
    toUrl(url) {
      this.$utils.push({
        url,
      })
    },
  },
  components: {},
}
</script>

<style scoped>
.content {
  margin: 0 auto;
  height: 100%;
}
.compDesc {
  width: 750rpx;
  height: 150rpx;
  background: #5cbb89;
}
.compDescContent {
  width: 686rpx;
  height: 256rpx;
  top: 48rpx;
  left: 32rpx;
  position: relative;
  background: #feffff;
  border-radius: 8rpx;
  box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.09);
}
.projTitle {
  width: 204rpx;
  height: 44rpx;
  font-size: 34rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  text-align: left;
  color: rgba(0, 0, 0, 0.9);
  line-height: 44rpx;
  padding-top: 32rpx;
  padding-left: 24rpx;
}
.projDesc {
  width: 654rpx;
  height: 132rpx;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  text-align: left;
  color: rgba(0, 0, 0, 0.65);
  line-height: 44rpx;
  padding-top: 24rpx;
  padding-left: 24rpx;
}
.storeContent {
  width: 684rpx;
  margin-left: 32rpx;
  margin-top: 188rpx;
}
.storeTitle {
  width: 136rpx;
  height: 44rpx;
  font-size: 34rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  color: rgba(0, 0, 0, 0.9);
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
  background: url(https://medcloud.oss-cn-shanghai.aliyuncs.com/dental/saas/mini-app/icon.png)
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
.detail {
  width: 394rpx;
  margin-top: 48rpx;
}
.detailTitle {
  width: 136rpx;
  height: 44rpx;
  font-size: 34rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  line-height: 44rpx;
  color: rgba(0, 0, 0, 0.9);
  margin-left: 24rpx;
}
.richText {
  margin-left: 24rpx;
  margin-top: 32rpx;
  width: 702rpx;
  border-radius: 8rpx;
}
.descr {
  width: 394rpx;
  margin-top: 48rpx;
}
.descrTitle {
  width: 136rpx;
  height: 44rpx;
  font-size: 34rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  line-height: 44rpx;
  color: rgba(0, 0, 0, 0.9);
  margin-left: 24rpx;
}
.descrContent {
  display: flex;
  flex-direction: column;
  width: 702rpx;
  margin-left: 24rpx;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  text-align: left;
  color: rgba(0, 0, 0, 0.65);
  line-height: 44rpx;
  margin-top: 24rpx;
  margin-bottom: 58rpx;
}
</style>
