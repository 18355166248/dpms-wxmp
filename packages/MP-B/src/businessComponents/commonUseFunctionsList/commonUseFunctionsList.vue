<template>
  <view class="common-functions-List">
    <view class="menu-item" v-for="(item,index) in filterMenuList" :key="index">
      <menuIcon
        :icon="menuDic[item.type].iconName"
        :menu-style="menuDic[item.type].menuStyle"
      >
      </menuIcon>
      <view class="menu-text">{{menuDic[item.type].text}}</view>
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
import { menuDic } from  './menu'
export default {
  name: "commonFunctionsList",
  data() {
    return {
      menuDic:menuDic,
      menuList:[
        {
          type:'visiting'
        },
        {
          type:'appoint'
        },
        {
          type:'patient'
        },
        {
          type:'preview'
        },
        {
          type:'purchase'
        },
        {
          type:'receive'
        },
        {
          type:'inventory'
        },
        {
          type:'archive'
        },
      ]
    };
  },
  computed: {
    filterMenuList(){
      return this.menuList.filter((item,index)=>index<7)
    }
  },
  methods: {
    //全部
    viewAll(url){
      console.log(url);
      this.$utils.push({
        url,
      })
    },
  },
  watch: {
    watchData: {
      handler(newVal, oldVal) {
      },
      deep: true,
      immediate: true
    }
  },
  components: {menuIcon},
};
</script>
<style lang="scss" scoped>
.common-functions-List {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 0 32rpx;
  .menu-item{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right:80rpx ;
    margin-bottom:32rpx ;
    .menu-text{
      font-size: 28rpx;
      line-height: 28rpx;
      padding-top: 24rpx;
    }
  }
  .menu-item:nth-child(4n){
    margin-right:0
  }
}
</style>
