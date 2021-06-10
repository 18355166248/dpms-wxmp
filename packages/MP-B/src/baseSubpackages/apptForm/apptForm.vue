<template>
  <view class="apptForm">
    <scroll-view scroll-y class="h100">
      <view class="bg" />
      <view class="patientInfo tc pt-48 mb-48">
        <view
          :class="['patientCard', form.patient ? 'hasPatient' : '']"
          @click="selectPatient"
        >
          <view class="patientDetail">
            <view>
              <patientAvatar :patient="form.patient" />
            </view>
            <view v-if="form.patient" class="patientCenter">
              <view class="patientTop text-ellipsis">
                {{ form.patient.patientName }}
              </view>
              <view class="patientC mt-8 mb-16">
                <span class="gender mr-8">{{
                  (form.patient && form.patient.gender) | getGenderText
                }}</span>
                <span class="age">{{ form.patient.medicalRecordNo }}</span>
              </view>
              <view class="patientBottom">
                <span>联系方式:</span>
                <span class="ml-10">{{ form.patient.mobile }}</span>
              </view>
            </view>
            <view class="patientRight">
              <span v-if="!form.patient">选择患者</span>
              <span
                class="iconfont icon-arrow-right"
                :style="{ color: form.patient ? 'rgba(0, 0, 0, 0.25)' : '' }"
              ></span>
            </view>
          </view>
        </view>
      </view>
      <dpmsForm ref="dpmsForm" :rules="rules">
        <dpmsCellTimePicker
          v-if="isAppt"
          required
          title="预约开始时间"
          v-model="form.appointmentBeginTimeStamp"
        />
        <!-- 编辑挂号显示预约时间 -->
        <dpmsCell
          v-if="formType === 'editRegister'"
          title="预约时间"
          :value="formTimeRangeText"
        />
        <dpmsCellInput
          required
          v-if="isAppt"
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
          :list="options.treatmentTypes"
          v-model="form.visType"
          defaultType="codeId"
          :defaultProps="{ label: 'name', value: 'codeId' }"
          title="就诊类型"
          placeholder="请选择就诊类型"
        />
        <dpmsEnumsPicker
          enumsKey="AppointmentType"
          v-model="form.appointmentType"
          title="预约类型"
          placeholder="请选择预约类型"
        />
        <dpmsCellPicker
          :list="options.doctorList"
          v-model="form.doctor"
          defaultType="staffId"
          :defaultProps="{ label: 'staffName', value: 'staffId' }"
          title="医生"
          placeholder="请选择医生"
        />
        <dpmsCellPicker
          v-if="isAppt"
          :list="options.medicalInstitutionList"
          v-model="form.appointmentMedicalInstitutionId"
          defaultType="appointmentMedicalInstitutionId"
          :defaultProps="{
            label: 'medicalInstitutionSimpleCode',
            value: 'appointmentMedicalInstitutionId',
          }"
          title="诊所"
          placeholder="请选择诊所"
        />
        <dpmsCell
          placeholder="请选择助理"
          title="助理"
          :value="selectedAssistantJoinedStr"
          @cellclick="
            onSelectStaff('请选择助理', 'assistantManagerList', 'help')
          "
        />
        <dpmsCell
          placeholder="请选择护士"
          title="护士"
          :value="selectedNurseJoinedStr"
          @cellclick="onSelectStaff('请选择护士', 'nurseList', 'nurse')"
        />
        <dpmsCellPicker
          :list="options.dentistList"
          v-model="form.dentalHygienist"
          defaultType="staffId"
          :defaultProps="{ label: 'staffName', value: 'staffId' }"
          title="洁牙师"
          placeholder="请选择洁牙师"
        />
        <dpmsCellPicker
          :list="options.consultantList"
          v-model="form.consultant"
          defaultType="staffId"
          :defaultProps="{ label: 'staffName', value: 'staffId' }"
          title="咨询师"
          placeholder="请选择咨询师"
        />
        <dpmsCellPicker
          :list="options.consultingRoomList"
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
          :title="isAppt ? '预约项目' : '就诊项目'"
          :value="selectedAppointmentItemStr"
          isLink
          @click.native="onSelectApptItem"
          :placeholder="isAppt ? '请选择预约项目' : '请选择就诊项目'"
        />
        <dpmsCell
          title="主诉"
          v-if="isRegister"
          :value="selectedMainComplaintStr"
          isLink
          @click.native="onSelectMainComplaintList"
          placeholder="请选择主诉"
        />
        <dpmsCell title="备注" />
        <view class="appointmentMemo">
          <textarea
            v-model="form.appointmentMemo"
            auto-height
            placeholder="请输入备注"
            placeholder-style="font-size: 34rpx; font-weight: 400; color: rgba(0, 0, 0, 0.25);"
            :maxlength="500"
            @focus="bindFocus"
          />
        </view>
        <view class="mt-56">
          <dpmsButton @click="onSave" :loading="submitting">保 存</dpmsButton>
        </view>
      </dpmsForm>
      <view class="pv-50" />
    </scroll-view>
  </view>
</template>

<script>
import moment from 'moment'
import patientAPI from 'APIS/patient/patient.api'
import appointmentAPI from 'APIS/appointment/appointment.api'
import institutionAPI from 'APIS/institution/institution.api'
import diagnosisAPI from 'APIS/diagnosis/diagnosis.api'
import patientAvatar from 'businessComponents/patientAvatar/patientAvatar'
import { apptDataService } from './apptData.service'
import { globalEventKeys } from 'config/global.eventKeys.js'
import { mapState } from 'vuex'
import inputMixins from 'mpcommon/mixins/inputMixins'
import { commonUtil } from 'mpcommon'
import _ from 'lodash'
// import { apptFormUtil } from './apptForm.util'
import {
  getStaffListOfInstitution,
  getTreatmentTypeByInstitution,
  extractOptions,
  joinCheckedStaffName,
  formatAppointmentData,
  getFormValueFromResourceMap,
  formatRegisterData,
  checkIsHeaderOrLargeArea,
} from './utils'

const GENDER_ENUM = commonUtil.getEnums('Gender')
const APPOINTMENT_TYPE_ENUM = commonUtil.getEnums('AppointmentType')

// 普通预约类型的值
const COMMON_APPOINTMENT = APPOINTMENT_TYPE_ENUM.COMMON.value

const titleMap = {
  createRegister: '新建挂号',
  editRegister: '编辑挂号',
  createAppt: '新建预约',
  editAppt: '编辑预约',
}

const rules = {
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
}

export default {
  mixins: [inputMixins],
  components: {
    patientAvatar,
  },
  data() {
    return {
      form: {
        appointmentId: undefined,
        patient: undefined,
        appointmentBeginTimeStamp: moment().startOf('hour').valueOf(),
        appointmentEndTimeStamp: moment().startOf('hour').valueOf(),
        duration: 30,
        visType: undefined,
        appointmentType: COMMON_APPOINTMENT,
        doctor: -1,
        consultant: -1, // 咨询师
        dentalHygienist: -1, // 洁牙师
        help: [-1], // 助理，注意此位置字段为help
        nurse: [-1], // 护士
        appointmentItems: [], // 预约项目
        appointmentMedicalInstitutionId: -1, // 诊所
        institutionConsultingRoomId: -1, // 诊室
        appointmentMemo: '', // 备注
        patientMainComplaintIds: [], // 主诉
      },
      options: {
        treatmentTypes: [], // 可选的就诊类型
        doctorList: [], // 可选的医生列表
        dentistList: [],
        consultantList: [],
        assistantManagerList: [],
        nurseList: [],
        apptItemList: [],
        consultingRoomList: [], // 诊室列表
        medicalInstitutionList: [], // 诊所列表
        mainComplaintList: [], // 主诉
      },
      pageOption: {},
      submitting: false,
      currentMedicalConfig: uni.getStorageSync(
        'currentMedicalInstitutionConfig',
      ),
    }
  },
  filters: {
    getGenderText(gender) {
      if (GENDER_ENUM && GENDER_ENUM.properties && gender) {
        return GENDER_ENUM.properties[gender].text.zh_CN
      }
      return '未知'
    },
  },
  computed: {
    ...mapState('workbenchStore', {
      apptSetting: (state) => state.apptSetting,
      loginMedicalInstitution: (state) => state.medicalInstitution,
    }),
    selectedAssistantJoinedStr() {
      return joinCheckedStaffName(
        this.form.help,
        this.options.assistantManagerList,
      )
    },
    selectedNurseJoinedStr() {
      return joinCheckedStaffName(this.form.nurse, this.options.nurseList)
    },
    selectedAppointmentItemStr() {
      return (this.options.apptItemList || [])
        .filter((item) =>
          this.form.appointmentItems.includes(
            item.appointmentSettingsAppointmentItemId,
          ),
        )
        .map((item) => item.appointmentSettingsAppointmentItemName.zh_CN)
        .join(',')
    },
    selectedMainComplaintStr() {
      return (this.options.mainComplaintList || [])
        .filter((item) => this.form.patientMainComplaintIds.includes(item.id))
        .map((item) => item.content)
        .join(',')
    },
    isAppt() {
      return this.formType === 'createAppt' || this.formType === 'editAppt'
    },
    isRegister() {
      return (
        this.formType === 'createRegister' || this.formType === 'editRegister'
      )
    },
    formTimeRangeText() {
      return (
        moment(this.form.appointmentBeginTimeStamp).format('HH:mm') +
        '~' +
        moment(this.form.appointmentEndTimeStamp + 1).format('HH:mm')
      )
    },
    formType() {
      // 目前如下几个类型：createAppt/editAppt/createRegister/editRegister
      return this.pageOption.type
    },
  },
  onLoad(option = {}) {
    this.pageOption = option
    uni.setNavigationBarTitle({ title: titleMap[option.type] })
    // 1. 如果是创建预约，对于带过来的默认参数进行赋值
    if (option.type === 'createAppt') {
      if (option.startTimeStamp && option.endTimeStamp) {
        const startTime = moment(Number(option.startTimeStamp))
        const endTime = moment(Number(option.endTimeStamp))
        const duration = endTime.diff(startTime, 'minute')
        this.form.appointmentBeginTimeStamp = startTime.valueOf()
        this.form.appointmentEndTimeStamp = endTime.valueOf()
        this.form.duration = duration
      }
      if (option.doctorId) {
        this.form.doctor = Number(option.doctorId)
      }
      if (option.patientId) {
        patientAPI
          .getPatientDetail({ patientId: option.patientId })
          .then((res) => {
            this.form.patient = res.data
            this.form.patientId = option.patientId
          })
      }

      // 2. 初始化机构，预约视图接入机构或者当前机构
      const defaultMedicalInstitution =
        uni.getStorageSync('accessMedicalInstitution') ||
        this.loginMedicalInstitution
      this.form.appointmentMedicalInstitutionId =
        defaultMedicalInstitution.medicalInstitutionId

      this.refreshMedicalInstitutionList()
      this.refreshInstitutionRelatedOptions()
    } else if (option.type === 'editAppt' || option.type === 'editRegister') {
      this.form.appointmentId = option.appointmentId
      appointmentAPI
        .getAppointmentDetail({ appointmentId: option.appointmentId })
        .then((res) => {
          const {
            patientId,
            patient,
            appointmentBeginTime,
            appointmentEndTime,
            visType,
            appointmentType,
            appointmentMedicalInstitutionId,
            appointmentMemo,
            appointmentResourceMap,
          } = res.data
          this.form.patientId = patientId
          this.form.patient = patient
          this.form.appointmentBeginTimeStamp = appointmentBeginTime
          this.form.appointmentEndTimeStamp = appointmentEndTime
          this.form.duration = moment(appointmentEndTime).diff(
            moment(appointmentBeginTime),
            'minute',
          )
          this.form.appointmentType = appointmentType
          this.form.appointmentMedicalInstitutionId = appointmentMedicalInstitutionId
          this.form.visType = visType
          this.form.appointmentMemo = appointmentMemo
          const otherFields = [
            'doctor',
            'consultant',
            'dentalHygienist',
            'help',
            'nurse',
            'appointmentItems',
            'institutionConsultingRoomId',
          ]
          otherFields.forEach((key) => {
            this.form[key] = getFormValueFromResourceMap(
              key,
              appointmentResourceMap,
            )
          })
          this.refreshMedicalInstitutionList()
          this.refreshInstitutionRelatedOptions()
        })
    } else if (option.type === 'createRegister') {
      this.form.appointmentMedicalInstitutionId = this.loginMedicalInstitution.medicalInstitutionId
      this.refreshMedicalInstitutionList()
      this.refreshInstitutionRelatedOptions()
    }

    this.initEvents()
  },
  watch: {
    'form.patient': function (newPatient) {
      // 在新建预约和新建挂号时，选择患者后，根据该患者在所选机构是否有就诊记录初始化就诊类型
      // 有：初始化为复诊，无：初始化为初诊
      if (
        this.formType === 'createAppt' ||
        this.formType === 'createRegister'
      ) {
        diagnosisAPI
          .getRegisterCount({
            patientId: newPatient.patientId,
            currentInstitution: this.form.medicalInstitutionId,
          })
          .then((res) => {
            // 1: 初诊, 2: 复诊, 这两种类型id固定
            this.form.visType = res.data > 0 ? 2 : 1
          })
      }
    },
    'form.appointmentMedicalInstitutionId': function (newVal) {
      // 清除和机构相关的填入数据
      this.form.consultant = -1 // 咨询师
      this.form.dentalHygienist = -1 // 洁牙师
      this.form.help = [-1] // 助理，注意此位置字段为help
      this.form.nurse = [-1] // 护士
      this.form.appointmentItems = [] // 预约项目
      this.form.institutionConsultingRoomId = -1 // 预约项目
      // 刷新机构相关的一些可选项数据，如医生、洁牙师、...
      this.refreshInstitutionRelatedOptions()
    },
    // 存储供预约项目列表使用
    'options.apptItemList': function (newVal) {
      uni.setStorageSync('apptItemList', newVal)
    },
    // 当预约开始时间和doctor变化时，获取诊所信息
    'form.doctor': function () {
      this.refreshMedicalInstitutionList()
    },
    'form.appointmentBeginTimeStamp': function () {
      this.refreshMedicalInstitutionList()
    },
    'form.duration': function () {
      this.form.appointmentEndTimeStamp = moment(
        this.form.appointmentBeginTimeStamp,
      )
        .add(this.form.duration, 'minutes')
        .subtract(1, 'milliseconds')
        .valueOf()
    },
  },
  beforeDestroy() {
    uni.$off('updateApptItemCheckedList')
    uni.$off('patientMainComplaintIds')
    uni.$off(globalEventKeys.selectPatientCardFromSearchPatient)
    uni.removeStorageSync('apptItemList')
  },
  methods: {
    // 刷新所有机构相关的可选项
    refreshInstitutionRelatedOptions() {
      getTreatmentTypeByInstitution(
        this.form.appointmentMedicalInstitutionId,
      ).then((res) => {
        if (res.data && res.data.length > 0) {
          this.options.treatmentTypes = res.data
        }
      })
      getStaffListOfInstitution(this.form.appointmentMedicalInstitutionId).then(
        (res) => {
          const optionsMap = extractOptions(res.data)
          this.options.doctorList = optionsMap.doctorList
          this.options.dentistList = optionsMap.dentistList
          this.options.consultantList = optionsMap.consultantList
          this.options.assistantManagerList = optionsMap.assistantManagerList
          this.options.nurseList = optionsMap.nurseList
          this.options.consultingRoomList = optionsMap.consultingRoomList
          this.options.apptItemList = optionsMap.apptItemList
        },
      )
    },
    initEvents() {
      uni.$on(
        globalEventKeys.selectPatientCardFromSearchPatient,
        ({ patientId }) => {
          // 只会传递一个patientId过来，获取医生详情，刷新卡片
          patientAPI.getPatientDetail({ patientId }).then((res) => {
            this.form.patient = res.data
            this.form.patientId = patientId
          })
        },
      )

      uni.$on('updateApptItemCheckedList', (checked) => {
        this.form.appointmentItems = checked
      })

      uni.$on('updateApptStaffCheckedList', ({ key, value }) => {
        this.form[key] = value
      })

      // 主诉
      uni.$on('patientMainComplaintIds', (checked, list) => {
        this.form.patientMainComplaintIds = checked
        this.options.mainComplaintList = list
      })
    },
    async refreshMedicalInstitutionList() {
      if (!this.form.appointmentBeginTimeStamp || !this.form.doctor) {
        return
      }
      const {
        data: medicalInstitutionList,
      } = await institutionAPI.getMedicalInstitutionInfoByDoctorSchedule({
        appointmentStartTimeStamp: this.form.appointmentBeginTimeStamp,
        staffId: this.form.doctor,
      })
      this.options.medicalInstitutionList = medicalInstitutionList
      const hasTarget =
        medicalInstitutionList.findIndex(
          (m) =>
            m.medicalInstitutionId ===
            this.form.appointmentMedicalInstitutionId,
        ) > -1
      if (!hasTarget) {
        this.form.appointmentMedicalInstitutionId =
          medicalInstitutionList[0].appointmentMedicalInstitutionId
      }
    },
    onBlurWithDuration(value) {
      // TODO 设置和机构相关，预约视图也有此问题
      const timeStep = this.apptSetting.appointmentDuration || 30
      this.$set(this.form, 'duration', Math.ceil(value / timeStep) * timeStep)
    },
    // 跳转选择员工页面
    onSelectStaff(title, optionKey, formKey) {
      uni.setStorageSync('apptStaffSelectList', this.options[optionKey])
      const checked = this.form[formKey].join(',')
      this.$utils.push({
        url:
          '/baseSubpackages/apptForm/staffList?' +
          `&checked=${checked}` +
          `&title=${title}` +
          `&key=${formKey}`,
      })
    },
    // 选择预约项目
    onSelectApptItem() {
      this.$utils.push({
        url:
          '/baseSubpackages/apptForm/apptItemList?checked=' +
          this.form.appointmentItems.join(',') +
          '&isAppt=' +
          this.isAppt,
      })
    },
    onSelectMainComplaintList() {
      this.$utils.push({
        url:
          '/baseSubpackages/apptForm/mainComplaintList?checked=' +
          this.form.patientMainComplaintIds.join(','),
      })
    },
    onSave() {
      if (this.submitting) {
        return
      }

      //  患者校验
      if (!this.form.patient) {
        this.$utils.show('暂无患者信息，请先选择患者信息')
        return
      }

      if (this.isAppt) {
        // 根据form中的id找到当前选择的预约机构
        const medicalInstitution = this.options.medicalInstitutionList.find(
          (m) =>
            m.appointmentMedicalInstitutionId ===
            this.form.appointmentMedicalInstitutionId,
        )

        // 不能预约到总部或大区
        if (checkIsHeaderOrLargeArea(medicalInstitution)) {
          this.$utils.show('不可预约到总部/大区')
          return
        }

        if (medicalInstitution.isCurrentInstitutionFlag) {
          uni.showModal({
            title: `确定要把患者${this.form.patient.patientName}预约到${medicalInstitution.appointmentMedicalInstitutionName}吗？`,
            showCancel: true,
            success: ({ confirm, cancel }) => {
              this.submitting = true
              if (confirm) {
                this.verify()
              }
            },
          })
        } else {
          this.verify()
        }
      } else if (this.isRegister) {
        // 挂号不做校验直接提交
        this.submit()
      }
    },
    verify() {
      const data = formatAppointmentData(this.form, this.options)
      apptDataService.getApptVerify(
        data,
        () => this.submit(),
        () => (this.saveLoading = false),
        () => (this.saveLoading = false),
        () => (this.saveLoading = false),
      )
    },
    async submit() {
      this.submitting = true
      let res = {}
      const submitData = formatAppointmentData(this.form, this.options)
      if (this.formType === 'createAppt') {
        res = await appointmentAPI.createAppointment({
          appointmentJsonStr: JSON.stringify(submitData),
        })
        this.$utils.show('新增预约成功')
      } else if (this.formType === 'editAppt') {
        res = await appointmentAPI.updateAppointment({
          appointmentJsonStr: JSON.stringify(submitData),
        })
        this.$utils.show('更新预约成功')
      } else if (this.formType === 'editRegister') {
        // 在预约上挂号
        res = await diagnosisAPI.createRegister({
          appointmentJsonStr: JSON.stringify(submitData),
        })
        this.$utils.show('挂号成功')
      } else if (this.formType === 'createRegister') {
        // 直接挂号
        const data = formatRegisterData(this.form)
        res = await diagnosisAPI.createNewRegister(data)
        this.$utils.show('新增挂号成功')
      }

      uni.$emit(globalEventKeys.apptFormWithSaveSuccess, {
        isSuccess: true,
        params: this.pageOption,
        appt: { ...submitData, ...res.data },
      })
      this.$utils.back()
    },
    // 选择患者
    selectPatient() {
      this.$utils.push({
        url: '/pages/patient/searchPatient/searchPatient?type=createAppt',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.apptForm {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.04);
  overflow: auto;
  .inputRightIcon {
    color: rgba($color: #000000, $alpha: 0.5);
  }
  scroll-view {
    height: 100%;
    position: relative;
    .bg {
      position: absolute;
      width: 2500rpx;
      height: 2500rpx;
      border-radius: 1250rpx;
      top: -2300rpx;
      left: -875rpx;
      background-color: $common-color;
      z-index: -1;
    }
  }
  .patientInfo {
    box-sizing: border-box;
    .patientCard {
      width: 702rpx;
      height: 184rpx;
      display: inline-block;
      background-color: #fff;
      padding: 32rpx 24rpx;
      box-sizing: border-box;
      border-radius: 8rpx;
      &.hasPatient {
        height: 208rpx;
      }
      > .patientDetail {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        .selectPatient {
          color: $common-color;
          font-size: 28rpx;
          margin-right: 10rpx;
        }
        .patientCenter {
          padding-left: 32rpx;
          flex: 1;
          text-align: left;
          overflow: hidden;
          .patientTop {
            width: 100%;
            font-size: 34rpx;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.9);
            overflow: hidden;
          }
          .patientC {
            font-size: 26rpx;
            .age,
            .gender {
              vertical-align: middle;
              display: inline-block;
              background: #fff2e8;
              color: #fa541c;
              border-radius: 2rpx;
              height: 40rpx;
              line-height: 40rpx;
              text-align: center;
              padding: 2rpx 16rpx;
              min-width: 90rpx;
            }
          }
          .patientBottom {
            color: rgba($color: #000000, $alpha: 0.5);
            font-size: 28rpx;
          }
        }
        .patientRight {
          color: $common-color;
          display: flex;
          align-items: center;
        }
      }
    }
  }
  .appointmentMemo {
    width: 100%;
    padding: 35rpx 32rpx;
    background-color: #fff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    box-sizing: border-box;
    textarea {
      width: 100%;
    }
  }
}
</style>
