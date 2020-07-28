<template>
  <view>
    <button type="primary" plain="true" @click="login">login</button>
    <button type="primary" plain="true" @click="getEnums">get enums</button>
  </view>
</template>

<script>
import authAPI from '@/APIS/auth/auth.api'
import systemAPI from '@/APIS/system.api'
import { setStorage, STORAGE_KEY } from '@/utils/storage'
export default {
  methods: {
    login() {
      authAPI
        .login({
          memberCode: '牙科组演示',
          username: 'likun1',
          password: 'likun1',
          mtId: 968,
        })
        .then((res) => {
          console.log('res:', res)
          const { access_token, medicalInstitution, staff } = res.data
          setStorage(STORAGE_KEY.ACCESS_TOKEN, access_token)
          setStorage(STORAGE_KEY.MEDICALINSTITUTION, medicalInstitution)
          setStorage(STORAGE_KEY.STAFF, staff)
        })
    },
    getEnums() {
      systemAPI.getDataDict({ test: 1, name: '123' })
    },
  },
}
</script>
