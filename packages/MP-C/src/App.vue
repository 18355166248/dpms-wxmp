<script>
import systemApi from '@/APIS/system.api'
import { getStorage, setStorage, STORAGE_KEY } from '@/utils/storage'
import config from './config'
import { mapMutations } from 'vuex'

export default {
  onLaunch: async function () {
    console.log('App Launch')
    try {
      const enumsRes = await systemApi.getDataDict()
      this.SET_ENUMS(enumsRes)

      let token = getStorage(STORAGE_KEY.ACCESS_TOKEN)
      if (!token) {
        const res = await systemApi.getAccessToken()
        this.SET_ACCESS_TOKEN(res.data)
        token = res.data
      }

      const res = await systemApi.getInstitution({ appId: config.appId })
      this.SET_MEDICALINSTITUTION(res.data)
    } catch (error) {
      console.log('Init Error-----', error)
    }
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  methods: {
    ...mapMutations('loginStore', [
      'SET_ACCESS_TOKEN',
      'SET_ENUMS',
      'SET_MEDICALINSTITUTION',
    ]),
  },
}
</script>

<style>
/*每个页面公共css */
@import url('mpcommon/css/common.css');

/*每个页面公共css */
page {
  height: 100%;
}

/*********在线字体代码start*********/
@font-face {
  font-family: 'iconfont'; /* project id 1965288 */
  src: url('//at.alicdn.com/t/font_1965288_x98fv1kngr.eot');
  src: url('//at.alicdn.com/t/font_1965288_x98fv1kngr.eot?#iefix')
      format('embedded-opentype'),
    url('//at.alicdn.com/t/font_1965288_x98fv1kngr.woff2') format('woff2'),
    url('//at.alicdn.com/t/font_1965288_x98fv1kngr.woff') format('woff'),
    url('//at.alicdn.com/t/font_1965288_x98fv1kngr.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_1965288_x98fv1kngr.svg#iconfont') format('svg');
}
/*********在线字体代码end*********/

.iconfont {
  font-family: 'iconfont' !important;
  font-size: 32rpx;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-location::before {
  content: '\e790';
}
.icon-time::before {
  content: '\e784';
}
.icon-right::before {
  content: '\e7eb';
}
.icon-set::before {
  content: '\e78e';
}
.icon-add::before {
  content: '\e781';
}
.icon-timeCircle::before {
  content: '\e848';
}
.icon-rightCircle::before {
  content: '\e845';
}
.icon-down::before {
  content: '\e7ee';
}
.icon-search::before {
  content: '\e8ef';
}
.icon-arrow-up::before {
  content: '\e7ed';
}
.icon-arrow-down::before {
  content: '\e7ee';
}
.icon-arrow-up-30::before {
  content: '\e602';
}
.icon-arrow-down-30::before {
  content: '\e618';
}
.icon-menu::before {
  content: '\e7f4';
}
.icon-clear::before {
  content: '\e600';
}
.icon-arrow-right::before {
  content: '\e7eb';
}
.icon-plus::before {
  content: '\e8fe';
}
.icon-medicine-chest::before {
  content: '\e863';
}
.icon-eye::before {
  content: '\e869';
}
.icon-no-eye::before {
  content: '\e8ff';
}
.icon-clock::before {
  content: '\e848';
}
.icon-patient::before {
  content: '\e607';
}
.icon-search::before {
  content: '\e8ef';
}
.icon-institutions::before {
  content: '\e625';
}
.icon-password::before {
  content: '\e626';
}
.icon-user::before {
  content: '\e627';
}
.icon-check-circle::before {
  content: '\e77d';
}
.icon-check::before {
  content: '\e7fc';
}
.icon-retweet::before {
  content: '\e8f0';
}
.icon-right::before {
  content: '\e7eb';
}
.icon-close::before {
  content: '\e844';
}
.icon-sliders::before {
  content: '\e7d6';
}
</style>
