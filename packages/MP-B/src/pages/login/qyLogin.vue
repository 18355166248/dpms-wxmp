<template>
  <view>
    <loading>登录中...</loading>
  </view>
</template>

<script>
import systemAPI from '@/APIS/system.api'
import authAPI from '@/APIS/auth/auth.api'
import { setStorage, STORAGE_KEY } from '@/utils/storage'
import qs from 'qs'

export default {
  data() {
    return {
      isLoading: false,
    }
  },
  onLoad() {
    console.log('企业微信登录')
    wx.qy.login({
      success: (res) => {
        if (res.code) {
          console.log(res)
          this.doLogin(res.code)
        } else {
          this.$utils.show('登录失败！' + res.errMsg)
        }
      },
    })
  },
  methods: {
    async doLogin(code) {
      const option = uni.getLaunchOptionsSync()
      const { query, path } = option
      // const corpId = query?.corpId || 'wwc436a6d7c6c66d49'
      // const agentId = query?.agentId || 1000039
      const corpId = query?.corpId
      const agentId = query?.agentId
      if (!corpId || !agentId) {
        this.$utils.show('corpId或agentId为空，将跳转至登录页面')
        this.$utils.reLaunch({
          url: "/pages/login/login",
        })
        return
      }

      const loginResult = await authAPI.qyLogin({ code, corpId, agentId })
      if (loginResult.code !== 0) {
        this.$utils.show('登录失败！')
        return
      }

      const { medicalInstitutionId, staffId, token } = loginResult.data
      setStorage(STORAGE_KEY.ACCESS_TOKEN, token)
      await this.getLoginInfo(staffId, medicalInstitutionId, token)
      await this.initData()

      const newPath = path.startsWith('/') ? path : `/${path}`
      this.$utils.reLaunch({
        url: `${newPath}?${qs.stringify(query)}`,
      })
    },
    async getLoginInfo(_uid, _mtId, _token) {
      const res = await systemAPI.getLoginInfo({
        _uid,
        _mtId,
        _token,
      })
      this.$store.commit(
        'workbenchStore/setMedicalInstitution',
        res.data.medicalInstitution,
      )
      this.$store.commit('workbenchStore/setStaff', {
        staffId: _uid,
        ...res.data.staff,
      })
    },
    async initData() {
      return Promise.all([systemAPI.menuAll(), systemAPI.getDataDict()]).then(
        ([res1, res2]) => {
          this.$store.commit('workbenchStore/setMenu', res1.data)
          setStorage(STORAGE_KEY.ENUMS, res2.data)
        },
      )
    },
  },
}
</script>
