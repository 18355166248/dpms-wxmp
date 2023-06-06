<template>
  <movable-area>
    <view>
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
          <image class="watch" src="/static/watch.svg" />
          <div class="statusType">
            <span
              class="iconfont icon-time"
              style="margin-right: 16rpx;"
            ></span>
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
              <span class="statusName">
                {{
                  NETWORL_APPOINTMENT_STATUS.properties[val.appointmentStatus]
                    .zh_CN
                }}
              </span>
            </span>
          </div>
          <div class="appointmentInfo">
            <div>
              <div style="white-space: nowrap;">门店：</div>
              <div>{{ val.shopName || '' }}</div>
            </div>
            <div>
              <div style="white-space: nowrap;">医生：</div>
              <div>{{ val.doctorName || '' }}</div>
            </div>
            <div>
              <div style="white-space: nowrap;">预约项目：</div>
              <div>
                {{
                  val.networkAppointmentItemList.length
                    ? arrObjKeys(
                        val.networkAppointmentItemList,
                        'itemName',
                        ',',
                      )
                    : ''
                }}
              </div>
            </div>
            <div>
              <div style="white-space: nowrap;">患者姓名：</div>
              <div>{{ val.personnelName || '' }}</div>
            </div>
          </div>
        </div>
      </div>
    </view>
    <div class="empty" v-show="showEmpty">
      <image class="emptyImg" src="/static/empty.svg" />
      <div class="emptyTxt">未查询到任何信息</div>
    </div>
  </movable-area>
</template>

<script>
import moment from 'moment'
import appointmentAPI from '@/APIS/appointment/appointment.api'
import { getStorage, setStorage, STORAGE_KEY } from '@/utils/storage'
import { globalEventKeys } from '@/config/global.eventKeys'

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
    uni.$on(
      globalEventKeys.deleteAppointFormWithSaveSuccess,
      ({ isSuccess }) => {
        console.log('isSuccess', isSuccess)
        this.getAppointmentList(this.RECENT_APPOINTMENT)
      },
    )
  },
  onUnload() {
    uni.$off(globalEventKeys.deleteAppointFormWithSaveSuccess)
  },
  onPullDownRefresh() {
    this.recent = 'active'
    this.history = ''
    this.getAppointmentList(this.RECENT_APPOINTMENT)
  },
  onShow() {
    this.recent = 'active'
    this.history = ''
    this.getAppointmentList(this.RECENT_APPOINTMENT)
  },
  methods: {
    getAppointmentList(type) {
      uni.showLoading({
        title: '加载中...',
      })
      appointmentAPI
        .getAppointmentList({
          userId: getStorage(STORAGE_KEY.STAFF).id,
          appointmentListType: type,
        })
        .then((res) => {
          this.appointList = res.data.map((v) => ({
            ...v,
            networkAppointmentItemList: v.networkAppointmentItemList
              ? v.networkAppointmentItemList
              : [],
          }))

          if (res.data.length == 0) {
            this.showEmpty = true
          } else {
            this.showEmpty = false
          }
          uni.stopPullDownRefresh()
          uni.hideLoading()
        })
        .catch(() => {
          uni.hideLoading()
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
    arrObjKeys(arr, key, splitQuote) {
      return arr.reduce((prev, cur) => {
        return cur[key] ? (prev += `${prev && splitQuote}${cur[key]}`) : prev
      }, '')
    },
  },
}
</script>

<style lang="scss" scoped>
movable-area {
  display: block;
  height: 100%;
  width: 100%;
}
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
    color: rgba(0, 0, 0, 0.65);
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
    position: relative;
    .watch {
      display: inline-block;
      width: 198rpx;
      height: 152rpx;
      position: absolute;
      right: 0;
      bottom: 0;
    }
    .statusType {
      font-size: 28rpx;
      font-weight: 400;
      height: 68rpx;
      display: flex;
      align-items: center;
      border-bottom: 1rpx rgba(0, 0, 0, 0.15) solid;
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
      color: rgba(0, 0, 0, 0.65);
      font-size: 28rpx;
      font-weight: 400;
      div {
        margin-bottom: 4rpx;
        display: flex;
      }
    }
  }
}
</style>
