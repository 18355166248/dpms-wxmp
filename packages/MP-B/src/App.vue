<script>
export default {
  onLaunch: function () {},
  onShow: function () {},
  onHide: function () {},
}
</script>

<style>
@import url('mpcommon/css/common.css');

/*每个页面公共css */
page {
  height: 100%;
  background-color: rgba(0, 0, 0, 0.04);
}

button::after {
  border: none;
}
/*********在线字体代码start*********/
@font-face {
  font-family: 'iconfont';  /* project id 1965288 */
  src: url('//at.alicdn.com/t/font_1965288_ur2qolnpvep.eot');
  src: url('//at.alicdn.com/t/font_1965288_ur2qolnpvep.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_1965288_ur2qolnpvep.woff2') format('woff2'),
  url('//at.alicdn.com/t/font_1965288_ur2qolnpvep.woff') format('woff'),
  url('//at.alicdn.com/t/font_1965288_ur2qolnpvep.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_1965288_ur2qolnpvep.svg#iconfont') format('svg');
}
/*********在线字体代码end*********/

.iconfont {
  font-family: 'iconfont' !important;
  font-size: 32rpx;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
/* iconfont图标 start */
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
.icon-delete::before {
  content: '\e7c3';
}
.icon-bank::before {
  content: '\e7c6';
}
.icon-my-entity::before {
  content: '\e643';
}
.icon-new-weet::before {
  content: '\e8f0';
}
.icon-phone:before {
  content: '\e698';
}
.icon-sms:before {
  content: '\e60a';
}
/* iconfont图标 end */
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
  .mh-#{$i} {
    margin-left: $i + rpx;
    margin-right: $i + rpx;
  }
  .mv-#{$i} {
    margin-top: $i + rpx;
    margin-bottom: $i + rpx;
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
  .pv-#{$i} {
    padding-top: $i + rpx;
    padding-bottom: $i + rpx;
  }
  .ph-#{$i} {
    padding-left: $i + rpx;
    padding-right: $i + rpx;
  }

  .fz-#{$i} {
    font-size: $i + rpx;
  }

  .c-white {
    color: #fff;
  }
  .c-black {
    color: #000;
  }
}
</style>
