<template>
  <view class="common-use-functions" :key="menuKey">
    <view class="common-functions-list-wrap">
      <view class="drag-tip">长按拖动可调整位置与顺序</view>
      <movable-area class="common-functions-list movable-area">
        <movable-view
          v-for="item in selectedList"
          :key="item.id"
          class="movable-view"
          :x="item.x"
          :y="item.y"
          direction="all"
          inertia="true"
          damping="80"
          @change="viewMoveChange($event, item)"
          @touchend="touchend"
        >
          <view class="menu-item">
            <menuIcon
              :icon="menuDic[item.type].iconName"
              :menu-style="menuDic[item.type].menuStyle"
              :showCloseIcon="true"
              @close="onMenuDelete(item)"
            >
            </menuIcon>
            <view class="menu-text">{{ menuDic[item.type].text }}</view>
          </view>
        </movable-view>
      </movable-area>
    </view>
    <!--等待添加列表-->
    <view class="wait-list-wrap" v-if="waitList.length > 0">
      <view class="wait-list-tip">
        <view class="tip">以上功能展示在首页</view>
      </view>
      <view class="wait-list">
        <view class="menu-item" v-for="item in waitList" :key="item.id">
          <menuIcon
            :icon="menuDic[item.type].iconName"
            :menu-style="menuDic[item.type].menuStyle"
            :showCloseIcon="true"
            @close="onWaitMenuDelete(item)"
          >
          </menuIcon>
          <view class="menu-text">{{ menuDic[item.type].text }}</view>
        </view>
      </view>
    </view>
    <!--待添加列表-->
    <view class="to-add-list-wrap">
      <view class="to-add-list">
        <view class="to-add-item" v-for="item in toAddList" :key="item.id">
          <view class="menu-info-wrap">
            <menuIcon
              :icon="menuDic[item.type].iconName"
              :menu-style="menuDic[item.type].menuStyle"
            ></menuIcon>
            <view class="infos">
              <view class="menu-name">物品一览</view>
              <view class="menu-des"
                >患者全视图，患者全视图患者全视图患者全视图。患者全</view
              >
            </view>
          </view>
          <view>
            <view class="btn added" v-if="item.added">已添加</view>
            <view class="btn tobe-add" v-else>添加</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import menuIcon from 'businessComponents/menuIcon'
import { menuDic } from 'businessComponents/commonUseFunctionsList/menu'
export default {
  name: 'commonFunctionsList',
  data() {
    return {
      menuDic: menuDic,
      menuList: [
        {
          type: 'visiting',
          id: 'visiting',
        },
        {
          type: 'appoint',
          id: 'appoint',
        },
        {
          type: 'patient',
          id: 'patient',
        },
        {
          type: 'preview',
          id: 'preview',
        },
        {
          type: 'purchase',
          id: 'purchase',
        },
        {
          type: 'receive',
          id: 'receive',
        },
        {
          type: 'inventory',
          id: 'inventory',
        },
        {
          type: 'archive',
          id: 'archive',
        },
      ],
      selectedList: [],
      targetMoveInfo: undefined,
      targetMenu: null,
      menuKey: 1,
      waitList: [
        {
          type: 'archive',
          id: 'archive',
        },
        {
          type: 'visiting',
          id: 'visiting',
        },
        {
          type: 'appoint',
          id: 'appoint',
        },
        {
          type: 'patient',
          id: 'patient',
        },
        {
          type: 'preview',
          id: 'preview',
        },
        {
          type: 'purchase',
          id: 'purchase',
        },
      ],
      toAddList: [
        {
          type: 'visiting',
          id: 'visiting',
          added: true,
        },
      ],
    }
  },
  computed: {},
  created() {
    let list = this.menuList.filter((item, index) => index < 7)
    this.selectedList = this.initMenuPosition(list)
  },
  mounted() {},
  methods: {
    //可拖动列表menu删除
    onMenuDelete(item) {
      this.selectedList = this.selectedList.filter(
        (menu) => menu.id !== item.id,
      )
      this.initMenuPosition(this.selectedList)
    },
    //等待添加到常用功能的列表里的menu被删除
    onWaitMenuDelete(item) {
      this.waitList = this.waitList.filter((menu) => menu.id !== item.id)
    },
    initMenuPosition(list) {
      list.forEach((item, index) => {
        let x = 32 + (index % 4) * 192
        let y = Math.floor(index / 4) * 220
        item.x = uni.upx2px(x)
        item.y = uni.upx2px(y)
        item.area = [
          [item.x, uni.upx2px(x + 112)],
          [item.y, uni.upx2px(y + 188)],
        ]
        item.index = index
      })
      return list
    },
    viewMoveChange(event, item) {
      this.targetMenu = item
      this.targetMoveInfo = event.detail
    },
    touchend() {
      if (this.targetMoveInfo === undefined) {
        return
      }
      let x = this.targetMoveInfo?.x + uni.upx2px(112) * 0.5
      let y = this.targetMoveInfo?.y + uni.upx2px(188) * 0.5
      let targetIndex = this.targetMenu.index
      let changeIndex = -1
      this.selectedList.forEach((item, index) => {
        if (
          x >= item.area[0][0] &&
          x <= item.area[0][1] &&
          y >= item.area[1][0] &&
          y <= item.area[1][1]
        ) {
          changeIndex = index
        }
      })
      if (changeIndex >= 0) {
        this.selectedList.splice(
          changeIndex,
          1,
          ...this.selectedList.splice(
            targetIndex,
            1,
            this.selectedList[changeIndex],
          ),
        )
      } else {
        this.selectedList[targetIndex].x = this.targetMoveInfo.x
        this.selectedList[targetIndex].y = this.targetMoveInfo.y
      }
      //menuKey 这个通过key和this.$forceUpdate 来强制刷新组件
      this.menuKey += 2
      this.$nextTick(() => {
        this.initMenuPosition(this.selectedList)
        this.$forceUpdate()
      })
    },
  },
  watch: {
    watchData: {
      handler(newVal, oldVal) {},
      deep: true,
      immediate: true,
    },
  },
  components: { menuIcon },
}
</script>
<style lang="scss" scoped>
.common-use-functions {
  width: 100%;
  height: 100%;
  .common-functions-list-wrap {
    background: #fff;
    .drag-tip {
      padding: 32rpx;
      color: #7f7f7f;
      font-size: 28rpx;
      line-height: 1;
    }
    .common-functions-list {
      width: 100%;
      height: 408rpx;
      display: flex;
      flex-wrap: wrap;
      padding-left: 32rpx;
      box-sizing: border-box;
      .movable-view {
        width: 112rpx;
        height: auto;
      }
      .menu-item {
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
    color: #7f7f7f;
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
