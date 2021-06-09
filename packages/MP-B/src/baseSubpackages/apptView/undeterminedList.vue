<template>
  <scroll-view>
    <view v-if="appointmentList.length !== 0">
      <view v-for="appt in appointmentList" :key="appt.appointmentId">
        <appt-card :appt="appt" @click.native="clickAppointmentCard(appt)" />
      </view>
      <load-more :status="status" />
    </view>
    <empty
      :disabled="true"
      v-else-if="status !== 'loading'"
      text="暂无待定预约"
    />
  </scroll-view>
</template>

<script>
import { commonUtil } from 'mpcommon'
import appointmentAPI from '@/APIS/appointment/appointment.api'
import apptCard from './apptCard'

const APPOINTMENT_STATUS_ENUM = commonUtil.getEnums('AppointmentStatus')
const APPOINTMENT_UNDETERMINED = APPOINTMENT_STATUS_ENUM.UNDETERMINED.value

export default {
  components: { apptCard },
  data() {
    return {
      appointmentList: [], //患者列表
      current: 1, //默认展示 第一页数据
      size: 10, //默认展示 15条数据
      total: 1, //默认 总条目，
      status: 'loading', // 数据列表的状态
    }
  },
  onShow() {
    this.init()
  },
  onReachBottom() {
    if (this.appointmentList.length < this.total) {
      this.current += 1
      this.getPageData()
    }
  },
  methods: {
    init() {
      this.current = 1
      this.getPageData()
    },
    async getPageData() {
      this.status = 'loading'
      uni.showLoading({
        title: '数据加载中',
        mask: true,
      })

      let {
        data: { total, current, records },
      } = await appointmentAPI.getUndeterminedAppointmentPage({
        appointmentStatus: APPOINTMENT_UNDETERMINED,
        current: this.current,
        size: this.size,
      })

      uni.hideLoading()

      if (current === 1) {
        this.appointmentList = records
      } else {
        this.appointmentList = this.appointmentList.concat(records)
      }
      this.total = total

      if (total === this.appointmentList.length) {
        this.status = 'noMore'
      } else {
        this.status = 'more'
      }
    },
    clickAppointmentCard(appt) {
      this.$utils.push({
        url:
          '/baseSubpackages/apptForm/apptDetail?appointmentId=' +
          appt.appointmentId,
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
