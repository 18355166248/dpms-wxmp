<template>
  <view class="common-functions-List">
    <view
      class="menu-item"
      v-for="(item, index) in menuList"
      :key="index"
      @click="viewPage(menuDic[item.type])"
    >
      <menuIcon
        :icon="menuDic[item.type].iconName"
        :menu-style="menuDic[item.type].menuStyle"
      >
      </menuIcon>
      <view class="menu-text">{{ item.displayName }}</view>
    </view>
    <view class="menu-item" @click="viewAll(menuDic.all.url)">
      <menuIcon
        :icon="menuDic.all.iconName"
        :fontSize="menuDic.all.fontSize"
        :menu-style="menuDic.all.menuStyle"
      >
      </menuIcon>
      <view class="menu-text">全部</view>
    </view>
  </view>
</template>
<script>
import menuIcon from '../menuIcon'
import { menuDic } from './menu'
// import systemAPI from '@/APIS/system.api.js'

// const commonParams = { modelId: 2, key: 'commonMenuFuns' }
export default {
  name: 'commonFunctionsList',
  components: { menuIcon },
  props: {
    menuList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      menuDic: menuDic,
    }
  },
  async created() {
    // const data = await this.getCommonFunsList()
    // const res = await this.getCommonFunsConfig()
    // const arr = data.menus.map(e => {
    //   return {
    //     ...e,
    //     type: e.enumValue.replaceAll('-', ''),
    //     status: res.indexOf(e.enumValue) > -1 || data.defaultMenus.indexOf(e.enumValue) > -1
    //   }
    // })
    // this.menuList = arr.filter(e => res.indexOf(e.enumValue) > -1 || data.defaultMenus.indexOf(e.enumValue) > -1).slice(0, 7)
  },
  methods: {
    // async getCommonFunsList() {
    //   const res = await systemAPI.getCommonFunsList()
    //   return res.data
    // },
    // // 获取常用功能配置
    // async getCommonFunsConfig() {
    //   const res = await systemAPI.getCommonFunsConfig(commonParams)
    //   return res.data || []
    // },
    //全部
    viewAll(url) {
      this.$dpmsUtils.push({
        url,
      })
    },
    viewPage(item) {
      if (item.url) {
        const url = item.url
        this.$dpmsUtils.push({
          url,
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.common-functions-List {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding-left: 32rpx;
  box-sizing: border-box;
  .menu-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 80rpx;
    margin-bottom: 32rpx;
    .menu-text {
      font-size: 28rpx;
      line-height: 28rpx;
      padding-top: 24rpx;
    }
  }
  .menu-item:nth-child(4n) {
    margin-right: 0;
  }
}
</style>
