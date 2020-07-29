<template>
  <div class="apptForm">
    <scroll-view scroll-y class="h100">
      <dpmsForm ref="dpmsForm" :rules="rules">
        <dpmsCellTimePicker
          required
          title="预约开始时间"
          v-model="form.startTime"
        />
        <dpmsCellInput
          required
          type="number"
          title="持续时间"
          v-model="form.duration"
          @blur="onBlurWithDuration"
        >
          <template v-slot:inputRight>
            <span class="inputRightIcon">分钟</span>
          </template>
        </dpmsCellInput>
        <dpmsCellPicker
          :list="multiArray"
          v-model="form.doctor"
          listKey="visType"
          title="就诊类型"
          placeholder="请选择就诊类型"
        />
        <dpmsCellPicker
          :list="DOCTOR_LIST"
          v-model="form.doctor"
          listKey="staffName"
          title="医生"
          placeholder="请选择医生"
        />
        <dpmsCell title="诊所" :value="form.medicalInstitutionSimpleCode" />
        <dpmsCell
          placeholder="请选择助理"
          title="助理"
          :value="form.help"
          isLink
          @click.native="onSelectStaff(5)"
        />
        <dpmsCell
          placeholder="请选择护士"
          title="护士"
          :value="form.nurse"
          isLink
          @click.native="onSelectStaff(6)"
        />
        <dpmsCellPicker
          :list="DENTIST_LIST"
          v-model="form.dentalHygienist"
          listKey="staffName"
          title="洁牙师"
          placeholder="请选择洁牙师"
        />
        <dpmsCellPicker
          :list="CONSULTANT_LIST"
          v-model="form.consultant"
          listKey="staffName"
          title="咨询师"
          placeholder="请选择咨询师"
        />
        <dpmsCellPicker
          :list="ConsultingRoomList"
          v-model="form.institutionConsultingRoomId"
          listKey="institutionConsultingRoomName"
          title="诊室"
          placeholder="请选择诊室"
        />
        <dpmsCell
          title="预约项目"
          :value="form.medicalInstitutionSimpleCode"
          isLink
        />
        <button @click="submit">提交</button>
      </dpmsForm>
    </scroll-view>
  </div>
</template>

<script>
import authAPI from 'APIS/patient/patient.api'

function getTxtFromArr(Arr, key) {
  return Arr.map((val) => val[key]).join(',')
}

export default {
  data() {
    return {
      form: { duration: 30 },
      rules: {
        doctor: {
          required: true,
          message: '请输入医生',
        },
        tel: {
          required: true,
          message: '请输入手机号',
        },
      },
      ASSISTANT_MANAGER_LIST: [], // 助理列表
      NURSE_LIST: [], // 护士列表
      DOCTOR_LIST: [], // 医生列表
      DENTIST_LIST: [], // 洁牙师列表
      CONSULTANT_LIST: [], // 咨询师列表
      ConsultingRoomList: [], // 诊室列表
    }
  },
  created() {
    uni.$on('apptFormWithUpdateStaffList', ({ key, value }) => {
      this[key] = value
    })

    this.init()
  },
  beforeDestroy() {
    uni.$off('apptFormWithUpdateStaffList')
  },
  watch: {
    ASSISTANT_MANAGER_LIST(newVal) {
      this.$set(this.form, 'help', getTxtFromArr(newVal, 'staffName'))
    },
    NURSE_LIST(newVal) {
      this.$set(this.form, 'nurse', getTxtFromArr(newVal, 'staffName'))
    },
  },
  filters: {
    durationWithText: function (value) {
      if (!value) return ''
      value = value.toString()
      return value + '分钟'
    },
  },
  methods: {
    init() {
      authAPI
        .getStaffMapThroughPosition({
          positions: '2,3,4', // 医生:2 --- 洁牙师:3 --- 咨询师:4
          workStatus: 1,
        })
        .then((res) => {
          if (Array.isArray(res.data.DOCTOR)) {
            this.DOCTOR_LIST = res.data.DOCTOR
          }
          if (Array.isArray(res.data.DENTIST)) {
            this.DENTIST_LIST = res.data.DENTIST
          }
          if (Array.isArray(res.data.CONSULTANT)) {
            this.CONSULTANT_LIST = res.data.CONSULTANT
          }
        })
        .catch()

      authAPI
        .getConsultationRoomList({ enabled: true })
        .then((res) => {
          if (Array.isArray(res.data)) {
            this.ConsultingRoomList = res.data.map((consultationRoom) => {
              consultationRoom.institutionConsultingRoomName =
                consultationRoom.institutionConsultingRoomName.zh_CN

              return consultationRoom
            })
          }
        })
        .catch()
    },
    submit() {
      console.log(this)
      this.$refs.dpmsForm.validate((err, fileds) => {
        console.log(err, fileds)
        console.log(this.form)
      })
    },
    onBlurWithDuration(value) {
      if (value < 15) return this.$set(this.form, 'duration', 15)
      if (value > 1440) return this.$set(this.form, 'duration', 1440)
      if (value % 15 !== 0) {
        return this.$set(this.form, 'duration', Math.ceil(value / 15) * 15)
      }
    },
    // 跳转选择助理页面
    onSelectStaff(option) {
      let list = []
      if (option === 5) list = this.ASSISTANT_MANAGER_LIST
      if (option === 6) list = this.NURSE_LIST

      this.flyUtil.push({
        url:
          '/baseSubpackages/apptForm/staffList?option=' +
          option +
          '&checked=' +
          getTxtFromArr(list, 'staffId'),
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.apptForm {
  width: 100%;
  height: 100%;

  scroll-view {
    height: 100%;
  }
  .inputRightIcon {
    color: $common-form-text-color;
  }
}
</style>
