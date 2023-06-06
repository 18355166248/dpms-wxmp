import _ from 'lodash'
import { commonUtil } from 'mpcommon'
import institutionAPI from 'APIS/institution/institution.api'

const GENDER_ENUM = commonUtil.getEnums('Gender')
const STAFF_STATUS_ENUM = commonUtil.getEnums('StaffStatus')
const STAFF_POSITION_ENUM = commonUtil.getEnums('StaffPosition')

const POSITION_DOCTOR = STAFF_POSITION_ENUM.DOCTOR.value
const STATUS_AT_WORK = STAFF_STATUS_ENUM.STAFF_STATUS_AT_WORK_NAME.value

// 医生数据转换成scheduler组件要求的group格式
export function data2schedulerGroup(data) {
  if (!data) {
    return null
  }

  return data.map((d) => ({ key: d.staffId, title: d.staffName }))
}

// 预约数据转换成scheduler组件要求数据格式
export function appointment2schedulerResource(data) {
  if (!data) {
    return []
  }

  return data.map((d) => {
    // groupId为医生id
    let doctorId = -1
    if (d.appointmentResourceMap && d.appointmentResourceMap.STAFF) {
      const staff = d.appointmentResourceMap.STAFF.find(
        (s) => s.position === POSITION_DOCTOR,
      )
      if (staff) {
        doctorId = staff.staffId
      }
    }

    // subtitle为性别和诊断类型
    let subTitle =
      GENDER_ENUM.properties[d.patient.gender]?.text.zh_CN || '未知'
    if (d.visTypeName) {
      subTitle = subTitle + ',' + d.visTypeName
    }

    // 多个预约项目
    const appointmentItems =
      d?.appointmentResourceMap?.COMMON_DATA_APPOINTMENT_ITEM || []
    const itemsForShow = appointmentItems.map((item) => ({
      typeName: item.appointmentSettingsAppointmentItemName,
      typeStyle: 'background: #fff2e8; color:#FA541C',
    }))

    return {
      id: d.appointmentId,
      groupId: doctorId,
      title: d.patient.patientName,
      subTitle: `(${subTitle})`,
      lock: false,
      showTime: true,
      items: itemsForShow,
      cardStyle: 'border-left:4px solid #5cbb89; background:#fff',
      begin: d.appointmentBeginTimeStamp,
      end: d.appointmentEndTimeStamp,
      flag: d.acrossInstitutionAppointmentFlag ? '跨' : undefined,
    }
  })
}

// 日程数据转换成scheduler组件要求数据格式
export function blockEvent2schedulerResource(data) {
  if (!data) {
    return []
  }

  return data.map((b) => {
    return {
      id: b.appointmentBlockEventId,
      groupId: b.businessId,
      title: b.businessName,
      subTitle: '(日程)',
      lock: true,
      showTime: true,
      items: [
        {
          typeName: b.appointmentBlockEventName,
          typeStyle:
            'border:1px solid rgba(0,0,0,0.15); color:#595959; background:#f6f6f6;',
        },
      ],
      cardStyle: 'border-left:4px solid #595959; background:#f6f6f6;',
      begin: b.blockBeginTime,
      end: b.blockEndTime,
    }
  })
}

export function findInstitutionInTree(root, targetId) {
  if (root.medicalInstitutionId === targetId) {
    return root
  }

  const childList = root.childMedicalInstitutionList
  if (childList && childList.length > 0) {
    for (let i = 0; i < childList.length; i++) {
      const result = findInstitutionInTree(childList[i], targetId)
      if (result) {
        return result
      }
    }
  }

  return null
}

export function getDoctorListByInstitutionId(institutionId) {
  return institutionAPI.getStaffListByPosition({
    position: POSITION_DOCTOR,
    workStatus: STATUS_AT_WORK,
    includeUnspecified: true,
    medicalInstitutionId: institutionId,
  })
}
