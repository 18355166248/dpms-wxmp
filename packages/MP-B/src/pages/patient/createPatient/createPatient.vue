<template>
  <editPatient ref="editPatient" @submit="createPatient"></editPatient>
</template>

<script>
import { mapState } from 'vuex'
import editPatient from '@/businessComponents/editPatient/editPatient.vue'
import patientAPI from '@/APIS/patient/patient.api'
import { globalEventKeys } from '@/config/global.eventKeys.js'

export default {
  data() {
    return {
      paramsObj: {},
    }
  },
  onLoad(option) {
    this.paramsObj = option
  },
  components: {
    editPatient,
  },
  computed: {
    ...mapState('workbenchStore', ['staff']),
  },
  created() {},
  methods: {
    async createPatient(form) {
      const formValue = _.cloneDeep(form)
      const { type } = this.paramsObj

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
      }

      if (Number(formValue.settingsPatientSourceId) < 0) {
        delete formValue.settingsPatientSourceId
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
          patientContactStr: JSON.stringify([{ ...patientContact }]),
        })
        .then((res) => {
          that.$refs.editPatient.showBtn()

          that.$utils.show('新增患者成功', {
            duration: 1000,
            complete() {
              setTimeout(() => {
                uni.$emit(globalEventKeys.newPatient)
                const pages = getCurrentPages()
                if (
                  pages[pages.length - 3]?.route ===
                  'baseSubpackages/apptForm/apptForm'
                ) {
                  uni.$emit(
                    globalEventKeys.selectPatientCardFromSearchPatient,
                    res.data,
                  )
                  that.$utils.back(2)
                  return
                }
                // if (type === 'createRegister') {
                //   return that.$utils.replace({
                //     url:
                //       '/baseSubpackages/apptForm/apptForm?patient=' +
                //       JSON.stringify(res.data) +
                //       '&type=createRegister',
                //   })
                // }

                // if (type === 'createAppt') {
                //   return that.$utils.replace({
                //     url:
                //       '/baseSubpackages/apptForm/apptForm?patient=' +
                //       JSON.stringify(res.data) +
                //       '&type=createAppt',
                //   })
                // }

                return that.$utils.replace({
                  url: '/pages/patient/patient?patientId=' + res.data.patientId,
                })
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
