<template>
  <view class="common-use-functions" :key="menuKey">
    <view class="common-functions-list-wrap">
      <!-- <view class="drag-tip">长按拖动可调整位置与顺序</view> -->
      <view class="common-functions-list" @click="showCloseIcon = false">
        <template v-for="(item, index) in selectedList">
          <view class="menu-item" :key="index" v-if="index < 7">
            <menuIcon
              :icon="menuDic[item.type].iconName"
              :menu-style="menuDic[item.type].menuStyle"
              :showCloseIcon="showCloseIcon"
              @close="onMenuDelete(item)"
              @longpress="handleLongPress"
            >
            </menuIcon>
            <view class="menu-text">{{ item.displayName }}</view>
          </view>
        </template>
      </view>
    </view>
    <!--等待添加列表-->
    <view class="wait-list-wrap" v-if="selectedList.length > 7">
      <view class="wait-list-tip">
        <view class="tip">以上功能展示在首页</view>
      </view>
      <view class="wait-list" @click="showCloseIcon = false">
        <template v-for="(item, index) in selectedList">
          <view class="menu-item" :key="index" v-if="index > 6">
            <menuIcon
              :icon="menuDic[item.type].iconName"
              :menu-style="menuDic[item.type].menuStyle"
              :showCloseIcon="showCloseIcon"
              @close="onMenuDelete(item)"
              @longpress="handleLongPress"
            >
            </menuIcon>
            <view class="menu-text">{{ item.displayName }}</view>
          </view>
        </template>
      </view>
    </view>
    <!--待添加列表-->
    <view class="to-add-list-wrap">
      <view class="to-add-list">
        <view
          class="to-add-item"
          v-for="(item, index) in toAddList"
          :key="index"
        >
          <view class="menu-info-wrap">
            <menuIcon
              :icon="menuDic[item.type].iconName"
              :menu-style="menuDic[item.type].menuStyle"
            ></menuIcon>
            <view class="infos">
              <view class="menu-name">{{ item.displayName }}</view>
              <view class="menu-des">{{ item.description }}</view>
            </view>
          </view>
          <view>
            <view class="btn added" v-if="item.status">已添加</view>
            <view
              class="btn tobe-add"
              v-else
              @click="handleAddClick(item, index)"
              >添加</view
            >
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import menuIcon from 'businessComponents/menuIcon'
import { menuDic } from 'businessComponents/commonUseFunctionsList/menu.js'
import systemAPI from '@/APIS/system.api.js'

const commonParams = { modelId: 2, key: 'commonMenuFuns' }

export default {
  name: 'commonFunctionsList',
  components: { menuIcon },
  data() {
    return {
      menuDic: menuDic,
      selectedList: [], // 已添加数据
      targetMoveInfo: undefined,
      targetMenu: null,
      menuKey: 1,
      showCloseIcon: false,
      toAddList: [
        {
          description: '门诊挂号',
          displayName: '今日就诊',
          enumvalue: 'visiting',
        },
        {
          description: '患者全视图',
          displayName: '患者',
          enumvalue: 'patient-list',
        },
        {
          description: '浏览预约记录、快速预约',
          displayName: '预约',
          enumvalue: 'appointment',
        },
        {
          description: '进销存物品基础信息一览',
          displayName: '物品一览',
          enumvalue: 'item-management',
        },
        {
          description: '查看采购订单详情',
          displayName: '采购',
          enumvalue: 'purchase-management',
        },
        {
          description: '查看领用申请单详情',
          displayName: '领用',
          enumvalue: 'use-application',
        },
        {
          description: '实时查看物品库存详情',
          displayName: '库存',
          enumvalue: 'warehouse-management',
        },
        {
          description: '实时处理审批单、查看审批进度',
          displayName: '审批',
          enumvalue: 'approval-management',
        },
      ], // 所有常用功能数据
    }
  },
  async created() {
    const data = await this.getCommonFunsList()
    const res = await this.getCommonFunsConfig()
    this.toAddList = data.menus.map((e) => {
      return {
        ...e,
        type: e.enumValue.replaceAll('-', ''),
        status:
          res.indexOf(e.enumValue) > -1 ||
          data.defaultMenus.indexOf(e.enumValue) > -1,
      }
    })
    this.selectedList = this.toAddList.filter((e) => e.status)
  },
  mounted() {},
  methods: {
    async getCommonFunsList() {
      const res = await systemAPI.getCommonFunsList()
      return res.data
    },
    // 获取常用功能配置
    async getCommonFunsConfig() {
      const res = await systemAPI.getCommonFunsConfig(commonParams)
      return res.data || []
    },
    // 更新常用功能配置
    async updateSelectMenus(data) {
      const res = await systemAPI.updateSelectMenus(data)
      console.log(res)
    },
    //可拖动列表menu删除
    async onMenuDelete(item) {
      let _index = this.selectedList.findIndex((e) => item.type == e.type)
      let index = this.toAddList.findIndex((e) => item.type == e.type)
      this.selectedList.splice(_index, 1)
      this.$set(this.toAddList[index], 'status', false)
      let arr = this.selectedList.map((e) => e.enumValue)
      let data = { ...commonParams, value: arr }
      this.updateSelectMenus(data)
    },
    /*
     * 点击下面的添加按钮操作
     * */
    handleAddClick(item, index) {
      this.$set(this.toAddList[index], 'status', true)
      let _index = this.selectedList.findIndex((e) => item.type == e.type)
      if (_index < 0) {
        this.selectedList.push(item)
        let arr = this.selectedList.map((e) => e.enumValue)
        let data = { ...commonParams, value: arr }
        this.updateSelectMenus(data)
      }
    },
    // 处理长按图标
    handleLongPress() {
      this.showCloseIcon = true
    },
  },
}
</script>
<style lang="scss" scoped>
.common-use-functions {
  width: 100%;
  height: 100%;
  .common-functions-list-wrap {
    padding-top: 32rpx;
    background: #fff;
    .drag-tip {
      padding: 32rpx;
      color: #7f7f7f;
      font-size: 28rpx;
      line-height: 1;
    }
    .common-functions-list {
      width: 100%;
      max-height: 408rpx;
      display: flex;
      flex-wrap: wrap;
      padding-left: 32rpx;
      box-sizing: border-box;
      color: #000000;
      .menu-item {
        width: 112rpx;
        margin-right: 80rpx;
        margin-bottom: 32rpx;
        height: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
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
  }
  .wait-list-wrap {
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
    color: #000000;
    padding: 32rpx 0 0 32rpx;
    .tip {
      position: relative;
      &::after {
        position: absolute;
        content: '';
        left: -96rpx;
        top: 50%;
        transform: translate(0, -50%);
        width: 80rpx;
        height: 2rpx;
        background: #e5e5e5;
      }
      &::before {
        position: absolute;
        content: '';
        right: -96rpx;
        top: 50%;
        transform: translate(0, -50%);
        width: 80rpx;
        height: 2rpx;
        background: #e5e5e5;
      }
    }
    .wait-list {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      padding-top: 32rpx;
      .menu-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 80rpx;
        margin-bottom: 32rpx;
      }
      .menu-text {
        font-size: 28rpx;
        line-height: 28rpx;
        padding-top: 24rpx;
      }
      .menu-item:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
}
.to-add-list-wrap {
  background: #fff;
  margin-top: 16rpx;
  padding: 32rpx 32rpx 48rpx;
  .to-add-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 50rpx;
    .menu-info-wrap {
      display: flex;
      align-items: center;
      .infos {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 26rpx;

        .menu-name {
          font-weight: 500;
          color: #191919;
          font-size: 34rpx;
          line-height: 34rpx;
          padding-bottom: 8rpx;
        }
        .menu-des {
          color: #4c4c4c;
          font-size: 28rpx;
          max-width: 360rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-height: 1.2;
        }
      }
    }
    .btn {
      width: 148rpx;
      height: 56rpx;
      border-radius: 30rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      line-height: 28rpx;
    }
    .added {
      background: #ffffff;
      border: 2rpx solid #5cbb89;
      color: #5cbb89;
    }
    .tobe-add {
      background: #5cbb89;
      border-radius: 28rpx;
      color: #ffffff;
    }
  }
}
</style>
