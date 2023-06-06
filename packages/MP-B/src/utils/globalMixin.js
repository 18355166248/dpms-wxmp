import Vue from 'vue'
import { mapState } from 'vuex'
import { frontAuthUtil } from './frontAuth.util'

const golbalMixin = {
  computed: {
    ...mapState('workbenchStore', ['menu']),
  },
  methods: {
    btnPremisstion(preString) {
      const { buttonList } = this.menu
      return buttonList.map((item) => item.enumValue).includes(preString)
    },
    menuPermission(keyArr = ['report-center', 'performance', 'doctors']) {
      if (!Array.isArray(keyArr)) return false
      if (keyArr[0] === 'any') return true
      const { menuList } = this.menu
      let _keyArr = [...keyArr]
      let findObj
      const checkPermission = (menuList) => {
        const menukey = _keyArr.shift()
        findObj = menuList?.find((v) => {
          return v.enumValue === menukey
        })
        if (findObj && _keyArr.length > 0) {
          checkPermission(findObj.children)
        }
        return findObj
      }
      return !!checkPermission(menuList)
    },
    // 根据连锁身份权限判断,总部,大区,直营,加盟
    checkChainPermission(name) {
      return frontAuthUtil.check(name)
    },
  },
}

Vue.mixin(golbalMixin)
