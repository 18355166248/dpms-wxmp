<template>
  <div class="apptForm">
    <div class="bg"></div>
    <scroll-view scroll-y class="h100">
      <div class="patientInfo tc pt-48">
        <div class="patientCard">
          <div class="patientDetail">
            <avatar :gender="form.patient.gender" />
            <div v-if="form.patient" class="patientCenter">
              <div class="patientTop">
                <span class="patientName text-ellipsis">{{
                  form.patient.patientName
                }}</span>
                <span class="age">{{ form.patient.age }}</span>
                <span class="gender">{{ form.patient.genderText }}</span>
              </div>
              <div class="patientBottom">
                <span>联系方式:</span>
                <span class="ml-10">{{ form.patient.mobile }}</span>
              </div>
            </div>
            <div class="patientRight">
              <span v-if="!form.patient">选择患者</span>
              <span class="iconfont icon-arrow-right"></span>
            </div>
          </div>
        </div>
      </div>
      <dpmsForm ref="dpmsForm" :rules="rules">
        <dpmsCellTimePicker
          required
          title="预约开始时间"
          v-model="form.appointmentBeginTimeStamp"
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
        <dpmsCell
          title="诊所"
          :value="form.medicalInstitution.medicalInstitutionSimpleCode"
        />
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
        <dpmsCell title="预约备注" />
        <textarea
          class="appointmentMemo"
          v-model="form.appointmentMemo"
          auto-height
          placeholder="请输入预约备注"
          placeholder-style="font-size: 34rpx; font-weight: 400; color: rgba(0, 0, 0, 0.25);"
          :maxlength="500"
        ></textarea>
        <div class="mt-56">
          <dpmsButton @click="onSave" :loading="saveLoading">保 存</dpmsButton>
        </div>
      </dpmsForm>
      <div class="pv-50"></div>
    </scroll-view>
  </div>
</template>

<script>
import authAPI from 'APIS/patient/patient.api'
import appointmentAPI from 'APIS/appointment/appointment.api'
import institutionAPI from 'APIS/institution/institution.api'
import { apptFormUtil } from './apptForm.util'
import moment from 'moment'
import avatar from 'businessComponents/avatar/avatar'
import { dataDictUtil } from 'utils/dataDict.util'
import { apptDataService } from './apptData.service'
import { apptMock } from './mock.data'

function getTxtFromArr(Arr, key) {
  return Arr.map((val) => val[key]).join(',')
}

const enums = uni.getStorageSync('enums')

const GENDER_ENUM = dataDictUtil.convert(enums.Gender || {})
const APPOINTMENT_TYPE_ENUM = enums.AppointmentType

let staffListInfo = uni.getStorageSync('staffListInfo') || {}
const notGet =
  staffListInfo.DOCTOR_LIST ||
  staffListInfo.DENTIST_LIST ||
  staffListInfo.CONSULTANT_LIST ||
  staffListInfo.ASSISTANT_MANAGER_LIST ||
  staffListInfo.NURSE_LIST

const medicalInstitution = uni.getStorageSync('medicalInstitution')

export default {
  data() {
    return {
      saveLoading: false, // 保存按钮loading
      GENDER_ENUM,
      method: 'create',
      form: {
        patient: {}, // 患者信息
        visType: undefined, // 就诊类型
        duration: 30, // 持续时间
        COMMON_DATA_APPOINTMENT_ITEM: [], // 预约项目 257, 258
        appointmentBeginTimeStamp: moment()
          .startOf('hour')
          .format('YYYY-MM-DD HH:mm'),
        consultant: -1, // 咨询师
        dentalHygienist: -1, // 洁牙师
        doctor: -1, // 2126 2132 2190 医生
        institutionConsultingRoomId: -1, // 诊室
        help: [-1], // 助理 2423
        nurse: [-1], // 护士 2424
      },
      rules: {
        appointmentBeginTimeStamp: {
          required: true,
          message: '请选择预约开始时间',
        },
        duration: {
          required: true,
          message: '请输入持续时间',
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
      APPT_ITEM_CHECKED_TEXT: '', // 预约项目选中文本
      HELP_CHECKED_TEXT: '', // 助理选中文本
      NURSE_CHECKED_TEXT: '', // 护士选中文本

      selectListCache: [[]], // 0科室, 1诊室, 2医生, 3洁牙师, 4咨询师, 5助理, 6预约项目 7诊所 8护士
      apptInfoCache: {}, // 缓存编辑/挂号预约详情
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

    const patient = {
      age: '24天',
      birthday: '2020-07-08',
      createTime: 1596075704000,
      customerId: 1007467,
      gender: 1,
      institutionChainType: 2,
      isMember: 2,
      medicalInstitutionId: 968,
      medicalRecordNo: 'BL202007290005',
      patientId: 1691,
      patientName: 'roscoe12553sd去往的群无',
      patientNo: 'BL202007290005',
      mobile: 17621399871,
    }

    if (GENDER_ENUM && GENDER_ENUM.properties && patient.gender) {
      patient.genderText = GENDER_ENUM.properties[patient.gender].text.zh_CN
    }

    this.$set(this.form, 'patient', patient)
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
        // console.log(newVal)
      },
      deep: true,
    },
    'form.doctor'(newVal) {
      // 通过医生数据获取当前诊所信息
      this.getMedicalInstitutionRequest().then((res) => {
        this.$set(this.form, 'medicalInstitution', res.data[0])
      })
    },
  },
  methods: {
    init() {
      const form = apptFormUtil.formatApptToFormValues(apptMock)

      this.NURSE_LIST = form.nurseList
      this.ASSISTANT_MANAGER_LIST = form.helpNameList

      this.form = JSON.parse(JSON.stringify(form))
      this.initCheckedText()
      console.log(form)

      // 通过医生数据获取当前诊所信息
      this.getMedicalInstitutionRequest().then((res) => {
        this.$set(this.form, 'medicalInstitution', res.data[0])
      })

      appointmentAPI
        .getAppointmentItemList()
        .then((res) => {
          if (Array.isArray(res.data)) {
            uni.setStorageSync('apptItemList', res.data)

            this.selectListCache[6] = res.data

            this.updateApptItemCheckedText()
          }
        })
        .catch()

      authAPI
        .getConsultationRoomList({ enabled: true })
        .then((res) => {
          if (Array.isArray(res.data)) {
            this.selectListCache[1] = res.data

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
              { staffId: -1, staffName: '未指定医生', position: 2 },
              ...res.data.DOCTOR,
            ]
          }
          if (Array.isArray(res.data.DENTIST)) {
            this.DENTIST_LIST = [
              { staffId: -1, staffName: '未指定洁牙师', position: 3 },
              ...res.data.DENTIST,
            ]
          }
          if (Array.isArray(res.data.CONSULTANT)) {
            this.CONSULTANT_LIST = [
              { staffId: -1, staffName: '未指定咨询师', position: 4 },
              ...res.data.CONSULTANT,
            ]
          }
          if (Array.isArray(res.data.ASSISTANT_MANAGER)) {
            this.ASSISTANT_MANAGER_LIST = [
              { staffId: -1, staffName: '未指定助理', position: 5 },
              ...res.data.ASSISTANT_MANAGER,
            ]
          }
          if (Array.isArray(res.data.NURSE)) {
            this.NURSE_LIST = [
              { staffId: -1, staffName: '未指定护士', position: 6 },
              ...res.data.NURSE,
            ]
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
    // 获取诊所信息
    getMedicalInstitutionRequest() {
      let { appointmentBeginTimeStamp, doctor } = this.form
      let getMedicalInstitution

      if (appointmentBeginTimeStamp && doctor && doctor !== -1) {
        getMedicalInstitution = institutionAPI.getMedicalInstitutionInfoByDoctorSchedule(
          {
            staffId: doctor,
            appointmentStartTimeStamp: moment(
              appointmentBeginTimeStamp,
            ).valueOf(),
          },
        )
      } else {
        getMedicalInstitution = new Promise((resolve) => {
          resolve({
            data: [
              {
                medicalInstitutionSimpleCode:
                  medicalInstitution.medicalInstitutionSimpleCode,
                appointmentMedicalInstitutionId:
                  medicalInstitution.medicalInstitutionId,
                isCurrentInstitutionFlag: true, // 表示是当前诊所
              },
            ],
          })
        })
      }

      return getMedicalInstitution
    },
    // 保存
    onSave() {
      if (!this.form.patient || Object.keys(this.form.patient).length === 0) {
        this.$utils.show('暂无患者信息, 请先选择患者信息')

        return
      }

      if (
        medicalInstitution.institutionChainType === 4 &&
        medicalInstitution.medicalInstitutionId !==
          this.form.medicalInstitution.appointmentMedicalInstitutionId
      ) {
        this.$utils.show('不可预约到其他诊所')

        return
      }

      if (apptFormUtil.isHeaderWithLargeArea(this.form.medicalInstitution)) {
        this.$utils.show('不可预约到总部/大区')

        return
      }

      if (
        medicalInstitution.institutionChainType === 2 &&
        medicalInstitution.topParentId !== 0
      ) {
        if (this.form.medicalInstitution?.institutionChainType === 4) {
          this.$utils.show('不可预约到加盟诊所')

          return
        }
      }

      if (this.form.medicalInstitution?.isCurrentInstitutionFlag === false) {
        uni.showModal({
          title: `确定要把患者${this.form.patient.patientName}预约到${this.form.medicalInstitution?.appointmentMedicalInstitutionName}吗？`,
          showCancel: true,
          success: () => {
            this.getApptVerify()
          },
        })

        return
      }

      this.getApptVerify()
    },
    // 预约提交之前需要校验
    getApptVerify() {
      let values = this.form

      this.saveLoading = true

      values.patientId = this.form.patient.patientId

      // 0科室, 1诊室, 2医生, 3洁牙师, 4咨询师, 5助理, 6预约项目 7诊所 8护士
      const selectListCache = this.selectListCache
      selectListCache[2] = this.DOCTOR_LIST
      selectListCache[3] = this.DENTIST_LIST
      selectListCache[4] = this.CONSULTANT_LIST
      selectListCache[5] = this.ASSISTANT_MANAGER_LIST
      selectListCache[8] = this.NURSE_LIST
      this.selectListCache = selectListCache

      const formatValue = apptFormUtil.mergeFormValuesToAppt(
        values,
        'zh_CN',
        this.selectListCache,
        this.method,
        this.apptInfoCache,
        APPOINTMENT_TYPE_ENUM,
        this.form.medicalInstitution,
      )

      // 预约类型为待定不做校验
      if (
        APPOINTMENT_TYPE_ENUM.UNDETERMINED.value === formatValue.appointmentType
      ) {
        updateApptCb(this.method, formatValue)

        return
      }

      // 预约 校验
      apptDataService.getApptVerify(
        formatValue,
        () => this.updateApptCb(this.method, formatValue),
        null,
        () => (this.saveLoading = false),
      )
    },
    // 新建/更新预约调用接口
    updateApptCb(method, formatValue) {
      let dept

      if (method === 'create' || method === 'again') {
        dept = appointmentAPI.createAppointment({
          appointmentJsonStr: JSON.stringify(formatValue),
        })
      }

      if (method === 'edit') {
        dept = appointmentAPI.updateAppointment({
          appointmentJsonStr: JSON.stringify(formatValue),
        })
      }

      dept
        .then(() => {
          if (method === 'create') {
            this.$utils.show('新增预约成功')
          }

          if (method === 'edit') {
            this.$utils.show('更新预约成功')
          }
        })
        .finally(() => {
          this.saveLoading = false
        })
        .catch()
    },
    initCheckedText() {
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
    },
  },
  components: {
    avatar,
  },
}
</script>

<style lang="scss" scoped>
.apptForm {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: rgba(0, 0, 0, 0.04);

  .bg {
    position: absolute;
    width: 2500rpx;
    height: 2500rpx;
    border-radius: 1250rpx;
    top: -2300rpx;
    left: -875rpx;
    background-color: $common-color;
    z-index: 0;
  }

  .inputRightIcon {
    color: rgba($color: #000000, $alpha: 0.5);
  }

  scroll-view {
    height: 100%;
  }
  .patientInfo {
    box-sizing: border-box;
    height: 296rpx;
    .patientCard {
      width: 686rpx;
      height: 184rpx;
      display: inline-block;
      background-color: #fff;
      padding: 32rpx;
      box-sizing: border-box;
      border-radius: 8rpx;

      > .patientDetail {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .selectPatient {
          color: $common-color;
          font-size: 28rpx;
          margin-right: 10rpx;
        }

        .patientCenter {
          padding-left: 32rpx;
          flex: 1;
          text-align: left;
          .patientTop {
            .patientName,
            .age,
            .gender {
              vertical-align: middle;
            }
            .patientName {
              font-size: 36rpx;
              font-weight: 500;
              color: rgba(0, 0, 0, 0.9);
              line-height: 44rpx;
              padding-right: 32rpx;
              max-width: 220rpx;
              display: inline-block;
              overflow: hidden;
              box-sizing: border-box;
            }
            .age,
            .gender {
              display: inline-block;
              width: 86rpx;
              height: 44rpx;
              background: #fff2e8;
              border: 1px solid #fa541c;
              border-radius: 2rpx;
              text-align: center;
              color: #fa541c;
            }
            .gender {
              background: #e6f7ff;
              border: 1px solid #1890ff;
              margin-left: 16rpx;
              color: #1890ff;
            }
          }
          .patientBottom {
            color: rgba($color: #000000, $alpha: 0.5);
            font-size: 28rpx;
            margin-top: 16rpx;
          }
        }

        .patientRight {
          color: $common-color;
        }
      }
    }
  }
  .appointmentMemo {
    width: 100%;
    padding: 35rpx 32rpx;
    background-color: #fff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  }
}
</style>
