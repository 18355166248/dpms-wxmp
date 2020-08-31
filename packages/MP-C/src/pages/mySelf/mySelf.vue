<template>
  <movable-area>
    <view
      :style="{
        paddingTop: navHeight + 'px',
        height: viewHeight,
      }"
      class="home-view"
    >
      <view class="home-bg">
        <image
          class="home-bg-img"
          src="/static/header-bg.png"
          mode="widthFix"
        />
      </view>
      <text class="my" :style="{ top: top + 'px' }">我的</text>
      <view class="header-wrapper mh-32 pt-47">
        <view class="header">
          <image class="headerImg" :src="headerImgSrc" />
          <view class="userName">{{ mobile || '未登录' }}</view>
        </view>
      </view>
      <view class="vipInfo">
        <div>
          <view>￥{{ memberDetails.balance || 0 }}</view>
          <view>储值卡余额</view>
        </div>
        <div>
          <view
            style="
              overflow: hidden;
              width: 90%;
              white-space: nowrap;
              text-overflow: ellipsis;
            "
            >{{ memberCardTypeQueryResponse.cardTypeName || '--' }}</view
          >
          <view>
            会员等级
            <span
              style="color: rgba(0, 0, 0, 0.25);"
              class="icon iconfont icon-rightCircle"
            ></span>
          </view>
        </div>
        <div style="border: none;">
          <view>{{ memberDetails.currentPoints || 0 }}</view>
          <view>积分</view>
        </div>
      </view>
      <view class="personAppointment">
        <div>
          <span>
            <span class="iconfont icon-set personnelManagement"></span>人员管理
          </span>
          <span @click="goPerson">
            已添加{{ count || 0 }}人
            <span class="iconfont icon-right"></span>
          </span>
        </div>
        <div>
          <span>
            <span class="iconfont icon-time appointment"></span>我的预约
          </span>
          <span @click="toUrl('/pages/myAppointment/myAppointment')">
            待确认:{{ confirmedCount || 0 }} /已预约:{{ appointCount || 0 }}
            <span class="iconfont icon-right"></span>
          </span>
        </div>
        <div @click="toUrl('/pages/myCoupon/myCoupon')">
          <span>
            <span class="iconfont icon-coupons coupons"></span>我的优惠卷
          </span>
          <span>
            <!-- 待确认:{{ confirmedCount || 0 }} /已预约:{{ appointCount || 0 }} -->
            <span class="iconfont icon-right"></span>
          </span>
        </div>
        <div
          @click="
            toUrl('/pages/couponCenter/couponCenter?memberId=' + memberId)
          "
        >
          <span>
            <span class="iconfont icon-gift couponCentre"></span>领券中心
          </span>
          <span>
            <!-- 待确认:{{ confirmedCount || 0 }} /已预约:{{ appointCount || 0 }} -->
            <span class="iconfont icon-right"></span>
          </span>
        </div>
      </view>
      <div v-if="showLogout" class="quit" @click="logOut">退出登录</div>
      <div class="version">版本号V1.0.0</div>

      <movable-view
        :x="x"
        :y="y"
        direction="all"
        @change="onChange"
        @click="toUrl('/pages/projAptmt/projAptmt')"
        class="aptmt"
      >
        <span class="iconfont icon-time"></span>
      </movable-view>
    </view>
  </movable-area>
</template>

<script>
import customerAPI from '@/APIS/customer/customer.api'
import {
  getStorage,
  setStorage,
  removeStorage,
  STORAGE_KEY,
} from '@/utils/storage'

export default {
  data() {
    return {
      count: '',
      confirmedCount: '',
      appointCount: '',
      top: '',
      x: 300,
      y: 360,
      headerImgSrc: '/static/header-img.svg',
      mobile: '',
      memberDetails: {},
      memberCardTypeQueryResponse: {},
      showLogout: false,
      memberId: '',
    }
  },
  onShow() {
    this.load()
    this.top =
      wx.getMenuButtonBoundingClientRect().top +
      wx.getMenuButtonBoundingClientRect().height / 4
  },
  onPullDownRefresh() {
    this.load()
  },
  methods: {
    // goMembershipCard() {
    //   this.$utils.push({ url: '/pages/membership/membershipCard' })
    // },
    load() {
      if (getStorage(STORAGE_KEY.STAFF).id) {
        this.showLogout = true
        this.getCount()
        this.getAppointCount()
        this.getUserDetail()
      } else {
        this.mobile = ''
        this.memberDetails = {}
        this.memberCardTypeQueryResponse = {}
        this.showLogout = false
        uni.showModal({
          title: '您还未授权登录',
          content: '您需要授权信息才能获取更多服务',
          showCancel: false,
          confirmText: '立即授权',
          confirmColor: '#5CBB89',
          success: (confirm) => {
            if (confirm.confirm) {
              this.$utils.reLaunch({ url: '/pages/login/index?param=myself' })
            }
          },
        })
      }
    },
    getCount() {
      uni.showLoading({
        title: '加载中...',
      })
      customerAPI
        .getPersonCount({ userId: getStorage(STORAGE_KEY.STAFF).id })
        .then((res) => {
          this.count = res.data
          uni.hideLoading()
          uni.stopPullDownRefresh()
        })
    },
    getAppointCount() {
      customerAPI
        .getAppointCount({ userId: getStorage(STORAGE_KEY.STAFF).id })
        .then((res) => {
          this.appointCount = res.data.appointmentCount
          this.confirmedCount = res.data.undeterminedCount
        })
    },
    getUserDetail() {
      customerAPI
        .userDetail({ userId: getStorage(STORAGE_KEY.STAFF).id })
        .then((res) => {
          console.log('userDetail', res)
          this.mobile = res.data.mobile
          this.memberId = res.data.memberId
          customerAPI
            .getMemberDetails({ memberId: res.data.memberId })
            .then((re) => {
              console.log('MemberDetails', re)
              this.memberDetails = re.data.memberDetailResponse
              this.memberCardTypeQueryResponse =
                re.data.memberCardTypeQueryResponse
            })
        })
    },
    logOut() {
      customerAPI.logOut().then((res) => {
        if (res.code == 0) {
          removeStorage(STORAGE_KEY.STAFF)
          this.$utils.reLaunch({ url: '/pages/login/index?param=myself' })
        }
      })
    },
    toUrl(url) {
      this.$utils.push({ url: url })
    },
    goPerson() {
      this.$utils.push({ url: '/pages/personManagement/personManagement' })
    },
    onChange(e) {
      this.$nextTick(function () {
        this.x = e.detail.x
        this.y = e.detail.y
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.home-view {
  .my {
    position: relative;
    display: block;
    font-weight: 500;
    color: white;
    font-size: 36rpx;
    text-align: center;
    height: 44rpx;
    line-height: 44rpx;
  }
  .home-bg {
    width: 100%;
    height: 420rpx;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 0;
    &-img {
      width: 100%;
    }
  }
  .header-wrapper {
    position: relative;
    .header {
      position: absolute;
      left: 72rpx;
      top: 116rpx;
      display: flex;
      align-items: center;
      color: white;
      image {
        display: inline-block;
        width: 124rpx;
        height: 124rpx;
        margin-right: 32rpx;
      }
      .userName {
        font-size: 36rpx;
        font-weight: 500;
      }
    }
  }
  .vipInfo {
    box-sizing: border-box;
    height: 154rpx;
    background: white;
    position: relative;
    top: 308rpx;
    margin: 0 34rpx;
    display: flex;
    justify-content: space-around;
    border-radius: 8rpx;
    box-shadow: 0px -8rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
    padding: 32rpx 0;
    div {
      border-right: 1rpx solid rgba(0, 0, 0, 0.15);
      width: calc(33% - 1rpx);
      padding-left: 50rpx;
      view:nth-child(1) {
        margin-bottom: 16rpx;
        font-weight: 500;
        font-size: 34rpx;
        color: rgba(0, 0, 0, 0.9);
      }
      view:nth-child(2) {
        font-weight: 400;
        font-size: 24rpx;
        color: rgba(0, 0, 0, 0.45);
      }
      .icon {
        display: inline-block;
        margin-left: 10rpx;
        border-radius: 50%;
        font-size: 25rpx;
      }
    }
  }
  .personAppointment {
    padding-left: 35rpx;
    position: relative;
    top: 372rpx;
    background: white;
    div {
      height: 112rpx;
      line-height: 112rpx;
      position: relative;
      display: flex;
      align-items: center;
      span:nth-child(1) {
        font-size: 34rpx;
        color: rgba(0, 0, 0, 0.9);
        font-weight: 400;
        display: flex;
        align-items: center;
        span {
          display: inline-block;
          margin-right: 20rpx;
        }
      }
      span:nth-child(2) {
        font-weight: 400;
        font-size: 34rpx;
        text-align: right;
        color: rgba(0, 0, 0, 0.5);
        position: absolute;
        right: 32rpx;
        display: flex;
        align-items: center;
        span {
          display: inline-block;
          margin-left: 13rpx;
          color: rgba(0, 0, 0, 0.25);
        }
      }
      span {
        span {
          -webkit-background-clip: text;
          color: transparent;
        }
      }
      .personnelManagement {
        background: linear-gradient(139deg, #fb8d51 12%, #feb277 90%);
      }
      .appointment {
        background: linear-gradient(321deg, #7ea8f5 12%, #3278de 101%);
      }
      .coupons {
        background: linear-gradient(318deg, #68e2a2 1%, #2ad67c 95%);
      }
      .couponCentre {
        background: linear-gradient(316deg, #fa85c5 0%, #eb2f96 89%);
      }
    }
    div:not(:last-child) {
      border-bottom: #dbdbdb 1rpx solid;
    }
  }
  .quit {
    height: 112rpx;
    width: 100%;
    background: #ffffff;
    line-height: 112rpx;
    text-align: center;
    color: rgba(0, 0, 0, 0.9);
    font-size: 34rpx;
    font-weight: 400;
    position: relative;
    top: 392rpx;
  }
  .version {
    width: 100%;
    position: absolute;
    bottom: 34rpx;
    text-align: center;
    font-size: 28rpx;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.5);
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
}
movable-area {
  width: 100%;
  height: 100%;
  background: rgba($color: #000000, $alpha: 0.04);
}

movable-view {
  z-index: 9999;
}
</style>
