import Vue from 'vue'
import { mapState } from 'vuex';

const golbalMixin = {
  computed: {
    ...mapState('workbenchStore', ['menu']),
  },
  methods: {
    btnPremisstion(preString) {
      const { buttonList } = this.menu
      return buttonList.map(item => item.enumValue).includes(preString)
    }
  }
}

Vue.mixin(golbalMixin);
