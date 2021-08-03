<template>
  <view class="detailPage">
    <scroll-view scroll-y class="h100 detail-sv">
      <view class="bg" />
      <view class="patientInfo tc">
        <view class="patientCard">
          <view class="patientDetail">
            <view>
              <patientAvatar :patient="customer" />
            </view>
            <view class="patientCenter">
              <view class="patientTop text-ellipsis">
                {{ customer.name }}
              </view>
              <view class="patientC mt-8 mb-16">
                <span class="gender mr-8">{{
                  customer.gender | getGenderText
                }}</span>
                <span class="age">{{ customer.age }}</span>
              </view>
              <view class="patientBottom">
                <span>联系方式:</span>
                <span class="ml-10">{{ customer.mobile }}</span>
              </view>
            </view>
            <view class="patientRight">
              <span
                :class="['circular', `followState_${followDetail.status}`]"
              ></span>
              <span :class="[`state_${followDetail.status}`]">
                {{ followDetail.status | getFollowStateText }}
              </span>
            </view>
          </view>
        </view>
      </view>
      <view style="height: 208rpx;"></view>
      <view class="follow-info">
        <view class="detail-info">
          <span>就诊信息:</span>
          <span>{{ followDetail.diagnosisTime | filterText }}</span>
        </view>
        <view class="detail-info">
          <span>随访类型:</span>
          <span>{{ followDetail.followUpTypeName | filterText }}</span>
        </view>
        <view class="detail-info">
          <span>计划随访人:</span>
          <span>{{ followDetail.createUserName | filterText }}</span>
        </view>
        <view class="detail-info">
          <span>节点计划时间:</span>
          <span>{{ planBeginTime }}~{{ planEndTime }}</span>
        </view>
        <view class="detail-info">
          <span>随访方式:</span>
          <span>{{ followDetail.followUpWay | getFollowUpWayText }}</span>
        </view>
        <view v-if="followDetail.followUpWay == 4" class="detail-info">
          <span>日程提醒:</span>
          <span>{{ followDetail.weWorkSendBefore | getScheduleInterval }}</span>
        </view>
        <view v-if="followDetail.followUpWay == 4" class="detail-info">
          <span>日程提醒人:</span>
          <span>{{
            followDetail.receiver.receiverNick
              ? followDetail.receiver.receiverNick
              : '-'
          }}</span>
        </view>
      </view>
      <view class="followUpNode">
        <view class="nodeTitle">
          <span class="icon_plane iconfont icon-calendar-check"></span>
          随访计划 (完成{{ finishTime }}/{{ totalTime }})
        </view>
        <followNode
          :nodeList="nodeList"
          :followUpNodeId="followUpNodeId"
          :followUpPlanId="followUpPlanId"
          :customer="customer"
        />
      </view>
    </scroll-view>
  </view>
</template>

<script>
import patientAvatar from '../../businessComponents/patientAvatar/patientAvatar.vue'
import { commonUtil } from 'mpcommon'
import moment from 'moment'
import followupAPI from '@/APIS/followup/followup.api.js'
import followNode from './common/followNode'

const GENDER_ENUM = commonUtil.getEnums('Gender')

export default {
  components: {
    patientAvatar,
    followNode,
  },
  data() {
    return {
      followDetail: {},
      nodeList: [],
      customer: {},
      planBeginTime: '',
      planEndTime: '',
      totalTime: 0,
      finishTime: 0,
      followUpNodeId: null,
      followUpPlanId: null,
    }
  },
  filters: {
    getGenderText(gender) {
      if (GENDER_ENUM && GENDER_ENUM.properties && gender) {
        return GENDER_ENUM.properties[gender].text.zh_CN
      }
      return '未知'
    },
    filterText(text) {
      if (!text) {
        return '-'
      }
      var textValue = text.replace(/(^\s*)|(\s*$)/g, '')
      if (!textValue || textValue == '') {
        return '-'
      }
      return text
    },
    getFollowStateText(state) {
      if (state == 10) {
        return '待随访'
      } else if (state == 20) {
        return '随访中'
      } else if (state == 30) {
        return '随访完成'
      } else if (state == 40) {
        return '终止随访'
      }
    },
    getFollowUpWayText(way) {
      if (way == 1) {
        return '人工随访'
      } else if (way == 2) {
        return '个人微信'
      } else if (way == 3) {
        return '公众号'
      } else if (way == 4) {
        return '企业微信'
      }
    },
    getScheduleInterval(time) {
      if (time == 1) {
        return '提前5分钟'
      } else if (time == 2) {
        return '提前10分钟'
      } else if (time == 3) {
        return '提前15分钟'
      } else if (time == 4) {
        return '提前30分钟'
      } else if (time == 5) {
        return '提前1小时'
      }
    },
  },
  onLoad(params) {
    this.followUpNodeId = params.followUpNodeId
    this.followUpPlanId = params.followUpPlanId
    uni.$on('followUpDetailUpdate', () => {
      console.log('detail followUpDetailUpdate event')
      this.getFollowUpList()
    })
    this.getFollowUpList()
  },
  onShow() {},
  onUnload() {
    uni.$off('followUpDetailUpdate')
  },
  computed: {},
  methods: {
    getFollowUpList() {
      let that = this
      followupAPI.getDetailService({ id: this.followUpPlanId }).then((res) => {
        console.log('detail', res)
        if (res.code == 0) {
          const { nodeList, customer } = res.data
          that.followDetail = {
            ...res.data,
            diagnosisTime: res.data?.diagnosisTime
              ? moment(res.data.diagnosisTime).format('YYYY-MM-DD HH:mm')
              : '无',
            createUserName: res.data?.createUserName
              ? res.data.createUserName
              : '',
          }
          that.nodeList = nodeList
          that.totalTime = nodeList.length
          const finish = nodeList.filter((v) => v?.nodeFollowUpStatus != 10)
          that.finishTime = finish.length
          ;(that.planBeginTime = nodeList[0]?.planFollowUpDate
            ? moment(nodeList[0].planFollowUpDate).format('YYYY-MM-DD')
            : ''),
            (that.planEndTime = nodeList[nodeList.length - 1]?.planFollowUpDate
              ? moment(nodeList[nodeList.length - 1].planFollowUpDate).format(
                  'YYYY-MM-DD',
                )
              : ''),
            (that.customer = {
              ...customer,
              name: customer.name || '',
              gender: customer.gender || 3,
              age: customer.medicalRecordNo || '',
              mobile: customer.mobile || '',
            })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.detailPage {
  width: 100%;
  height: 100%;
  background: #fff;
  padding-bottom: 68rpx;
  scroll-view {
    height: 100%;
    position: relative;
    .bg {
      position: absolute;
      width: 2500rpx;
      height: 2440rpx;
      border-radius: 1250rpx;
      top: -2300rpx;
      left: -875rpx;
      background-color: $common-color;
    }
  }
  .patientInfo {
    box-sizing: border-box;
    .patientCard {
      display: inline-block;
      width: 702rpx;
      height: 208rpx;
      position: absolute;
      top: 0rpx;
      left: 50%;
      margin-left: -351rpx;
      background-color: #fff;
      padding: 32rpx 24rpx;
      box-sizing: border-box;
      border-radius: 8rpx;
      box-shadow: 0rpx 4rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
      > .patientDetail {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        .patientCenter {
          padding-left: 32rpx;
          flex: 1;
          text-align: left;
          overflow: hidden;
          .patientTop {
            width: 100%;
            font-size: 34rpx;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.9);
            overflow: hidden;
          }
          .patientC {
            font-size: 26rpx;
            .age,
            .gender {
              vertical-align: middle;
              display: inline-block;
              background: #fff2e8;
              color: #fa541c;
              border-radius: 2rpx;
              height: 40rpx;
              line-height: 40rpx;
              text-align: center;
              padding: 2rpx 16rpx;
            }
          }
          .patientBottom {
            color: rgba($color: #000000, $alpha: 0.5);
            font-size: 28rpx;
          }
        }
        .patientRight {
          font-size: 28rpx;
          .circular {
            display: inline-block;
            width: 16rpx;
            height: 16rpx;
            border-radius: 50%;
            margin-right: 12rpx;
          }
        }
      }
    }
  }
  .follow-info {
    padding: 32rpx 48rpx;
    .detail-info {
      display: flex;
      margin-bottom: 24rpx;
      span:nth-child(1) {
        flex: 30%;
        text-align: left;
        font-size: 28rpx;
        color: #4c4c4c;
      }
      span:nth-child(2) {
        flex: 70%;
        font-size: 28rpx;
        font-weight: 400;
        color: #191919;
      }
    }
    view.detail-info:last-child {
      margin-bottom: 0rpx;
    }
  }
  .followUpNode {
    width: 100%;
    .nodeTitle {
      padding: 0rpx 32rpx;
      width: 100%;
      height: 64rpx;
      line-height: 64rpx;
      color: $common-color;
      background-color: #eef8f3;
      font-size: 30rpx;
      .icon_plane {
        font-size: 40rpx;
        margin-right: 10rpx;
        vertical-align: middle;
      }
    }
  }
  // 待随访
  .followState_10 {
    background-color: #faad14;
  }
  // 随访中
  .followState_20 {
    background-color: #722ed1;
  }
  // 随访完成
  .followState_30 {
    background-color: #089eba;
  }
  // 终止随访
  .followState_40 {
    background-color: #7f7f7f;
  }
  // 待随访
  .state_10 {
    color: #faad14;
  }
  // 随访中
  .state_20 {
    color: #722ed1;
  }
  // 随访完成
  .state_30 {
    color: #089eba;
  }
  // 终止随访
  .state_40 {
    color: #7f7f7f;
  }
}
</style>
