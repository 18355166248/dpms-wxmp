<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
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
@import url('mpcommon/css/common.css');

/*每个页面公共css */
page {
  height: 100%;
}

/*********在线字体代码start*********/
@font-face {
  font-family: 'iconfont'; /* project id 1965288 */
  src: url('//at.alicdn.com/t/font_1965288_wj5zo7d0u1f.eot');
  src: url('//at.alicdn.com/t/font_1965288_wj5zo7d0u1f.eot?#iefix')
      format('embedded-opentype'),
    url('//at.alicdn.com/t/font_1965288_wj5zo7d0u1f.woff2') format('woff2'),
    url('//at.alicdn.com/t/font_1965288_wj5zo7d0u1f.woff') format('woff'),
    url('//at.alicdn.com/t/font_1965288_wj5zo7d0u1f.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_1965288_wj5zo7d0u1f.svg#iconfont') format('svg');
}
/*********在线字体代码end*********/

.iconfont {
  font-family: 'iconfont' !important;
  font-size: 32rpx;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
  content: '\e608';
}
.icon-search::before {
  content: '\e636';
}
.icon-clear::before {
  content: '\e600';
}
.icon-arrow-right::before {
  content: '\e7eb';
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
.tc {
  text-align: center;
}

.hidden {
  display: none;
}

.w100 {
  width: 100%;
}
.h100 {
  height: 100%;
}
</style>

<style lang="scss">
@for $i from 1 through 100 {
  .m-#{$i} {
    margin: $i + rpx;
  }
  .mt-#{$i} {
    margin-top: $i + rpx;
  }
  .mb-#{$i} {
    margin-bottom: $i + rpx;
  }
  .ml-#{$i} {
    margin-left: $i + rpx;
  }
  .mr-#{$i} {
    margin-right: $i + rpx;
  }

  .p-#{$i} {
    padding: $i + rpx;
  }
  .pt-#{$i} {
    padding-top: $i + rpx;
  }
  .pb-#{$i} {
    padding-bottom: $i + rpx;
  }
  .pl-#{$i} {
    padding-left: $i + rpx;
  }
  .pr-#{$i} {
    padding-right: $i + rpx;
  }

  .fz-#{$i} {
    font-size: $i + rpx;
  }
}
</style>
