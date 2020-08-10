<template>
  <view class="content">
    <view class="nav">
      <view class="leftNav">按项目预约<view class="selected"></view></view>
      <view class="rightNav" @click="jump('/pages/docAptmt/docAptmt')"
        >按医生预约</view
      >
    </view>
    <view class="filter">
      <view class="storePicker">
        <picker
          mode="selector"
          range-key="institutionName"
          :range="filterStoreList"
          :value="selectedIndex"
          @change="onFilterOption"
        >
          <input class="storePickerInput" :value="pickerText" disabled />
        </picker>
        <span class="iconfont icon-down storePickerIcon"></span>
      </view>
      <view class="keywords">
        <span class="iconfont icon-search keyWordIcon"></span>
        <input :value="keyWord" @blur="setKeyWord" class="keyWordInput" />
      </view>
    </view>
    <view class="aptmtList" v-show="total !== 0">
      <view class="aptmtCard" v-for="p in projList" :key="p.appointmentItemId">
        <view
          class="clickableArea"
          @click="
            toUrl(
              '/pages/projAptmt/projDetail?appointmentItemId=' +
                p.appointmentItemId,
            )
          "
        ></view>
        <image :src="p.itemThumbnailUrl" />
        <view>
          <view class="aptmtCardContent">
            <view class="cardTile">{{ p.itemName }}</view>
            <view
              class="cardBtn"
              v-show="p.canAppointment"
              @click="handleAptmt(p.appointmentItemId)"
              >预 约</view
            >
          </view>
          <view class="cardDesc">{{ p.itemBriefIntroduction }}</view>
        </view>
      </view>
      <load-more :status="loadStatus"></load-more>
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
const medicalInstitution = getStorage(STORAGE_KEY.MEDICALINSTITUTION)
const staff = getStorage(STORAGE_KEY.STAFF)

export default {
  data() {
    return {
      projList: [],
      selectedIndex: 0,
      filterStoreList: [],
      keyWord: '',
      currentPage: 1,
      total: -1,
      size: 10,
      loadStatus: 'loading',
    }
  },
  onLoad(params) {
    this.init(params)
  },
  onPullDownRefresh() {
    this.currentPage = 1
    this.loadData('init')
  },
  onReachBottom() {
    if (this.loadStatus === 'loading') return
    if (this.projList.length >= this.total) return
    this.loadStatus = 'loading'
    ++this.currentPage
    this.loadData('add')
  },
  watch: {
    selectedIndex() {
      this.emitPullDownRefresh()
    },
  },
  methods: {
    init(params) {
      const { appointmentInstitutionId } = params
      institutionAPI
        .getFilterStoreList({
          medicalInstitutionId: medicalInstitution.medicalInstitutionId,
          filterInstitutionId: appointmentInstitutionId,
        })
        .then((res) => {
          res.data.unshift({
            appointmentInstitutionId: null,
            institutionName: '全部门店',
          })
          this.filterStoreList = res.data
          if (appointmentInstitutionId) {
            this.selectedIndex = this.filterStoreList.findIndex(
              (v) => v.appointmentInstitutionId == appointmentInstitutionId,
            )
          }
          this.emitPullDownRefresh()
        })
    },
    loadData(method) {
      institutionAPI
        .getInnerProjList({
          medicalInstitutionId: medicalInstitution.medicalInstitutionId,
          filterInstitutionId:
            this.filterStoreList[this.selectedIndex]
              ?.appointmentInstitutionId || null,
          searchParam: this.keyWord,
          current: this.currentPage,
          size: this.size,
        })
        .then((res) => {
          if (method === 'add') {
            this.projList = this.projList.concat(res.data.itemList)
          } else {
            this.projList = res.data.itemList
          }
          this.total = res.data.total
          if (this.projList.length < this.total) {
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
    handleAptmt(appointmentItemId) {
      if (!staff) {
        this.$utils.replace({ url: '/pages/login/index' })
      }
      uni.showLoading({
        title: '加载中...',
      })
      const { toUrl } = this
      institutionAPI
        .checkPorjCanAptmt({
          medicalInstitutionId: medicalInstitution.medicalInstitutionId,
          appointmentItemId,
        })
        .then((res) => {
          if (res.data.canAppointment) {
            toUrl('/pages/appoint/index?projAptmt=' + appointmentItemId)
            return
          }
          toUrl(
            '/pages/projAptmt/projDetail?appointmentItemId=' +
              appointmentItemId,
          )
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
      return this.filterStoreList[this.selectedIndex]?.institutionName
    },
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
}
.nav {
  width: 100%;
  height: 76rpx;
  background: #ffffff;
  display: flex;
}
.leftNav {
  width: 50%;
  font-size: 30rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  text-align: center;
  color: #5cbb89;
  line-height: 36rpx;
  padding-top: 20rpx;
}
.selected {
  width: 58rpx;
  height: 4rpx;
  background: #5cbb89;
  border-radius: 2rpx;
  margin: 0 auto;
  margin-top: 16rpx;
}
.rightNav {
  width: 50%;
  font-size: 30rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  text-align: center;
  color: rgba(0, 0, 0, 0.65);
  line-height: 36rpx;
  padding-top: 20rpx;
}
.filter {
  margin-top: 24rpx;
  display: flex;
}
.storePicker {
  width: 232rpx;
  height: 76rpx;
  background: #ffffff;
  border-radius: 8rpx;
  margin-left: 24rpx;
  display: flex;
}
.storePickerInput {
  height: 36rpx;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  text-align: left;
  color: rgba(0, 0, 0, 0.9);
  line-height: 36rpx;
  margin-left: 32rpx;
  margin-top: 12rpx;
}
.storePickerIcon {
  color: rgba(0, 0, 0, 0.25);
  margin-top: 22rpx;
  margin-right: 4rpx;
}
.keyWordInput {
  height: 36rpx;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  text-align: left;
  color: rgba(0, 0, 0, 0.9);
  line-height: 36rpx;
  margin-left: 24rpx;
  margin-top: 12rpx;
}
.keywords {
  width: 446rpx;
  height: 76rpx;
  background: #ffffff;
  border-radius: 8rpx;
  margin-left: 24rpx;
  display: flex;
}
.keyWordIcon {
  margin-top: 22rpx;
  margin-left: 18rpx;
  color: rgba(0, 0, 0, 0.25);
}
.aptmtCard {
  width: 702rpx;
  height: 212rpx;
  margin-left: 24rpx;
  background: #feffff;
  border-radius: 8px;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.09);
  display: flex;
  margin-bottom: 16rpx;
  margin-top: 32rpx;
}
.aptmtCard > image {
  margin-top: 32rpx;
  margin-left: 24rpx;
  width: 184rpx;
  height: 140rpx;
  border-radius: 4rpx;
}
.cardTile {
  width: 300rpx;
  height: 44rpx;
  font-size: 34rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  text-align: left;
  color: rgba(0, 0, 0, 0.9);
  line-height: 44rpx;
  margin-top: 32rpx;
  margin-left: 24rpx;
}
.cardDesc {
  width: 446rpx;
  height: 88rpx;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  text-align: left;
  color: rgba(0, 0, 0, 0.5);
  line-height: 44rpx;
  margin-left: 24rpx;
  margin-top: 16rpx;
}
.aptmtCardContent {
  display: flex;
}
.cardBtn {
  width: 130rpx;
  height: 56rpx;
  background: #ffffff;
  border: 2rpx solid #5cbb89;
  border-radius: 28rpx;
  font-size: 32rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  text-align: center;
  color: #5cbb89;
  line-height: 52rpx;
  position: relative;
  top: 25rpx;
  z-index: 9999;
}
.clickableArea {
  height: 212rpx;
  width: 520rpx;
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
</style>
