<template>
  <scroll-view scroll-y style="background: rgba(0, 0, 0, 0.04); height: 100%;">
    <div class="tab">
      <div class="recentAppointment" @click="getRecent">
        <span :class="recent">近期预约</span>
      </div>
      <div class="historyAppointment" @click="getHistory">
        <span :class="history">历史预约</span>
      </div>
    </div>
    <div class="appointmentList">
      <div
        class="item"
        v-for="val of appointList"
        :key="val.networkAppointmentId"
        @click="appointmentDetail(val.networkAppointmentId)"
      >
        <div class="statusType">
          <span class="iconfont icon-time" style="margin-right: 16rpx;"></span>
          <span>{{ time(val.appointmentBeginTime) }}</span>
          <span class="colorAndName">
            <span
              class="statusColor"
              :style="{
                background:
                  NETWORL_APPOINTMENT_STATUS.properties[val.appointmentStatus]
                    .zh_CN == '已预约'
                    ? '#5CBB89'
                    : NETWORL_APPOINTMENT_STATUS.properties[
                        val.appointmentStatus
                      ].zh_CN == '已挂号'
                    ? '#F2647C'
                    : NETWORL_APPOINTMENT_STATUS.properties[
                        val.appointmentStatus
                      ].zh_CN == '待确认'
                    ? '#FBD438'
                    : '#B1B0B0',
              }"
            ></span>
            <span class="statusName">{{
              NETWORL_APPOINTMENT_STATUS.properties[val.appointmentStatus].zh_CN
            }}</span>
          </span>
        </div>
        <div class="appointmentInfo">
          <div>门店:{{ val.shopName || '' }}</div>
          <div>医生:{{ val.doctorName || '' }}</div>
          <div>
            预约项目:{{
              val.networkAppointmentItemList
                ? item(val.networkAppointmentItemList)
                : ''
            }}
          </div>
          <div>患者姓名:{{ val.patientName || '' }}</div>
        </div>
      </div>
    </div>
    <div class="empty" v-show="showEmpty">
      <image class="emptyImg" src="/static/empty.svg" />
      <div class="emptyTxt">未查询到任何信息</div>
    </div>
  </scroll-view>
</template>

<script>
import moment from 'moment'
import appointmentAPI from '@/APIS/appointment/appointment.api'
import { getStorage, setStorage, STORAGE_KEY } from '@/utils/storage'

export default {
  data() {
    return {
      recent: 'active',
      history: '',
      showEmpty: false,
      appointList: [],
      NETWORL_APPOINTMENT_STATUS: this.$utils.getEnums(
        'NetworkAppointmentStatus',
      ),
      RECENT_APPOINTMENT: getStorage(STORAGE_KEY.ENUMS).AppointmentListType
        .RECENT_APPOINTMENT.value,
      HISTORY_APPOINTMENT: getStorage(STORAGE_KEY.ENUMS).AppointmentListType
        .HISTORY_APPOINTMENT.value,
    }
  },
  mounted() {
    console.log('NETWORL_APPOINTMENT_STATUS', this.NETWORL_APPOINTMENT_STATUS)
  },
  onLoad() {
    this.getAppointmentList(this.RECENT_APPOINTMENT)
  },
  methods: {
    getAppointmentList(type) {
      appointmentAPI
        .getAppointmentList({
          userId: 0,
          appointmentListType: type,
        })
        .then((res) => {
          console.log('recentListrecentList', res)
          this.appointList = res.data
          if (res.data.length == 0) {
            this.showEmpty = true
          } else {
            this.showEmpty = false
          }
        })
    },
    getRecent() {
      this.recent = 'active'
      this.history = ''
      this.getAppointmentList(this.RECENT_APPOINTMENT)
    },
    getHistory() {
      this.recent = ''
      this.history = 'active'
      this.getAppointmentList(this.HISTORY_APPOINTMENT)
    },
    time(t) {
      return moment(t).format('YYYY-MM-DD HH:mm')
    },
    appointmentDetail(id) {
      this.$utils.push({
        url:
          '/pages/appointmentDetail/appointmentDetail?networkAppointmentId=' +
          id,
      })
    },
    item(val) {
      for (let i in val) {
        return val[i].itemName + ','
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.tab {
  height: 76rpx;
  line-height: 74rpx;
  margin-bottom: 32rpx;
  background: #fff;
  font-size: 28rpx;
  font-weight: 500;
  display: flex;
  div {
    width: 50%;
    text-align: center;
    .active {
      display: inline-block;
      border-bottom: #5cbb89 4rpx solid;
      color: #5cbb89;
    }
  }
}
.empty {
  width: 406rpx;
  height: 374rpx;
  position: absolute;
  top: -304rpx;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
  .emptyImg {
    display: inline-block;
    width: 406rpx;
    height: 290rpx;
    margin-bottom: 40rpx;
  }
  .emptyTxt {
    font-size: 34rpx;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
  }
}
.appointmentList {
  .item {
    margin: 0 24rpx 32rpx 24rpx;
    background: #feffff;
    border-radius: 8rpx;
    box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.09);
    box-sizing: border-box;
    padding: 0 24rpx 32rpx 24rpx;
    .statusType {
      font-size: 28rpx;
      font-weight: 400;
      height: 68rpx;
      line-height: 68rpx;
      border-bottom: 2rpx rgba(0, 0, 0, 0.15) solid;
      color: rgba(0, 0, 0, 0.9);
      position: relative;
      .colorAndName {
        position: absolute;
        right: 0;
        .statusColor {
          display: inline-block;
          width: 16rpx;
          height: 16rpx;
          border-radius: 50%;
          margin-right: 12rpx;
        }
        .statusName {
          color: rgba(0, 0, 0, 0.65);
        }
      }
    }
    .appointmentInfo {
      margin-top: 17rpx;
      color: rgba(0, 0, 0, 0.5);
      font-size: 28rpx;
      font-weight: 400;
    }
  }
}
</style>
