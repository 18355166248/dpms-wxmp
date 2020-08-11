import {
  getStorage,
  setStorage,
  removeStorage,
  STORAGE_KEY,
} from '@/utils/storage'

export default {
  namespaced: true,
  state: {
    ACCESS_TOKEN: getStorage(STORAGE_KEY.ACCESS_TOKEN),
    ENUMS: getStorage(STORAGE_KEY.ENUMS),
    MEDICALINSTITUTION: getStorage(STORAGE_KEY.MEDICALINSTITUTION),
  },
  mutations: {
    SET_ACCESS_TOKEN(state, value) {
      state.ACCESS_TOKEN = value
      setStorage(STORAGE_KEY.ACCESS_TOKEN, value)
    },
    SET_ENUMS(state, value) {
      state.ENUMS = value
      setStorage(STORAGE_KEY.ENUMS, value)
    },
    SET_MEDICALINSTITUTION(state, value) {
      state.MEDICALINSTITUTION = value
      setStorage(STORAGE_KEY.MEDICALINSTITUTION, value)
    },
  },
}
