<template>
  <scroll-view class="content" scroll-y>
    <view class="banner">
      <swiper
        class="swiper banner"
        indicator-dots
        autoplay
        v-for="b in bannerList"
        :key="b.bannerId"
      >
        <swiper-item class="alignCenter">
          <image
            class="bannerImg"
            mode="aspectFit"
            :src="b.imageUrl"
            :title="b.description"
            @click="toUrl(b.linkUrl)"
          />
        </swiper-item>
        <!-- <swiper-item class="alignCenter">
          <image
            class="bannerImg"
            mode="aspectFit"
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595843250493&di=ae2861d58b2bd6ad784fe9e4caa4bab1&imgtype=0&src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Fface%2Fe93c24dc4a4cfdd228524ce87ab8117406fe0c97.jpg"
          />
        </swiper-item>
        <swiper-item class="alignCenter">
          <image
            class="bannerImg"
            mode="aspectFit"
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595844294412&di=d53e27dc81240a496500bb20f0189bb6&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fq_mini%2Cc_zoom%2Cw_640%2Fimages%2F20171106%2F8e9d50ae61f14a8983c9400c1db6d59f.jpeg"
          />
        </swiper-item>
        <swiper-item class="alignCenter">
          <image
            class="bannerImg"
            mode="aspectFit"
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595844395668&di=6c473d00bf3a03f6d6a9e11c901816a6&imgtype=0&src=http%3A%2F%2Fimg.bqatj.com%2Fimg%2Fb6b2d754a722aa35.jpg"
          />
        </swiper-item> -->
      </swiper>
    </view>
    <view class="compDesc">
      <swiper
        class="swiper compDescImg"
        autoplay
        v-for="(p, i) in institutionIntroduce.introduceImageUrls"
        :key="i"
      >
        <swiper-item class="alignCenter">
          <img class="compDescImg" mode="aspectFit" :src="p" />
        </swiper-item>
        <!-- <swiper-item class="alignCenter">
          <img
            class="compDescImg"
            mode="aspectFit"
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595846007191&di=49f7640038b79adbb562fc0ad1e4ab9d&imgtype=0&src=http%3A%2F%2Fimage.suning.cn%2Fuimg%2Fsop%2Fcommodity%2F117970640468680470958160_x.jpg"
          />
        </swiper-item> -->
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
        <view class="projBtn" @click="toUrl('/pages/docAptmt/docAptmt')"
          >更多</view
        >
      </view>
      <view class="cardList">
        <swiper
          class="swiper"
          display-multiple-items="2"
          next-margin="10rpx"
          v-for="i in itemList"
          :key="i.appointmentItemId"
        >
          <swiper-item>
            <view class="card">
              <view class="cardContent">
                <text class="cardTitle">{{ i.itemName }}</text>
                <view class="cardBtn">预约</view>
              </view>
              <view class="cardDesc">{{ i.itemBriefIntroduction }}</view>
              <view class="cardImg">
                <img mode="aspectFit" :src="i.itemThumbnailUrl" />
              </view>
            </view>
          </swiper-item>
          <!-- <swiper-item>
            <view class="card">
              <view class="cardContent">
                <text class="cardTitle">口腔预约2</text>
                <view class="cardBtn">预约</view>
              </view>
              <view class="cardDesc"
                >任意门店可约，口腔全面检查美好口腔牙齿美好…</view
              >
              <view class="cardImg">
                <img
                  mode="aspectFit"
                  src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595847895031&di=8aee312e80d2f572504d33fc18072511&imgtype=0&src=http%3A%2F%2Fimg2.xitongzhijia.net%2F170413%2F76-1F413114454146.png"
                />
              </view>
            </view>
          </swiper-item>
          <swiper-item>
            <view class="card">
              <view class="cardContent">
                <text class="cardTitle">口腔预约3</text>
                <view class="cardBtn">预约</view>
              </view>
              <view class="cardDesc"
                >任意门店可约，口腔全面检查美好口腔牙齿美好…</view
              >
              <view class="cardImg">
                <img
                  mode="aspectFit"
                  src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595847895031&di=8aee312e80d2f572504d33fc18072511&imgtype=0&src=http%3A%2F%2Fimg2.xitongzhijia.net%2F170413%2F76-1F413114454146.png"
                />
              </view>
            </view>
          </swiper-item> -->
        </swiper>
      </view>
    </view>
    <view class="store">
      <view class="storeContent">
        <text class="storeTitle">门店</text>
        <view class="storeBtn" @click="toUrl('/pages/docAptmt/docAptmt')"
          >更多 ></view
        >
        <view
          class="storeList"
          v-for="s in storeList.limitedList(3)"
          :key="s.institutionId"
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
            <view class="storeCardAptmt">预 约</view>
          </view>
        </view>
      </view>
    </view>
    <movable-area out-of-bounds>
      <!-- <movable-view :x="x" :y="y" direction="all" @change="onChange"
        >text</movable-view
      > -->
      <view class="aptmt"><span class="iconfont icon-time"></span></view>
    </movable-area>
  </scroll-view>
</template>

<script>
import institutionAPI from '@/APIS/institution/institution.api'
const medicalInstitution = uni.getStorageSync('medicalInstitution')

export default {
  data() {
    return {
      bannerList: [],
      institutionIntroduce: {},
      itemList: [],
      storeList: [],
      x: 0,
      y: 0,
      old: {
        x: 0,
        y: 0,
      },
    }
  },
  onLoad() {
    this.init()
  },
  computed: {
    limitedList: function (length) {
      return this.storeList.length <= length
        ? this.storeList
        : this.storeList.slice(0, --length)
    },
  },
  methods: {
    async init() {
      let [err, res] = await this.$utils.asyncTasks(
        institutionAPI.getInstitutionInfo({
          medicalInstitutionId: medicalInstitution.medicalInstitutionId || 1,
        }),
      )
      if (res) {
        this.bannerList = res.bannerList
        this.institutionIntroduce = res.institutionIntroduce
      }
      ;[err, res] = await this.$utils.asyncTasks(
        institutionAPI.getProjList({
          medicalInstitutionId: medicalInstitution.medicalInstitutionId || 1,
        }),
      )
      if (res) {
        this.itemList = res.itemList
      }
      ;[err, res] = await this.$utils.asyncTasks(
        institutionAPI.getStoreList({
          medicalInstitutionId: medicalInstitution.medicalInstitutionId || 1,
        }),
      )
      if (res) {
        this.storeList = res.institutionList
      }
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

<style>
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
  width: 88rpx;
  height: 80rpx;
  background: linear-gradient(304deg, #74d1a0 11%, #5cbb89 84%);
  border-radius: 42rpx 0rpx 0rpx 42rpx;
  box-shadow: 0rpx 10rpx 28rpx 0rpx #b4e0c9;
  position: fixed;
  bottom: 26rpx;
  right: 0;
  color: #feffff;
}
.aptmt > .icon-time {
  font-size: 50rpx;
  position: relative;
  left: 30rpx;
  top: 12rpx;
}
</style>
