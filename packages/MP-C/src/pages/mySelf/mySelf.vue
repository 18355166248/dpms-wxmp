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
        <image class="home-bg-img" src="/static/header-bg.png" mode="widthFix" />
      </view>
      <text class="my">我的</text>
      <view class="header-wrapper mh-32 pt-47">
        <view class="header">
          <image class="headerImg" :src="headerImgSrc" />
          <view class="userName">{{ mobile||'未登录' }}</view>
        </view>
      </view>
      <view class="vipInfo">
        <div>
          <view>￥{{ memberDetails.balance || 0 }}</view>
          <view>储值卡余额</view>
        </div>
        <div @click="goMembershipCard">
          <view
            style="
              overflow: hidden;
              width: 90%;
              white-space: nowrap;
              text-overflow: ellipsis;
            "
          >{{ memberCardTypeQueryResponse.cardTypeName || '--' }}</view>
          <view>
            会员等级
            <span class="icon iconfont icon-rightCircle"></span>
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
            <span style="color: #fb8e51;" class="iconfont icon-set"></span>人员管理
          </span>
          <span @click="goPerson">
            已添加{{ count || 0 }}人
            <span class="iconfont icon-right"></span>
          </span>
        </div>
        <div>
          <span>
            <span style="color: #4d94fe;" class="iconfont icon-timeCircle"></span>我的预约
          </span>
          <span @click="goAppointment('/pages/myAppointment/myAppointment')">
            待确认:{{ confirmedCount || 0 }} /已预约:{{ appointCount || 0 }}
            <span
              class="iconfont icon-right"
            ></span>
          </span>
        </div>
      </view>
      <view class="logOut" v-if="showLogout">
        <div class="quit" @click="logOut">退出登录</div>
        <div class="version">版本号V1.0.0</div>
      </view>

      <movable-view
        :x="x"
        :y="y"
        direction="all"
        @change="onChange"
        @click="goAppointment('/pages/projAptmt/projAptmt')"
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
      x: 300,
      y: 360,
      headerImgSrc: '/static/header-img.svg',
      mobile: '',
      memberDetails: {},
      memberCardTypeQueryResponse: {},
      showLogout: false,
    }
  },
  onShow() {
    this.load()
  },
  onPullDownRefresh() {
    this.load()
  },
  methods: {
    goMembershipCard() {
      this.$utils.push({ url: '/pages/membership/membershipCard' })
    },
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
    goAppointment(url) {
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
    top: 62rpx;
    display: block;
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
      border-right: 1px dashed rgba(0, 0, 0, 0.15);
      width: 33%;
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
    border-bottom: #dbdbdb 2rpx solid;
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
    }
    div:first-child {
      border-bottom: #dbdbdb 2rpx solid;
    }
  }
  .logOut {
    margin: 0 64rpx;
    position: relative;
    top: 600rpx;
    .quit {
      height: 78rpx;
      line-height: 78rpx;
      text-align: center;
      color: white;
      font-size: 36rpx;
      font-weight: 400;
      background: #5cbb89;
      margin-bottom: 32rpx;
      border-radius: 8px;
    }
    .version {
      font-weight: 400;
      text-align: center;
      font-size: 28rpx;
      color: rgba(0, 0, 0, 0.5);
    }
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
