import moment from 'moment'

const apptFormUtil = {
  /**
   * 格式化数据给后端
   * @param formValues {object} 表单数据
   * @param lang {string} 多语言
   * @param selectListCache {array} 预约弹窗缓存列表数据 科室, 诊室, 医生, 洁牙师, 咨询师, 助理, 预约项目
   * @param method {string} 模态框方式 新增/编辑/查看/再次
   * @param apptInfoCache 缓存编辑/挂号预约详情
   * @param APPOINTMENT_TYPE_ENUM 预约类型字典(编辑预约需要)  普通:COMMON  待定:UNDETERMINED
   * @param curMedicalInstitution 当前预约诊所信息
   * selectListCache 0科室, 1诊室, 2医生, 3洁牙师, 4咨询师, 5助理, 6预约项目 7诊所 8护士
   */
  mergeFormValuesToAppt(
    formValues,
    lang,
    selectListCache,
    method,
    apptInfoCache,
    APPOINTMENT_TYPE_ENUM,
    curMedicalInstitution,
  ) {
    const values = _.cloneDeep(formValues)
    const selectList = _.cloneDeep(selectListCache)
    const toothPositionArr = _.cloneDeep(
      apptInfoCache?.appointmentResourceMap?.TOOTH_POSITION || [],
    )
    const staffArr = _.cloneDeep(
      apptInfoCache?.appointmentResourceMap?.STAFF || [],
    )
    const apptItemArr = _.cloneDeep(
      apptInfoCache?.appointmentResourceMap?.COMMON_DATA_APPOINTMENT_ITEM || [],
    )
    const departmentCache = _.cloneDeep(
      apptInfoCache?.appointmentResourceMap?.DEPARTMENT?.[0] || {},
    )
    const consultingRoomCache = _.cloneDeep(
      apptInfoCache?.appointmentResourceMap?.CONSULTING_ROOM?.[0] || {},
    )

    if (method === 'again') {
      delete values.appointmentId
    }

    // 编辑状态 预约类型改变了的情况下 普通到待定 appointmentStatus: 1 待定到普通 appointmentStatus: 2
    if (method === 'edit' && APPOINTMENT_TYPE_ENUM) {
      if (apptInfoCache.appointmentType !== formValues.appointmentType) {
        if (formValues.appointmentType === APPOINTMENT_TYPE_ENUM.COMMON.value) {
          values.appointmentStatus = 2
        }

        if (
          formValues.appointmentType ===
          APPOINTMENT_TYPE_ENUM.UNDETERMINED.value
        ) {
          values.appointmentStatus = 1
        }
      }
    }

    if (method !== 'register') {
      values.appointmentResourceMap = {}

      // 格式化开始时间
      values.appointmentBeginTimeStamp = moment(
        values.appointmentBeginTimeStamp,
      ).valueOf()
      // 格式化结束时间
      values.appointmentEndTimeStamp = moment(values.appointmentBeginTimeStamp)
        .add(values.duration, 'minutes')
        .subtract(1, 'milliseconds')
        .valueOf()
    }

    // 格式化牙位
    if (values?.TOOTH_POSITION?.teeth) {
      values.appointmentResourceMap.TOOTH_POSITION = Object.keys(
        values.TOOTH_POSITION.teeth,
      ).map((teethItem) => {
        const item =
          toothPositionArr.find(
            (toothPosition) => +teethItem === toothPosition.toothPosition,
          ) || {}

        // 再次预约 删除appointmentId 和 appointmentItemId
        deleteIds(method, item)

        return {
          ...item,
          appointmentResourceType: 1,
          toothPosition: teethItem,
        }
      })
    }

    // 格式化诊所信息
    if (curMedicalInstitution) {
      values.appointmentMedicalInstitutionObj = curMedicalInstitution
    }

    // 格式化预约项目
    if (
      Array.isArray(selectList[6]) &&
      Array.isArray(values.COMMON_DATA_APPOINTMENT_ITEM)
    ) {
      values.COMMON_DATA_APPOINTMENT_ITEM.forEach((appItem) => {
        let apptItemValue = selectList[6].find(
          (valueItem) =>
            appItem === valueItem.appointmentSettingsAppointmentItemId,
        )

        if (apptItemValue) {
          apptItemValue.appointmentSettingsAppointmentItemName =
            apptItemValue.appointmentSettingsAppointmentItemName[lang]

          // 编辑/挂号状态从缓存中查找是否是已存在的数据, 如果以存在, 将缓存数据合并进来
          const apptItemValueCache = apptItemArr.find(
            (apptItem) =>
              apptItem.appointmentSettingsAppointmentItemId ===
              apptItemValue.appointmentSettingsAppointmentItemId,
          )

          if (apptItemValueCache) {
            apptItemValue = { ...apptItemValueCache, ...apptItemValue }
          }

          deleteIds(method, apptItemValue)

          if (values.appointmentResourceMap.COMMON_DATA_APPOINTMENT_ITEM) {
            values.appointmentResourceMap.COMMON_DATA_APPOINTMENT_ITEM.push(
              apptItemValue,
            )
          } else {
            values.appointmentResourceMap.COMMON_DATA_APPOINTMENT_ITEM = [
              apptItemValue,
            ]
          }
        }
      })
    }

    // 格式化 2医生, 3洁牙师, 4咨询师, 5助理, 8护士
    values.appointmentResourceMap.STAFF = []

    // 医生
    // 医生从缓存中查找是否是已存在的数据, 如果已存在, 将缓存数据合并进来
    const doctorCache = staffArr.find((staff) => staff.position === 2)

    if (values.doctor !== -1) {
      let doctor = selectList[2].find(
        (staff) => values.doctor === staff.staffId,
      )

      if (doctor) {
        // doctor.staffName = doctor.staffName[lang];

        if (doctorCache && doctorCache.staffId === doctor.staffId) {
          doctor = { ...doctorCache, ...doctor }
        }

        deleteIds(method, doctor)

        values.appointmentResourceMap.STAFF.push(doctor)
      }
    } else {
      let doctor = { staffId: -1, staffName: '未指定医生', position: 2 }

      if (doctorCache && doctorCache.staffId === -1) {
        doctor = { ...doctorCache, ...doctor }
      }

      deleteIds(method, doctor)

      values.appointmentResourceMap.STAFF.push(doctor)
    }

    // 3洁牙师
    // 从缓存中查找是否是已存在的数据, 如果已存在, 将缓存数据合并进来
    const dentalHygienistCache = staffArr.find((staff) => staff.position === 3)

    if (values.dentalHygienist !== -1) {
      let dentalHygienist = selectList[3].find(
        (dentalHygienist) => values.dentalHygienist === dentalHygienist.staffId,
      )

      if (dentalHygienist) {
        // dentalHygienist.staffName = dentalHygienist.staffName[lang];

        if (
          dentalHygienistCache &&
          dentalHygienistCache.staffId === dentalHygienist.staffId
        ) {
          dentalHygienist = { ...dentalHygienistCache, ...dentalHygienist }
        }

        deleteIds(method, dentalHygienist)

        values.appointmentResourceMap.STAFF.push(dentalHygienist)
      }
    } else {
      let dentalHygienist = {
        staffId: -1,
        staffName: '未指定洁牙师',
        position: 3,
      }

      if (dentalHygienistCache && dentalHygienistCache.staffId === -1) {
        dentalHygienist = { ...dentalHygienistCache, ...dentalHygienist }
      }

      deleteIds(method, dentalHygienist)

      values.appointmentResourceMap.STAFF.push(dentalHygienist)
    }

    // 4咨询师
    // 从缓存中查找是否是已存在的数据, 如果已存在, 将缓存数据合并进来
    const consultantCache = staffArr.find((staff) => staff.position === 4)

    if (values.consultant !== -1) {
      let consultant = selectList[4].find(
        (consultant) => values.consultant === consultant.staffId,
      )

      if (consultant) {
        // consultant.staffName = consultant.staffName[lang];

        if (consultantCache && consultantCache.staffId === consultant.staffId) {
          consultant = { ...consultantCache, ...consultant }
        }

        deleteIds(method, consultant)

        values.appointmentResourceMap.STAFF.push(consultant)
      }
    } else {
      let consultant = { staffId: -1, staffName: '未指定咨询师', position: 4 }

      if (consultantCache && consultantCache.staffId === -1) {
        consultant = { ...consultantCache, ...consultant }
      }

      deleteIds(method, consultant)

      values.appointmentResourceMap.STAFF.push(consultant)
    }

    // 5助理
    // 从缓存中查找是否是已存在的数据, 如果已存在, 将缓存数据合并进来
    const helpListCache = staffArr.filter((staff) => staff.position === 5)

    values.help.forEach((helpItem) => {
      let help = selectList[5].find((staff) => staff.staffId === helpItem)

      if (help) {
        // help.staffName = help.staffName[lang];

        const helpCache = helpListCache.find(
          (helpItem) => helpItem.staffId === help.staffId,
        )

        if (helpCache) {
          help = { ...helpCache, ...help }
        }

        deleteIds(method, help)

        values.appointmentResourceMap.STAFF.push(help)
      }
    })

    // 8护士
    // 从缓存中查找是否是已存在的数据, 如果已存在, 将缓存数据合并进来
    const nurseListCache = staffArr.filter((staff) => staff.position === 6)

    values.nurse.forEach((nurseItem) => {
      let nurse = selectList[8].find((staff) => staff.staffId === nurseItem)

      if (nurse) {
        // nurse.staffName = nurse.staffName[lang];

        const nurseCache = nurseListCache.find(
          (nurseItem) => nurseItem.staffId === nurse.staffId,
        )

        if (nurseCache) {
          nurse = { ...nurseCache, ...nurse }
        }

        deleteIds(method, nurse)

        values.appointmentResourceMap.STAFF.push(nurse)
      }
    })

    // 处理 0科室 DEPARTMENT
    let DEPARTMENT = selectList[0].find(
      (department) =>
        department.institutionDepartmentId === values.institutionDepartmentId,
    )

    if (DEPARTMENT) {
      DEPARTMENT.institutionDepartmentName =
        DEPARTMENT.institutionDepartmentName[lang]

      if (
        departmentCache.institutionDepartmentId ===
        DEPARTMENT.institutionDepartmentId
      ) {
        DEPARTMENT = { ...departmentCache, ...DEPARTMENT }
      }

      deleteIds(method, DEPARTMENT)

      values.appointmentResourceMap.DEPARTMENT = [DEPARTMENT]
    } else {
      DEPARTMENT = {
        institutionDepartmentId: -1,
        institutionDepartmentName: '未指定科室',
      }

      if (departmentCache.institutionDepartmentId === -1) {
        DEPARTMENT = { ...departmentCache, ...DEPARTMENT }
      }

      deleteIds(method, DEPARTMENT)

      values.appointmentResourceMap.DEPARTMENT = [DEPARTMENT]
    }

    // 处理 1诊室 CONSULTING_ROOM
    let CONSULTING_ROOM = selectList[1].find(
      (consultingRoom) =>
        consultingRoom.institutionConsultingRoomId ===
        values.institutionConsultingRoomId,
    )

    if (CONSULTING_ROOM) {
      CONSULTING_ROOM.institutionConsultingRoomName =
        CONSULTING_ROOM.institutionConsultingRoomName[lang]

      if (
        consultingRoomCache.institutionConsultingRoomId ===
        CONSULTING_ROOM.institutionConsultingRoomId
      ) {
        CONSULTING_ROOM = { ...consultingRoomCache, ...CONSULTING_ROOM }
      }

      deleteIds(method, CONSULTING_ROOM)

      values.appointmentResourceMap.CONSULTING_ROOM = [CONSULTING_ROOM]
    } else {
      CONSULTING_ROOM = {
        institutionConsultingRoomId: -1,
        institutionConsultingRoomName: '未指定诊室',
      }

      if (consultingRoomCache.institutionConsultingRoomId === -1) {
        CONSULTING_ROOM = { ...consultingRoomCache, ...CONSULTING_ROOM }
      }

      deleteIds(method, CONSULTING_ROOM)

      values.appointmentResourceMap.CONSULTING_ROOM = [CONSULTING_ROOM]
    }

    return values

    // 删除appointmentId和appointmentItemId
    function deleteIds(method, object) {
      if (method === 'again') {
        delete object.appointmentId
        delete object.appointmentItemId
      }
    }
  },

  /**
   * 解析后端数据渲染到页面
   * @param appt {object} 后端数据
   */
  formatApptToFormValues(appt) {
    const values = _.cloneDeep(appt)

    // 格式化牙位
    values.TOOTH_POSITION = {
      teeth: {},
    }

    if (values.appointmentResourceMap?.TOOTH_POSITION) {
      values.appointmentResourceMap.TOOTH_POSITION.forEach((tooth) => {
        values.TOOTH_POSITION.teeth[tooth.toothPosition] = true
      })
    }

    // 格式化开始时间
    values.appointmentBeginTimeStamp = moment(
      values.appointmentBeginTimeStamp,
    ).format('YYYY-MM-DD HH:mm')
    // 格式化持续时间
    values.duration =
      moment(values.appointmentEndTimeStamp).diff(
        moment(values.appointmentBeginTimeStamp),
        'minutes',
      ) + 1

    // 格式化预约项目
    values.COMMON_DATA_APPOINTMENT_ITEM = []

    if (values.appointmentResourceMap?.COMMON_DATA_APPOINTMENT_ITEM) {
      values.appointmentResourceMap.COMMON_DATA_APPOINTMENT_ITEM.forEach(
        (apptItem) => {
          values.COMMON_DATA_APPOINTMENT_ITEM.push(
            apptItem.appointmentSettingsAppointmentItemId,
          )
        },
      )
    }

    // 格式化 2医生, 3洁牙师, 4咨询师, 5助理
    values.doctor = -1
    values.dentalHygienist = -1
    values.consultant = -1
    values.help = [] // 助理
    values.helpNameList = []
    values.nurse = [] //护士
    values.nurseList = []

    if (values.appointmentResourceMap?.STAFF) {
      values.appointmentResourceMap.STAFF.forEach((staffItem) => {
        if (staffItem.position === 2) {
          values.doctor = staffItem.staffId // 医生
          values.doctorName = staffItem.staffId !== -1 && staffItem.staffName // 用于如果该人离职的话需要在表单显示
        }

        if (staffItem.position === 3) {
          values.dentalHygienist = staffItem.staffId // 洁牙师
          values.dentalHygienistName =
            staffItem.staffId !== -1 && staffItem.staffName // 用于如果该人离职的话需要在表单显示
        }

        if (staffItem.position === 4) {
          values.consultant = staffItem.staffId // 咨询师
          values.consultantName =
            staffItem.staffId !== -1 && staffItem.staffName // 用于如果该人离职的话需要在表单显示
        }

        if (staffItem.position === 5) {
          values.help.push(staffItem.staffId) // 助理 (多选)

          if (staffItem.staffId !== -1) {
            values.helpNameList.push(staffItem) // 用于如果该人离职的话需要在表单显示
          }
        }

        if (staffItem.position === 6) {
          values.nurse.push(staffItem.staffId) // 护士 (多选)

          if (staffItem.staffId !== -1) {
            values.nurseList.push(staffItem) // 用于如果该人离职的话需要在表单显示
          }
        }
      })
    }

    if (values.help.length === 0) {
      values.help = [-1]
    }

    if (values.nurse.length === 0) {
      values.nurse = [-1]
    }

    // 科室
    if (
      Array.isArray(values.appointmentResourceMap?.DEPARTMENT) &&
      values.appointmentResourceMap.DEPARTMENT.length > 0
    ) {
      values.institutionDepartmentId =
        values.appointmentResourceMap.DEPARTMENT[0].institutionDepartmentId
      values.institutionDepartmentName =
        values.institutionDepartmentId !== -1 &&
        values.appointmentResourceMap.DEPARTMENT[0].institutionDepartmentName // 用于如果该人离职的话需要在表单显示
    }

    // 诊室
    if (
      Array.isArray(values.appointmentResourceMap?.CONSULTING_ROOM) &&
      values.appointmentResourceMap.CONSULTING_ROOM.length > 0
    ) {
      values.institutionConsultingRoomId =
        values.appointmentResourceMap.CONSULTING_ROOM[0].institutionConsultingRoomId
      values.institutionConsultingRoomName =
        values.institutionConsultingRoomId !== -1 &&
        values.appointmentResourceMap.CONSULTING_ROOM[0]
          .institutionConsultingRoomName // 用于如果该人离职的话需要在表单显示
    }

    return values
  },
  // 判断是否是总部/大区
  isHeaderWithLargeArea(clinic) {
    const { institutionChainType, topParentId } = clinic

    return (
      (institutionChainType === 2 && topParentId === 0) ||
      institutionChainType === 3
    )
  },
  // 判断 总部和大区不能选择
  canSelect(clinicItem) {
    const { institutionChainType, topParentId } = clinicItem

    return !(
      (institutionChainType === 2 && topParentId === 0) ||
      institutionChainType === 3
    )
  },
}
export { apptFormUtil }
