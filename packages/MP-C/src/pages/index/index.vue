<template>
  <movable-area>
    <view class="content" scroll-y>
      <view
        class="nav"
        :style="{
          height: navTop + `px`,
        }"
      >
        <view class="title">{{ appTitle }}</view>
      </view>
      <!-- 主要内容 -->
      <view class="" :style="{ paddingTop: navTop + 'px' }">
        <!-- banner -->
        <swiper
          class="banner"
          indicator-dots
          autoplay
          indicator-color="#ffffff"
          indicator-active-color="#5cbb89"
        >
          <swiper-item
            class="alignCenter"
            v-for="b in bannerList"
            :key="b.bannerId"
            @click="bannerToUrl(b.linkUrl)"
          >
            <image class="bannerImg" :src="b.imageUrl" :title="b.description" />
          </swiper-item>
        </swiper>
        <!-- 详情描述 -->
        <view class="compDesc">
          <p class="compDescContentDesc">
            {{ institutionIntroduce.briefIntroduction || '' }}
          </p>
          <p
            class="compDescMore"
            v-if="institutionIntroduce.briefIntroduction"
            @click="toUrl('/pages/knowUs/index')"
          >
            更多详情
            <span class="iconfont icon-right" style="font-size: 28rpx;"></span>
          </p>
        </view>
        <!-- 项目 -->
        <view class="projectWrap" v-if="projectAppointment === 1">
          <view class="project">项目</view>
          <view class="projectList">
            <view
              class="projectItem"
              v-for="(item, index) in itemList"
              :key="item.appointmentItemId"
              @click.self="
                toUrl(
                  '/pages/projAptmt/projDetail?appointmentItemId=' +
                    item.appointmentItemId,
                )
              "
            >
              <image
                mode="aspectFill"
                :src="item.itemThumbnailUrl"
                class="image"
              ></image>
              <view class="infos">
                <view class="top-infos">
                  <view class="">{{ item.itemName }}</view>
                  <view
                    class="appointBtn"
                    v-if="item.canAppointment && projectAppointment === 1"
                    @click.stop="handleProjAptmt(item)"
                    >预约</view
                  >
                </view>
                <view class="detail">{{ item.itemBriefIntroduction }}</view>
              </view>
            </view>
          </view>
        </view>
        <!-- 门店 -->
        <view class="storeWrap">
          <view class="store">门店</view>
          <view class="storeList">
            <view
              class="storeItem"
              v-for="s in storeList"
              :key="s.appointmentInstitutionId"
            >
              <!-- 水印-->
              <image
                src="../../static/index/watermark.png"
                mode=""
                class="watermark"
              ></image>
              <view class="storeInfos">
                <!-- 门店信息 -->
                <view class="storeBaseInfo">
                  <text class="title">{{ s.institutionName }}</text>
                  <text class="phone">{{ s.institutionPhoneNumber }}</text>
                </view>
                <!-- 门店地址 -->
                <view class="storeAddress">
                  <span class="iconfont icon-location"></span>
                  <span class="address">{{ s.institutionAddress }}</span>
                </view>
                <!-- 门店营业时间  -->
                <view class="storeTime">
                  <span class="iconfont icon-time"></span>
                  <span class="time">{{ s.businessHours }}</span>
                </view>
              </view>
              <view
                class="appointBtn"
                v-if="
                  s.canAppointment &&
                  !(
                    doctorAppointment !== 1 &&
                    projectAppointment !== 1 &&
                    quickAppointment !== 1
                  )
                "
                @click="
                  toUrl(
                    '/pages/projAptmt/projAptmt?&isShowTab=2appointmentInstitutionId=' +
                      s.appointmentInstitutionId,
                  )
                "
              >
                预约
              </view>
            </view>
            <load-more
              :status="loadStatus"
              :contentText="contentText"
              :color="color"
            ></load-more>
          </view>
        </view>
      </view>
    </view>
    <movable-view
      :x="x"
      :y="y"
      direction="all"
      @change="onChange"
      @click="toAppoint"
      class="aptmt"
      v-if="
        !(
          doctorAppointment !== 1 &&
          projectAppointment !== 1 &&
          quickAppointment !== 1
        )
      "
    >
      <span class="iconfont icon-time"></span>
    </movable-view>
    <Notice />
  </movable-area>
</template>

<script>
import customerAPI from '@/APIS/customer/customer.api'
import institutionAPI from '@/APIS/institution/institution.api'
import { getStorage, STORAGE_KEY } from '@/utils/storage'
import { mapState } from 'vuex'
import Notice from './notice'

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
      size: 2,
      displayMultipleItems: 1,
      showMoreBtn: false,
      color: 'rgb(0, 0, 0, 0.5)',
      appTitle: '',
      height: '',
      contentText: {
        contentdown: '加载更多',
        contentrefresh: '正在加载..',
        contentnomore: '没有更多数据了',
      },
      backgroundStyle: 'rgb(92, 187, 137, 0)',
      doctorAppointment: 0,
      projectAppointment: 0,
      quickAppointment: 0,
    }
  },
  onShareAppMessage(res) {
    return {
      path: '/pages/index/index',
    }
  },
  computed: {
    ...mapState('loginStore', {
      MEDICALINSTITUTION: (state) => state.MEDICALINSTITUTION,
    }),
    menuButtonObject() {
      return uni.getMenuButtonBoundingClientRect()
    },
    navTop: function () {
      this.height = this.menuButtonObject.top + this.menuButtonObject.height
      return `${this.menuButtonObject.top + this.menuButtonObject.height + 10}`
    },
  },
  watch: {
    MEDICALINSTITUTION(newVal) {
      uni.startPullDownRefresh()
    },
    scrollTop(newVal) {},
  },
  created() {
    uni.getSystemInfo({
      success: (res) => {
        this.y = res.windowHeight - 60
        this.x = res.windowWidth
        this.hide = false
      },
    })
  },
  onLoad(params) {
    if (!this.MEDICALINSTITUTION) return
    uni.startPullDownRefresh()
    // 测试
    this.init()
    this.getfunctionConfigDetail()
  },
  onPullDownRefresh() {
    this.init()
  },

  onPageScroll({ scrollTop }) {
    let alpha = scrollTop / this.height
    this.backgroundStyle = `rgb(92, 187, 137, ${alpha})`
  },
  onReachBottom() {
    this.loadMoreList()
  },
  methods: {
    getfunctionConfigDetail() {
      customerAPI.getfunctionConfigDetail({}).then((res) => {
        this.doctorAppointment = res.data.doctorAppointment
        this.projectAppointment = res.data.projectAppointment
        this.quickAppointment = res.data.quickAppointment
      })
    },
    init() {
      if (!this.MEDICALINSTITUTION) return
      institutionAPI
        .getInstitutionInfo({
          medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
        })
        .then((res) => {
          this.bannerList = res.data.bannerList
          this.institutionIntroduce = res.data.institutionIntroduce
          if (
            this.institutionIntroduce.briefIntroduction &&
            this.institutionIntroduce.briefIntroduction.length > 70
          ) {
            this.institutionIntroduce.briefIntroduction =
              this.institutionIntroduce.briefIntroduction.substring(0, 70) +
              `...`
          }
          this.appTitle =
            res.data.institutionIntroduce.medicalInstitutionName?.length > 7
              ? res.data.institutionIntroduce.medicalInstitutionName?.substring(
                  0,
                  7,
                ) + `..`
              : res.data.institutionIntroduce.medicalInstitutionName
        })
      institutionAPI
        .getProjList({
          medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
        })
        .then((res) => {
          this.itemList = res.data.itemList
          if (this.itemList.length > 1) {
            this.displayMultipleItems = 2
          } else {
            this.displayMultipleItems = 1
          }
          if (res.data.total > 3) {
            this.showMoreBtn = true
          } else {
            this.showMoreBtn = false
          }
        })
      //初始化重置list和page
      this.storeList = []
      this.currentPage = 1
      institutionAPI
        .getStoreList({
          medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
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
      uni.stopPullDownRefresh()
    },
    toAppoint() {
      if (this.quickAppointment === 1) {
        this.$utils.push({ url: '/pages/appoint/index' })
      } else if (this.projectAppointment === 1) {
        this.$utils.push({ url: '/pages/projAptmt/projAptmt' })
      } else {
        this.$utils.push({ url: '/pages/docAptmt/docAptmt' })
      }
    },
    bannerToUrl(url) {
      if (!url) return
      if (url.indexOf(`http`) !== -1) {
        this.toUrl(`/pages/index/webView?url=${url}`)
      } else {
        this.toUrl(url)
      }
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
          medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
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
    handleProjAptmt({ appointmentItemId, itemId }) {
      uni.showLoading({
        title: '加载中...',
      })
      const { toUrl } = this
      institutionAPI
        .checkPorjCanAptmt({
          medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
          appointmentItemId,
        })
        .then((res) => {
          if (res.data.canAppointment) {
            const canApptInstitutionList = res.data.institutionList.filter(
              (institution) => institution.canAppointment,
            )
            if (canApptInstitutionList.length === 0) {
              this.$utils.show('无可约门店')
            }
            if (canApptInstitutionList.length === 1) {
              toUrl(
                '/pages/appoint/index?itemId=' +
                  itemId +
                  '&isShowTab=2&shopId=' +
                  canApptInstitutionList[0].appointmentInstitutionId,
              )
            }
            if (canApptInstitutionList.length > 1) {
              toUrl(
                '/pages/projAptmt/projAptmt?appointmentItemId=' +
                  appointmentItemId,
              )
            }
          } else {
            this.$utils.show('项目不可预约')
          }
          uni.hideLoading()
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
  components: {
    Notice,
  },
}
</script>

<style scoped lang="scss">
template {
  background-color: #ffffff;
}
.flex {
  display: flex;
}
.content {
  height: 100%;
  .nav {
    position: fixed;
    width: 100%;
    z-index: 99;
    background: #5cbb89;
    .title {
      color: #ffffff;
      font-size: 36rpx;
      position: absolute;
      left: 50%;
      bottom: 20rpx;
      transform: translateX(-50%);
    }
  }
  .banner {
    position: relative;
    margin: 24rpx;
    width: 702rpx;
    height: 252rpx;
    border-radius: 8rpx;
    .alignCenter {
      text-align: center;
    }
    .bannerImg {
      height: 100%;
      width: 100%;
      border-radius: 8rpx;
    }
  }
  .compDesc {
    margin: 24rpx;
    display: flex;
    flex-direction: column;
    padding: 24rpx;
    background: #feffff;
    border-radius: 8rpx;
    box-shadow: 0px 0px 20rpx 0px rgba(0, 0, 0, 0.09);
    .compDescContentDesc {
      font-size: 30rpx;
      font-family: PingFangSC, PingFangSC-Regular;
      color: rgba(0, 0, 0, 0.9);
      line-height: 44rpx;
      word-wrap: break-word;
      word-break: break-all;
      overflow: hidden;
    }
    .compDescMore {
      height: 36rpx;
      font-size: 28rpx;
      font-family: PingFangSC, PingFangSC-Regular;
      text-align: right;
      color: #5cbb89;
    }
  }
  .appointBtn {
    border-radius: 30rpx;
    border: 2rpx solid #5cbb89;
    padding: 10rpx 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    line-height: 28rpx;
    color: #5cbb89;
  }
  .projectWrap {
    margin: 24rpx;
    .project {
      padding: 24rpx 0 32rpx 0;
      font-size: 36rpx;
      font-weight: 500;
    }
    .projectList {
      background-color: #ffffff;
      padding: 0 24rpx;
      border-radius: 8rpx;
      box-shadow: 0px 0px 20rpx 0px rgba(0, 0, 0, 0.09);
      .projectItem {
        display: flex;
        padding: 24rpx 0;
        border-bottom: 2rpx solid rgba(0, 0, 0, 0.15);
        &:last-child {
          border-bottom: none;
        }
        .image {
          width: 184rpx;
          height: 156rpx;
          flex-shrink: 0;
          margin-right: 24rpx;
        }
        .infos {
          display: flex;
          flex-direction: column;
          flex-grow: 2;
          .top-infos {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 34rpx;
            font-weight: 400;
          }
          .detail {
            padding-top: 12rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            color: rgba(0, 0, 0, 0.5);
            font-size: 28rpx;
            line-height: 44rpx;
          }
        }
      }
    }
  }
  .storeWrap {
    margin: 24rpx;
    .store {
      padding: 24rpx 0 32rpx 0;
      font-size: 36rpx;
      font-weight: 500;
    }
    .storeList {
      .storeItem {
        background: #feffff;
        border-radius: 8rpx;
        box-shadow: 0px 0px 20rpx 0px rgba(0, 0, 0, 0.09);
        padding: 24rpx;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16rpx;
        .watermark {
          position: absolute;
          right: 56rpx;
          top: -36rpx;
          width: 160rpx;
          height: 152rpx;
        }
        .storeInfos {
          position: relative;
          z-index: 2;
          .storeBaseInfo {
            display: flex;
            flex-wrap: nowrap;
            font-size: 34rpx;
            font-weight: 400;
            margin-bottom: 16rpx;
            .title {
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              margin-right: 20rpx;
            }
            .phone {
              flex-shrink: 0;
            }
          }
          .storeAddress,
          .storeTime {
            font-size: 28rpx;
            margin-top: 16rpx;
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            color: rgba(0, 0, 0, 0.5);
            .icon-location,
            .icon-time {
              flex-shrink: 0;
              margin-right: 12rpx;
              font-size: 36rpx;
            }
            .address,
            .time {
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
            }
          }
        }
        .appointBtn {
          position: relative;
          z-index: 1;
          flex-shrink: 0;
          margin-left: 40rpx;
        }
      }
    }
  }
}

.aptmt {
  position: fixed;
  width: 96rpx;
  height: 96rpx;
  background: linear-gradient(304deg, #74d1a0 11%, #5cbb89 84%);
  box-shadow: 0px 10px 28px 0px #b4e0c9;
  border-radius: 200rpx;
  bottom: 32rpx;
  right: 0;
  color: #feffff;
  display: flex;
  align-items: center;
  justify-content: center;
  .icon-time {
    font-size: 50rpx;
    line-height: 50rpx;
    margin-right: 0 !important;
  }
}
movable-area {
  width: 100%;
  height: 100%;
}
movable-view {
  z-index: 9999;
}
.iconfont {
  margin-right: 8rpx;
}
</style>
