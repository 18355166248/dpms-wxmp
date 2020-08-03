<script>
import systemApi from '@/APIS/system.api'
import { getStorage, setStorage, STORAGE_KEY } from '@/utils/storage'
export default {
  onLaunch: function () {
    console.log('App Launch')
    const token = getStorage(STORAGE_KEY.ACCESS_TOKEN)
    if (!token) {
      setStorage(STORAGE_KEY.ACCESS_TOKEN, '123123')
      systemApi.getAccessToken()
    }
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
  src: url('//at.alicdn.com/t/font_1965288_g4ckenpgb3s.eot');
  src: url('//at.alicdn.com/t/font_1965288_g4ckenpgb3s.eot?#iefix')
      format('embedded-opentype'),
    url('//at.alicdn.com/t/font_1965288_g4ckenpgb3s.woff2') format('woff2'),
    url('//at.alicdn.com/t/font_1965288_g4ckenpgb3s.woff') format('woff'),
    url('//at.alicdn.com/t/font_1965288_g4ckenpgb3s.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_1965288_g4ckenpgb3s.svg#iconfont') format('svg');
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
</style>
