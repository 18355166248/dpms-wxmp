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
  menu: getStorage(STORAGE_KEY.MENU) ? getStorage(STORAGE_KEY.MENU) : {},
  teethPreviewParams: uni.getStorageSync('teethPreviewParams') || {},
  teethPreviewImgs: uni.getStorageSync('teethPreviewImgs') || {},
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
  setMenu(state, value) {
    state.menu = value
    setStorage(STORAGE_KEY.MENU, value)
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
  setTeethPreviewParams(state, value) {
    state.teethPreviewParams = value
    setStorage('teethPreviewParams', value)
  },
  setTeethPreviewImgs(state, value) {
    state.teethPreviewImgs = value
    setStorage('teethPreviewImgs', value)
  },
}

export default {
  namespaced: true,
  state,
  mutations
}
