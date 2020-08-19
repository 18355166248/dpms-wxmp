<template>
  <view class="content">
    <div class="bg" />
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
          <view class="storeCardTitle">
            <text>{{
              i.institutionName.length > 10
                ? i.institutionName.substring(0, 10) + `...`
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
                `/pages/appoint/index?itemId=${item.itemId}&shopId=${i.appointmentInstitutionId}`,
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
    <view class="descr">
      <text class="descrTitle">温馨提示</text>
      <view class="descrContent">
        <text v-for="(t, i) in tips" :key="i"> {{ (i + 1) }}.{{ t }} </text>
      </view>
    </view>
    <view style="height: 48rpx;"></view>
  </view>
</template>

<script>
import institutionAPI from '@/APIS/institution/institution.api'
import { getStorage, setStorage, STORAGE_KEY } from '@/utils/storage'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      item: {
        itemName: '',
        itemBriefIntroduction: '',
      },
      institutionList: [],
      tips: [],
      params: {},
      detailIntroduction: '',
    }
  },
  onShareAppMessage(res) {
    return {
      path: `/pages/projAptmt/projDetail?appointmentItemId=${this.params.appointmentItemId}`,
    }
  },
  onLoad(params) {
    this.params = params
    if (!this.MEDICALINSTITUTION) return
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
      const { appointmentItemId } = params
      institutionAPI
        .getProjDetail({
          medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
          appointmentItemId,
        })
        .then((res) => {
          this.institutionList = res.data.institutionList
          this.item = res.data.item
          this.tips = res.data.tips
          this.detailIntroduction =
            res.data.detailIntroduction || res.data.item.itemDetailIntroduction
          this.detailIntroduction = this.richTextHander(this.detailIntroduction)
        })
      uni.stopPullDownRefresh()
    },
    toUrl(url) {
      institutionAPI
        .checkPorjCanAptmt({
          medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
          appointmentItemId: this.params.appointmentItemId,
        })
        .then((res) => {
          this.$utils.push({
            url,
          })
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
  components: {},
}
</script>

<style scoped>
.content {
  margin: 0 auto;
  width: 750rpx;
  overflow: hidden;
  position: relative;
}
.bg {
  position: absolute;
  width: 2500rpx;
  height: 2500rpx;
  border-radius: 1250rpx;
  top: -2300rpx;
  left: -875rpx;
  background-color: #5cbb89;
  z-index: -1;
}
.compDesc {
  padding: 48rpx 24rpx;
}
.compDescContent {
  background: #feffff;
  border-radius: 8rpx;
  box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.09);
  padding: 24rpx;
}
.projTitle {
  height: 44rpx;
  font-size: 34rpx;
  font-weight: bold;
  text-align: left;
  color: rgba(0, 0, 0, 0.9);
  line-height: 44rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
}
.projDesc {
  font-size: 28rpx;
  text-align: left;
  color: rgba(0, 0, 0, 0.65);
  line-height: 44rpx;
}
.storeContent {
  width: 684rpx;
  margin-left: 32rpx;
}
.storeTitle {
  width: 136rpx;
  height: 44rpx;
  font-size: 34rpx;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.9);
  line-height: 44rpx;
}
.storeBtn {
  height: 36rpx;
  font-size: 28rpx;
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
  width: 500rpx;
  height: 42rpx;
  font-size: 34rpx;
  text-align: left;
  color: rgba(0, 0, 0, 0.9);
  line-height: 42rpx;
  padding-top: 24rpx;
  padding-left: 24rpx;
}
.storeCardAddress {
  height: 36rpx;
  font-size: 28rpx;
  text-align: left;
  color: rgba(0, 0, 0, 0.5);
  line-height: 36rpx;
  padding-top: 16rpx;
  padding-left: 24rpx;
}
.storeCardTime {
  height: 36rpx;
  font-size: 28rpx;
  text-align: left;
  color: rgba(0, 0, 0, 0.5);
  line-height: 36rpx;
  padding-top: 8rpx;
  padding-left: 24rpx;
}
.storeCard .iconfont {
  margin-right: 8rpx;
}
.storeCardAptmt {
  position: absolute;
  width: 130rpx;
  height: 56rpx;
  line-height: 56rpx;
  background: #ffffff;
  border: 2rpx solid #5cbb89;
  border-radius: 28rpx;
  font-size: 28rpx;
  text-align: center;
  color: #5cbb89;
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
  font-weight: bold;
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
  font-weight: bold;
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
  text-align: left;
  color: rgba(0, 0, 0, 0.65);
  line-height: 44rpx;
  margin-top: 24rpx;
  margin-bottom: 58rpx;
}
</style>
