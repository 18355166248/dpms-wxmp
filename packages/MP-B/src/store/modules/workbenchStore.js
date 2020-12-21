import {
  getStorage,
  setStorage,
  removeStorage,
  STORAGE_KEY,
} from '@/utils/storage'

const state = {
  medicalInstitution: getStorage(STORAGE_KEY.MEDICALINSTITUTION)
    ? getStorage(STORAGE_KEY.MEDICALINSTITUTION)
    : {},
  staff: getStorage(STORAGE_KEY.STAFF) ? getStorage(STORAGE_KEY.STAFF) : {},
  apptSetting: getStorage(STORAGE_KEY.APPTSETTING)
    ? getStorage(STORAGE_KEY.APPTSETTING)
    : {},
}

const mutations = {
  setMedicalInstitution(state, value) {
    state.medicalInstitution = value
    setStorage(STORAGE_KEY.MEDICALINSTITUTION, value)
  },
  setStaff(state, value) {
    state.staff = value
    setStorage(STORAGE_KEY.STAFF, value)
  },
  setApptSetting(state, value) {
    state.apptSetting = value
    setStorage(STORAGE_KEY.APPTSETTING, value)
  },
  delMedicalInstitution(state) {
    removeStorage(STORAGE_KEY.MEDICALINSTITUTION)
    state.medicalInstitution = {}
  },
  delStaff(state) {
    removeStorage(STORAGE_KEY.STAFF)
    state.staff = {}
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}
