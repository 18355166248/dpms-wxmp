<template>
  <view>
    <loading>登录中...</loading>
  </view>
</template>

<script>
import systemAPI from '@/APIS/system.api'
import authAPI from '@/APIS/auth/auth.api'
import { setStorage, getStorage, STORAGE_KEY } from '@/utils/storage'
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
          this.$dpmsUtils.show('登录失败！' + res.errMsg)
        }
      },
    })
  },
  methods: {
    async doLogin(code) {
      const fullPath = getStorage(STORAGE_KEY.QW_ENTRY_FULL_PATH)
      const query = qs.parse(fullPath.split('?')[1])
      console.log('hc:!!!!!!!', query)

      const corpId = query?.corpId
      const agentId = query?.agentId
      if (!corpId || !agentId) {
        this.$dpmsUtils.show('corpId或agentId为空，将跳转至登录页面')
        this.$dpmsUtils.reLaunch({
          url: '/pages/login/login',
        })
        return
      }

      const loginResult = await authAPI.qyLogin({ code, corpId, agentId })
      if (loginResult.code !== 0) {
        this.$dpmsUtils.show('登录失败！')
        return
      }

      const { medicalInstitutionId, staffId, token } = loginResult.data
      setStorage(STORAGE_KEY.ACCESS_TOKEN, token)
      await this.getLoginInfo(staffId, medicalInstitutionId, token)
      await this.initData()

      this.$dpmsUtils.reLaunch({ url: fullPath })
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
