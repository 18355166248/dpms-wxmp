<template>
  <movable-area>
    <movable-view
      :x="x"
      :y="y"
      direction="all"
      @change="onChange"
      @click="toUrl('/pages/projAptmt/projAptmt')"
      class="aptmt"
      v-show="!hide"
      ><span class="iconfont icon-time"></span
    ></movable-view>
    <scroll-view class="content" scroll-y @scrolltolower="loadMoreList">
      <view class="banner">
        <swiper class="swiper banner" indicator-dots autoplay>
          <swiper-item
            class="alignCenter"
            v-for="b in bannerList"
            :key="b.bannerId"
          >
            <image
              class="bannerImg"
              mode="aspectFit"
              :src="b.imageUrl"
              :title="b.description"
              @click="toUrl(b.linkUrl)"
            />
          </swiper-item>
        </swiper>
      </view>
      <view class="compDesc">
        <swiper class="swiper compDescImg" autoplay>
          <swiper-item
            class="alignCenter"
            v-for="(p, i) in institutionIntroduce.introduceImageUrls"
            :key="i"
          >
            <img class="compDescImg" mode="aspectFit" :src="p" />
          </swiper-item>
        </swiper>
        <view class="compDescContent">
          <p class="compDescContentDesc">
            {{ institutionIntroduce.briefIntroduction || '' }}
          </p>
          <p class="compDescMore">更多详情 ></p>
        </view>
      </view>
      <view class="proj">
        <view class="projContent">
          <text class="projTitle">项目</text>
          <view class="projBtn" @click="toUrl('/pages/projAptmt/projAptmt')"
            >更多</view
          >
        </view>
        <view class="cardList">
          <swiper
            class="swiper"
            display-multiple-items="displayMultipleItems"
            next-margin="10rpx"
          >
            <swiper-item v-for="i in itemList" :key="i.appointmentItemId">
              <view class="card">
                <view class="cardContent">
                  <text class="cardTitle">{{ i.itemName }}</text>
                  <view
                    class="cardBtn"
                    v-show="i.canAppointment"
                    @click="handleProjAptmt(i.appointmentItemId)"
                    >预约</view
                  >
                </view>
                <view class="cardDesc">{{ i.itemBriefIntroduction }}</view>
                <view class="cardImg">
                  <img mode="aspectFit" :src="i.itemThumbnailUrl" />
                </view>
              </view>
            </swiper-item>
          </swiper>
        </view>
      </view>
      <view class="store">
        <view class="storeContent">
          <text class="storeTitle">门店</text>
          <view
            class="storeList"
            v-for="s in storeList"
            :key="s.appointmentInstitutionId"
          >
            <view class="storeCard">
              <view class="storeCardTitle"
                >{{ s.institutionName }} &nbsp;&nbsp;&nbsp;{{
                  s.institutionPhoneNumber
                }}</view
              >
              <view class="storeCardAddress"
                ><span class="iconfont icon-location"></span>
                {{ s.institutionAddress }}</view
              >
              <view class="storeCardTime"
                ><span class="iconfont icon-time"></span>
                {{ s.institutionAddress }}</view
              >
              <view
                class="storeCardAptmt"
                v-show="s.canAppointment"
                @click="
                  toUrl(
                    '/pages/projAptmt/projAptmt?appointmentInstitutionId=' +
                      s.appointmentInstitutionId,
                  )
                "
                >预 约</view
              >
            </view>
          </view>
          <load-more :status="loadStatus"></load-more>
        </view>
      </view>
    </scroll-view>
  </movable-area>
</template>

<script>
import institutionAPI from '@/APIS/institution/institution.api'
import { getStorage, setStorage, STORAGE_KEY } from '@/utils/storage'
const medicalInstitution = getStorage(STORAGE_KEY.MEDICALINSTITUTION)
const staff = getStorage(STORAGE_KEY.STAFF)

export default {
  data() {
    return {
      bannerList: [],
      institutionIntroduce: {},
      itemList: [],
      storeList: [],
      x: 0,
      y: 0,
      hide: true,
      loadStatus: 'loading',
      currentPage: 1,
      total: 0,
      size: 3,
      displayMultipleItems: 1,
    }
  },
  created() {
    const self = this
    uni.getSystemInfo({
      success: function (res) {
        self.y = res.windowHeight - 60
        self.x = res.windowWidth
        self.hide = false
      },
    })
    uni.setNavigationBarTitle({
      title: medicalInstitution.medicalInstitutionDTO.medicalInstitutionName,
    })
  },
  onLoad() {
    this.init()
  },
  methods: {
    init() {
      institutionAPI
        .getInstitutionInfo({
          medicalInstitutionId: medicalInstitution.medicalInstitutionId,
        })
        .then((res) => {
          this.bannerList = res.data.bannerList
          this.institutionIntroduce = res.data.institutionIntroduce
        })
      institutionAPI
        .getProjList({
          medicalInstitutionId: medicalInstitution.medicalInstitutionId,
        })
        .then((res) => {
          this.itemList = res.data.itemList
          if (this.itemList >= 2) {
            this.displayMultipleItems = 2
          } else {
            this.displayMultipleItems = 1
          }
        })
      institutionAPI
        .getStoreList({
          medicalInstitutionId: medicalInstitution.medicalInstitutionId,
          current: this.currentPage,
          size: this.size,
        })
        .then((res) => {
          this.storeList = res.data.institutionList
          this.total = res.data.total
          if (this.storeList.length < this.total) {
            this.loadStatus = 'more'
          } else {
            this.loadStatus = 'noMore'
          }
        })
    },
    loadMoreList() {
      if (this.loadStatus === 'loading') return
      if (this.storeList.length >= this.total) return
      this.loadStatus = 'loading'
      ++this.currentPage
      this.loadData()
    },
    loadData() {
      institutionAPI
        .getStoreList({
          medicalInstitutionId: medicalInstitution.medicalInstitutionId,
          current: this.currentPage,
          size: this.size,
        })
        .then((res) => {
          this.storeList = this.storeList.concat(res.data.institutionList)
          this.total = res.data.total
          if (this.storeList.length < this.total) {
            this.loadStatus = 'more'
          } else {
            this.loadStatus = 'noMore'
          }
        })
    },
    handleProjAptmt(appointmentItemId) {
      if (!staff) {
        this.$utils.replace({ url: '/pages/login/index' })
      }
      const { toUrl } = this
      institutionAPI
        .checkPorjCanAptmt({
          medicalInstitutionId: medicalInstitution.medicalInstitutionId,
          appointmentItemId,
        })
        .then((res) => {
          if (res.data.canAppointment) {
            toUrl('/pages/appoint/index?itemId=' + appointmentItemId)
            return
          }
          toUrl(
            '/pages/docAptmt/docAptmt?appointmentItemId=' + appointmentItemId,
          )
        })
    },
    toUrl(url) {
      this.$utils.push({
        url,
      })
    },
    onChange(e) {
      this.$nextTick(function () {
        this.x = e.detail.x
        this.y = e.detail.y
      })
    },
  },
  components: {},
}
</script>

<style scoped>
.content {
  height: 100%;
}
.alignCenter {
  text-align: center;
}
.banner {
  width: 750rpx;
  height: 296rpx;
}
.bannerImg {
  height: 100%;
}
.compDesc {
  width: 750rpx;
  height: 488rpx;
  margin-top: 64rpx;
}
.compDescImg {
  width: 750rpx;
  height: 296rpx;
}
.compDescContent {
  width: 686rpx;
  height: 232rpx;
  top: -50rpx;
  left: 32rpx;
  position: relative;
  background: #feffff;
  border-radius: 8px;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.09);
}
.compDescContentDesc {
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  color: rgba(0, 0, 0, 0.9);
  line-height: 44rpx;
  padding: 24rpx;
}
.compDescMore {
  height: 36rpx;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  text-align: right;
  color: #5cbb89;
  line-height: 36rpx;
  padding-right: 35rpx;
  margin-top: 90rpx;
}
.proj {
  margin: 64rpx auto;
  height: 436rpx;
  width: 686rpx;
  background: url(https://medcloud.oss-cn-shanghai.aliyuncs.com/dental/saas/mini-app/compBg.png)
    no-repeat center;
}
.projContent {
  padding-top: 28rpx;
  margin-left: 24rpx;
}
.projTitle {
  width: 72rpx;
  height: 44rpx;
  font-size: 36rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  color: #fafafa;
  line-height: 44rpx;
}
.projBtn {
  float: right;
  width: 94rpx;
  height: 44rpx;
  border: 2rpx solid #fafafa;
  border-radius: 26rpx;
  margin-right: 24rpx;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  text-align: center;
  color: #ffffff;
  line-height: 42rpx;
}
.cardList {
  padding-top: 24rpx;
  padding-right: 24rpx;
  padding-left: 24rpx;
}
.card {
  width: 306rpx;
  height: 312rpx;
  background: #feffff;
  border-radius: 8px;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.09);
}
.cardContent {
  width: 274rpx;
  height: 36rpx;
  padding: 16rpx;
}
.cardTitle {
  width: 112rpx;
  height: 36rpx;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  color: rgba(0, 0, 0, 0.9);
  line-height: 36rpx;
}
.cardBtn {
  width: 96rpx;
  height: 38rpx;
  background: #5cbb89;
  border-radius: 20rpx;
  float: right;
  font-size: 24rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  text-align: center;
  color: #ffffff;
}
.cardDesc {
  width: 274rpx;
  height: 72rpx;
  font-size: 24rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  text-align: left;
  color: rgba(0, 0, 0, 0.45);
  line-height: 36rpx;
  margin: 12rpx;
}
.cardImg {
  width: 274rpx;
  height: 138rpx;
  margin: 16rpx;
}
.cardImg > img {
  width: 100%;
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
.aptmt {
  width: 78rpx;
  height: 78rpx;
  background: linear-gradient(304deg, #74d1a0 11%, #5cbb89 84%);
  box-shadow: 0rpx 26rpx 72rpx 0rpx #b4e0c9;
  border-radius: 200rpx;
  position: fixed;
  bottom: 26rpx;
  right: 0;
  color: #feffff;
}
.aptmt > .icon-time {
  font-size: 50rpx;
  position: relative;
  left: 16rpx;
  top: 12rpx;
}

movable-area {
  width: 100%;
  height: 100%;
}

movable-view {
  z-index: 9999;
}
</style>
