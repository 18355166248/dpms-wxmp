<template>
  <view class="content">
    <div class="nav">
      <div
        v-if="quickAppointment === 1"
        class="navItem leftNav"
        @click="jump('/pages/appoint/index')"
      >
        快速预约
      </div>
      <div
        v-if="projectAppointment === 1"
        class="navItem centerNav"
        @click="jump('/pages/projAptmt/projAptmt')"
      >
        按项目预约
      </div>
      <div v-if="doctorAppointment === 1" class="navItem rightNav">
        按医生预约<view class="selected"></view>
      </div>
    </div>
    <view class="filter">
      <view class="storePicker">
        <picker
          mode="selector"
          range-key="institutionName"
          :range="filterStoreList"
          :value="selectedIndex"
          @change="onFilterOption"
        >
          <text>{{ pickerText }}</text>
          <span class="iconfont icon-down storePickerIcon"></span>
        </picker>
      </view>
      <view class="keywords">
        <span class="iconfont icon-search keyWordIcon"></span>
        <input :value="keyWord" @blur="setKeyWord" class="keyWordInput" />
      </view>
    </view>
    <view class="aptmtList" v-show="total !== 0">
      <view
        class="aptmtCard"
        v-for="d in doctorList"
        :key="d.appointmentDoctorId"
      >
        <view
          class="clickableArea"
          @click="
            toUrl(
              '/pages/docAptmt/docDetail?appointmentDoctorId=' +
                d.appointmentDoctorId,
            )
          "
        ></view>
        <image :src="d.doctorAvatarUrl" />
        <view>
          <view class="aptmtCardContent">
            <view class="cardTile">{{ d.doctorName }}</view>
            <view
              class="cardBtn"
              v-show="d.canAppointment"
              @click="handleAptmt(d)"
              >预 约</view
            >
          </view>
          <view class="cardDesc"
            >{{
              d.goodAt.length > 30
                ? d.goodAt.substring(0, 30) + '...'
                : d.goodAt
            }}
          </view>
        </view>
      </view>
      <load-more :status="loadStatus" color="rgba(0, 0, 0, 0.5)"></load-more>
    </view>
    <view class="empty" v-show="total === 0">
      <image
        src="https://medcloud.oss-cn-shanghai.aliyuncs.com/dental/saas/mini-app/%E7%A9%BA%E7%99%BD%E9%A1%B5_%E7%94%BB%E6%9D%BF%201%402x.png"
      />
      <text>未查询到任何信息</text>
    </view>
  </view>
</template>

<script>
import institutionAPI from '@/APIS/institution/institution.api'
import loadMore from '@/components/load-more/load-more.vue'
import { getStorage, setStorage, STORAGE_KEY } from '@/utils/storage'
import { mapState } from 'vuex'
import customerAPI from '@/APIS/customer/customer.api'
export default {
  data() {
    return {
      doctorList: [],
      selectedIndex: 0,
      filterStoreList: [],
      keyWord: '',
      currentPage: 1,
      total: -1,
      size: 10,
      loadStatus: 'loading',
      doctorAppointment: 1,
      projectAppointment: 1,
      quickAppointment: 2,
    }
  },
  onShareAppMessage(res) {
    return {
      path: `/pages/docAptmt/docAptmt`,
    }
  },
  onLoad(params) {
    if (!this.MEDICALINSTITUTION) return
    this.init()
    this.getfunctionConfigDetail()
  },
  onPullDownRefresh() {
    this.currentPage = 1
    this.loadData('init')
  },
  onReachBottom() {
    if (this.loadStatus === 'loading') return
    if (this.doctorList.length >= this.total) return
    this.loadStatus = 'loading'
    ++this.currentPage
    this.loadData('add')
  },
  watch: {
    selectedIndex() {
      this.emitPullDownRefresh()
    },
    MEDICALINSTITUTION(newVal) {
      this.init()
    },
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
      institutionAPI
        .getFilterStoreList({
          medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
        })
        .then((res) => {
          res.data.unshift({
            appointmentInstitutionId: null,
            institutionName: '全部门店',
          })
          this.filterStoreList = res.data
          this.emitPullDownRefresh()
        })
    },
    loadData(method) {
      institutionAPI
        .getInnerDocList({
          medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
          filterInstitutionId:
            this.filterStoreList[this.selectedIndex]
              ?.appointmentInstitutionId || null,
          searchParam: this.keyWord,
          current: this.currentPage,
          size: this.size,
        })
        .then((res) => {
          if (method === 'add') {
            this.doctorList = this.doctorList.concat(res.data.doctorList)
          } else {
            this.doctorList = res.data.doctorList
          }
          this.total = res.data.total
          if (this.doctorList.length < this.total) {
            this.loadStatus = 'more'
          } else {
            this.loadStatus = 'noMore'
          }
        })
      uni.stopPullDownRefresh()
    },
    onFilterOption(e) {
      this.selectedIndex = e.target.value
    },
    emitPullDownRefresh() {
      uni.startPullDownRefresh()
    },
    handleAptmt({ doctorId, appointmentDoctorId }) {
      const { toUrl } = this
      uni.showLoading({
        title: '加载中...',
      })
      institutionAPI
        .checkDocCanAptmt({
          medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
          appointmentDoctorId,
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
                '/pages/appoint/index?doctorId=' +
                  doctorId +
                  '&isShowTab=2&shopId=' +
                  canApptInstitutionList[0].appointmentInstitutionId,
              )
            }
            if (canApptInstitutionList.length > 1) {
              toUrl(
                `/pages/docAptmt/docDetail?appointmentDoctorId=${appointmentDoctorId}`,
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
    jump(url) {
      uni.redirectTo({ url })
    },
    setKeyWord(e) {
      this.keyWord = e.target.value
      this.emitPullDownRefresh()
    },
  },
  computed: {
    pickerText() {
      let text = this.filterStoreList[this.selectedIndex]
        ? this.filterStoreList[this.selectedIndex].institutionName
        : ''
      if (text.length > 4) {
        return text.substring(0, 3) + '…'
      } else {
        return text
      }
    },
    ...mapState('loginStore', {
      MEDICALINSTITUTION: (state) => state.MEDICALINSTITUTION,
    }),
  },
  components: {
    loadMore,
  },
}
</script>

<style scoped>
.content {
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.04);
  height: 100%;
  font-size: 32rpx;
}
.nav {
  width: 100%;
  height: 76rpx;
  background: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.selected {
  width: 58rpx;
  height: 4rpx;
  background: #5cbb89;
  border-radius: 2rpx;
  margin: 0 auto;
  margin-top: 16rpx;
}
.navItem {
  width: 140rpx;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  text-align: center;
  color: rgba(0, 0, 0, 0.65);
  line-height: 36rpx;
  padding-top: 20rpx;
}
.rightNav {
  color: #5cbb89;
}
.filter {
  margin-top: 24rpx;
  padding: 0 24rpx;
  display: flex;
}
.storePicker {
  width: 232rpx;
  height: 76rpx;
  background: #ffffff;
  border-radius: 8rpx;
  padding: 0 25rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.storePickerIcon {
  color: rgba(0, 0, 0, 0.25);
}
.keyWordInput {
  width: 100%;
  height: 76rpx;
  line-height: 76rpx;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  text-align: left;
  color: rgba(0, 0, 0, 0.9);
  margin-left: 24rpx;
}
.keywords {
  width: 454rpx;
  height: 76rpx;
  line-height: 76rpx;
  background: #ffffff;
  border-radius: 8rpx;
  margin-left: 16rpx;
  display: flex;
}
.keyWordIcon {
  margin-left: 18rpx;
  color: rgba(0, 0, 0, 0.25);
}
.aptmtList {
  padding-top: 32rpx;
}
.aptmtCard {
  background: #feffff;
  display: flex;
  margin-bottom: 16rpx;
  padding-bottom: 32rpx;
}
.aptmtCard > image {
  margin: 32rpx 0 0 24rpx;
  width: 120rpx;
  height: 120rpx;
  border-radius: 80rpx;
}
.cardTile {
  width: 320rpx;
  height: 44rpx;
  font-size: 34rpx;
  text-align: left;
  color: rgba(0, 0, 0, 0.9);
  line-height: 44rpx;
  margin-top: 32rpx;
  margin-left: 24rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.cardDesc {
  width: 510rpx;
  font-size: 28rpx;
  color: rgba(0, 0, 0, 0.5);
  margin-left: 24rpx;
  margin-top: 24rpx;
  overflow: hidden;
}
.aptmtCardContent {
  display: flex;
}
.cardBtn {
  width: 130rpx;
  height: 56rpx;
  line-height: 56rpx;
  background: #fff;
  border: 2rpx solid #5cbb89;
  border-radius: 28rpx;
  font-size: 32rpx;
  text-align: center;
  color: #5cbb89;
  position: relative;
  top: 25rpx;
  left: 60rpx;
  z-index: 9999;
}
.clickableArea {
  height: 180rpx;
  width: 500rpx;
  position: absolute;
  z-index: 9999;
}
.empty {
  width: 406rpx;
  margin-top: 196rpx;
  margin-left: 172rpx;
}
.empty > image {
  width: 406rpx;
  height: 290rpx;
}
.empty > text {
  font-size: 34rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  text-align: center;
  color: rgba(0, 0, 0, 0.65);
  line-height: 44rpx;
  margin-left: 70rpx;
}
.iconfont {
  font-size: 40rpx;
}
.icon-down {
  margin-left: 10rpx;
}
</style>
