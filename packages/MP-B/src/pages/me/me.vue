<template>
  <view class="content">
    <view class="status_bar" :style="{ height: navTop }"></view>
    <view class="tit">我的</view>
    <view class="me" @click="toUrl('/pages/myProfile/myProfile')">
      <patientAvatar
        :width="124"
        :patient="{ avatarUrl: staff.photoUrl }"
        class="image"
      />
      <view class="info">
        <view class="name">{{ staff.staffName }}</view>
        <view v-if="staff.position" class="role">{{
          staffPosition[staff.position].zh_CN
        }}</view>
      </view>
      <view class="link">
        <text class="iconfont icon-right" />
      </view>
    </view>
    <view class="menu">
      <view class="li">
        <view class="institution">
          <text class="iconfont icon-bank" />
          登录诊所
        </view>
        <text class="text text-ellipsis">{{
          medicalInstitution.medicalInstitutionSimpleCode
        }}</text>
      </view>
      <view class="li" @click="toUrl('/pages/myProfile/about')">
        <view>
          <image class="logo" src="../../static/icon-mini-logo.png" />
          关于北吉熊
        </view>
        <text class="iconfont icon-right text" />
      </view>
    </view>
    <view class="out" @click="loginOut">退出登录</view>
  </view>
</template>

<script>
import patientAvatar from '@/businessComponents/patientAvatar/patientAvatar'
import { removeStorage, STORAGE_KEY } from '@/utils/storage'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      staffPosition: this.$dpmsUtils.getEnums('StaffPosition').properties,
    }
  },
  components: {
    patientAvatar,
  },
  computed: {
    ...mapState('workbenchStore', ['staff', 'medicalInstitution']),
    menuButtonObject() {
      return uni.getMenuButtonBoundingClientRect()
    },
    navTop: function () {
      return `${this.menuButtonObject.top}px`
    },
  },
  methods: {
    toUrl(url) {
      this.$dpmsUtils.push({
        url,
      })
    },
    loginOut() {
      removeStorage(STORAGE_KEY.ACCESS_TOKEN)
      removeStorage(STORAGE_KEY.LOGIN_TYPE)
      removeStorage(STORAGE_KEY.ENUMS)
      this.$store.commit('workbenchStore/delMedicalInstitution')
      this.$store.commit('workbenchStore/delStaff')
      this.$dpmsUtils.reLaunch({
        url: '/pages/login/login',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.content {
  background-image: url('~@/static/home-bg.png');
  background-size: contain;
  background-repeat: no-repeat;
}
.status_bar {
  width: 100%;
}
.tit {
  height: 64rpx;
  line-height: 64rpx;
  text-align: center;
  font-size: 36rpx;
  color: #fff;
}
.me {
  margin-bottom: 64rpx;
  padding: 45rpx 22rpx 0 34rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .image {
    margin-right: 32rpx;
  }
  .info {
    flex: auto;
    box-sizing: border-box;
    .name {
      font-size: 36rpx;
      margin-bottom: 16rpx;
      color: #fff;
    }
    .role {
      float: left;
      font-size: 26rpx;
      padding: 0 16rpx;
      height: 40rpx;
      line-height: 40rpx;
      color: #fff;
      background: #25925a;
      border-radius: 2rpx;
    }
  }
  .link {
    width: 50rpx;
    height: 124rpx;
    line-height: 124rpx;
    color: #fff;
    text-align: center;
  }
}
.menu {
  padding-left: 32rpx;
  margin-bottom: 20rpx;
  background-color: #fff;
  .li {
    height: 112rpx;
    line-height: 112rpx;
    padding-right: 32rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 34rpx;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.15);

    .institution {
      flex: 0 0 auto;
      padding-right: 40rpx;
    }

    &:last-child {
      border-bottom: none;
    }
    text.icon-bank {
      font-size: 38rpx;
      margin-right: 10rpx;
      color: #6dcd9a;
    }
    .text {
      color: rgba(0, 0, 0, 0.5);
      overflow: hidden;
    }
    .text.icon-right {
      color: rgba(0, 0, 0, 0.25);
    }
    .logo {
      width: 40rpx;
      height: 40rpx;
      margin-right: 10rpx;
      vertical-align: middle;
    }
  }
}
.out {
  height: 112rpx;
  line-height: 112rpx;
  background: #fff;
  font-size: 34rpx;
  text-align: center;
  color: rgba(0, 0, 0, 0.9);
}
</style>
