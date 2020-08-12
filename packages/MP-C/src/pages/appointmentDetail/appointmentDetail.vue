<template>
  <div class="content">
    <div class="appointmentInfo">
      <div>
        <span>预约门店</span>
        <span>{{ detailInfo.shopName }}</span>
      </div>
      <div>
        <span>门店地址</span>
        <span>{{ detailInfo.shopAddress }}</span>
      </div>
      <div>
        <span>预约医生</span>
        <span>{{ detailInfo.doctorName }}</span>
      </div>
      <div>
        <span>预约项目</span>
        <span>{{ arrObjKeys(detailInfo.networkAppointmentItemList,'itemName',',') }}</span>
      </div>
      <div>
        <span>预约日期</span>
        <span>{{ date(detailInfo.appointmentBeginTime) }}</span>
      </div>
      <div>
        <span>预约时间</span>
        <span>{{ time(detailInfo.appointmentBeginTime) }}</span>
      </div>
      <div>
        <span>预约人员</span>
        <span>{{ detailInfo.personnelName }}</span>
      </div>
      <div>
        <span>预约备注</span>
        <span>{{ detailInfo.appointmentMemo || '--' }}</span>
      </div>
      <div>
        <span>状态</span>
        <span>
          {{
          NETWORL_APPOINTMENT_STATUS.properties[detailInfo.appointmentStatus]
          .zh_CN?NETWORL_APPOINTMENT_STATUS.properties[detailInfo.appointmentStatus]
          .zh_CN:''
          }}
        </span>
      </div>
    </div>
    <div class="operation">
      <div class="protocol">
        <checkbox class="check" checked @click="agree"></checkbox>
        <span>我已知悉并同意</span>
        <span @click="open">《预约服务协议》</span>
      </div>

      <div
        class="reminder"
        v-if="
          NETWORL_APPOINTMENT_STATUS.properties[detailInfo.appointmentStatus]
            .zh_CN == '待确认'
        "
      >
        提醒：您的预约{{
        NETWORL_APPOINTMENT_STATUS.properties[detailInfo.appointmentStatus]
        .zh_CN
        }}，请耐心等待诊所审核确认，有任何问题可拨打电话：13967801309
      </div>
      <div
        class="reminder"
        v-if="
          NETWORL_APPOINTMENT_STATUS.properties[detailInfo.appointmentStatus]
            .zh_CN == '已取消' ||
          NETWORL_APPOINTMENT_STATUS.properties[detailInfo.appointmentStatus]
            .zh_CN == '已过期'
        "
      >
        您的预约{{
        NETWORL_APPOINTMENT_STATUS.properties[detailInfo.appointmentStatus]
        .zh_CN
        }}，有任何问题可拨打电话：13967801309
      </div>
      <div
        class="reminder"
        v-if="
          NETWORL_APPOINTMENT_STATUS.properties[detailInfo.appointmentStatus]
            .zh_CN == '已失效'
        "
      >
        您的预约{{
        NETWORL_APPOINTMENT_STATUS.properties[detailInfo.appointmentStatus]
        .zh_CN
        }}没有及时就诊，有任何问题可拨打电话：13967801309
      </div>
      <div
        class="reminder"
        v-if="
          NETWORL_APPOINTMENT_STATUS.properties[detailInfo.appointmentStatus]
            .zh_CN == '已预约'
        "
      >
        您{{
        NETWORL_APPOINTMENT_STATUS.properties[detailInfo.appointmentStatus]
        .zh_CN
        }}，请及时就诊，有任何问题可拨打电话：13967801309
      </div>
      <div class="btn">
        <button
          @click="amend"
          v-if="
            NETWORL_APPOINTMENT_STATUS.properties[detailInfo.appointmentStatus]
              .zh_CN == '待确认'
          "
        >修改</button>
        <button
          @click="delAppoint"
          v-if="
            NETWORL_APPOINTMENT_STATUS.properties[detailInfo.appointmentStatus]
              .zh_CN == '待确认' ||
            NETWORL_APPOINTMENT_STATUS.properties[detailInfo.appointmentStatus]
              .zh_CN == '已预约'
          "
        >取消</button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import appointmentAPI from '@/APIS/appointment/appointment.api'
import { globalEventKeys } from '@/config/global.eventKeys'

export default {
  data() {
    return {
      NETWORL_APPOINTMENT_STATUS: this.$utils.getEnums(
        'NetworkAppointmentStatus',
      ),
      protocol: true,
      networkAppointmentId: '',
      detailInfo: {},
    }
  },
  mounted() {},
  onLoad(id) {
    this.networkAppointmentId = id.networkAppointmentId
    this.getDetail()
  },
  methods: {
    getDetail() {
      appointmentAPI
        .getAppointmentDetail({
          networkAppointmentId: this.networkAppointmentId,
        })
        .then((res) => {
          console.log('kkkkkkkkkkkk', res)
          this.detailInfo = res.data
        })
    },
    delAppoint() {
      uni.showModal({
        content: '您确认取消预约吗？',
        cancelText: '再想想',
        confirmText: '确认',
        confirmColor: '#5CBB89',
        success: (confirm) => {
          if (confirm.confirm) {
            this.del()
          }
        },
      })
    },
    del() {
      appointmentAPI
        .deleteAppointment({ networkAppointmentId: this.networkAppointmentId })
        .then((res) => {
          if (res.code == 0) {
            uni.$emit(globalEventKeys.deleteAppointFormWithSaveSuccess, {
              isSuccess: true,
            })
            this.$utils.back()
          }
        })
    },
    agree() {
      this.protocol = !this.protocol
    },
    open() {
      console.log('打开协议')
    },
    amend() {
      if (this.protocol) {
        this.$utils.push({ url: '/pages/appointmenAmend/appointmenAmend' })
      } else {
        this.this.$utils.show('请同意预约服务协议')
      }
    },
    date(t) {
      return moment(t).format('YYYY-MM-DD')
    },
    time(t) {
      return moment(t).format('HH:mm')
    },
    arrObjKeys(arr, key, splitQuote) {
      return (
        arr &&
        arr.reduce((prev, cur) => {
          return cur[key] ? (prev += `${prev && splitQuote}${cur[key]}`) : prev
        }, '')
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.content {
  padding-bottom: 118rpx;
  background: rgba($color: #000000, $alpha: 0.04);
}
.appointmentInfo {
  padding-left: 32rpx;
  background: #fff;
  margin-bottom: 32rpx;
  div {
    height: 112rpx;
    line-height: 112rpx;
    position: relative;
    border-bottom: rgba($color: #000000, $alpha: 0.15) 2rpx solid;
    span:first-child {
      color: rgba($color: #000000, $alpha: 0.9);
      font-size: 34rpx;
    }
    span:last-child {
      position: absolute;
      right: 32rpx;
      color: rgba($color: #000000, $alpha: 0.5);
      font-size: 34rpx;
    }
  }
}
.operation {
  .protocol {
    padding-left: 32rpx;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    .check {
      zoom: 50%;
    }
    span:first-child {
      color: #999999;
    }
    span:last-child {
      color: #5cbb89;
    }
  }
  .reminder {
    margin: 32rpx 32rpx 48rpx 32rpx;
    font-size: 28rpx;
    color: #999999;
  }
  .btn {
    padding: 0 64rpx;
    button {
      border-radius: 8px;
      border: none;
      font-size: 36rpx;
    }
    button:first-child {
      background: #5cbb89;
      color: #fff;
      margin-bottom: 24rpx;
    }
    button:last-child {
      color: #5cbb89;
      border: 2rpx solid #5cbb89;
    }
  }
}
</style>
