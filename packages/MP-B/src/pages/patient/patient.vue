<template>
  <view class="content">
    患者资料
  </view>
</template>

<script>
import patientAPI from '@/APIS/patient/patient.api'

export default {
  data() {
    return {
      patientId: '',
    }
  },
  onLoad(params) {
    this.patientId = params.patientId
  },
  methods: {},
  components: {},
}
</script>

<style></style>
