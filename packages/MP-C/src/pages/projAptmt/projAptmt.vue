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
          <text>{{ pickerText }}</text>
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
              @click="handleAptmt(p)"
              >预 约</view
            >
          </view>
          <view class="cardDesc">{{
            p.itemBriefIntroduction.length > 35
              ? p.itemBriefIntroduction.substring(0, 35) + '...'
              : p.itemBriefIntroduction
          }}</view>
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
import { mapState } from 'vuex'

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
      params: '',
    }
  },
  onShareAppMessage(res) {
    return {
      path: '/pages/projAptmt/projAptmt',
    }
  },
  onLoad(params) {
    this.params = params
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
  computed: {
    ...mapState('loginStore', {
      MEDICALINSTITUTION: (state) => state.MEDICALINSTITUTION,
    }),
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
  },
  watch: {
    selectedIndex() {
      this.emitPullDownRefresh()
    },
    MEDICALINSTITUTION(newVal) {
      this.init(this.params)
    },
  },
  methods: {
    init(params) {
      const { appointmentInstitutionId } = params
      institutionAPI
        .getFilterStoreList({
          medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
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
    handleAptmt({ appointmentItemId, itemId }) {
      const { toUrl } = this
      uni.showLoading({
        title: '加载中...',
      })
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
                  '&shopId=' +
                  canApptInstitutionList[0].appointmentInstitutionId,
              )
            }
            if (canApptInstitutionList.length > 1) {
              toUrl(
                '/pages/projAptmt/projDetail?appointmentItemId=' +
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
    jump(url) {
      uni.redirectTo({ url })
    },
    setKeyWord(e) {
      this.keyWord = e.target.value
      this.emitPullDownRefresh()
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
  padding: 0 24rpx;
  display: flex;
}
.storePicker {
  width: 232rpx;
  height: 76rpx;
  background: #ffffff;
  border-radius: 8rpx;
  padding: 0 30rpx 0 32rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.storePickerIcon {
  margin-left: 16rpx;
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
  height: 212rpx;
  background: #feffff;
  display: flex;
  margin-bottom: 16rpx;
}
.aptmtCard > image {
  margin-top: 32rpx;
  margin-left: 24rpx;
  width: 184rpx;
  height: 156rpx;
  border-radius: 4rpx;
}
.cardTile {
  width: 350rpx;
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
  margin-top: 12rpx;
  overflow: hidden;
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
  font-size: 28rpx;
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
