<template>
  <div class="apptForm">
    <scroll-view :scroll-y="isScroll" class="h100">
      <div class="bg" />
      <div class="patientInfo tc pt-48 mb-48">
        <div
          :class="['patientCard', form.patient ? 'hasPatient' : '']"
          @click="selectPatient"
        >
          <div class="patientDetail">
            <div>
              <patientAvatar :patient="form.patient" />
            </div>
            <div v-if="form.patient" class="patientCenter">
              <div class="patientTop text-ellipsis">
                {{ form.patient.patientName }}
              </div>
              <div class="patientC mt-8 mb-16">
                <span class="gender mr-8">{{
                  (form.patient && form.patient.gender) | getGenderText
                }}</span>
                <span class="age">{{ form.patient.medicalRecordNo }}</span>
              </div>
              <div class="patientBottom">
                <span>联系方式:</span>
                <span class="ml-10">{{ form.patient.mobile }}</span>
              </div>
            </div>
            <div class="patientRight">
              <span v-if="!form.patient">选择患者</span>
              <span
                class="iconfont icon-arrow-right"
                :style="{ color: form.patient ? 'rgba(0, 0, 0, 0.25)' : '' }"
              ></span>
            </div>
          </div>
        </div>
      </div>
      <dpmsForm ref="dpmsForm" :rules="rules">
        <dpmsCellTimePicker
          v-if="isAppt"
          required
          title="预约开始时间"
          v-model="form.appointmentBeginTimeStamp"
        />
        <!-- 挂号显示预约时间 -->
        <dpmsCell
          v-if="paramsObj.type === 'editRegister'"
          title="预约时间"
          :value="form.timeRange"
        />
        <dpmsCellInput
          v-if="isAppt"
          required
          type="number"
          title="持续时间"
          v-model="form.duration"
          @focus="bindFocus"
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
          v-if="isAppt"
          title="诊所"
          :value="form.medicalInstitution.medicalInstitutionSimpleCode"
        />
        <dpmsCell
          placeholder="请选择助理"
          title="助理"
          :value="HELP_CHECKED_TEXT"
          :isLink="isCurrentInstitutionFlag"
          :disabled="!isCurrentInstitutionFlag"
          @cellclick="onSelectStaff(5)"
        />
        <dpmsCell
          placeholder="请选择护士"
          title="护士"
          :value="NURSE_CHECKED_TEXT"
          :isLink="isCurrentInstitutionFlag"
          :disabled="!isCurrentInstitutionFlag"
          @cellclick="onSelectStaff(6)"
        />
        <dpmsCellPicker
          :list="DENTIST_LIST"
          v-model="form.dentalHygienist"
          defaultType="staffId"
          :defaultProps="{ label: 'staffName', value: 'staffId' }"
          title="洁牙师"
          :disabled="!isCurrentInstitutionFlag"
          placeholder="请选择洁牙师"
        />
        <dpmsCellPicker
          :list="CONSULTANT_LIST"
          v-model="form.consultant"
          defaultType="staffId"
          :defaultProps="{ label: 'staffName', value: 'staffId' }"
          title="咨询师"
          :disabled="!isCurrentInstitutionFlag"
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
          :disabled="!isCurrentInstitutionFlag"
          placeholder="请选择诊室"
        />
        <dpmsCell
          :title="isAppt ? '预约项目' : '就诊项目'"
          :value="APPT_ITEM_CHECKED_TEXT"
          isLink
          @click.native="onSelectApptItem"
          :placeholder="isAppt ? '请选择预约项目' : '请选择就诊项目'"
        />
        <dpmsCell
          v-if="
            paramsObj.type === 'createRegister' ||
            paramsObj.type === 'editRegister'
          "
          title="主诉"
          :value="patientMainComplaintIds"
          isLink
          @click.native="onSelectMainComplaintList"
          placeholder="请选择主诉"
        />
        <dpmsCell title="预约备注" />
        <view class="appointmentMemo">
          <textarea
            v-model="form.appointmentMemo"
            auto-height
            placeholder="请输入预约备注"
            placeholder-style="font-size: 34rpx; font-weight: 400; color: rgba(0, 0, 0, 0.25);"
            :maxlength="500"
            @focus="bindFocus"
            @blur="closeBlur"
          />
        </view>
        <div class="mt-56">
          <dpmsButton @click="onSave" :loading="saveLoading">保 存</dpmsButton>
        </div>
      </dpmsForm>
      <div class="pv-50" />
    </scroll-view>
  </div>
</template>

<script>
import moment from 'moment'
import patientAPI from 'APIS/patient/patient.api'
import appointmentAPI from 'APIS/appointment/appointment.api'
import institutionAPI from 'APIS/institution/institution.api'
import diagnosisAPI from 'APIS/diagnosis/diagnosis.api'
import { apptFormUtil } from './apptForm.util'
import patientAvatar from 'businessComponents/patientAvatar/patientAvatar'
import { dataDictUtil } from 'utils/dataDict.util'
import { apptDataService } from './apptData.service'
import { globalEventKeys } from 'config/global.eventKeys.js'
import { mapState } from 'vuex'
import inputMixins from 'mpcommon/mixins/inputMixins'

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

// 地址栏参数配置
const paramsConfig = {
  createRegister: { title: '新建挂号' },
  editRegister: { title: '编辑挂号' },
  createAppt: { title: '新建预约' },
  editAppt: { title: '编辑预约' },
}

export default {
  mixins: [inputMixins],
  data() {
    return {
      paramsObj: {},
      saveLoading: false, // 保存按钮loading
      GENDER_ENUM,
      method: 'edit',
      form: {
        patient: null, // 患者信息
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
        appointmentType: APPOINTMENT_TYPE_ENUM.COMMON.value, // 预约类型 写死为普通
        patientMainComplaintIds: [],
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
      HELP_CHECKED_TEXT: '未指定助理', // 助理选中文本
      NURSE_CHECKED_TEXT: '未指定护士', // 护士选中文本
      selectListCache: [[]], // 0科室, 1诊室, 2医生, 3洁牙师, 4咨询师, 5助理, 6预约项目 7诊所 8护士
      apptInfoCache: {}, // 缓存编辑/挂号预约详情
      isCurrentInstitutionFlag: true, // 是否为当前诊所
      APPOINTMENT_STATUS_ENUM: this.$utils.getEnums('AppointmentStatus'),
      patientMainComplaintIds: [],
    }
  },
  filters: {
    getGenderText(gender) {
      if (GENDER_ENUM && GENDER_ENUM.properties && gender) {
        return GENDER_ENUM.properties[gender].text.zh_CN
      }
      return ''
    },
  },
  computed: {
    ...mapState('workbenchStore', {
      medicalInstitution: (state) => state.medicalInstitution,
      apptSetting: (state) => state.apptSetting,
    }),
    isAppt() {
      return (
        this.paramsObj.type === 'createAppt' ||
        this.paramsObj.type === 'editAppt'
      )
    },
  },
  onLoad(option = {}) {
    this.paramsObj = option
    uni.setNavigationBarTitle({
      title: paramsConfig[option.type].title,
    })
    // 新建预约进入此页面数据初始化 开始时间, 持续时间, 医生
    if (
      option.startTimeStamp &&
      option.endTimeStamp &&
      option.doctorId &&
      this.paramsObj.type === 'createAppt'
    ) {
      const startTime = moment(Number(option.startTimeStamp))
      const endTime = moment(Number(option.endTimeStamp))
      const duration = endTime.diff(startTime, 'minute')
      this.form.appointmentBeginTimeStamp = startTime.format('YYYY-MM-DD HH:mm')
      this.form.duration = duration
      this.form.doctor = Number(option.doctorId)
    }
    if (option.patient) {
      this.form.patient = JSON.parse(option.patient)
    }
    if (this.paramsObj.type === 'createAppt' && option.patientId) {
      this.getPatientInfoFromServer(option.patientId)
      this.form.appointmentStatus = this.APPOINTMENT_STATUS_ENUM.APPOINTMENT.value
    }
  },
  mounted() {
    // 更新选中员工列表
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
      this.updateApptItemCheckedText(this.form)
    })
    //更新主诉
    uni.$on('patientMainComplaintIds', (checked, list) => {
      this.form.patientMainComplaintIds = checked
      const arr = []
      checked &&
        checked.forEach((ele) => {
          list.forEach((ele2) => {
            if (ele === ele2.id) {
              arr.push(ele2.content)
            }
          })
        })
      this.patientMainComplaintIds = arr.join(',')
    })
    // 更新选中患者卡片信息
    uni.$on(
      globalEventKeys.selectPatientCardFromSearchPatient,
      ({ patientId }) => {
        this.getPatientInfoFromServer(patientId)
      },
    )
    this.init()
  },
  beforeDestroy() {
    uni.$off('apptFormWithUpdateStaffList')
    uni.$off('updateApptItemCheckedList')
    uni.$off('patientMainComplaintIds')
    uni.$off(globalEventKeys.selectPatientCardFromSearchPatient)
    uni.removeStorageSync('apptItemList')
    uni.removeStorageSync('staffListInfo')
  },
  watch: {
    'form.doctor'(newVal) {
      // 通过医生数据获取当前诊所信息
      if (!this.isAppt) return
      if (newVal === -1) {
        this.$set(this.form, 'medicalInstitution', {
          appointmentMedicalInstitutionId: this.medicalInstitution
            .medicalInstitutionId,
          ...this.medicalInstitution,
        })
        return
      }
      this.getMedicalInstitutionRequest().then((res) => {
        this.$set(this.form, 'medicalInstitution', res.data[0])
      })
    },
    'form.appointmentBeginTimeStamp'(newVal) {
      // 通过医生数据获取当前诊所信息
      if (!this.isAppt || this.form.doctor === -1) return
      this.getMedicalInstitutionRequest().then((res) => {
        this.$set(this.form, 'medicalInstitution', res.data[0])
      })
    },
    'form.medicalInstitution'(newVal) {
      newVal &&
        (this.isCurrentInstitutionFlag = newVal.isCurrentInstitutionFlag)
    },
  },
  methods: {
    init() {
      this.$utils.showLoading()
      // 如果地址栏有appointmentId并且type为editRegister或者editAppt才去获取预约详情
      const type = this.paramsObj.type
      this.selectListCache[6] = [] // 预约项目类别

      if (
        this.paramsObj.appointmentId &&
        (type === 'editRegister' || type === 'editAppt')
      ) {
        appointmentAPI
          .getAppointmentDetail({
            appointmentId: this.paramsObj.appointmentId,
          })
          .then((res) => {
            const form = apptFormUtil.formatApptToFormValues(res.data)
            form.appointmentType = APPOINTMENT_TYPE_ENUM.COMMON.value
            if (type === 'editRegister') {
              form.timeRange =
                moment(form.appointmentBeginTimeStamp).format('HH:mm') +
                '~' +
                moment(form.appointmentEndTimeStamp + 1).format('HH:mm')
            }
            // 初始化预约项目选中文本
            if (type === 'editAppt') {
              this.getAppointmentItemList().then(() => {
                this.updateApptItemCheckedText(form)
              })
            }
            this.form = JSON.parse(JSON.stringify(form))
            // 更新诊所信息
            this.getMedicalInstitutionRequest().then((res) => {
              this.$set(this.form, 'medicalInstitution', res.data[0])
            })
            this.initCheckedText(form.helpNameList, form.nurseList)
          })
      }

      this.getAppointmentItemList()
      this.getMedicalInstitutionRequest().then((res) => {
        this.$set(this.form, 'medicalInstitution', res.data[0])
      })

      patientAPI
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
        this.$utils.clearLoading()
        return
      }

      patientAPI
        .getStaffMapThroughPosition({
          positions: '2,3,4,5,6', // 医生:2 --- 洁牙师:3 --- 咨询师:4 --- 助理:5 --- 护士:6
          workStatus: 1,
        })
        .then((res) => {
          this.DOCTOR_LIST = [
            { staffId: -1, staffName: '未指定医生', position: 2 },
            ...(res.data.DOCTOR || []),
          ]
          this.DENTIST_LIST = [
            { staffId: -1, staffName: '未指定洁牙师', position: 3 },
            ...(res.data.DENTIST || []),
          ]
          this.CONSULTANT_LIST = [
            { staffId: -1, staffName: '未指定咨询师', position: 4 },
            ...(res.data.CONSULTANT || []),
          ]
          this.ASSISTANT_MANAGER_LIST = [
            { staffId: -1, staffName: '未指定助理', position: 5 },
            ...(res.data.ASSISTANT_MANAGER || []),
          ]
          this.NURSE_LIST = [
            { staffId: -1, staffName: '未指定护士', position: 6 },
            ...(res.data.NURSE || []),
          ]
          uni.setStorageSync('staffListInfo', {
            DOCTOR_LIST: this.DOCTOR_LIST,
            DENTIST_LIST: this.DENTIST_LIST,
            CONSULTANT_LIST: this.CONSULTANT_LIST,
            ASSISTANT_MANAGER_LIST: this.ASSISTANT_MANAGER_LIST,
            NURSE_LIST: this.NURSE_LIST,
          })
        })
        .finally(() => {
          this.$utils.clearLoading()
        })
        .catch()
    },
    // 获取预约项目列表
    getAppointmentItemList() {
      return new Promise((resolve) => {
        appointmentAPI
          .getAppointmentItemList()
          .then((res) => {
            if (Array.isArray(res.data)) {
              uni.setStorageSync('apptItemList', res.data)
              this.selectListCache[6] = res.data
              resolve()
            }
          })
          .catch((err) => {
            console.log(err)
          })
      })
    },
    onBlurWithDuration(value) {
      this.closeBlur()
      const timeStep = this.apptSetting.appointmentDuration || 15
      if (value < timeStep) return this.$set(this.form, 'duration', timeStep)
      if (value > 1440) return this.$set(this.form, 'duration', 1440)
      if (value % timeStep !== 0) {
        return this.$set(
          this.form,
          'duration',
          Math.max(Math.ceil(value / timeStep) * timeStep, timeStep * 2),
        )
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
          checked.join(','),
      })
    },
    // 选择预约项目
    onSelectApptItem() {
      this.$utils.push({
        url:
          '/baseSubpackages/apptForm/apptItemList?checked=' +
          this.form.COMMON_DATA_APPOINTMENT_ITEM.join(',') +
          '&isAppt=' +
          this.isAppt,
      })
    },
    onSelectMainComplaintList() {
      if (!this.form.patientMainComplaintIds)
        this.form.patientMainComplaintIds = []
      this.$utils.push({
        url:
          '/baseSubpackages/apptForm/mainComplaintList?checked=' +
          this.form.patientMainComplaintIds.join(','),
      })
    },
    updateApptItemCheckedText(form) {
      let apptItemList = uni.getStorageSync('apptItemList')
      uni.pageScrollTo({
        scrollTop: 0,
      })
      apptItemList = apptItemList.filter((apptItem) =>
        form.COMMON_DATA_APPOINTMENT_ITEM.includes(
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
      // 开始时间有值 并且医生不是未指定医生并且是预约页面不是挂号页面
      if (appointmentBeginTimeStamp && doctor && doctor !== -1 && this.isAppt) {
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
                medicalInstitutionSimpleCode: this.medicalInstitution
                  .medicalInstitutionSimpleCode,
                appointmentMedicalInstitutionId: this.medicalInstitution
                  .medicalInstitutionId,
                institutionChainType: this.medicalInstitution
                  .institutionChainType,
                institutionTypeId: this.medicalInstitution.institutionTypeId,
                parentId: this.medicalInstitution.parentId,
                staffMedicalInstitutionId: this.medicalInstitution
                  .staffMedicalInstitutionId,
                topParentId: this.medicalInstitution.topParentId,
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
      if (this.saveLoading) return
      if (!this.form.patient || Object.keys(this.form.patient).length === 0) {
        this.$utils.show('暂无患者信息, 请先选择患者信息')
        return
      }
      if (this.isAppt) {
        if (
          this.medicalInstitution.institutionChainType === 4 &&
          this.medicalInstitution.medicalInstitutionId !==
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
          this.medicalInstitution.institutionChainType === 2 &&
          this.medicalInstitution.topParentId !== 0
        ) {
          if (this.form.medicalInstitution.institutionChainType === 4) {
            this.$utils.show('不可预约到加盟诊所')
            return
          }
        }
        if (this.form.medicalInstitution.isCurrentInstitutionFlag === false) {
          uni.showModal({
            title: `确定要把患者${this.form.patient.patientName}预约到${this.form.medicalInstitution?.appointmentMedicalInstitutionName}吗？`,
            showCancel: true,
            success: ({ confirm, cancel }) => {
              confirm && this.getApptVerify()
            },
          })
          return
        }
        if (!this.saveLoading) {
          this.saveLoading = true
          this.getApptVerify()
        }
      } else {
        this.getApptVerify()
      }
    },
    // 预约提交之前需要校验
    getApptVerify() {
      let values = this.form
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
        this.APPOINTMENT_STATUS_ENUM,
      )
      formatValue.appointmentMedicalInstitutionId =
        formatValue.medicalInstitution.appointmentMedicalInstitutionId

      // 挂号不需要做校验
      if (!this.isAppt) {
        this.updateApptCb(formatValue)
        return
      }
      // 预约 校验
      apptDataService.getApptVerify(
        formatValue,
        () => this.updateApptCb(formatValue),
        () => (this.saveLoading = false),
        () => (this.saveLoading = false),
        () => (this.saveLoading = false),
      )
    },
    // 新建/更新预约 | 挂号调用接口
    updateApptCb(formatValue) {
      this.saveLoading = true
      const type = this.paramsObj.type
      let dept
      if (type === 'createAppt') {
        dept = appointmentAPI.createAppointment({
          appointmentJsonStr: JSON.stringify(formatValue),
        })
      }
      if (type === 'editAppt') {
        dept = appointmentAPI.updateAppointment({
          appointmentJsonStr: JSON.stringify(formatValue),
        })
      }
      if (type === 'createRegister') {
        const params = {
          assistantStaffIds: this.form.help.join(), // 助理ID集合
          visType: this.form.visType, // 就诊类型（1-初诊/2-复诊）
          doctorStaffId: this.form.doctor, // 医生ID
          patientId: this.form.patient.patientId, // 患者ID
          consultedStaffId: this.form.consultant, // 咨询师ID
          teethCleanedStaffId: this.form.dentalHygienist, // 洁牙师ID
          institutionConsultingRoomId: this.form.institutionConsultingRoomId, // 诊室ID
          nurseStaffIds: this.form.nurse.join(), // 护士ID集合
          visItemIds: this.form.COMMON_DATA_APPOINTMENT_ITEM.join(','),
          patientMainComplaintIds: this.form.patientMainComplaintIds,
          memo: this.form.appointmentMemo, // 备注
        }
        console.log(params)
        dept = diagnosisAPI.createNewRegister(params)
      }
      if (type === 'editRegister') {
        dept = diagnosisAPI.createRegister({
          appointmentJsonStr: JSON.stringify(formatValue),
        })
      }
      dept
        .then((res) => {
          if (type === 'createAppt') {
            this.$utils.show('新增预约成功')
          }
          if (type === 'editAppt') {
            this.$utils.show('更新预约成功')
          }
          if (type === 'createRegister') {
            this.$utils.show('新增挂号成功')
          }
          if (type === 'editRegister') {
            this.$utils.show('挂号成功')
          }
          uni.$emit(globalEventKeys.apptFormWithSaveSuccess, {
            isSuccess: true,
            params: this.paramsObj,
            appt: { ...formatValue, ...res.data },
          })
          this.$utils.back()
        })
        .finally(() => {
          this.saveLoading = false
        })
        .catch()
    },
    initCheckedText(helpNameList = [], nurseList = []) {
      helpNameList.length > 0 &&
        (this.HELP_CHECKED_TEXT = getTxtFromArr(
          helpNameList.filter((ASSISTANT_MANAGER) =>
            this.form.help.includes(ASSISTANT_MANAGER.staffId),
          ),
          'staffName',
        ))
      nurseList.length > 0 &&
        (this.NURSE_CHECKED_TEXT = getTxtFromArr(
          nurseList.filter((NURSE) => this.form.nurse.includes(NURSE.staffId)),
          'staffName',
        ))
    },
    // 选择患者
    selectPatient() {
      this.$utils.push({
        url:
          '/pages/patient/searchPatient/searchPatient?type=' +
          this.paramsObj.type,
      })
    },
    // 获取患者信息
    getPatientInfoFromServer(patientId) {
      patientAPI
        .getPatientDetail({ patientId })
        .then((res) => {
          this.$set(this.form, 'patient', res.data)
          this.form.patientId = patientId
        })
        .catch()
    },
  },
  components: {
    patientAvatar,
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
