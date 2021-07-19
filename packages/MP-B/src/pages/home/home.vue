<template>
  <view class="home-view">
    <nav-bar
      :navLeftLoading="switchClinicStatus === 'loading'"
      :navHeight="navHeight"
      :navTop="navTop"
      :capsuleHeight="capsuleHeight"
      :navLeftText="medicalInstitutionSimpleCode"
      @click="switchClinic"
    />
    <view class="header-wrapper pt-47">
      <view class="header">
        <view
          class="header-search-wrapper"
          @click="toUrl('/pages/patient/searchPatient/searchPatient')"
        >
          <view class="header-search-wrapper-input">
            搜索
          </view>
          <text class="iconfont icon-search"></text>
        </view>
        <!--新建-->
        <dropDown :list="getDropDownList()" @select="dropMenuSelect">
          <view class="btn-new">
            <text>新建</text>
          </view>
        </dropDown>
      </view>
      <view class="c-white mt-36 fz-34 ml-32">你好，{{ staffName }}</view>
    </view>

    <view class="mt-64">
      <view
        class="statistics ph-32 mh-32 mb-32"
        v-if="!isHeadquartersAndRegion"
      >
        <view class="statistics-header" @click="toggle">
          今日统计
          <text v-if="visible" class="iconfont icon-eye ml-18"></text>
          <text v-else class="iconfont icon-no-eye ml-18"></text>
        </view>
        <view class="statistics-body">
          <view
            class="statistics-item"
            @click="toUrl(`/pages/patient/searchPatient/searchPatient?type=3`)"
          >
            <view class="statistics-item-header">
              {{ pageData.patientCount }}
            </view>
            <text class="statistics-item-body">新增患者</text>
          </view>
          <view
            class="statistics-item"
            @click="toUrl('/baseSubpackages/apptView/apptView')"
          >
            <view class="statistics-item-header">
              {{ pageData.appointmentCount }}
            </view>

            <text class="statistics-item-body">新增预约</text>
          </view>
          <view
            class="statistics-item"
            @click="toUrl('/baseSubpackages/todayWork/todayWork')"
          >
            <view class="statistics-item-header">
              {{ pageData.registerFirstDiagnosisCount }}
              /
              {{ pageData.registerCount }}
            </view>
            <text class="statistics-item-body">今日就诊</text>
          </view>
          <view class="statistics-item" @click="jumpStatistics">
            <view class="statistics-item-header">
              <toggle :text="price" :isVisible="visible"></toggle>
            </view>
            <text class="statistics-item-body">实收金额</text>
          </view>
        </view>
      </view>
      <!--常用功能-->
      <view class="common-functions-List-wrap pb-32">
        <view class="menu-area-header ph-32 pb-32">常用功能</view>
        <commonUseFunctionsList :menuList="commonFuns"></commonUseFunctionsList>
      </view>
      <!--统计报表-->
      <view class="menu-area pb-48 ph-32" v-if="isShowReportIcon">
        <view class="menu-area-header">
          统计报表
        </view>
        <view class="menu-area-body mt-41">
          <view
            class="menu-area-item"
            @click="toUrl('/baseSubpackages/statistics/statistics')"
            v-if="iconShow.isStatisticsShow"
          >
            <view class="menu-area-item-icon menu-area-item-icon-color4">
              <text class="iconfont icon-statis"></text>
            </view>
            <view class="menu-area-item-txt mt-24">
              诊所统计
            </view>
          </view>
          <view
            class="menu-area-item"
            @click="toUrl('/baseSubpackages/revenueForm/revenueForm')"
            v-if="iconShow.isReportShow"
          >
            <view class="menu-area-item-icon menu-area-item-icon-color5">
              <text class="iconfont icon-chart"></text>
            </view>
            <view class="menu-area-item-txt mt-24">
              营收报表
            </view>
          </view>
          <view
            class="menu-area-item"
            @click="openBillPopup"
            v-if="menuPermission(['report-center', 'finance-reconclie'])"
          >
            <view class="menu-area-item-icon menu-area-item-icon-color8">
              <text class="iconfont icon-bill-fill"></text>
            </view>
            <view class="menu-area-item-txt mt-24">
              财务对账
            </view>
          </view>
          <view
            class="menu-area-item"
            @click="openAchPopup"
            v-if="menuPermission(['report-center', 'performance'])"
          >
            <view class="menu-area-item-icon menu-area-item-icon-color7">
              <text class="iconfont icon-ar-report"></text>
            </view>
            <view class="menu-area-item-txt mt-24">
              绩效报表
            </view>
          </view>
        </view>
      </view>
    </view>
    <selectMedicalInstitution
      ref="selectMedicalInstitution"
      @confirm="selectClinic"
    ></selectMedicalInstitution>
    <achevementpopup ref="achevementpopup" id="achevementpopup" />
    <actionSheet
      background="#fff"
      @close="showActionSheet = false"
      v-if="showActionSheet"
    >
      <billReport @closeModal="showActionSheet = false" />
    </actionSheet>
  </view>
</template>

<script>
import moment from 'moment'
import navBar from '@/components/nav-bar/nav-bar'
import commonUseFunctionsList from 'businessComponents/commonUseFunctionsList/commonUseFunctionsList'
import diagnosisAPI from '@/APIS/diagnosis/diagnosis.api'
import appointmentAPI from 'APIS/appointment/appointment.api'
import institutionAPI from 'APIS/institution/institution.api'

import toggle from '@/components/toggle/toggle'
import dropDown from './dropDown.vue'

import { globalEventKeys } from '@/config/global.eventKeys'
import { mapState } from 'vuex'
import { setCustomOpenId } from '@/utils/utils'
import billReport from '@/pages/home/billReport'
import billAPI from '../../APIS/bill/bill.api'
import { checkQwInstitution } from '@/utils/utils'

import systemAPI from '@/APIS/system.api.js'

const commonParams = { modelId: 2, key: 'commonMenuFuns' }

export default {
  components: {
    navBar,
    toggle,
    dropDown,
    billReport,
    commonUseFunctionsList,
  },
  data() {
    return {
      title: '首页',
      visible: true,
      // 下拉刷新的配置(可选, 绝大部分情况无需配置)
      downOption: {
        textColor: '#fff',
        textLoading: '正在加载',
      },
      scrollTop: '0px',

      newBtnNames: ['新建患者', '新建预约'],
      btnIndex: 0,
      newBtns: [
        '/pages/patient/createPatient/createPatient',
        '/baseSubpackages/apptView/apptView',
      ],

      // 上拉加载的配置(可选, 绝大部分情况无需配置)
      upOption: {
        isLock: true,
        use: false,
      },

      switchClinicStatus: 'success',
      INSTITUTION_CHAIN_TYPE_ENUM: this.$dpmsUtils.getEnums(
        'InstitutionChainType',
      ),
      // 列表数据
      pageData: {
        patientCount: 0,
        appointmentCount: 0,
        registerFirstDiagnosisCount: 0,
        registerCount: 0,
        actualIncome: 0,
      },
      iconShow: {
        isStatisticsShow: false,
        isReportShow: false,
        isFinanceShow: false, // 这两个字段是为了兼容原来的写法，其实已经没有必要了，按钮有单独的权限函数做控制
        isPerformanceShow: false, // 下次如果再加字段，这里统一改造
      },
      showActionSheet: false,
      commonFuns: [],
    }
  },
  onShareAppMessage() {
    return {
      title: '北吉熊口腔',
      path: '/pages/home/home',
    }
  },
  onLoad() {
    checkQwInstitution()
    // 小程序请求数据，一般写在健壮的onLoad， 因为onShow会导致返回页面也加载
    this.init()
    setCustomOpenId()
    uni.$on(globalEventKeys.newPatient, () => {
      this.init()
    })
    this.getAmountDisplay()
  },
  onShow() {
    this.setMenusList()
  },
  onUnload() {
    uni.$off(globalEventKeys.newPatient)
  },
  onPullDownRefresh() {
    this.pullDownLoadData()
  },
  computed: {
    ...mapState('workbenchStore', ['medicalInstitution', 'staff', 'menu']),
    initIconShow() {
      const { menuList, pageElementsList } = this.menu

      this.iconShow.isStatisticsShow =
        pageElementsList?.findIndex((v) => {
          return v.enumValue === '11004'
        }) > -1 ||
        pageElementsList?.findIndex((v) => {
          return v.enumValue === '11003'
        }) > -1 ||
        pageElementsList?.findIndex((v) => {
          return v.enumValue === '11002'
        }) > -1 ||
        pageElementsList?.findIndex((v) => {
          return v.enumValue === '11001'
        }) > -1

      const findObj =
        menuList &&
        menuList.find((v) => {
          return v.enumValue === 'report-center'
        })

      this.iconShow.isReportShow =
        findObj &&
        findObj.children.findIndex((v) => {
          return v.enumValue === 'marketing-report'
        }) > -1
      this.iconShow.isFinanceShow =
        findObj &&
        findObj.children.findIndex((v) => {
          return v.enumValue === 'finance-reconclie'
        }) > -1
      this.iconShow.isPerformanceShow =
        findObj &&
        findObj.children.findIndex((v) => {
          return v.enumValue === 'performance'
        }) > -1
    },
    institutionChainTypeKey() {
      if (this.INSTITUTION_CHAIN_TYPE_ENUM && this.medicalInstitution) {
        if (
          this.INSTITUTION_CHAIN_TYPE_ENUM.properties &&
          this.medicalInstitution.institutionChainType
        ) {
          return this.INSTITUTION_CHAIN_TYPE_ENUM.properties[
            this.medicalInstitution.institutionChainType
          ].key
        }
      }
    },
    isHeadquartersAndRegion() {
      return (
        (this.medicalInstitution.topParentId === 0 &&
          this.medicalInstitution.institutionChainType === 2) ||
        this.medicalInstitution.institutionChainType === 3
      )
    },
    capsuleHeight() {
      return `${uni.getMenuButtonBoundingClientRect().height}px`
    },
    navHeight() {
      return (
        this.$systemInfo.statusBarHeight +
        uni.getMenuButtonBoundingClientRect().height +
        (uni.getMenuButtonBoundingClientRect().top -
          this.$systemInfo.statusBarHeight)
      )
    },
    staffName() {
      const { name, staffName } = this.staff || {}
      return name || staffName || '--'
    },
    medicalInstitutionSimpleCode() {
      if (this.switchClinicStatus === 'loading') {
        return '诊所切换中...'
      } else if (this.switchClinicStatus === 'error') {
        return '切换失败，请重试'
      }
      return this.medicalInstitution
        ? this.medicalInstitution.medicalInstitutionSimpleCode
        : '--'
    },
    price() {
      return this.$dpmsUtils.formatPrice(this.pageData.actualIncome)
    },
    scrollHeight() {
      return this.$systemInfo.windowHeight - this.navHeight + 'px'
    },
    // 计算属性的 getter
    navTop() {
      return `${uni.getMenuButtonBoundingClientRect().top}px`
    },
    viewHeight() {
      return this.$systemInfo.windowHeight - this.navHeight + 'px'
    },
    isShowReportIcon() {
      return (
        this.iconShow.isFinanceShow ||
        this.iconShow.isPerformanceShow ||
        this.iconShow.isReportShow ||
        this.iconShow.isStatisticsShow
      )
    },
  },
  methods: {
    async getCommonFunsList() {
      const res = await systemAPI.getCommonFunsList()
      return res.data
    },
    // 获取常用功能配置
    async getCommonFunsConfig() {
      const res = await systemAPI.getCommonFunsConfig(commonParams)
      return res.data
    },
    async setMenusList() {
      const data = await this.getCommonFunsList()
      const res = await this.getCommonFunsConfig()
      const menuIds = data.menus.map((e) => e.enumValue)
      // res 为 空字符串 表示 初始化, 尚未对常用功能进行修改, 已选数据为默认数据, 修改过后的已选数据 以配置接口返回的数据为准
      let selectArr =
        res === ''
          ? data.defaultMenus
          : res.filter((e) => menuIds.indexOf(e) > -1)
      const arr = data.menus.map((e) => {
        return {
          ...e,
          type: e.enumValue.replaceAll('-', ''),

          status: selectArr.indexOf(e.enumValue) > -1,
        }
      })

      this.commonFuns = selectArr
        .map((e) => {
          let _index = arr.findIndex((k) => k.enumValue == e)
          return {
            ...arr[_index],
          }
        })
        .slice(0, 7)
    },
    getDropDownList() {
      let list = [
        {
          name: '新建患者',
          value: 'newPatient',
          icon: 'icon-patient',
        },
        { name: '新建预约', value: 'newAppt', icon: 'icon-clock' },
      ]
      if (this.isHeadquartersAndRegion) {
        return list.slice(0, 1)
      }
      return list
    },
    dropMenuSelect(val) {
      const urls = {
        newPatient: '/pages/patient/createPatient/createPatient',
        newAppt: '/baseSubpackages/apptView/apptView',
      }
      this.toUrl(urls[val])
    },
    switchClinic() {
      if (this.institutionChainTypeKey !== 'SINGLE_STORE') {
        this.$refs.selectMedicalInstitution.show()
      }
    },
    openAchPopup() {
      this.$refs.achevementpopup.open()
    },
    openBillPopup() {
      this.showActionSheet = true
    },
    toUrl(url) {
      this.$dpmsUtils.push({
        url,
      })
    },
    jumpStatistics() {
      if (this.iconShow.isStatisticsShow) {
        this.toUrl('/baseSubpackages/statistics/statistics')
      }
    },
    toggle() {
      this.visible = !this.visible
    },
    bindPickerChange(e) {
      this.roleIndex = e.target.value
      this.selectedRole = this.roles[this.roleIndex]
    },
    /*下拉刷新的回调, 有三种处理方式:*/
    async pullDownLoadData() {
      const [err, res] = await this.loadData()
      uni.stopPullDownRefresh()
    },
    async loadData() {
      const [err, res] = await this.$dpmsUtils.asyncTasks(
        diagnosisAPI.getTodayWorkStatistics({
          beginTimestamp: moment().startOf('day').valueOf(),
          endTimestamp: moment().endOf('day').valueOf(),
        }),
      )

      if (err) {
        return [err, null]
      }

      if (res) {
        this.pageData = res.data
        return [null, res]
      }
    },
    async getAmountDisplay() {
      const res = await billAPI.getAmountDisplaySet()
      if (res.code === 0 && res.data) {
        res.data.forEach((item) => {
          if (item.configCode === 'payment_amount_show_switch') {
            this.visible = item.configValue === '1' ? false : true
          }
        })
      }
    },
    async init() {
      if (!this.isHeadquartersAndRegion) {
        uni.showLoading({
          title: '正在加载',
          mask: true,
        })
        const [err, res] = await this.loadData()
        uni.hideLoading()
      }
    },
    async selectClinic(val) {
      console.log('val:', val)
      this.switchClinicStatus = 'loading'

      const [err, res] = await this.$dpmsUtils.asyncTasks(
        institutionAPI.switchInstitution({
          _mtId: val.source.medicalInstitutionId,
          _cmtId: val.source.topParentId,
          _cmtType: val.source.institutionChainType,
        }),
      )
      if (err) {
        this.switchClinicStatus = 'error'
      }
      if (res) {
        const medicalInstitution = {
          ...res.data.medicalInstitution,
          tenantId: this.medicalInstitution.tenantId,
        }

        this.switchClinicStatus = 'success'
        this.$store.commit('workbenchStore/setStaff', res.data.staff)
        this.$store.commit(
          'workbenchStore/setMedicalInstitution',
          medicalInstitution,
        )
        this.getApptSetting()
        this.init()
        this.setMenusList()
      }
    },
    // 获取预约视图设置
    getApptSetting() {
      appointmentAPI
        .getSetting()
        .then((res) => {
          const { data } = res
          this.$store.commit('workbenchStore/setApptSetting', data)
        })
        .catch()
    },
  },
}
</script>

<style lang="scss" scoped>
.home-view {
  height: 100%;
  background: #fff
    // url(https://medcloud.oss-cn-shanghai.aliyuncs.com/dental/saas/mini-app/home-header-bg.png)
    url('~@/static/home-bg.png') 0 0 no-repeat;
  background-size: 100%;
  .home-bg {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 0;
    &-img {
      width: 100%;
    }
  }
  .header-wrapper {
    .header {
      $height: 76rpx;
      $frontColor: #feffff;

      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      &-search-wrapper {
        flex: 1;
        position: relative;
        height: $height;
        background: $frontColor;
        border-radius: 8rpx;
        padding-left: 66rpx;
        margin-left: 32rpx;
        color: rgba(0, 0, 0, 0.25);
        &-input {
          width: 100%;
          height: $height;
          line-height: $height;
          font-size: 28rpx;
        }
        .iconfont {
          position: absolute;
          left: 16rpx;
          top: 50%;
          transform: translateY(-50%);
          font-size: 40rpx;
          font-weight: 700;
          color: rgba($color: #000000, $alpha: 0.25);
        }
      }
      .btn-new {
        padding: 0 24rpx;
        font-size: 34rpx;
        height: $height - 4rpx;
        line-height: $height - 4rpx;
        color: $frontColor;
        .iconfont {
          font-size: 42rpx;
        }
      }
    }
  }
  .common-functions-List-wrap {
    width: 100%;
    padding-top: 40rpx;
    background-color: white;
  }
  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }
  .statistics {
    padding: 32rpx 0;
    background: #feffff url('~@/static/tooth.png') no-repeat right 16rpx;
    background-size: 94rpx 136rpx;
    border-radius: 8rpx;
    box-shadow: 0 20rpx 20rpx 0 rgba(0, 0, 0, 0.09);

    &-header {
      color: rgba(0, 0, 0, 0.9);
      padding: 0 32rpx;
      font-size: 36rpx;
      font-weight: 500;
      margin-bottom: 48rpx;
      .iconfont {
        font-size: 36rpx;
        color: rgba(0, 0, 0, 0.45);
      }
    }
    &-body {
      display: flex;
      flex-direction: row;
      .statistics-item {
        display: flex;
        padding: 0 31rpx;
        flex-direction: column;
        flex: 1;
        border-right: 1rpx dashed rgba(0, 0, 0, 0.15);
        justify-content: center;
        align-items: flex-start;

        &-header {
          margin-bottom: 16rpx;
          font-size: 34rpx;
          font-weight: 500;
        }

        &-body {
          color: rgba(0, 0, 0, 0.45);
          font-size: 24rpx;
        }

        &:last-child {
          border: none;
        }
      }
    }
  }
  .menu-area {
    $width: 112rpx;
    background: #fff;

    @mixin colors($linearStartColor, $linearEndColor) {
      box-shadow: 0px 20px 20px -20px $linearEndColor;
      background: linear-gradient(
        323deg,
        $linearStartColor 10%,
        $linearEndColor 89%
      );
    }

    &-header {
      font-size: 36rpx;
      font-weight: 500;
    }

    &-body {
      display: flex;
      flex-direction: row;
      .menu-area-item {
        width: $width;
        margin-right: 80rpx;
        text-align: center;
        &-icon {
          width: $width;
          height: $width;
          line-height: $width;
          border-radius: 40rpx;
          text-align: center;
          color: #fff;
          .iconfont {
            font-size: 60rpx;
          }
        }
        &-icon-color1 {
          $values: rgba(91, 218, 153, 1), rgba(52, 197, 122, 1);
          @include colors($values...);
        }
        &-icon-color2 {
          $values: rgba(254, 178, 119, 1), rgba(251, 141, 81, 1);
          @include colors($values...);
        }
        &-icon-color3 {
          $values: rgba(110, 167, 252, 1), rgba(74, 147, 254, 1);
          @include colors($values...);
        }
        &-icon-color4 {
          $values: rgba(179, 127, 235, 1), rgba(114, 46, 209, 1);
          @include colors($values...);
        }
        &-icon-color5 {
          $values: rgba(255, 133, 192, 1), rgba(235, 47, 150, 1);
          @include colors($values...);
        }
        &-icon-color7 {
          $values: #bfdf27, #8bbb11;
          @include colors($values...);
        }
        &-icon-color8 {
          $values: #ff8487, #ff4d4f;
          @include colors($values...);
        }
        &-txt {
          font-size: 28rpx;
        }
      }
    }
  }
  .popup-content {
    background-color: #fff;
    padding: 15px;
  }
}
</style>
