<template>
  <scroll-view class="content" scroll-y>
    <view class="compDesc">
      <view class="compDescContent">
        <view class="aptmtCard">
          <image :src="doctor.doctorAvatarUrl" />
          <view class="aptmtCardContent">
            <view class="cardTile">{{ doctor.doctorName }}</view>
            <view class="cardDesc">{{ doctor.goodAt }}</view>
          </view>
        </view>
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
          <view class="storeCardTitle">
            <text>{{
              i.institutionName.length > 9
                ? i.institutionName.substring(0, 8) + `...`
                : i.institutionName
            }}</text>
            <text style="float: right;">{{ i.institutionPhoneNumber }}</text>
          </view>
          <view class="storeCardAddress"
            ><span class="iconfont icon-location"></span>
            {{
              i.institutionAddress.length > 18
                ? i.institutionAddress.substring(0, 18) + `...`
                : i.institutionAddress
            }}
          </view>
          <view class="storeCardTime" v-if="i.businessHours"
            ><span class="iconfont icon-time"></span>
            {{
              i.businessHours.length > 18
                ? i.businessHours.substring(0, 18) + `...`
                : i.businessHours
            }}</view
          >
          <view
            class="storeCardAptmt"
            v-show="i.canAppointment"
            @click="
              toUrl(
                `/pages/appoint/index?doctorId=${doctor.doctorId}&shopId=${i.appointmentInstitutionId}`,
              )
            "
            >预 约</view
          >
        </view>
      </view>
    </view>
    <view class="detail">
      <text class="detailTitle">详情介绍</text>
      <view class="richText">
        <rich-text :nodes="detailIntroduction"></rich-text>
      </view>
    </view>
    <view class="descr" v-if="tips.length">
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
import { mapState } from 'vuex'

export default {
  data() {
    return {
      doctor: {
        doctorName: '',
        goodAt: '',
        doctorAvatarUrl: '',
      },
      institutionList: [],
      tips: [],
      params: {},
      detailIntroduction: '',
    }
  },
  onShareAppMessage(res) {
    return {
      path: `/pages/docAptmt/docDetail?appointmentDoctorId=${this.params.appointmentDoctorId}`,
    }
  },
  onLoad(params) {
    this.params = params
    if (!this.MEDICALINSTITUTION) {
      return
    }
    this.init(params)
  },
  onPullDownRefresh() {
    this.init(this.params)
  },
  computed: {
    ...mapState('loginStore', {
      MEDICALINSTITUTION: (state) => state.MEDICALINSTITUTION,
    }),
  },
  watch: {
    MEDICALINSTITUTION(newVal) {
      this.init(this.params)
    },
  },
  methods: {
    init(params) {
      const { appointmentDoctorId } = params
      institutionAPI
        .getDocDetail({
          medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
          appointmentDoctorId,
        })
        .then((res) => {
          this.institutionList = res.data.institutionList
          this.doctor = res.data.doctor
          this.tips = res.data.tips
          this.detailIntroduction = res.data.detailIntroduction
            ? this.richTextHander(res.data.detailIntroduction)
            : ''
        })
      uni.stopPullDownRefresh()
    },
    toUrl(url) {
      institutionAPI
        .checkDocCanAptmt({
          medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
          appointmentDoctorId: this.params.appointmentDoctorId,
        })
        .then((res) => {
          this.$utils.push({
            url,
          })
        })
    },
    richTextHander(richText) {
      return richText.replace(/<img/g, '<img width="100%"')
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
  background: #5cbb89;
}
.compDescContent {
  width: 686rpx;
  top: 48rpx;
  left: 32rpx;
  position: relative;
  background: #feffff;
  border-radius: 8rpx;
  box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.09);
}
.aptmtCard {
  width: 702rpx;
  background: #ffffff;
  border-radius: 8rpx;
  box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
  display: flex;
}
.aptmtCard > image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 200rpx;
  margin-top: 32rpx;
  margin-left: 24rpx;
}
.cardTile {
  font-size: 34rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  text-align: left;
  color: rgba(0, 0, 0, 0.9);
  line-height: 44rpx;
  margin-top: 44rpx;
}
.cardDesc {
  font-size: 28rpx;
  text-align: left;
  word-break: break-all;
  color: rgba(0, 0, 0, 0.5);
  line-height: 44rpx;
  margin-top: 16rpx;
  margin-bottom: 16rpx;
}
.aptmtCardContent {
  width: 502rpx;
  margin-left: 32rpx;
}
.storeContent {
  width: 684rpx;
  margin-left: 32rpx;
  margin-top: 88rpx;
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
  position: relative;
  background: url(https://medcloud.oss-cn-shanghai.aliyuncs.com/dental/saas/mini-app/logo-1.png)
    no-repeat;
  background-size: 152rpx 160rpx;
  height: 186rpx;
  width: 700rpx;
  background-position: 500rpx -35rpx;
  border-radius: 8rpx;
  box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.09);
}
.storeCardTitle {
  width: 520rpx;
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
  position: absolute;
  top: calc(50% - 30rpx);
  left: 546rpx;
}
.detail {
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
  overflow: hidden;
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
  word-break: break-all;
}
</style>
