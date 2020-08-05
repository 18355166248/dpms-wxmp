<template>
  <view class="content">
    <view class="me">
      <image v-if="staff.photoUrl" :src="staff.photoUrl" />
      <view class="info">
        <view class="name">{{ staff.staffName }}</view>
        <view class="role">{{ staffPosition[staff.position].zh_CN }}</view>
      </view>
      <view class="link" @click="goMyProfile">
        <text class="iconfont icon-right" />
      </view>
    </view>
    <view class="menu">
      <view class="li">
        <view>
          <text class="iconfont icon-institutions" />
          登录诊所
        </view>
        <text class="institution">{{
          medicalInstitution.medicalInstitutionSimpleCode
        }}</text>
      </view>
      <view class="li">
        <view>
          <text class="iconfont icon-password" />
          关于北吉熊1
        </view>
      </view>
    </view>
    <dpmsPlacePicker v-model="test" title="选择地区"></dpmsPlacePicker>
    <view class="out">
      <dpmsButton @click="loginOut" text="退出登录" type="primary" />
    </view>
  </view>
</template>

<script>
import { getStorage, removeStorage, STORAGE_KEY } from '@/utils/storage'
export default {
  data() {
    return {
      test: [],
      medicalInstitution: getStorage(STORAGE_KEY.MEDICALINSTITUTION),
      staff: getStorage(STORAGE_KEY.STAFF),
      staffPosition: this.$utils.getEnums('StaffPosition').properties,
    }
  },
  onLoad() {},
  methods: {
    goMyProfile() {
      this.$utils.push({
        url: '/pages/myProfile/myProfile',
      })
    },
    loginOut() {
      removeStorage(STORAGE_KEY.ACCESS_TOKEN)
      removeStorage(STORAGE_KEY.MEDICALINSTITUTION)
      removeStorage(STORAGE_KEY.STAFF)
      removeStorage(STORAGE_KEY.ENUMS)
      this.$utils.reLaunch({
        url: '/pages/login/login',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.me {
  height: 200rpx;
  margin: 50rpx 20rpx;
  padding: 10rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  background: #feffff;
  border-radius: 8rpx;
  box-shadow: 0rpx 20rpx 20rpx 0rpx rgba(0, 0, 0, 0.09);
  image {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    margin-right: 10rpx;
  }
  .info {
    flex: auto;
    padding: 0 10rpx;
    box-sizing: border-box;
    .name {
      font-weight: bold;
      margin-bottom: 10rpx;
    }
    .role {
      font-size: 24rpx;
    }
  }
  .link {
    width: 50rpx;
    text-align: center;
  }
}
.menu {
  .li {
    height: 80rpx;
    padding: 0 50rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text.iconfont {
      margin-right: 10rpx;
    }
  }
}
.out {
  position: fixed;
  bottom: 20rpx;
  right: 0;
  left: 0;
}
</style>
