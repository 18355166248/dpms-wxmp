<template>
  <view class="content">
    <scroll-view v-if="dataSource.length > 0" class="h100" scroll-y>
      <view class="ph-24 pb-32">
        <apptCard
          v-for="apptInfo in dataSource"
          :key="apptInfo.appointmentId"
          :appt="apptInfo"
          :doctor="doctor"
        />
      </view>
    </scroll-view>
  </view>
</template>

<script>
import moment from 'moment'
import patientAPI from '@/APIS/patient/patient.api'
import apptCard from '@/businessComponents/apptCard/apptCard.vue'

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
    this.getPatient()
    this.loadData()
  },
  methods: {
    // 触发下拉事件
    emitPullDownRefresh() {
      uni.startPullDownRefresh()
    },
    // 获取列表数据
    loadData() {
      patientAPI.getApptList({ patientId: this.patientId }).then((res) => {
        let { data } = res
        this.dataSource = [
          ...data.afterList,
          ...data.beforeList,
          ...data.currentList,
        ]
        console.log('data', this.dataSource)
        // this.formData = data
      })
    },
    // 获取患者信息
    getPatient() {
      patientAPI.getPatientDetail({ patientId: this.patientId }).then((res) => {
        let { data } = res
        this.patient = data
      })
    },
    getDoctor(val) {},
  },
  components: {
    apptCard,
    // empty,
    // loadMore,
    // requestError,
    // fixedFilter,
    // fixedFooter,
  },
  computed: {},
}
</script>

<style lang="scss" scoped></style>
