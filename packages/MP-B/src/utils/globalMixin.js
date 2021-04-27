import Vue from 'vue'
import { mapState } from 'vuex'

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
      const { menuList } = this.menu
      let findObj
      const checkPermission = (menuList) => {
        const menukey = keyArr.shift()
        findObj = menuList.find((v) => {
          return v.enumValue === menukey
        })
        if (findObj && keyArr.length > 0) {
          checkPermission(findObj.children)
        }
        return findObj
      }
      return !!checkPermission(menuList)
    },
  },
}

Vue.mixin(golbalMixin)
