<template>
  <editPatient ref="editPatient" @submit="checkPatientInScrm"></editPatient>
</template>

<script>
import { mapState } from 'vuex'
import editPatient from '@/baseSubpackages/editPatient/editPatient.vue'
import patientAPI from '@/APIS/patient/patient.api'
import { globalEventKeys } from '@/config/global.eventKeys.js'

export default {
  data() {
    return {}
  },
  components: {
    editPatient,
  },
  computed: {
    ...mapState('workbenchStore', ['staff']),
  },
  created() {},
  methods: {
    // 检查患者是否已存在scrm系统中
    async checkPatientInScrm(form) {
      let { data: scrmPatientInfo } = await patientAPI.getPatientInScrm({
        medicalInstitutionId: this.staff.belongsInstitutionId,
        mobile: form.mobile,
        patientName: form.patientName,
      })

      let that = this

      if (scrmPatientInfo.newCustomer) {
        //如果是新患者
        this.createPatient(scrmPatientInfo, form)
      } else {
        //如果患者已存在
        if (scrmPatientInfo.patientId) {
          this.createPatient(scrmPatientInfo, form)
        } else {
          uni.showModal({
            content: 'SCRM中存在姓名和手机号相同的客户，是否关联',
            confirmText: '确认',
            success: function (res) {
              if (res.confirm) {
              } else if (res.cancel) {
                delete scrmPatientInfo.customerId
              }
              that.createPatient(scrmPatientInfo, form)
            },
          })
        }
      }
    },
    async createPatient(scrmPatientInfo, form) {
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

      delete formValue.contactLabel
      delete formValue.alternateMobile
      delete formValue.weChatId
      delete formValue.qqNum
      delete formValue.region
      delete formValue.address

      let that = this
      patientAPI
        .createPatient({
          ...formValue,
          ...scrmPatientInfo,
          patientContactStr: JSON.stringify([{ ...patientContact }]),
        })
        .then((res) => {
          that.$refs.editPatient.showBtn()

          that.$utils.show('修改成功', {
            duration: 1000,
            complete() {
              setTimeout(() => {
                uni.$emit(globalEventKeys.newPatient)

                that.$utils.back()
              }, 1000)
            },
          })
        })
        .catch(() => {
          that.$refs.editPatient.showBtn()
        })
    },
  },
}
</script>

<style lang="scss" scoped></style>
