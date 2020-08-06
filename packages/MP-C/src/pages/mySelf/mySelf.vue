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
        ></image>
      </view>
      <text class="my">我的</text>
      <view class="header-wrapper mh-32 pt-47">
        <view class="header">
          <image class="headerImg" :src="headerImgSrc"></image>
          <view class="userName">112233445566</view>
        </view>
      </view>
      <view class="vipInfo">
        <div>
          <view>￥1,1111</view>
          <view>储值卡余额</view>
        </div>
        <div>
          <view>白金会员</view>
          <view
            >会员等级
            <span class="icon iconfont icon-rightCircle"></span>
          </view>
        </div>
        <div style="border: none;">
          <view>10000</view>
          <view>积分</view>
        </div>
      </view>
      <view class="personAppointment">
        <div>
          <span
            ><span style="color: #fb8e51;" class="iconfont icon-set"></span
            >人员管理</span
          >
          <span @click="goPerson"
            >已添加{{ count }}人<span class="iconfont icon-right"></span
          ></span>
        </div>
        <div>
          <span
            ><span
              style="color: #4d94fe;"
              class="iconfont icon-timeCircle"
            ></span
            >我的预约</span
          >
          <span @click="goAppointment"
            >待确认:{{ 1 }} /已预约:{{ 2
            }}<span class="iconfont icon-right"></span
          ></span>
        </div>
      </view>
      <view class="logOut">
        <div class="quit">退出登录</div>
        <div class="version">版本号V1.0.0</div>
      </view>

      <movable-view
        :x="x"
        :y="y"
        direction="all"
        @change="onChange"
        @click="goAppointment"
        class="aptmt"
        ><span class="iconfont icon-time"></span
      ></movable-view>
    </view>
  </movable-area>
</template>

<script>
import customerAPI from '@/APIS/customer/customer.api'
import { getStorage, setStorage, STORAGE_KEY } from '@/utils/storage'

export default {
  data() {
    return {
      count: '',
      x: 300,
      y: 360,
      headerImgSrc: '/static/header-img.svg',
    }
  },
  beforeCreate() {
    let staff = getStorage(STORAGE_KEY.STAFF)
    if (!staff) {
      this.$utils.replace({ url: '/pages/login/index' })
    }
  },
  mounted() {},
  beforeMount() {
    this.getCount()
  },
  onLoad() {},
  methods: {
    getCount() {
      customerAPI
        .getPersonCount({ userId: getStorage(STORAGE_KEY.STAFF).id })
        .then((res) => {
          this.count = res.data
        })
    },
    goAppointment() {
      this.$utils.push({ url: '/pages/myAppointment/myAppointment' })
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
