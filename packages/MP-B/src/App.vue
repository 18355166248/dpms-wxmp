<script>
import store from '@/store'
import { getSystemInfo } from 'mpcommon/utils/os'

export default {
  onLaunch: function () {
    const isPhoneXCeil = getSystemInfo()
    store.commit('systemStore/setIsPhoneXCeil', isPhoneXCeil)
    console.log('isPhoneXCeil', isPhoneXCeil)
  },
  onShow: function () {},
  onHide: function () {},
  globalData: {},
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
  font-family: 'iconfont'; /* Project id 1965288 */
  src: url('//at.alicdn.com/t/font_1965288_7tc0z3jswgy.woff2?t=1631004687279')
      format('woff2'),
    url('//at.alicdn.com/t/font_1965288_7tc0z3jswgy.woff?t=1631004687279')
      format('woff'),
    url('//at.alicdn.com/t/font_1965288_7tc0z3jswgy.ttf?t=1631004687279')
      format('truetype');
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
.icon-arrow-left::before {
  content: '\e7ec';
}
.icon-plus::before {
  content: '\e8fe';
}
.icon-minus-circle::before {
  content: '\e780';
}
.icon-minus-fill::before {
  content: '\e847';
}
.icon-plus-fill::before {
  content: '\e84a';
}
.icon-codesandbox::before {
  content: '\e87e';
}
.icon-inverted-triangle::before {
  content: '\e8ec';
}
.icon-home-close::before {
  content: '\e66f';
}
/* 随访 */
.iconclose:before {
  content: '\e633';
}
.icon-follow-up:before {
  content: '\e604';
}
.icon-phone:before {
  content: '\e690';
}
.iconphone:before {
  content: '\e690';
}
.icon-shengri:before {
  content: '\e68f';
}
.icon-nv:before {
  content: '\e68c';
}
.icon-nan:before {
  content: '\e68d';
}
.icon-calendar-check:before {
  content: '\e7d5';
}
.icon-up::before {
  content: '\e68a';
}
.icon-down::before {
  content: '\e684';
}
.icon-video::before {
  content: '\e69e';
}
.icon-excel::before {
  content: '\e69a';
}

/*今日就诊*/
.icon-warning::before {
  content: '\e605';
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
.icon-chart::before {
  content: '\e62b';
}
.icon-statis::before {
  content: '\e62a';
}
.icon-shenpi::before {
  content: '\e65f';
}
.icon-manage_fill::before {
  content: '\e70b';
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
/*患者*/
.icon-user::before {
  content: '\e627';
}
.icon-check-circle::before {
  content: '\e77d';
}
.icon-check-circle-no::before {
  content: '\e645';
}
.icon-checked-circle:before {
  content: '\e846';
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
.icon-warning-circle-fill:before {
  content: '\e849';
}
/*预约*/
.icon-time-circle::before {
  content: '\e784';
}
.icon-vip::before {
  content: '\e624';
}
.icon-yingxiang::before {
  content: '\e628';
}
.icon-dingdan-mian::before {
  content: '\e629';
}
.icon-plus-circle::before {
  content: '\e781';
}
.icon-phone:before {
  content: '\e698';
}
.icon-sms:before {
  content: '\e60a';
}
.icon-renmingbi:before {
  content: '\e64b';
}
.icon-arrea:before {
  content: '\e64d';
}
.icon-lishibingli1:before {
  content: '\e64c';
}
.icon-moban1:before {
  content: '\e653';
}
.icon-open:before {
  content: '\e64e';
}
.icon-closed:before {
  content: '\e654';
}
.icon-sync:before {
  content: '\e655';
}
.icon-edit:before {
  content: '\e7e1';
}
.icon-filter:before {
  content: '\e611';
}
.icon-savings:before {
  content: '\e657';
}
.icon-customer-management:before {
  content: '\e636';
}
.icon-detail:before {
  content: '\e793';
}
/*消费预览*/
.iconconsumption-profile:before {
  content: '\e60d';
}
/*诊疗项目*/
.icondiagnosis-treatment:before {
  content: '\e60c';
}
/*储值卡余额*/
.iconconsumption-profile:before {
  content: '\e60d';
}
/*卡券积分*/
.icon-card-integral:before {
  content: '\e646';
}
.iconsearch:before {
  content: '\e8ef';
}
.iconup1:before {
  content: '\e68a';
}
.icondown1:before {
  content: '\e684';
}
.icon-ar-report:before {
  content: '\e610';
}
.icon-ar-close:before {
  content: '\e633';
}
.icon-warning-circle:before {
  content: '\e785';
}
.icon-disposal-fill:before {
  content: '\e858';
}
.icon-stored-value-card:before {
  content: '\e613';
}
.icon-search:before {
  content: '\e631';
}
.icon-whole:before {
  content: '\e661';
}
.icon-bill-fill::before {
  content: '\e67d';
}
.icon-check-square-fill:before {
  content: '\e84b';
}
.icon-card-voucher-face:before {
  content: '\e646';
}
.icon-wechat-fill:before {
  content: '\e68b';
}

/*全部*/
.icon-all-fill:before {
  content: '\e70b';
}
/*物品一览*/
.icon-goods-preview-fill:before {
  content: '\e885';
}
/*采购*/
.icon-purchase-fill:before {
  content: '\e887';
}
/*领用*/
.icon-receive-fill:before {
  content: '\e88a';
}
/*库存*/
.icon-inventory-fill:before {
  content: '\e88d';
}
/*患者归档*/
.icon-patient-archive-fill:before {
  content: '\e65d';
}
.icon-danxuan-xuanzhong:before {
  content: '\e663';
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
