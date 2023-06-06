import _ from 'lodash'

const handleMustData = {
  /**
   * ** 获取是否展示/必填数据  **
   * patientName  患者姓名
   * gender  性别
   * uploadPhoto  上传头像
   * nickName  个性称呼
   * settingsTypeId  患者类型
   * medicalRecordNo  病历号
   * mobile  联系电话
   * fixedTelephone  固定电话
   * birthday  出生日期
   * age  年龄
   * certificatesNo  身份证号
   * settingsPatientSourceId  患者来源
   * sourceValue  介绍人
   * region  家庭地址
   * address  详细地址
   * isFamilyDecision  家庭决策人
   * nationality  国籍
   * medicalInsuranceCardNo  医保卡号
   * tagIds  患者标签
   * memo  备注
   * @returns
   */
  initMustData() {
    const allPro = [
      'patientName',
      'gender',
      'uploadPhoto',
      'nickName',
      'settingsTypeId',
      'medicalRecordNo',
      'mobile',
      'fixedTelephone',
      'birthday',
      'age',
      'certificatesNo',
      'settingsPatientSourceId',
      'sourceValue',
      'region',
      'address',
      'isFamilyDecision',
      'nationality',
      'medicalInsuranceCardNo',
      'tagIds',
      'memo',
    ]
    let getDataObj = {}

    for (const key in allPro) {
      const temp = allPro[key]

      getDataObj[temp] = {}
      getDataObj[temp]['key'] = key
      getDataObj[temp]['enableMust'] = false
      getDataObj[temp]['enableShow'] = true
    }

    return getDataObj
  },

  /**
   * 修改展示/必填数据
   * @param {*} obj 展示/必填数据
   * @param {*} arr 所有类型的展示/必填数据
   * @param {*} extend 患者类型id
   * @returns
   */
  formatMustData(params) {
    const { obj, arr, extend } = params
    let tempObj = _.cloneDeep(obj)

    for (const key in tempObj) {
      // 没有传extendName，则取第一个患者类型的数据
      if (!extend) {
        tempObj = this.formatPro(tempObj, arr[0], key)
      } else {
        arr.forEach((val) => {
          if (Number(val[0].extend) === Number(extend)) {
            tempObj = this.formatPro(tempObj, val, key)
          }
        })
      }
    }

    return tempObj
  },

  /**
   * 根据属性key修改展示/必填数据（数据取并集）
   * @param {*} obj 展示/必填数据
   * @param {*} arr 所有类型的展示/必填数据
   * @param {*} key 属性的key
   * @returns
   */
  formatPro(obj, arr, key) {
    let tempObj = _.cloneDeep(obj)

    arr.forEach((valA) => {
      if (Number(valA.belongId) === Number(tempObj[key].key) + 1) {
        tempObj[key].enableMust = Boolean(valA.enableMust)
        tempObj[key].enableShow = Boolean(valA.enableShow)
      }
    })

    return tempObj
  },
}

export { handleMustData }
