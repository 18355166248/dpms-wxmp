<template>
  <editPatient
    ref="editPatient"
    :formData="formData"
    @submit="checkPatientInScrm"
  ></editPatient>
</template>

<script>
import { mapState } from 'vuex'
import editPatient from '@/businessComponents/editPatient/editPatient.vue'
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
  computed: {
    ...mapState('workbenchStore', ['staff']),
  },
  onLoad(params) {
    this.patientId = params.patientId
  },
  mounted(params) {
    this.getPatient()
  },
  methods: {
    getPatient() {
      this.$utils.showLoading()
      patientAPI
        .getPatientDetail({ patientId: this.patientId })
        .then((res) => {
          let { data } = res
          this.formData = data
          this.$utils.clearLoading()
        })
        .catch(() => {
          this.$utils.clearLoading()
        })
    },
    // 检查患者是否已存在scrm系统中
    async checkPatientInScrm(form) {
      let { data: scrmPatientInfo } = await patientAPI.getPatientInScrm({
        medicalInstitutionId: this.staff.belongsInstitutionId,
        mobile: form.mobile,
        patientName: form.patientName,
      })
      if (scrmPatientInfo.patientId && scrmPatientInfo.customerId) {
        delete scrmPatientInfo.customerId
      }
      this.updatePatient(scrmPatientInfo, form)
    },
    updatePatient(scrmPatientInfo, form) {
      const formValue = _.cloneDeep(form)

      let patientContact = {
        contactLabel: form.contactLabel,
        mobile: form.mobile,
        alternateMobile: form.alternateMobile,
        weChatId: form.weChatId,
        qqNum: form.qqNum,
        province: form.region[0],
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
          ...scrmPatientInfo,
          patientContactStr: JSON.stringify([{ ...patientContact }]),
        })
        .then((res) => {
          let that = this
          this.$utils.show('修改成功', {
            duration: 1000,
            complete() {
              setTimeout(() => {
                that.$refs.editPatient.showBtn()
                that.$utils.back()
              }, 1000)
            },
          })
        })
        .catch(() => {
          this.$refs.editPatient.showBtn()
        })
    },
  },
}
</script>

<style lang="scss" scoped></style>
