import institutionAPI from 'APIS/institution/institution.api'
import diagnosisAPI from 'APIS/diagnosis/diagnosis.api'
import { commonUtil } from 'mpcommon'
import moment from 'moment'
import _ from 'lodash'

const STAFF_POSITION_ENUM = commonUtil.getEnums('StaffPosition')

// 员工岗位属性值
const POSITION_DOCTOR = STAFF_POSITION_ENUM.DOCTOR.value // 医生
const POSITION_DENTIST = STAFF_POSITION_ENUM.DENTIST.value // 洁牙师
const POSITION_CONSULTANT = STAFF_POSITION_ENUM.CONSULTANT.value // 咨询师
const POSITION_ASSISTANT_MANAGER = STAFF_POSITION_ENUM.ASSISTANT_MANAGER.value // 助理
const POSITION_NURSE = STAFF_POSITION_ENUM.NURSE.value // 护士

// 原有接口对一些默认参数进行赋值
export function getStaffListOfInstitution(institutionId) {
  return institutionAPI.getInstitutionStaffList({
    medicalInstitutionId: institutionId,
    flag: 1,
    appointmentItem: { flag: 1 },
    consultingRoom: { flag: 1 },
    department: { flag: 1 },
  })
}

export function getTreatmentTypeByInstitution(institutionId) {
  return diagnosisAPI.getTreatmentTypes({
    medicalInstitutionId: institutionId,
  })
}

export function extractOptions(data) {
  if (!data) {
    return {}
  }

  const options = {
    doctorList: [
      {
        staffId: -1,
        staffName: '未指定医生',
        position: POSITION_DOCTOR,
      },
    ],
    dentistList: [
      {
        staffId: -1,
        staffName: '未指定洁牙师',
        position: POSITION_DENTIST,
      },
    ],
    consultantList: [
      {
        staffId: -1,
        staffName: '未指定咨询师',
        position: POSITION_CONSULTANT,
      },
    ],
    assistantManagerList: [
      {
        staffId: -1,
        staffName: '未指定助理',
        position: POSITION_ASSISTANT_MANAGER,
      },
    ],
    nurseList: [
      { staffId: -1, staffName: '未指定护士', position: POSITION_NURSE },
    ],
    consultingRoomList: [
      {
        institutionConsultingRoomName: '未指定诊室',
        institutionConsultingRoomId: -1,
      },
    ],
    apptItemList: [],
  }

  if (!_.isEmpty(data.doctor)) {
    options.doctorList = options.doctorList.concat(data.doctor)
  }
  if (!_.isEmpty(data.dentist)) {
    options.dentistList = options.dentistList.concat(data.dentist)
  }
  if (!_.isEmpty(data.consultant)) {
    options.consultantList = options.consultantList.concat(data.consultant)
  }
  if (!_.isEmpty(data.assistantManager)) {
    options.assistantManagerList = options.assistantManagerList.concat(
      data.assistantManager,
    )
  }
  if (!_.isEmpty(data.nurse)) {
    options.nurseList = options.nurseList.concat(data.nurse)
  }
  if (!_.isEmpty(data.consultingRoom)) {
    const formatData = data.consultingRoom.map((item) => ({
      ...item,
      institutionConsultingRoomName: item.institutionConsultingRoomName.zh_CN,
    }))

    options.consultingRoomList = options.consultingRoomList.concat(formatData)
  }
  if (!_.isEmpty(data.appointmentItem)) {
    options.apptItemList = options.apptItemList.concat(data.appointmentItem)
  }

  return options
}

export function joinCheckedStaffName(checkedKeys, staffList) {
  return (staffList || [])
    .filter((staff) => checkedKeys.includes(staff.staffId))
    .map((staff) => staff.staffName)
    .join(',')
}

export function formatAppointmentData(form, options) {
  console.log(form, options)
  // 1. 添加资源数据，冗余，后期建议去掉，form已包含相关id信息
  const resourceMap = {}

  // 1.1 添加员工信息
  const staffList = []

  const doctor = options.doctorList.find((s) => s.staffId === form.doctor)
  staffList.push({ ...doctor, position: POSITION_DOCTOR })

  const dental = options.dentistList.find(
    (s) => s.staffId === form.dentalHygienist,
  )
  staffList.push({ ...dental, position: POSITION_DENTIST })

  const consultant = options.consultantList.find(
    (s) => s.staffId === form.consultant,
  )
  staffList.push({ ...consultant, position: POSITION_CONSULTANT })

  // 助理列表
  const helpList = options.assistantManagerList
    .filter((s) => form.help.includes(s.staffId))
    .map((s) => ({ ...s, position: POSITION_ASSISTANT_MANAGER }))
  staffList.push(...helpList)

  // 护士列表
  const nurseList = options.nurseList
    .filter((s) => form.nurse.includes(s.staffId))
    .map((s) => ({ ...s, position: POSITION_NURSE }))
  staffList.push(...nurseList)

  resourceMap.STAFF = staffList

  // 1.2 添加科室信息，目前创建预约没有选择科室的功能
  resourceMap.DEPARTMENT = [
    {
      institutionDepartmentName: '未指定科室',
      institutionDepartmentId: -1,
    },
  ]

  // 1.3 添加诊室信息
  const consultingRoom = options.consultingRoomList.find(
    (r) => r.institutionConsultingRoomId === form.institutionConsultingRoomId,
  )
  resourceMap.CONSULTING_ROOM = [consultingRoom]

  // 1.4 添加预约项目信息，注意这里name要改写，取zh_CN
  const appointmentItems = options.apptItemList
    .filter((item) =>
      form.appointmentItems.includes(item.appointmentSettingsAppointmentItemId),
    )
    .map((item) => ({
      ...item,
      appointmentSettingsAppointmentItemName:
        item.appointmentSettingsAppointmentItemName.zh_CN,
    }))
  resourceMap.COMMON_DATA_APPOINTMENT_ITEM = appointmentItems

  // 2. 添加 appointmentMedicalInstitutionObj，冗余的，建议后期去掉，form中已包含机构id
  const appointmentMedicalInstitutionObj = options.medicalInstitutionList.find(
    (m) =>
      m.appointmentMedicalInstitutionId ===
      form.appointmentMedicalInstitutionId,
  )

  const formatValues = {
    ...form,
    appointmentMedicalInstitutionObj,
    appointmentResourceMap: resourceMap,
  }

  return _.omit(formatValues, ['appointmentItems'])
}

export function getFormValueFromResourceMap(formKey, resourceMap) {
  // doctor: -1,
  // consultant: -1, // 咨询师
  // dentalHygienist: -1, // 洁牙师
  // help: [-1], // 助理，注意此位置字段为help
  // nurse: [-1], // 护士
  // appointmentItems: [], // 预约项目
  // institutionConsultingRoomId: -1, // 诊室

  if (formKey === 'doctor') {
    return resourceMap.STAFF.find((s) => s.position === POSITION_DOCTOR).staffId
  }

  if (formKey === 'consultant') {
    return resourceMap.STAFF.find((s) => s.position === POSITION_CONSULTANT)
      .staffId
  }

  if (formKey === 'dentalHygienist') {
    return resourceMap.STAFF.find((s) => s.position === POSITION_DENTIST)
      .staffId
  }

  if (formKey === 'help') {
    return resourceMap.STAFF.filter(
      (s) => s.position === POSITION_ASSISTANT_MANAGER,
    ).map((s) => s.staffId)
  }

  if (formKey === 'nurse') {
    return resourceMap.STAFF.filter((s) => s.position === POSITION_NURSE).map(
      (s) => s.staffId,
    )
  }

  if (formKey === 'appointmentItems') {
    return (resourceMap.COMMON_DATA_APPOINTMENT_ITEM || []).map(
      (item) => item.appointmentSettingsAppointmentItemId,
    )
  }

  if (formKey === 'institutionConsultingRoomId') {
    if (
      !resourceMap.CONSULTING_ROOM ||
      resourceMap.CONSULTING_ROOM.length === 0
    ) {
      return -1
    }
    return resourceMap.CONSULTING_ROOM[0].institutionConsultingRoomId
  }

  return undefined
}

// 判断是否是总部/大区
export function checkIsHeaderOrLargeArea(institution) {
  const { institutionChainType, topParentId } = institution

  return (
    (institutionChainType === 2 && topParentId === 0) ||
    institutionChainType === 3
  )
}

export function formatRegisterData(form) {
  return {
    assistantStaffIds: form.help.join(','), // 助理ID集合
    visType: form.visType, // 就诊类型（1-初诊/2-复诊）
    doctorStaffId: form.doctor, // 医生ID
    patientId: form.patient.patientId, // 患者ID
    consultedStaffId: form.consultant, // 咨询师ID
    teethCleanedStaffId: form.dentalHygienist, // 洁牙师ID
    institutionConsultingRoomId: form.institutionConsultingRoomId, // 诊室ID
    nurseStaffIds: form.nurse.join(','), // 护士ID集合
    visItemIds: form.appointmentItems.join(','),
    patientMainComplaintIds: form.patientMainComplaintIds,
    memo: form.appointmentMemo, // 备注
  }
}

/**
 * 1. 预约开始时间和结束时间不能跨天
 * 2. 持续时间为5的整数倍（之前为刻度的整数倍，废弃）
 * @param {Moment} startTime 开始时间Moment对象
 * @param {Number} desiredDuration 期望持续时间（分钟）
 * @returns 调整后的预约持续时间
 */
const MIN_DURATION = 5
export function getDuration(startTime, desiredDuration) {
  if (desiredDuration <= MIN_DURATION) {
    return MIN_DURATION
  }

  // 和开始时间同天的最大结束时间
  const endTime = moment(startTime).startOf('day').add(1, 'days')

  // 可以设置的相对于5的最大步数
  const maxStep = Math.floor(endTime.diff(startTime, 'minutes') / MIN_DURATION)

  // 如果步数为0，则直接返回时间差
  if (maxStep === 0) {
    return endTime.diff(startTime, 'minutes')
  }

  const currentStep = Math.ceil(desiredDuration / MIN_DURATION)
  return Math.min(maxStep, currentStep) * MIN_DURATION
}
