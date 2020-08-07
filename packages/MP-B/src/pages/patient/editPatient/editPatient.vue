<template>
  <editPatient
    ref="editPatient"
    :formData="formData"
    @submit="updatePatient"
  ></editPatient>
</template>

<script>
import { mapState } from 'vuex'
import editPatient from '@/baseSubpackages/editPatient/editPatient.vue'
import patientAPI from '@/APIS/patient/patient.api'
export default {
  data() {
    return {
      formData: {},
      patientId: '',
    }
  },
  components: {
    editPatient,
  },
  onLoad(params) {
    this.patientId = params.patientId
  },
  mounted(params) {
    this.getPatient()
  },
  methods: {
    getPatient() {
      patientAPI.getPatientDetail({ patientId: this.patientId }).then((res) => {
        let { data } = res
        this.formData = data
      })
    },
    updatePatient(form) {
      const formValue = _.cloneDeep(form)

      let patientContact = {
        contactLabel: form.contactLabel,
        mobile: form.mobile,
        alternateMobile: form.alternateMobile,
        weChatId: form.weChatId,
        qqNum: form.qqNum,
        provinc: form.region[0],
        city: form.region[1],
        area: form.region[2],
        address: form.address,
      }

      delete formValue.patientContactsList
      delete formValue.createTime
      delete formValue.tagList
      delete formValue.contactLabel
      delete formValue.alternateMobile
      delete formValue.weChatId
      delete formValue.qqNum
      delete formValue.region
      delete formValue.address

      patientAPI
        .updatePatient({
          patientId: this.patientId,
          ...formValue,
          patientContactStr: JSON.stringify([{ ...patientContact }]),
        })
        .then((res) => {
          this.$refs.editPatient.showBtn()
          this.$utils.back()
        })
        .catch(() => {
          this.$refs.editPatient.showBtn()
        })
    },
  },
}
</script>

<style lang="scss" scoped></style>
