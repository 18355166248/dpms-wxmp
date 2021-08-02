<template>
  <view class="followup-home" @click="hideDropDownBox">
    <calendar
      :value="calendarDate"
      @change="dateChange"
      @collapseChange="collapseChange"
      ref="Calendar"
    />
    <view class="toolbar-wrap">
      <view class="icon-whole iconfont" @click="showFilterModal"></view>
      <text class="date">{{ showDate() }}</text>
      <text class="return" @click="goBackToday" v-if="!isToday()"
        >返回今天</text
      >
    </view>

    <view class="selected-chara-list" v-if="selectedCharas.length > 0">
      <view class="item" v-for="(item, index) in selectedCharas" :key="index">
        <text>{{ item.value }}</text>
        <view class="iconfont iconclose" @click="refreshView(item)"></view>
      </view>
    </view>

    <view class="follow-node-list" v-if="followupList.length > 0">
      <view
        class="follow-node-item"
        v-for="(item, index) in followupList"
        :key="index"
      >
        <view class="name-status">
          <text class="name">{{ item.followUpTypeName }}</text>
          <view class="status-wrap">
            <view :class="['dot', `style-${item.nodeFollowUpStatus}`]"></view>
            <text :class="[`style-${item.nodeFollowUpStatus}`]">{{
              mapStatusValue[item.nodeFollowUpStatus]
            }}</text>
          </view>
        </view>
        <view class="detail">
          <view class="basic">
            <text>{{ item.customerName }}</text>
            <view class="icon-nan iconfont male"></view>
            <view class="iconfont iconphone"></view>
            <text class="phone">{{ item.realMobile }}</text>
            <!-- <view class="icon-shengri iconfont"></view>
            <text class="age">22岁</text> -->
          </view>
          <view
            class="line-info-wrap"
            v-if="
              item.nodeFollowUpStatus === 10 || item.nodeFollowUpStatus === 40
            "
          >
            <view class="left">计划节点时间：</view>
            <view class="right">{{
              formatStamp(item.planFollowUpDate, item.planFollowUpTime)
            }}</view>
          </view>
          <view class="line-info-wrap" v-else>
            <view class="left">实际随访时间：</view>
            <view class="right">{{
              formatStamp(item.planFollowUpDate, item.planFollowUpTime)
            }}</view>
          </view>
          <view class="line-info-wrap">
            <view class="left">随访方式：</view>
            <view class="right">{{ followUpWay[item.followUpWay] }}</view>
          </view>
          <view
            class="line-info-wrap"
            v-if="
              item.nodeFollowUpStatus === 10 || item.nodeFollowUpStatus === 40
            "
          >
            <view class="left">计划随访人：</view>
            <view class="right">{{ item.planFollowUpUserName }}</view>
          </view>
          <view class="line-info-wrap" v-else>
            <view class="left">实际随访人：</view>
            <view class="right">{{ item.planFollowUpUserName }}</view>
          </view>
          <view class="line-info-wrap" v-if="institutionChainType !== 1">
            <view class="left">随访机构：</view>
            <view class="right">{{ item.institutionName }}</view>
          </view>
          <view class="operate">
            <view
              class="more"
              @click.stop="showDropDownBox(index)"
              v-if="item.nodeFollowUpStatus === 10"
            >
              更多
              <view
                class="drop-down"
                v-if="dropDownBoxVisibleIndex === index + 1"
              >
                <view class="stop" @click="terminaNode(item)">终止</view>
                <view class="delete" @click="deleteNode(item)">删除</view>
              </view>
            </view>
            <view
              class="carry mid"
              @click="handleCarry(item)"
              v-if="item.nodeFollowUpStatus === 10"
              >执行</view
            >
            <view
              class="carry mid retry"
              @click="followupAgain(item)"
              v-if="item.nodeFollowUpStatus === 31"
              >重新随访</view
            >
            <view class="inspect" @click="handleInspect(item)">查看</view>
          </view>
        </view>
      </view>
    </view>

    <empty :disabled="true" v-else text="暂无数据" />

    <view class="pop-mask" v-if="filterModal">
      <view class="filter-box-wrap">
        <view class="inner">
          <view class="header">
            <text class="clear" @click="handleReset">清空</text>
            <text>筛选</text>
            <view
              class="icon-ar-close iconfont"
              @click="hideFilterModal"
            ></view>
          </view>
          <view class="status-wrap filter-type">
            <text>按随访状态查看</text>
            <view class="list">
              <view
                :class="[
                  'status-item',
                  statusIndex === index ? 'selected' : '',
                  index % 3 === 1 && index === statusList.length - 1
                    ? 'fix'
                    : '',
                ]"
                v-for="(item, index) in statusList"
                :key="index"
                @click="handleStatusSelect(index)"
              >
                {{ item.value }}
              </view>
            </view>
          </view>
          <view class="institution-wrap filter-type" v-if="!isSingle">
            <view class="callapse">
              <text>按随访机构查看</text>
              <view
                class="iconfont iconup1"
                @click="showDetailIns"
                v-if="institutionNodeVisible"
              ></view>
              <view
                class="iconfont icondown1"
                @click="showDetailIns"
                v-if="!institutionNodeVisible"
              ></view>
            </view>
            <view class="list">
              <view
                :class="[
                  'status-item',
                  institutionIndex.type === 0 ? 'selected' : '',
                ]"
                @click="hanldeSelectInstitution(institutionList[0])"
                >{{ institutionList[0].medicalInstitutionSimpleCode }}</view
              >
            </view>
            <view v-if="institutionNodeVisible">
              <text>大区</text>
              <view class="list">
                <view
                  @click="hanldeSelectInstitution(item, key)"
                  :class="[
                    'status-item',
                    institutionIndex.type === 3 &&
                    institutionIndex.index === key
                      ? 'selected'
                      : '',
                  ]"
                  v-for="(item, key) in regionList"
                  :key="key"
                >
                  {{ item.medicalInstitutionSimpleCode }}
                </view>
              </view>
              <text>连锁直营</text>
              <view class="list">
                <view
                  @click="hanldeSelectInstitution(item, key)"
                  :class="[
                    'status-item',
                    institutionIndex.type !== 3 &&
                    institutionIndex.index === key
                      ? 'selected'
                      : '',
                  ]"
                  v-for="(item, key) in directList"
                  :key="key"
                >
                  {{ item.medicalInstitutionSimpleCode }}
                </view>
              </view>
            </view>
          </view>
          <view class="customer-wrap filter-type">
            <text>按随访人查看</text>
            <view class="list">
              <view
                :class="[
                  'status-item',
                  staffIndex === index ? 'selected' : '',
                  index % 3 === 1 && index === staffs.length - 1 ? 'fix' : '',
                ]"
                v-for="(item, index) in staffs"
                :key="index"
                @click="handleStaffSelect(item, index)"
              >
                {{ item.value }}
              </view>
            </view>
            <view class="row" @click="goSearch">
              <view class="iconfont icon-search"></view>
              <input
                class="search"
                placeholder="搜索随访人"
                placeholder-style="color: #bfbfbf; font-size: 28rpx;"
              />
            </view>
          </view>
          <view class="pop-bottom"
            ><view class="ensure" @click="handleEnsure">确认</view></view
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import calendar from '@/businessComponents/calendar/calendar'
import followConfigData from './Data.js'
import systemAPI from '@/APIS/system.api.js'
import { getStorage, STORAGE_KEY } from '@/utils/storage'
import followupAPI from '@/APIS/followup/followup.api.js'
import Empty from '@/components/empty/empty.vue'

const {
  BACKFILTERMODAL,
  staffs,
  mapStatusValue,
  followUpWay,
  getWeekdays,
} = followConfigData
export default {
  components: {
    calendar,
  },
  data() {
    return {
      // 日历组件日期
      institutionNodeVisible: true,
      institutionChainType: 1,
      followUpWay: followUpWay,
      mapStatusValue: mapStatusValue,
      calendarDate: moment().format('YYYY-MM-DD'),
      statusList: followConfigData.status,
      staffs: staffs,
      filterModal: false,
      dropDownBoxVisibleIndex: false,
      isSingle: false,
      institutionList: [],
      regionList: [],
      directList: [],
      statusIndex: 0,
      staffIndex: 0,
      current: 1,
      followupList: [],
      startTimeStamp: moment().startOf('day').format('x'),
      endTimeStamp: moment().endOf('day').format('x'),
      planFollowUpUserId: '',
      nodeFollowUpStatus: '',
      institutionIndex: {
        index: 0,
        type: 0,
      },
      selectedCharas: [],
    }
  },
  created() {
    const that = this
    this.loginForm = getStorage(STORAGE_KEY.LOGIN_INFO)
    this.medicalInstitution = getStorage(STORAGE_KEY.MEDICALINSTITUTION)
    this.staffs[1].staffId = getStorage(STORAGE_KEY.STAFF).staffId

    this.institutionChainType = this.medicalInstitution.institutionChainType

    // 如果是单店，不用显示随访状态筛选
    if (this.medicalInstitution.institutionChainType === 1) {
      this.isSingle = true
    } else {
      systemAPI
        .getInstitutionListScrm({
          memberName: this.loginForm.memberCode,
          username: this.loginForm.username,
        })
        .then((res) => {
          this.institutionList = res.data
          this.regionList = res.data[0].children.filter(
            (i) => i.medicalInstitutionType === 3,
          )
          this.directList = res.data[0].children.filter(
            (i) => i.medicalInstitutionType !== 3,
          )
        })
    }

    this.getFollowupList()

    this.calendarDate
  },
  onLoad(options) {
    uni.$on('followUpHomeUpdate', () => {
      console.log('home event: followup node already change')
      this.getFollowupList()
    })
    const { staffName, staffId } = options
    if (staffName) {
      this.filterModal = true
      this.staffs = [
        ...this.staffs,
        {
          staffId: staffId,
          value: staffName,
        },
      ]
    }
  },
  onUnload() {
    uni.$off('followUpHomeUpdate')
  },
  methods: {
    refreshView(item) {
      let index
      // 如果是状态
      if (item.hasOwnProperty('key')) {
        this.selectedCharas = this.selectedCharas.filter(
          (i) => !i.hasOwnProperty('key'),
        )
        this.statusIndex = 0
        this.nodeFollowUpStatus = ''
        this.getFollowupList()
      }

      if (item.hasOwnProperty('staffId')) {
        this.selectedCharas = this.selectedCharas.filter(
          (i) => !i.hasOwnProperty('staffId'),
        )
        this.staffIndex = 0
        this.planFollowUpUserId = ''
        this.getFollowupList()
      }
    },
    showDetailIns() {
      this.institutionNodeVisible = !this.institutionNodeVisible
    },
    isToday() {
      return (
        moment().format('YYYYMMDD') ===
        moment(this.calendarDate).format('YYYYMMDD')
      )
    },
    // 显示选中的时间
    showDate() {
      return (
        moment(this.calendarDate).format('MM') +
        '月' +
        moment(this.calendarDate).format('DD') +
        '日' +
        ' ' +
        getWeekdays(moment(this.calendarDate).day())
      )
    },
    formatStamp(stamp, timer) {
      return (
        moment(stamp).format('YYYY-MM-DD') + ' ' + moment(timer).format('HH:mm')
      )
    },
    getFollowupList(params, cb) {
      this.calendarDate =
        this.calendarDate instanceof moment
          ? this.calendarDate
          : moment(String(this.calendarDate))
      uni.showLoading({
        title: '数据加载中',
        mask: true,
      })
      followupAPI
        .getFollowupNodeList({
          size: 1000,
          current: this.current,
          followUpPlanNodeBeginTimeLeft: this.calendarDate
            .startOf('day')
            .format('x'),
          followUpPlanNodeBeginTimeRight: this.calendarDate
            .endOf('day')
            .format('x'),
          planFollowUpUserId: this.planFollowUpUserId,
          nodeFollowUpStatus: this.nodeFollowUpStatus,
          ...params,
        })
        .then((res) => {
          const result = res.data.records || []
          // this.followupList = [...this.followupList, ...result]
          this.followupList = result
          uni.hideLoading()
          cb && cb()
        })
        .catch((err) => {
          uni.hideLoading()
        })
    },
    dateChange({ fulldate }) {
      this.calendarDate = moment(String(fulldate))
      // this.getFollowupList({
      //   followUpPlanNodeBeginTimeLeft: this.calendarDate
      //     .startOf('day')
      //     .format('x'),
      //   followUpPlanNodeBeginTimeRight: this.calendarDate
      //     .endOf('day')
      //     .format('x'),
      // })
    },
    collapseChange(status) {},
    handleEnsure() {
      this.filterModal = false
      this.nodeFollowUpStatus = this.statusList[this.statusIndex].key
      this.planFollowUpUserId = this.staffs[this.staffIndex].staffId
      this.getFollowupList({
        nodeFollowUpStatus: this.nodeFollowUpStatus,
        planFollowUpUserId: this.planFollowUpUserId,
      })

      this.selectedCharas = [
        this.statusIndex && this.statusList[this.statusIndex],
        this.staffIndex && this.staffs[this.staffIndex],
      ].filter((i) => !!i)
    },
    goBackToday() {
      // this.calendarDate = moment().format('YYYY-MM-DD')
      // this.$refs.Calendar.update_month()
      // this.$refs.Calendar.get_date(moment().format('YYYY-MM-DD'))
      this.calendarDate = moment().format('YYYY-MM-DD')
      this.$refs.Calendar.doc_list_update()
      this.$refs.Calendar.update_month()
    },
    handleCarry({ followUpNodeId, followUpPlanId }) {
      uni.navigateTo({
        url: `/pages/followup/execute?followUpNodeId=${followUpNodeId}&followUpPlanId=${followUpPlanId}`,
      })
    },
    handleInspect({ followUpNodeId, followUpPlanId }) {
      uni.navigateTo({
        url: `/pages/followup/detail?followUpNodeId=${followUpNodeId}&followUpPlanId=${followUpPlanId}`,
      })
    },
    followupAgain({ followUpNodeId, followUpPlanId }) {
      uni.navigateTo({
        url: `/pages/followup/execute?followUpNodeId=${followUpNodeId}&followUpPlanId=${followUpPlanId}`,
      })
    },
    showDropDownBox(index) {
      this.dropDownBoxVisibleIndex = index + 1
    },
    hideDropDownBox(e) {
      this.dropDownBoxVisibleIndex = false
    },
    showFilterModal() {
      this.filterModal = true
    },
    handleStatusSelect(index) {
      this.statusIndex = index
    },
    hideFilterModal() {
      this.filterModal = false
    },
    handleReset() {
      this.statusIndex = 0
      this.staffIndex = 0
      this.institutionIndex = {
        index: 0,
        type: 0,
      }
    },
    goSearch() {
      wx.navigateTo({
        url: '/pages/followup/search',
      })
    },
    handleStaffSelect({ staffId }, index) {
      this.staffIndex = index
      this.planFollowUpUserId = staffId
    },
    deleteNode({ followUpNodeId, followUpPlanId }) {
      uni.showModal({
        title: '确认删除该条数据吗？',
        success: async ({ confirm }) => {
          if (confirm) {
            this.$dpmsUtils.showLoading('请稍后...')
            const res = await followupAPI.deleteChildrenCurrentItem({
              followUpNodeId: followUpNodeId,
              followUpPlanId: followUpPlanId,
            })
            this.$dpmsUtils.clearLoading()
            this.$dpmsUtils.show('删除成功', { icon: 'success' })
            this.getFollowupList(
              {},
              () => (this.dropDownBoxVisibleIndex = false),
            )
          }
        },
      })
    },
    terminaNode(item) {
      const { followUpNodeId, followUpPlanId } = item
      uni.navigateTo({
        url: `/pages/followup/terminationNode?followUpNodeId=${followUpNodeId}&followUpPlanId=${followUpPlanId}`,
      })
    },
    hanldeSelectInstitution(item, index) {
      const { parentId, medicalInstitutionType, medicalInstitutionId } = item

      this.institutionIndex = {
        index: index,
        type: parentId === 0 ? parentId : medicalInstitutionType,
      }
    },
  },
  watch: {
    calendarDate(newVal, oldVal) {
      newVal = newVal instanceof moment ? newVal : moment(String(newVal))
      this.selectedCharas = []
      this.statusIndex = 0
      this.staffIndex = 0
      this.nodeFollowUpStatus = ''
      this.planFollowUpUserId = ''
      this.getFollowupList({
        followUpPlanNodeBeginTimeLeft: newVal.startOf('day').format('x'),
        followUpPlanNodeBeginTimeRight: newVal.endOf('day').format('x'),
      })
    },
  },
}
</script>
<style lang="scss" scoped>
view {
  box-sizing: border-box;
}
page {
  width: 100%;
  height: 100%;
}
.followup-home {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  position: relative;
  .selected-chara-list {
    display: flex;
    width: 100%;
    padding: 0 24rpx;
    margin-top: 24rpx;
    .item {
      height: 56rpx;
      opacity: 1;
      background: #eef8f3;
      border: 1rpx solid #5cbb89;
      border-radius: 4rpx;
      padding: 0 22rpx 0 16rpx;
      display: flex;
      align-items: center;
      margin-right: 16rpx;

      > text {
        font-size: 28rpx;
        font-family: PingFangSC, PingFangSC-Regular;
        color: #5cbb89;
        margin-right: 14rpx;
      }
      .iconfont {
        color: #6cc194;
        font-size: 28rpx;
      }
    }
  }
}
.toolbar-wrap {
  margin-top: 16rpx;
  widows: 100%;
  height: 76rpx;
  opacity: 1;
  background: #feffff;
  box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0 32rpx 0 45rpx;
  // justify-content: space-between;
  > view {
    color: #6cc194;
    font-size: 36rpx;
  }
  .date {
    font-size: 28rpx;
    font-family: PingFangSC, PingFangSC-Regular;
    color: rgba(0, 0, 0, 0.9);
    margin-left: 193rpx;
  }
  .return {
    font-size: 28rpx;
    font-family: PingFangSC, PingFangSC-Regular;
    color: #5cbb89;
    margin-left: auto;
  }
}
.follow-node-list {
  width: 702rpx;
  margin: 24rpx auto;

  .follow-node-item {
    box-sizing: border-box;
    width: 100%;
    opacity: 1;
    background: #feffff;
    border-radius: 8rpx;
    box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
    padding: 24rpx;
    margin-bottom: 24rpx;

    .name-status {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .name {
        opacity: 1;
        font-size: 34rpx;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.9);
      }
      .status-wrap {
        display: flex;
        align-items: center;

        .dot {
          width: 16rpx;
          height: 16rpx;
          opacity: 1;
          background: #5cbb89;
          border-radius: 50%;
          margin-right: 8rpx;
          &.style-10 {
            background: #faad14;
          }
          &.style-31 {
            background: #e64040;
          }
          &.style-35 {
            background: #5cbb89;
          }
        }
        .style-10 {
          color: #faad14;
        }
        .style-31 {
          color: #e64040;
        }
        .style-35 {
          color: #5cbb89;
        }
      }
    }

    .detail {
      margin-top: 24rpx;
      .basic {
        display: flex;
        align-items: center;
        .male {
          color: #1890ff;
          margin: 0 35rpx 0 12rpx;
        }
        > text {
          font-size: 28rpx;
          font-family: PingFangSC, PingFangSC-Regular;
          color: #191919;
        }
        > view {
          color: #7f7f7f;
        }
        .phone {
          margin: 0 28rpx 0 15rpx;
        }
        .age {
          margin-left: 12rpx;
        }
      }
      .line-info-wrap {
        display: flex;
        align-items: center;
        margin-top: 16rpx;
        .left {
          width: 196rpx;
          font-size: 28rpx;
          font-family: PingFangSC, PingFangSC-Regular;
          color: #4c4c4c;
        }
        .right {
          font-size: 28rpx;
          font-family: PingFangSC, PingFangSC-Regular;
          color: #191919;
        }
      }
      .operate {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 24rpx;
        .more {
          font-size: 28rpx;
          font-family: PingFangSC, PingFangSC-Regular;
          color: #4c4c4c;
          position: relative;
          .drop-down {
            position: absolute;
            width: 152rpx;
            height: 204rpx;
            opacity: 1;
            background: #ffffff;
            box-shadow: 0rpx 4rpx 16rpx 6rpx rgba(0, 0, 0, 0.08);
            left: 50%;
            transform: translateX(-50%);
            top: 56rpx;
            > view {
              font-size: 28rpx;
              font-family: PingFangSC, PingFangSC-Regular;
              color: #4c4c4c;
              width: 152rpx;
              height: 96rpx;
              line-height: 96rpx;
              text-align: center;
            }
            .stop {
              border-bottom: 1px solid #e5e5e5;
            }
          }
        }
        .carry,
        .inspect {
          text-align: center;
          line-height: 56rpx;
          width: 120rpx;
          height: 56rpx;
          opacity: 1;
          background: #ffffff;
          border: 2rpx solid #5cbb89;
          border-radius: 30rpx;
          font-size: 28rpx;
          font-family: PingFangSC, PingFangSC-Regular;
          color: #5cbb89;
        }
        .retry {
          width: 176rpx;
        }
        .mid {
          margin: 0 16rpx 0 32rpx;
        }
      }
    }
  }
}
.pop-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  opacity: 1;
  background: rgba(0, 0, 0, 0.5);
  .filter-box-wrap {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 750rpx;
    overflow-y: scroll;
    height: 80%;
    opacity: 1;
    background: #ffffff;
    border-radius: 24rpx 24rpx 0rpx 0rpx;
    .inner {
      position: relative;
      width: 750rpx;
      opacity: 1;
      background: #ffffff;
      border-radius: 24rpx 24rpx 0rpx 0rpx;
      padding-top: 111rpx;
    }
    .header {
      z-index: 10;
      position: fixed;
      left: 0;
      top: 20%;
      display: flex;
      width: 100%;
      height: 111rpx;
      padding: 0 32rpx;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      border-bottom: 1px solid #e5e5e5;
      .clear {
        font-size: 28rpx;
        font-family: PingFangSC, PingFangSC-Regular;
        color: #5cbb89;
      }
    }
    .filter-type {
      width: 100%;
      padding: 32rpx;
      border-bottom: 1px solid #e5e5e5;
      .callapse {
        display: flex;
        justify-content: space-between;
        align-items: center;
        > text {
          font-size: 34rpx;
          font-family: PingFangSC, PingFangSC-Regular;
          color: #191919;
          display: block;
        }
        .iconfont {
          color: #4c4c4c;
          font-size: 50rpx;
        }
      }
      > text {
        font-size: 34rpx;
        font-family: PingFangSC, PingFangSC-Regular;
        color: #191919;
        display: block;
      }
      .list {
        margin-top: 16rpx;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      .status-item {
        width: 218rpx;
        height: 68rpx;
        opacity: 1;
        background: #ffffff;
        border: 1rpx solid rgba(0, 0, 0, 0.15);
        border-radius: 8rpx;
        margin-bottom: 16rpx;
        font-size: 28rpx;
        font-family: PingFangSC, PingFangSC-Regular;
        color: #595959;
        text-align: center;
        line-height: 68rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 24rpx;
        &.selected {
          background: #eef8f3;
          border: 1rpx solid #5cbb89;
          color: #5cbb89;
        }
      }
      .fix {
        transform: translateX(-234rpx);
      }
    }
    .customer-wrap {
      .row {
        position: relative;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .iconfont {
          position: absolute;
          color: #b2b2b2;
          left: 31rpx;
          top: 50%;
          transform: translateY(-20%);
        }
      }
      .search {
        padding-left: 80rpx;
        margin-top: 22rpx;
        width: 686rpx;
        height: 72rpx;
        opacity: 1;
        background: #ffffff;
        border: 1rpx solid #d9d9d9;
        border-radius: 8rpx;
      }
    }
    .pop-bottom {
      position: sticky;
      height: 196rpx;
      left: 0;
      bottom: 0;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      .ensure {
        width: 686rpx;
        height: 80rpx;
        opacity: 1;
        background: #5cbb89;
        border-radius: 40rpx;
        font-size: 36rpx;
        font-family: PingFangSC, PingFangSC-Regular;
        line-height: 80rpx;
        color: #ffffff;
        text-align: center;
        z-index: 100;
      }
    }
  }
}
</style>
