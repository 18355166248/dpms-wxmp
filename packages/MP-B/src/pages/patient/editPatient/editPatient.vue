<template>
  <editPatient
    ref="editPatient"
    :formData="formData"
    :editType="editType"
    @submit="updatePatient"
  ></editPatient>
</template>

<script>
import { mapState } from 'vuex'
import editPatient from '@/businessComponents/editPatient/editPatient.vue'
import patientAPI from '@/APIS/patient/patient.api'
import { CCDesensitizedUpdateFilterUtil } from '@arctic/tools'
export default {
  data() {
    return {
      formData: {},
      patientId: '',
      editType: true,
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
  mounted() {
    this.getPatient()
  },
  methods: {
    getPatient() {
      this.$dpmsUtils.showLoading()
      patientAPI
        .getPatientDetail({ patientId: this.patientId })
        .then((res) => {
          let { data } = res
          this.formData = data
          this.$dpmsUtils.clearLoading()
        })
        .catch(() => {
          this.$dpmsUtils.clearLoading()
        })
    },
    updatePatient(form) {
      const formValue = _.cloneDeep(form)

      const patientContact = {
        contactLabel: form.contactLabel,
        mobile: form.mobile,
        alternateMobile: form.alternateMobile,
        weChatId: form.weChatId,
        qqNum: form.qqNum,
        province: form.region[0],
        city: form.region[1],
        area: form.region[2],
        address: form.address,
        patientContactsId: form?.patientContactsList[0]?.patientContactsId,
      }

      // 联系方式脱敏
      const desensitizationData = CCDesensitizedUpdateFilterUtil({
        currentFormvalue: patientContact,
        oldFormvalue: this.formData?.patientContactsList[0],
      })

      delete formValue.patientContactsList
      delete formValue.createTime
      delete formValue.tagList
      delete formValue.contactLabel
      delete formValue.alternateMobile
      delete formValue.weChatId
      delete formValue.qqNum
      delete formValue.region
      delete formValue.address
      delete formValue.weChatInfoList

      if (formValue.systemInner === 2) {
        formValue.sourceValue = formValue.introducer
      }
      delete formValue.introducer

      formValue.firstDiagnosisMilliSecond = formValue.firstVisitTime
      delete formValue.firstVisitTime

      // 电话脱敏
      if (this.formData?.mobile === formValue?.mobile) {
        delete formValue.mobile
      }
      // 固话脱敏
      if (this.formData?.fixedTelephone === formValue?.fixedTelephone) {
        delete formValue.fixedTelephone
      }
      if (Number(this.formData?.settingsPatientSourceId) < 0) {
        delete formValue.settingsPatientSourceId
      }

      patientAPI
        .updatePatient({
          patientId: this.patientId,
          ...formValue,
          patientContactStr: JSON.stringify([{ ...desensitizationData }]),
        })
        .then((res) => {
          let that = this
          this.$dpmsUtils.show('修改成功', {
            duration: 1000,
            complete() {
              setTimeout(() => {
                that.$refs.editPatient.showBtn()
                that.$dpmsUtils.back()
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
