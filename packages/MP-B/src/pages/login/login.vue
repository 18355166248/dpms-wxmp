<template>
  <view>
    <button type="primary" plain="true" @click="login">login</button>
    <button type="primary" plain="true" @click="getEnums">get enums</button>
  </view>
</template>

<script>
import authAPI from '@/APIS/auth/auth.api'
import systemAPI from '@/APIS/system.api'
import { setStorage } from '@/APIS/utils'

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
          const { access_token, refresh_token, medicalInstitution, staff } = res.data
          setStorage('access_token', access_token)
          setStorage('refresh_token', refresh_token)
          setStorage('medicalInstitution', medicalInstitution)
          setStorage('staff', staff)
        })
    },
    getEnums() {
      systemAPI.getDataDict({ test: 1, name: '123' })
    },
  },
}
</script>
