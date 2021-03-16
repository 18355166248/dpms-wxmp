<template>
  <movable-area>
    <view class="home-view">
      <view class="home-bg">
        <image
          class="home-bg-img"
          src="/static/header-bg.svg"
          mode="widthFix"
        />
      </view>
      <text class="my" :style="{ top: top + 'px' }">我的</text>
      <view class="header-wrapper mh-32 pt-47">
        <view class="header">
          <image class="headerImg" :src="headerImgSrc" />
          <view class="userName">{{ mobile || '未登录' }}</view>
          <span
            class="iconfont icon-switch-user"
            style="
              height: 40rpx;
              width: 36rpx;
              font-size: 44rpx;
              margin-left: 20rpx;
              font-weight: 500;
            "
            @click="toUrl('/pages/switchUser/switchUser')"
          >
          </span>
        </view>
      </view>

      <view class="vipInfo" v-if="configNumber > 0">
        <div
          :class="{
            mySelf1: configNumber === 1,
            mySelf2: configNumber === 2,
            mySelf3: configNumber === 3,
          }"
          v-if="storedCardAccount === 1"
        >
          <view>￥{{ memberDetails.balance || 0.0 }}</view>
          <view
            @click="
              toUrl(
                '/pages/StoreCardDealRecordchild/StoreCardDealRecordchild',
                1,
              )
            "
            >储值卡余额<span
              v-if="storedCardDetail === 1"
              style="color: rgba(0, 0, 0, 0.25);"
              class="icon iconfont icon-rightCircle"
            ></span
          ></view>
        </div>
        <div
          :class="{
            mySelf1: configNumber === 1,
            mySelf2: configNumber === 2,
            mySelf3: configNumber === 3,
          }"
          v-if="memberCardLevel === 1"
        >
          <view
            >{{ memberCardTypeQueryResponse.cardTypeName || '--'
            }}<span
              v-if="shareMember === true"
              class="icon iconfont icon-team"
            ></span
          ></view>
          <view @click="toUrl('/pages/membership/membershipCard', 2)"
            >会员等级<span
              v-if="
                memberCardDetail === 1 &&
                memberCardTypeQueryResponse.cardTypeName
              "
              style="color: rgba(0, 0, 0, 0.25);"
              class="icon iconfont icon-rightCircle"
            ></span
          ></view>
        </div>
        <div
          :class="{
            mySelf1: configNumber === 1,
            mySelf2: configNumber === 2,
            mySelf3: configNumber === 3,
          }"
          v-if="integral === 1"
          style="border: none;"
        >
          <view>{{ memberDetails.currentPoints || 0 }}</view>
          <view>积分</view>
        </div>
      </view>

      <view class="personAppointment">
        <div>
          <span
            ><span class="iconfont icon-set personnelManagement"></span
            >人员管理</span
          >
          <span @click="goPerson"
            >已添加{{ count || 0 }}人<span class="iconfont icon-right"></span
          ></span>
        </div>
        <div>
          <span
            ><span class="iconfont icon-time appointment"></span>我的预约</span
          >
          <span @click="toUrl('/pages/myAppointment/myAppointment', 4)"
            >待确认:{{ confirmedCount || 0 }} /已预约:{{ appointCount || 0 }}
            <span class="iconfont icon-right"></span>
          </span>
        </div>
        <div v-if="billOverview === 1" @click="toUrl('/pages/myBill/myBill')">
          <span><span class="iconfont icon-bill bill"></span>我的账单</span>
          <span><span class="iconfont icon-right"></span></span>
        </div>
        <div v-if="medicalRecord === 1" @click="onHandeleSelectPerson">
          <span
            ><span class="iconfont icon-archives archives"></span>健康档案</span
          >
          <span><span class="iconfont icon-right"></span></span>
        </div>
        <div
          v-if="myCoupon === 1"
          @click="toUrl('/pages/myCoupon/myCoupon', 5)"
        >
          <span
            ><span class="iconfont icon-coupons coupons"></span>我的优惠券</span
          >
          <span><span class="iconfont icon-right"></span></span>
        </div>
        <div
          v-if="couponCenter === 1"
          @click="
            toUrl('/pages/couponCenter/couponCenter?memberId=' + memberId, 6)
          "
        >
          <span
            ><span class="iconfont icon-gift couponCentre"></span>领券中心</span
          >
          <span><span class="iconfont icon-right"></span></span>
        </div>
      </view>
      <div class="version">版本号V1.0.0</div>
      <div v-if="showLogout" class="quit" @click="logOut">退出登录</div>

      <movable-view
        :x="x"
        :y="y"
        direction="all"
        @change="onChange"
        v-show="
          !(
            doctorAppointment !== 1 &&
            projectAppointment !== 1 &&
            quickAppointment !== 1
          )
        "
        @click="toAppoint"
        class="aptmt"
      >
        <span class="iconfont icon-time"></span>
      </movable-view>
    </view>
    <dpmsBottomPicker
      class="dpmsBottomPicker"
      :visible.sync="itemPickerSelectPersonVisible"
      title="选择人员"
    >
      <div>
        <div
          class="item"
          v-for="(item, index) in selectPersonData"
          :key="item.patientId"
          @click="onHandleItemClick(item)"
        >
          <div class="itemContent">
            <div class="itemContentLeft">
              <div>
                <span class="labelContentText">姓名：</span
                ><span class="textContentName">{{ item.patientName }}</span>
              </div>
              <div>
                <span class="labelContentText">病历号：</span
                ><span class="textContentName">{{ item.patientNo }}</span>
              </div>
            </div>
            <div class="itemContentRight">
              <span>
                <span
                  class="iconfont icon-right"
                  style="color: #4c4c4c;"
                ></span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <empty
        v-if="!selectPersonData.length"
        :disabled="true"
        text="暂无可可选择人员"
      />
    </dpmsBottomPicker>
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
      x: 0,
      y: 0,
      headerImgSrc: '/static/header-img.svg',
      mobile: '',
      memberDetails: {},
      memberCardTypeQueryResponse: {},
      shareMember: false,
      showLogout: false,
      memberId: '',
      itemPickerSelectPersonVisible: false,
      selectPersonData: [],
      selectPersonCurrentIndex: 0,
      billDetail: 1,
      billOverview: 1,
      couponCenter: 1,
      doctorAppointment: 1,
      electronicMedicalRecord: 1,
      imaging: 1,
      integral: 1,
      medicalRecord: 1,
      memberCardDetail: 1,
      memberCardLevel: 1,
      miniAppsFunctionConfigId: 1,
      myCoupon: 1,
      projectAppointment: 1,
      quickAppointment: 1,
      storedCardAccount: 1,
      storedCardDetail: 4,
      configNumber: 0,
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
  created() {
    uni.getSystemInfo({
      success: (res) => {
        this.y = res.windowHeight - 60
        this.x = res.windowWidth
      },
    })
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
        this.getfunctionConfigDetail()
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
          this.count = res.data || ''
          uni.hideLoading()
          uni.stopPullDownRefresh()
        })
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
    getAppointCount() {
      customerAPI
        .getAppointCount({ userId: getStorage(STORAGE_KEY.STAFF).id })
        .then((res) => {
          this.appointCount = res.data.appointmentCount
          this.confirmedCount = res.data.undeterminedCount
        })
    },
    getfunctionConfigDetail() {
      customerAPI.getfunctionConfigDetail({}).then((res) => {
        console.log('getfunctionConfigDetail', res)
        this.billDetail = res.data.billDetail
        this.billOverview = res.data.billOverview
        this.couponCenter = res.data.couponCenter
        this.doctorAppointment = res.data.doctorAppointment
        this.electronicMedicalRecord = res.data.electronicMedicalRecord
        this.imaging = res.data.imaging
        this.integral = res.data.integral
        this.medicalRecord = res.data.medicalRecord
        this.memberCardDetail = res.data.memberCardDetail
        this.memberCardLevel = res.data.memberCardLevel
        this.miniAppsFunctionConfigId = res.data.miniAppsFunctionConfigId
        this.myCoupon = res.data.myCoupon
        this.projectAppointment = res.data.projectAppointment
        this.quickAppointment = res.data.quickAppointment
        this.storedCardAccount = res.data.storedCardAccount
        this.storedCardDetail = res.data.storedCardDetail
        let configNumber = 0
        if (this.memberCardLevel === 1) {
          configNumber++
        }
        if (this.storedCardAccount === 1) {
          configNumber++
        }
        if (this.integral === 1) {
          configNumber++
        }
        this.configNumber = configNumber
        console.log('this.configNumber', this.configNumber)
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
            .getMemberDetails({
              memberId: res.data.memberId,
              userBaseId: res.data.userBaseId,
            })
            .then((re) => {
              this.memberDetails = re.data?.memberDetailResponse || {}
              this.memberCardTypeQueryResponse =
                re.data.memberCardTypeQueryResponse
              this.shareMember =
                re.data.memberDetailResponse === undefined ||
                re.data.memberDetailResponse.shareInfo === undefined
                  ? false
                  : re.data.memberDetailResponse.shareInfo.shareMember
            })
        })
    },
    logOut() {
      customerAPI.logOut().then((res) => {
        if (res.code == 0) {
          removeStorage(STORAGE_KEY.STAFF)
          removeStorage(STORAGE_KEY.CUSTOMERID)
          this.$utils.reLaunch({ url: '/pages/login/index?param=myself' })
        }
      })
    },
    toUrl(url, num) {
      if (this.toUrling) return
      this.toUrling = true
      setTimeout(() => (this.toUrling = false), 999)
      if (getStorage(STORAGE_KEY.STAFF).id) {
        if (num === 1 && this.storedCardDetail !== 1) return //点储值卡余额但没配置储值卡明细
        if (
          num === 2 &&
          (this.memberCardDetail !== 1 ||
            !this.memberCardTypeQueryResponse.cardTypeName)
        )
          return //点会员等级但没配置会员详情
        this.$utils.push({ url: url })
      } else {
        this.load()
      }
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
    getPeopleList() {
      customerAPI
        .healthRecordsSelectUserList({
          userId: getStorage(STORAGE_KEY.STAFF).id,
        })
        .then((res) => {
          this.selectPersonData = res.data
        })
    },
    onHandeleSelectPerson() {
      this.itemPickerSelectPersonVisible = true
      this.getPeopleList()
    },
    onHandleItemClick(item, index) {
      console.log('item', item)
      this.selectPersonCurrentIndex = index
      this.$utils.push({
        url: '/pages/healthFile/healthFile?patientId=' + item.patientId,
      })
      this.itemPickerSelectPersonVisible = false
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
  .header-wrapper {
    position: relative;
    .header {
      position: absolute;
      left: 72rpx;
      top: 108rpx;
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
    top: 282rpx;
    margin: 0 34rpx;
    display: flex;
    justify-content: space-around;
    border-radius: 8rpx;
    box-shadow: 0px -8rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
    padding: 32rpx 0;
    .mySelf1 {
      width: 100%;
      display: flex;
      flex-direction: row-reverse;
      height: 102rpx;
      line-height: 102rpx;
      view:nth-child(2) {
        width: calc(50% - 32rpx);
        text-align: left;
        font-weight: 400;
        font-size: 34rpx;
        padding-left: 32px;
        color: rgba(0, 0, 0, 0.5);
      }
      view:nth-child(1) {
        width: calc(50% - 32rpx);
        text-align: right;
        font-weight: 400;
        font-size: 34rpx;
        padding-right: 32px;
        color: rgba(0, 0, 0, 0.9);
      }
      .icon {
        display: inline-block;
        margin-left: 10rpx;
        border-radius: 50%;
        font-size: 25rpx;
      }
    }
    .mySelf2 {
      &:nth-child(1) {
        border-right: 1rpx solid rgba(0, 0, 0, 0.15);
      }
      width: calc(50% - 1rpx);
      view:nth-child(1) {
        text-align: center;
        margin-bottom: 16rpx;
        font-weight: 500;
        font-size: 34rpx;
        color: rgba(0, 0, 0, 0.9);
      }
      view:nth-child(2) {
        text-align: center;
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
    .mySelf3 {
      &:nth-child(1),
      &:nth-child(2) {
        border-right: 1rpx solid rgba(0, 0, 0, 0.15);
      }
      width: calc(33% - 1rpx);
      view:nth-child(1) {
        text-align: center;
        margin-bottom: 16rpx;
        font-weight: 500;
        font-size: 34rpx;
        color: rgba(0, 0, 0, 0.9);
        max-width: 220rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      view:nth-child(2) {
        text-align: center;
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
    top: 312rpx;
    background: white;
    margin-bottom: 100rpx;
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
      .bill {
        background: linear-gradient(321deg, #f5222d 12%, #ff7875 101%);
      }
      .archives {
        background: linear-gradient(321deg, #b37feb 12%, #d3adf7 101%);
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
    top: 332rpx;
  }
  .version {
    width: 100%;
    position: relative;
    top: 300rpx;
    margin: 0;
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
}

movable-view {
  z-index: 9999;
}
.home-bg {
  width: 100%;
  height: 452rpx;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  &-img {
    width: 100%;
  }
}
.item {
  .itemContent {
    padding: 24rpx 16rpx 24rpx 32rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    border-radius: 8rpx;
    box-shadow: 0 18rpx 56rpx 16rpx rgba(0, 0, 0, 0.05),
      0 12rpx 32rpx 0 rgba(0, 0, 0, 0.08),
      0 6rpx 12rpx -8rpx rgba(0, 0, 0, 0.12);
    margin-bottom: 32rpx;
    .labelContentText {
      font-size: 28rpx;
      color: rgba(0, 0, 0, 0.9);
    }
    .textContentName {
      font-size: 28rpx;
      color: rgba(0, 0, 0, 0.7);
    }
    .itemContentRight {
      .defaultContent {
        margin-right: 24rpx;
        padding: 0 16rpx;
        height: 40rpx;
        font-size: 28rpx;
        font-family: SanFranciscoDisplay, SanFranciscoDisplay-Regular,
          sans-serif;
        font-weight: 400;
        text-align: center;
        color: #1890ff;
        line-height: 36rpx;
        background: #e6f7ff;
        border: 2rpx solid #91d5ff;
        border-radius: 6rpx;
      }
    }
  }
}

.dpmsBottomPicker .empty {
  padding: 100rpx 0;
}
</style>
