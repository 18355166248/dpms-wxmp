import _ from 'lodash'
import frontAuthConfig from '@/config/frontAuth.config.json'
import EnvConfig from '@/config'
import { getStorage } from '@/utils/storage'

// single-package 单体
// chain-package 连锁
// superadmin-role 超级管理员
// admin-role 诊所管理员
// other-role 其他角色
// in-hq 总部
// in-region 大区
// in-direct 直营
// in-franchise 加盟
// work-in-own 所属诊所
// work-in-other 非所属诊所的工作诊所

const frontAuthUtil = {
  getUserAuth() {
    if (EnvConfig.overwriteFrontAuth?.open) {
      return EnvConfig.overwriteFrontAuth
    }

    const medicalInstitution = getStorage('medicalInstitution')
    const staff = getStorage('staff')

    if (!medicalInstitution || !staff) return {}

    return {
      isSinglePackage: medicalInstitution?.institutionTypeId === 1,
      isChainPackage: medicalInstitution?.institutionTypeId === 2,

      isSuperAdminRole: staff?.isSuper === 1,
      isAdminRole: staff?.isSuper !== 1 && staff?.isAdmin === 1,
      isOtherRole: staff?.isSuper !== 1 && staff?.isAdmin !== 1,

      isInHQ:
        medicalInstitution?.institutionChainType === 2 &&
        medicalInstitution?.topParentId ===
          medicalInstitution?.medicalInstitutionId,
      isInRegion: medicalInstitution?.institutionChainType === 3,
      isInDirect:
        medicalInstitution?.institutionChainType === 2 &&
        medicalInstitution?.topParentId !== 0,
      isInFranchise: medicalInstitution?.institutionChainType === 4,

      isWorkInOwn:
        staff &&
        staff.belongsInstitutionId &&
        staff.belongsInstitutionId === medicalInstitution?.medicalInstitutionId,
      isWorkInOther:
        staff &&
        staff.belongsInstitutionId &&
        staff.belongsInstitutionId !== medicalInstitution?.medicalInstitutionId,
    }
  },

  check(name) {
    const targetAuthMap = frontAuthConfig[name]

    if (!targetAuthMap) {
      console.warn(`未找到 [${name}] 权限`)

      return
    }

    const {
      isSinglePackage,
      isChainPackage,
      isSuperAdminRole,
      isAdminRole,
      isOtherRole,
      isInHQ,
      isInRegion,
      isInDirect,
      isInFranchise,
      isWorkInOwn,
      isWorkInOther,
    } = frontAuthUtil.getUserAuth()

    const targetAuthNameList = []

    if (isSinglePackage) {
      targetAuthNameList.push('single-package')

      isSuperAdminRole && targetAuthNameList.push('superadmin-role')
      !isSuperAdminRole && targetAuthNameList.push('other-role')
    }

    if (isChainPackage) {
      targetAuthNameList.push('chain-package')

      if (isSuperAdminRole) {
        isSuperAdminRole && targetAuthNameList.push('superadmin-role')
        isInHQ && targetAuthNameList.push('in-hq')
        isInRegion && targetAuthNameList.push('in-region')
        isInDirect && targetAuthNameList.push('in-direct')
        isInFranchise && targetAuthNameList.push('in-franchise')
      } else {
        isAdminRole && targetAuthNameList.push('admin-role')
        isOtherRole && targetAuthNameList.push('other-role')

        isWorkInOwn && targetAuthNameList.push('work-in-own')
        isWorkInOther && targetAuthNameList.push('work-in-other')

        isInHQ && targetAuthNameList.push('in-hq')
        isInRegion && targetAuthNameList.push('in-region')
        isInDirect && targetAuthNameList.push('in-direct')
        isInFranchise && targetAuthNameList.push('in-franchise')
      }
    }

    const targetAuth = targetAuthMap[targetAuthNameList.join('_')]

    if (_.isUndefined(targetAuth)) {
      console.warn(
        `[${name}] 权限中 未找到 [${targetAuthNameList.join(
          '_',
        )}] 配置项 默认返回 false`,
      )

      return false
    }

    return targetAuth
  },

  // 判断 总部和大区不能选择
  canSelect(clinicItem) {
    const {
      institutionChainType,
      topParentId,
      medicalInstitutionId,
    } = clinicItem

    return !(
      (institutionChainType === 2 && topParentId === medicalInstitutionId) ||
      institutionChainType === 3
    )
  },
}

export { frontAuthUtil }
