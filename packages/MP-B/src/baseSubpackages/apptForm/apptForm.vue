<template>
  <div class="apptForm">
    <scroll-view scroll-y class="h100">
      <dpmsForm ref="dpmsForm" :rules="rules">
        <dpmsCellTimePicker required title="预约开始时间" v-model="startTime" />
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
        <dpmsEnumsPicker
          enumsKey="VisType"
          v-model="form.visType"
          title="就诊类型"
          placeholder="请选择就诊类型"
        />
        <dpmsCellPicker
          :list="DOCTOR_LIST"
          v-model="form.doctor"
          defaultType="staffId"
          :defaultProps="{ label: 'staffName', value: 'staffId' }"
          title="医生"
          placeholder="请选择医生"
        />
        <dpmsCell title="诊所" :value="medicalInstitutionSimpleCode" />
        <dpmsCell
          placeholder="请选择助理"
          title="助理"
          :value="HELP_CHECKED_TEXT"
          isLink
          @click.native="onSelectStaff(5)"
        />
        <dpmsCell
          placeholder="请选择护士"
          title="护士"
          :value="NURSE_CHECKED_TEXT"
          isLink
          @click.native="onSelectStaff(6)"
        />
        <dpmsCellPicker
          :list="DENTIST_LIST"
          v-model="form.dentalHygienist"
          defaultType="staffId"
          :defaultProps="{ label: 'staffName', value: 'staffId' }"
          title="洁牙师"
          placeholder="请选择洁牙师"
        />
        <dpmsCellPicker
          :list="CONSULTANT_LIST"
          v-model="form.consultant"
          defaultType="staffId"
          :defaultProps="{ label: 'staffName', value: 'staffId' }"
          title="咨询师"
          placeholder="请选择咨询师"
        />
        <dpmsCellPicker
          :list="ConsultingRoomList"
          v-model="form.institutionConsultingRoomId"
          defaultType="institutionConsultingRoomId"
          :defaultProps="{
            label: 'institutionConsultingRoomName',
            value: 'institutionConsultingRoomId',
          }"
          title="诊室"
          placeholder="请选择诊室"
        />
        <dpmsCell
          title="预约项目"
          :value="APPT_ITEM_CHECKED_TEXT"
          isLink
          @click.native="onSelectApptItem"
          placeholder="请选择预约项目"
        />
        <dpmsCellInput
          title="预约备注"
          :value="form.appointmentMemo"
          placeholder="请输入预约项目"
          type="textarea"
          autosize
        />
        <button @click="submit">提交</button>
      </dpmsForm>
      <textarea rows="1" auto-height :maxlength="500"></textarea>
    </scroll-view>
  </div>
</template>

<script>
import authAPI from 'APIS/patient/patient.api'
import appointmentAPI from 'APIS/appointment/appointment.api'
import moment from 'moment'

function getTxtFromArr(Arr, key) {
  return Arr.map((val) => val[key]).join(',')
}

let staffListInfo = uni.getStorageSync('staffListInfo') || {}
const notGet =
  staffListInfo.DOCTOR_LIST ||
  staffListInfo.DENTIST_LIST ||
  staffListInfo.CONSULTANT_LIST ||
  staffListInfo.ASSISTANT_MANAGER_LIST ||
  staffListInfo.NURSE_LIST

const medicalInstitution = uni.getStorageSync('medicalInstitution')

const { medicalInstitutionSimpleCode } = medicalInstitution

export default {
  data() {
    return {
      startTime: '', // 预约开始时间
      form: {
        visType: 1,
        duration: 30,
        COMMON_DATA_APPOINTMENT_ITEM: [257, 258], // 预约项目
        appointmentBeginTimeStamp: moment()
          .startOf('hour')
          .format('YYYY-MM-DD HH-mm'),
        consultant: -1, // 咨询师
        dentalHygienist: -1, // 洁牙师
        doctor: -1, // 2126 2132 2190
        institutionConsultingRoomId: -1, // 诊室
        help: [2423], // 助理
        nurse: [2424], // 护士
        appointmentMemo: [],
      },
      rules: {
        startTime: {
          required: true,
          message: '请输入医生',
        },
        duration: {
          required: true,
          message: '请输入手机号',
        },
        appointmentMemo: {
          max: 500,
          message: '备注输入不应该超过 500 字',
        },
      },
      ASSISTANT_MANAGER_LIST: staffListInfo.ASSISTANT_MANAGER_LIST || [], // 助理列表
      NURSE_LIST: staffListInfo.NURSE_LIST || [], // 护士列表
      DOCTOR_LIST: staffListInfo.DOCTOR_LIST || [], // 医生列表
      DENTIST_LIST: staffListInfo.DENTIST_LIST || [], // 洁牙师列表
      CONSULTANT_LIST: staffListInfo.CONSULTANT_LIST || [], // 咨询师列表
      ConsultingRoomList: [], // 诊室列表
      APPT_ITEM_CHECKED_TEXT: [], // 预约项目选中列表
      HELP_CHECKED_TEXT: [], // 助理选中列表
      NURSE_CHECKED_TEXT: [], // 护士选中列表
      medicalInstitutionSimpleCode,
    }
  },
  created() {
    uni.$on('apptFormWithUpdateStaffList', ({ key, value, list }) => {
      this.$set(this.form, key, value)

      const txt = getTxtFromArr(list, 'staffName')

      if (key === 'help') {
        this.HELP_CHECKED_TEXT = txt
      }

      if (key === 'nurse') {
        this.NURSE_CHECKED_TEXT = txt
      }
    })
    // 更新预约项目选中值
    uni.$on('updateApptItemCheckedList', (checked) => {
      this.form.COMMON_DATA_APPOINTMENT_ITEM = checked

      this.updateApptItemCheckedText()
    })

    this.init()
  },
  beforeDestroy() {
    uni.$off('apptFormWithUpdateStaffList')
    uni.$off('updateApptItemCheckedList')
    uni.removeStorageSync('apptItemList')
    uni.removeStorageSync('staffListInfo')
  },
  watch: {
    ASSISTANT_MANAGER_LIST(newVal) {
      this.$set(this.form, 'help', getTxtFromArr(newVal, 'staffName'))
    },
    NURSE_LIST(newVal) {
      this.$set(this.form, 'nurse', getTxtFromArr(newVal, 'staffName'))
    },
    form: {
      handler(newVal) {
        console.log(newVal)
      },
      deep: true,
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
      appointmentAPI
        .getAppointmentItemList()
        .then((res) => {
          if (Array.isArray(res.data)) {
            uni.setStorageSync('apptItemList', res.data)

            this.updateApptItemCheckedText()
          }
        })
        .catch()

      authAPI
        .getConsultationRoomList({ enabled: true })
        .then((res) => {
          if (Array.isArray(res.data)) {
            this.ConsultingRoomList = [
              {
                institutionConsultingRoomName: '未指定诊室',
                institutionConsultingRoomId: -1,
              },
              ...res.data.map((consultationRoom) => {
                consultationRoom.institutionConsultingRoomName =
                  consultationRoom.institutionConsultingRoomName.zh_CN

                return consultationRoom
              }),
            ]
          }
        })
        .catch()

      if (notGet) {
        this.HELP_CHECKED_TEXT = getTxtFromArr(
          this.ASSISTANT_MANAGER_LIST.filter((ASSISTANT_MANAGER) =>
            this.form.help.includes(ASSISTANT_MANAGER.staffId),
          ),
          'staffName',
        )
        this.NURSE_CHECKED_TEXT = getTxtFromArr(
          this.NURSE_LIST.filter((NURSE) =>
            this.form.nurse.includes(NURSE.staffId),
          ),
          'staffName',
        )
        return
      }

      authAPI
        .getStaffMapThroughPosition({
          positions: '2,3,4,5,6', // 医生:2 --- 洁牙师:3 --- 咨询师:4 --- 助理:5 --- 护士:6
          workStatus: 1,
        })
        .then((res) => {
          if (Array.isArray(res.data.DOCTOR)) {
            this.DOCTOR_LIST = [
              { staffId: -1, staffName: '未指定医生' },
              ...res.data.DOCTOR,
            ]
          }
          if (Array.isArray(res.data.DENTIST)) {
            this.DENTIST_LIST = [
              { staffId: -1, staffName: '未指定洁牙师' },
              ...res.data.DENTIST,
            ]
          }
          if (Array.isArray(res.data.CONSULTANT)) {
            this.CONSULTANT_LIST = [
              { staffId: -1, staffName: '未指定咨询师' },
              ...res.data.CONSULTANT,
            ]
          }
          if (Array.isArray(res.data.ASSISTANT_MANAGER)) {
            this.ASSISTANT_MANAGER_LIST = [
              { staffId: -1, staffName: '未指定助理' },
              ...res.data.ASSISTANT_MANAGER,
            ]

            this.HELP_CHECKED_TEXT = getTxtFromArr(
              this.ASSISTANT_MANAGER_LIST.filter((ASSISTANT_MANAGER) =>
                this.form.help.includes(ASSISTANT_MANAGER.staffId),
              ),
              'staffName',
            )

            console.log(this.HELP_CHECKED_TEXT)
          }
          if (Array.isArray(res.data.NURSE)) {
            this.NURSE_LIST = [
              { staffId: -1, staffName: '未指定护士' },
              ...res.data.NURSE,
            ]

            this.NURSE_CHECKED_TEXT = getTxtFromArr(
              this.NURSE_LIST.filter((NURSE) =>
                this.form.help.includes(NURSE.staffId),
              ),
              'staffName',
            )
          }

          uni.setStorageSync('staffListInfo', {
            DOCTOR_LIST: this.DOCTOR_LIST,
            DENTIST_LIST: this.DENTIST_LIST,
            CONSULTANT_LIST: this.CONSULTANT_LIST,
            ASSISTANT_MANAGER_LIST: this.ASSISTANT_MANAGER_LIST,
            NURSE_LIST: this.NURSE_LIST,
          })
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
      let checked = []
      if (option === 5) checked = this.form.help
      if (option === 6) checked = this.form.nurse

      this.$utils.push({
        url:
          '/baseSubpackages/apptForm/staffList?option=' +
          option +
          '&checked=' +
          checked,
      })
    },
    // 选择预约项目
    onSelectApptItem() {
      this.$utils.push({
        url:
          '/baseSubpackages/apptForm/apptItemList?checked=' +
          this.form.COMMON_DATA_APPOINTMENT_ITEM.join(','),
      })
    },
    updateApptItemCheckedText() {
      let apptItemList = uni.getStorageSync('apptItemList')

      apptItemList = apptItemList.filter((apptItem) =>
        this.form.COMMON_DATA_APPOINTMENT_ITEM.includes(
          apptItem.appointmentSettingsAppointmentItemId,
        ),
      )

      this.APPT_ITEM_CHECKED_TEXT = apptItemList
        .map(
          (apptItem) => apptItem.appointmentSettingsAppointmentItemName.zh_CN,
        )
        .join(',')
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
