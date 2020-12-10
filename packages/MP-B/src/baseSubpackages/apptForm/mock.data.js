const apptMock = {
  patient: {
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
    genderText: '男',
  },
  visType: 1,
  duration: 30,
  COMMON_DATA_APPOINTMENT_ITEM: [257, 258, 315, 260],
  appointmentBeginTimeStamp: 1596376800000,
  consultant: 2194,
  dentalHygienist: 2422,
  doctor: 2137,
  institutionConsultingRoomId: 442,
  help: [2423],
  nurse: [2424],
  medicalInstitution: {
    appointmentMedicalInstitutionId: 968,
    appointmentMedicalInstitutionName: '南京直营一店',
    institutionChainType: 2,
    institutionTypeId: 2,
    isCurrentInstitutionFlag: true,
    medicalInstitutionSimpleCode: '南京直营一店简称',
    parentId: 967,
    staffMedicalInstitutionId: 966,
    topParentId: 966,
  },
  patientId: 1691,
  appointmentMemo: '测试预约备注',
  appointmentResourceMap: {
    COMMON_DATA_APPOINTMENT_ITEM: [
      {
        appointmentSettingsAppointmentItemId: 257,
        appointmentSettingsAppointmentItemName: '牙齿清洁',
        appointmentSettingsAppointmentItemTypeColorNo: 'rgba(254,244,200,1)',
        appointmentSettingsAppointmentItemTypeId: 179,
        appointmentSettingsAppointmentItemTypeName: '清洁',
        availableInstitutionIds: [966, 967, 968, 969, 970, 971, 972],
        availableInstitutionList: [
          {
            address: '漕河泾科汇大厦',
            area: 310104,
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            city: 310100,
            contactsName: '李俊',
            contactsPhone: '13521118999',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 2,
            institutionCode: '牙科组演示',
            institutionTypeId: 2,
            institutionWebSite: '',
            latitudeLongitude: '121.40808674791364, 31.184239503103512',
            medicalInstitutionId: 966,
            medicalInstitutionName: '牙科组演示专用诊所',
            medicalInstitutionSimpleCode: '牙科组演示',
            memberCode: '牙科组演示',
            parentId: 0,
            province: 310000,
            status: 1,
            styleId: 1,
            tenantId: 541,
            topParentId: 0,
          },
          {
            address: '',
            area: 120102,
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            city: 120100,
            contactsName: '陈跃霄',
            contactsPhone: '13521118998',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 3,
            institutionCode: '华东大区',
            institutionTypeId: 2,
            medicalInstitutionId: 967,
            medicalInstitutionName: '华东大区',
            medicalInstitutionSimpleCode: '华东大区',
            parentId: 966,
            province: 120000,
            status: 1,
            styleId: 1,
            topParentId: 966,
          },
          {
            address: '',
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            contactsName: '吴相德',
            contactsPhone: '13521118997',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 2,
            institutionCode: '南京直营一店',
            institutionTypeId: 2,
            institutionWebSite: '',
            latitudeLongitude: '121.40433578342619, 31.176267075970756',
            medicalInstitutionId: 968,
            medicalInstitutionName: '南京直营一店',
            medicalInstitutionSimpleCode: '南京直营一店简称',
            parentId: 967,
            status: 1,
            styleId: 1,
            topParentId: 966,
          },
          {
            address: '哈哈路11号',
            area: 120101,
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            city: 120100,
            contactsName: '吴彦祖',
            contactsPhone: '13521118996',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 4,
            institutionCode: '南京加盟一店',
            institutionTypeId: 2,
            institutionWebSite: '',
            medicalInstitutionId: 969,
            medicalInstitutionName: '南京加盟一店',
            medicalInstitutionSimpleCode: '南京加盟一店',
            parentId: 967,
            province: 120000,
            status: 1,
            styleId: 1,
            topParentId: 966,
          },
          {
            address: '',
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            contactsName: '刘诺诺',
            contactsPhone: '13521118995',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 3,
            institutionCode: '华南大区',
            institutionTypeId: 2,
            medicalInstitutionId: 970,
            medicalInstitutionName: '华南大区',
            medicalInstitutionSimpleCode: '华南大区',
            parentId: 966,
            status: 1,
            styleId: 1,
            topParentId: 966,
          },
          {
            address: '',
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            contactsName: '刘安迪',
            contactsPhone: '13521118994',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 2,
            institutionCode: '深圳直营一店',
            institutionTypeId: 2,
            medicalInstitutionId: 971,
            medicalInstitutionName: '深圳直营一店',
            medicalInstitutionSimpleCode: '深圳直营一店',
            parentId: 970,
            status: 1,
            styleId: 1,
            topParentId: 966,
          },
          {
            address: '',
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            contactsName: '刘一名',
            contactsPhone: '13521118993',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 4,
            institutionCode: '深圳加盟一店',
            institutionTypeId: 2,
            medicalInstitutionId: 972,
            medicalInstitutionName: '深圳加盟一店',
            medicalInstitutionSimpleCode: '深圳加盟一店',
            parentId: 970,
            status: 1,
            styleId: 1,
            topParentId: 966,
          },
        ],
        duration: 30,
        lastUpdateStaffId: 2124,
        lastUpdateStaffName: '李俊',
        lastUpdateTime: 1593595426000,
        sort: 1,
      },
      {
        appointmentSettingsAppointmentItemId: 258,
        appointmentSettingsAppointmentItemName: '口腔清洁',
        appointmentSettingsAppointmentItemTypeColorNo: 'rgba(254,244,200,1)',
        appointmentSettingsAppointmentItemTypeId: 179,
        appointmentSettingsAppointmentItemTypeName: '清洁',
        availableInstitutionIds: [966, 967, 968, 969, 970, 971, 972],
        availableInstitutionList: [
          {
            address: '漕河泾科汇大厦',
            area: 310104,
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            city: 310100,
            contactsName: '李俊',
            contactsPhone: '13521118999',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 2,
            institutionCode: '牙科组演示',
            institutionTypeId: 2,
            institutionWebSite: '',
            latitudeLongitude: '121.40808674791364, 31.184239503103512',
            medicalInstitutionId: 966,
            medicalInstitutionName: '牙科组演示专用诊所',
            medicalInstitutionSimpleCode: '牙科组演示',
            memberCode: '牙科组演示',
            parentId: 0,
            province: 310000,
            status: 1,
            styleId: 1,
            tenantId: 541,
            topParentId: 0,
          },
          {
            address: '',
            area: 120102,
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            city: 120100,
            contactsName: '陈跃霄',
            contactsPhone: '13521118998',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 3,
            institutionCode: '华东大区',
            institutionTypeId: 2,
            medicalInstitutionId: 967,
            medicalInstitutionName: '华东大区',
            medicalInstitutionSimpleCode: '华东大区',
            parentId: 966,
            province: 120000,
            status: 1,
            styleId: 1,
            topParentId: 966,
          },
          {
            address: '',
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            contactsName: '吴相德',
            contactsPhone: '13521118997',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 2,
            institutionCode: '南京直营一店',
            institutionTypeId: 2,
            institutionWebSite: '',
            latitudeLongitude: '121.40433578342619, 31.176267075970756',
            medicalInstitutionId: 968,
            medicalInstitutionName: '南京直营一店',
            medicalInstitutionSimpleCode: '南京直营一店简称',
            parentId: 967,
            status: 1,
            styleId: 1,
            topParentId: 966,
          },
          {
            address: '哈哈路11号',
            area: 120101,
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            city: 120100,
            contactsName: '吴彦祖',
            contactsPhone: '13521118996',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 4,
            institutionCode: '南京加盟一店',
            institutionTypeId: 2,
            institutionWebSite: '',
            medicalInstitutionId: 969,
            medicalInstitutionName: '南京加盟一店',
            medicalInstitutionSimpleCode: '南京加盟一店',
            parentId: 967,
            province: 120000,
            status: 1,
            styleId: 1,
            topParentId: 966,
          },
          {
            address: '',
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            contactsName: '刘诺诺',
            contactsPhone: '13521118995',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 3,
            institutionCode: '华南大区',
            institutionTypeId: 2,
            medicalInstitutionId: 970,
            medicalInstitutionName: '华南大区',
            medicalInstitutionSimpleCode: '华南大区',
            parentId: 966,
            status: 1,
            styleId: 1,
            topParentId: 966,
          },
          {
            address: '',
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            contactsName: '刘安迪',
            contactsPhone: '13521118994',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 2,
            institutionCode: '深圳直营一店',
            institutionTypeId: 2,
            medicalInstitutionId: 971,
            medicalInstitutionName: '深圳直营一店',
            medicalInstitutionSimpleCode: '深圳直营一店',
            parentId: 970,
            status: 1,
            styleId: 1,
            topParentId: 966,
          },
          {
            address: '',
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            contactsName: '刘一名',
            contactsPhone: '13521118993',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 4,
            institutionCode: '深圳加盟一店',
            institutionTypeId: 2,
            medicalInstitutionId: 972,
            medicalInstitutionName: '深圳加盟一店',
            medicalInstitutionSimpleCode: '深圳加盟一店',
            parentId: 970,
            status: 1,
            styleId: 1,
            topParentId: 966,
          },
        ],
        duration: 15,
        lastUpdateStaffId: 2124,
        lastUpdateStaffName: '李俊',
        lastUpdateTime: 1593595434000,
        sort: 2,
      },
      {
        appointmentSettingsAppointmentItemId: 315,
        appointmentSettingsAppointmentItemName: '123',
        appointmentSettingsAppointmentItemTypeColorNo: 'rgba(254,244,200,1)',
        appointmentSettingsAppointmentItemTypeId: 179,
        appointmentSettingsAppointmentItemTypeName: '清洁',
        availableInstitutionIds: [966, 967, 968, 969, 970, 971, 972],
        availableInstitutionList: [
          {
            address: '漕河泾科汇大厦',
            area: 310104,
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            city: 310100,
            contactsName: '李俊',
            contactsPhone: '13521118999',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 2,
            institutionCode: '牙科组演示',
            institutionTypeId: 2,
            institutionWebSite: '',
            latitudeLongitude: '121.40808674791364, 31.184239503103512',
            medicalInstitutionId: 966,
            medicalInstitutionName: '牙科组演示专用诊所',
            medicalInstitutionSimpleCode: '牙科组演示',
            memberCode: '牙科组演示',
            parentId: 0,
            province: 310000,
            status: 1,
            styleId: 1,
            tenantId: 541,
            topParentId: 0,
          },
          {
            address: '',
            area: 120102,
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            city: 120100,
            contactsName: '陈跃霄',
            contactsPhone: '13521118998',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 3,
            institutionCode: '华东大区',
            institutionTypeId: 2,
            medicalInstitutionId: 967,
            medicalInstitutionName: '华东大区',
            medicalInstitutionSimpleCode: '华东大区',
            parentId: 966,
            province: 120000,
            status: 1,
            styleId: 1,
            topParentId: 966,
          },
          {
            address: '',
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            contactsName: '吴相德',
            contactsPhone: '13521118997',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 2,
            institutionCode: '南京直营一店',
            institutionTypeId: 2,
            institutionWebSite: '',
            latitudeLongitude: '121.40433578342619, 31.176267075970756',
            medicalInstitutionId: 968,
            medicalInstitutionName: '南京直营一店',
            medicalInstitutionSimpleCode: '南京直营一店简称',
            parentId: 967,
            status: 1,
            styleId: 1,
            topParentId: 966,
          },
          {
            address: '哈哈路11号',
            area: 120101,
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            city: 120100,
            contactsName: '吴彦祖',
            contactsPhone: '13521118996',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 4,
            institutionCode: '南京加盟一店',
            institutionTypeId: 2,
            institutionWebSite: '',
            medicalInstitutionId: 969,
            medicalInstitutionName: '南京加盟一店',
            medicalInstitutionSimpleCode: '南京加盟一店',
            parentId: 967,
            province: 120000,
            status: 1,
            styleId: 1,
            topParentId: 966,
          },
          {
            address: '',
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            contactsName: '刘诺诺',
            contactsPhone: '13521118995',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 3,
            institutionCode: '华南大区',
            institutionTypeId: 2,
            medicalInstitutionId: 970,
            medicalInstitutionName: '华南大区',
            medicalInstitutionSimpleCode: '华南大区',
            parentId: 966,
            status: 1,
            styleId: 1,
            topParentId: 966,
          },
          {
            address: '',
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            contactsName: '刘安迪',
            contactsPhone: '13521118994',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 2,
            institutionCode: '深圳直营一店',
            institutionTypeId: 2,
            medicalInstitutionId: 971,
            medicalInstitutionName: '深圳直营一店',
            medicalInstitutionSimpleCode: '深圳直营一店',
            parentId: 970,
            status: 1,
            styleId: 1,
            topParentId: 966,
          },
          {
            address: '',
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            contactsName: '刘一名',
            contactsPhone: '13521118993',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 4,
            institutionCode: '深圳加盟一店',
            institutionTypeId: 2,
            medicalInstitutionId: 972,
            medicalInstitutionName: '深圳加盟一店',
            medicalInstitutionSimpleCode: '深圳加盟一店',
            parentId: 970,
            status: 1,
            styleId: 1,
            topParentId: 966,
          },
        ],
        duration: 15,
        lastUpdateStaffId: 2137,
        lastUpdateStaffName: '陈医生',
        lastUpdateTime: 1594782898000,
        sort: 7,
      },
      {
        appointmentSettingsAppointmentItemId: 260,
        appointmentSettingsAppointmentItemName: '牙齿美白',
        appointmentSettingsAppointmentItemTypeColorNo: 'rgba(225,253,249,1)',
        appointmentSettingsAppointmentItemTypeId: 180,
        appointmentSettingsAppointmentItemTypeName: '美白',
        availableInstitutionIds: [966, 967, 968, 969, 970, 971, 972],
        availableInstitutionList: [
          {
            address: '漕河泾科汇大厦',
            area: 310104,
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            city: 310100,
            contactsName: '李俊',
            contactsPhone: '13521118999',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 2,
            institutionCode: '牙科组演示',
            institutionTypeId: 2,
            institutionWebSite: '',
            latitudeLongitude: '121.40808674791364, 31.184239503103512',
            medicalInstitutionId: 966,
            medicalInstitutionName: '牙科组演示专用诊所',
            medicalInstitutionSimpleCode: '牙科组演示',
            memberCode: '牙科组演示',
            parentId: 0,
            province: 310000,
            status: 1,
            styleId: 1,
            tenantId: 541,
            topParentId: 0,
          },
          {
            address: '',
            area: 120102,
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            city: 120100,
            contactsName: '陈跃霄',
            contactsPhone: '13521118998',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 3,
            institutionCode: '华东大区',
            institutionTypeId: 2,
            medicalInstitutionId: 967,
            medicalInstitutionName: '华东大区',
            medicalInstitutionSimpleCode: '华东大区',
            parentId: 966,
            province: 120000,
            status: 1,
            styleId: 1,
            topParentId: 966,
          },
          {
            address: '',
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            contactsName: '吴相德',
            contactsPhone: '13521118997',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 2,
            institutionCode: '南京直营一店',
            institutionTypeId: 2,
            institutionWebSite: '',
            latitudeLongitude: '121.40433578342619, 31.176267075970756',
            medicalInstitutionId: 968,
            medicalInstitutionName: '南京直营一店',
            medicalInstitutionSimpleCode: '南京直营一店简称',
            parentId: 967,
            status: 1,
            styleId: 1,
            topParentId: 966,
          },
          {
            address: '哈哈路11号',
            area: 120101,
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            city: 120100,
            contactsName: '吴彦祖',
            contactsPhone: '13521118996',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 4,
            institutionCode: '南京加盟一店',
            institutionTypeId: 2,
            institutionWebSite: '',
            medicalInstitutionId: 969,
            medicalInstitutionName: '南京加盟一店',
            medicalInstitutionSimpleCode: '南京加盟一店',
            parentId: 967,
            province: 120000,
            status: 1,
            styleId: 1,
            topParentId: 966,
          },
          {
            address: '',
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            contactsName: '刘诺诺',
            contactsPhone: '13521118995',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 3,
            institutionCode: '华南大区',
            institutionTypeId: 2,
            medicalInstitutionId: 970,
            medicalInstitutionName: '华南大区',
            medicalInstitutionSimpleCode: '华南大区',
            parentId: 966,
            status: 1,
            styleId: 1,
            topParentId: 966,
          },
          {
            address: '',
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            contactsName: '刘安迪',
            contactsPhone: '13521118994',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 2,
            institutionCode: '深圳直营一店',
            institutionTypeId: 2,
            medicalInstitutionId: 971,
            medicalInstitutionName: '深圳直营一店',
            medicalInstitutionSimpleCode: '深圳直营一店',
            parentId: 970,
            status: 1,
            styleId: 1,
            topParentId: 966,
          },
          {
            address: '',
            beginTimeMilliSecond: 32400000,
            beginTimeStr: '9:00',
            contactsName: '刘一名',
            contactsPhone: '13521118993',
            endTimeMilliSecond: 64800000,
            endTimeStr: '18:00',
            expireDate: 1625155199000,
            institutionChainType: 4,
            institutionCode: '深圳加盟一店',
            institutionTypeId: 2,
            medicalInstitutionId: 972,
            medicalInstitutionName: '深圳加盟一店',
            medicalInstitutionSimpleCode: '深圳加盟一店',
            parentId: 970,
            status: 1,
            styleId: 1,
            topParentId: 966,
          },
        ],
        duration: 30,
        lastUpdateStaffId: 2124,
        lastUpdateStaffName: '李俊',
        lastUpdateTime: 1593595468000,
        sort: 4,
      },
    ],
    STAFF: [
      {
        departmentId: 768,
        mobile: '15900451752',
        position: 2,
        sort: 3,
        staffId: 2137,
        staffName: '陈医生',
        username: 'chenyx1',
      },
      {
        departmentId: -1,
        mobile: '15900451752',
        position: 3,
        sort: 6,
        staffId: 2422,
        staffName: '陈洁牙师',
        username: 'chenyx4',
      },
      {
        departmentId: -1,
        mobile: '12345678902',
        position: 4,
        sort: 4,
        staffId: 2194,
        staffName: '李咨询',
        username: 'likun2',
      },
      {
        departmentId: -1,
        mobile: '15900451752',
        position: 5,
        sort: 6,
        staffId: 2423,
        staffName: '陈助理',
        username: 'chenyx5',
      },
      {
        departmentId: -1,
        mobile: '15900451752',
        position: 6,
        sort: 6,
        staffId: 2424,
        staffName: '陈护士',
        username: 'chenyx6',
      },
    ],
    DEPARTMENT: [
      { institutionDepartmentId: -1, institutionDepartmentName: '未指定科室' },
    ],
    CONSULTING_ROOM: [
      { enabled: true, institutionConsultingRoomId: 442, sort: 1 },
    ],
  },
  appointmentEndTimeStamp: 1596378599999,
  appointmentMedicalInstitutionObj: {
    appointmentMedicalInstitutionId: 968,
    appointmentMedicalInstitutionName: '南京直营一店',
    institutionChainType: 2,
    institutionTypeId: 2,
    isCurrentInstitutionFlag: true,
    medicalInstitutionSimpleCode: '南京直营一店简称',
    parentId: 967,
    staffMedicalInstitutionId: 966,
    topParentId: 966,
  },
}

export { apptMock }