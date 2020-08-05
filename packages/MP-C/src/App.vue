<script>
import systemApi from '@/APIS/system.api'
import { getStorage, setStorage, STORAGE_KEY } from '@/utils/storage'
export default {
  onLaunch: async function () {
    console.log('App Launch')
    let token = getStorage(STORAGE_KEY.ACCESS_TOKEN)
    if (!token) {
      const res = await systemApi.getAccessToken()
      setStorage(STORAGE_KEY.ACCESS_TOKEN, res.data)
      token = res.data
    }
    const res = await systemApi.getInstitution({ appId: 'wx00028b3b0c0f877e' })
    setStorage(STORAGE_KEY.MEDICALINSTITUTION, res.data)
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
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
  src: url('//at.alicdn.com/t/font_1965288_sd0oonvt9m.eot');
  src: url('//at.alicdn.com/t/font_1965288_sd0oonvt9m.eot?#iefix')
      format('embedded-opentype'),
    url('//at.alicdn.com/t/font_1965288_sd0oonvt9m.woff2') format('woff2'),
    url('//at.alicdn.com/t/font_1965288_sd0oonvt9m.woff') format('woff'),
    url('//at.alicdn.com/t/font_1965288_sd0oonvt9m.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_1965288_sd0oonvt9m.svg#iconfont') format('svg');
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
</style>
