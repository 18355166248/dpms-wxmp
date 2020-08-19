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
        <span>{{
          arrObjKeys(detailInfo.networkAppointmentItemList, 'itemName', ',')
        }}</span>
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
        <span>{{ detailInfo.customerMemo || '' }}</span>
      </div>
      <div>
        <span>状态</span>
        <span>
          {{
            NETWORL_APPOINTMENT_STATUS.properties[detailInfo.appointmentStatus]
              .zh_CN
              ? NETWORL_APPOINTMENT_STATUS.properties[
                  detailInfo.appointmentStatus
                ].zh_CN
              : ''
          }}
        </span>
      </div>
    </div>
    <div class="operation">
      <div class="protocol">
        <dpmsCheckbox
          style="margin-right: 10rpx;"
          disabled
          value="true"
          @change="(v) => (btnDisabled = !v)"
        />
        <span>我已知悉并同意</span>
        <span @click="showContent = true">《预约服务协议》</span>
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
        }}，请耐心等待诊所审核确认，有任何问题可拨打电话：{{
          detailInfo.shopMobile || ''
        }}
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
        }}，有任何问题可拨打电话：{{ detailInfo.shopMobile || '' }}
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
        }}没有及时就诊，有任何问题可拨打电话：{{ detailInfo.shopMobile || '' }}
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
        }}，请及时就诊，有任何问题可拨打电话：{{ detailInfo.shopMobile || '' }}
      </div>
      <div class="btn">
        <button
          class="amend"
          @click="amend"
          v-if="
            NETWORL_APPOINTMENT_STATUS.properties[detailInfo.appointmentStatus]
              .zh_CN == '待确认'
          "
        >
          修改
        </button>
        <button
          class="cancel"
          @click="delAppoint"
          v-if="
            NETWORL_APPOINTMENT_STATUS.properties[detailInfo.appointmentStatus]
              .zh_CN == '待确认' ||
            NETWORL_APPOINTMENT_STATUS.properties[detailInfo.appointmentStatus]
              .zh_CN == '已预约'
          "
        >
          取消
        </button>
      </div>
    </div>
    <modal
      :show="showContent"
      title="预约服务协议"
      confirm-color="#5cbb89"
      :show-cancel="false"
      @close="showContent = false"
    >
      <view style="padding: 32rpx 24rpx;">
        <view>1. 停诊将会短信通知您，请保持电话畅通；</view>
        <view>
          2. 您的预约信息作为登陆信息，在诊所核实确认时有权取消您的预约信息；
        </view>
        <view>3. 实名制预约，就诊人信息不符合没法就诊；</view>
      </view>
    </modal>
  </div>
</template>

<script>
import moment from 'moment'
import appointmentAPI from '@/APIS/appointment/appointment.api'
import { globalEventKeys } from '@/config/global.eventKeys'
import modal from '@/components/modal/neil-modal.vue'

export default {
  data() {
    return {
      NETWORL_APPOINTMENT_STATUS: this.$utils.getEnums(
        'NetworkAppointmentStatus',
      ),
      protocol: true,
      networkAppointmentId: '',
      detailInfo: {},
      showContent: false,
    }
  },
  mounted() {},
  components: {
    modal,
  },
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
        this.$utils.push({
          url:
            '/pages/appoint/index?shopId=' +
            this.detailInfo.shopId +
            '&userId=' +
            this.detailInfo.userId +
            '&doctorId=' +
            this.detailInfo.doctorId +
            '&networkAppointmentId=' +
            this.detailInfo.networkAppointmentId,
        })
      } else {
        this.$utils.show('请同意预约服务协议')
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
      max-width: 70%;
      text-align: right;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  div:last-child {
    border: none;
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
      border-radius: 8rpx;
      border: none;
      font-size: 36rpx;
      height: 78rpx;
      line-height: 78rpx;
    }
    .amend::after {
      border: none;
    }
    .amend {
      background: #5cbb89;
      color: #fff;
      margin-bottom: 24rpx;
    }
    .cancel::after {
      border: none;
    }
    .cancel {
      color: #5cbb89;
      border: 2rpx solid #5cbb89;
    }
  }
}
</style>
