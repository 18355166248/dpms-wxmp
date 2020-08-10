<template>
  <view class="content">
    <scroll-view v-if="dataSource.length > 0" class="h100" scroll-y>
      <view class="ph-24 pb-32">
        <apptCard
          v-for="apptInfo in dataSource"
          :key="apptInfo.appointmentId"
          :appt="apptInfo"
          :doctor="getDoctor(apptInfo.appointmentResourceMap.STAFF)"
        />
      </view>
    </scroll-view>
    <template v-else>
      <empty :disabled="true" text="暂无预约数据"></empty>
    </template>
  </view>
</template>

<script>
import moment from 'moment'
import patientAPI from '@/APIS/patient/patient.api'
import apptCard from '@/businessComponents/apptCard/apptCard.vue'
import empty from '@/components/empty/empty.vue'

export default {
  data() {
    return {
      patientId: '',
      patient: {},
      dataSource: [],
    }
  },
  onLoad(params) {
    this.patientId = params.patientId
  },
  onReady() {
    this.init()
  },
  methods: {
    async init() {
      this.$utils.showLoading()
      await this.loadData()
      await this.getPatient()
      this.$utils.clearLoading()
    },
    // 获取列表数据
    async loadData() {
      const { data } = await patientAPI.getApptList({
        patientId: this.patientId,
      })
      this.dataSource = [
        ...data.afterList,
        ...data.beforeList,
        ...data.currentList,
      ]
    },
    // 获取患者信息
    async getPatient() {
      const { data } = await patientAPI.getPatientDetail({
        patientId: this.patientId,
      })
      this.patient = data
    },
    getDoctor(val) {
      let doctor = val.filter((v) => v.position === 2 && v.staffId !== -1)[0]
      return doctor ? doctor : { staffName: '未指定医生' }
    },
  },
  components: {
    apptCard,
    empty,
  },
}
</script>

<style lang="scss" scoped>
.content {
  padding-top: 32rpx;
}
</style>
