<template>
  <view class="list-wrap">
    <scroll-view scroll-y="true" class="scroll-wrap">
      <view
        class="item"
        v-for="item in merchandiseList"
        :key="item.merchandiseId"
      >
        <view class="top-content">
          <view>
            <view class="infos">
              <span>物品名称：</span>
              <view>{{ item.commonName }}</view>
            </view>
            <view class="infos">
              <span>商品名称：</span>
              <view>{{ item.merchandiseName || '-' }}</view>
            </view>
            <view class="infos">
              <span>物品类型：</span>
              <view>{{ merchandiseTypeDic[item.merchandiseType] }}</view>
            </view>
            <view class="infos">
              <span>生产厂商：</span>
              <view>{{ item.manufacturer }}</view>
            </view>
          </view>
          <view class="checkBox">
            <dpmsCheckbox shape="square" :value="item.checked"  @change="onCheckBoxChange($event, item)"></dpmsCheckbox>
          </view>
        </view>
        <view class="bottom-content">
          <view class="flex">
            <view class="infos">
              <span>规格：</span>
              <view>{{ item.specificationsStr }}</view>
            </view>
            <view class="infos">
              <span>可用库存：</span>
              <view
                >{{ item.availableNum || 0 }}{{ item.inventoryUnitStr }}</view
              >
            </view>
          </view>
          <view :style="{ color: '#fa5151' }">{{
            item.retailAmount | thousandFormatter(2, '￥')
          }}</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<script>
export default {
  name: '',
  data() {
    return {
      merchandiseList: [],
      //
      merchandiseTypeDic: {
        1: '药品',
        2: '耗材',
        3: '设备',
        4: '其他',
      },
    }
  },
  props: {
    list: {
      type: Array,
      default: function () {
        return []
      },
    },
  },
  created() {},
  methods: {
    onCheckBoxChange(value,item){
      item.checked = value
    }
  },
  watch: {
    list: {
      handler(newVal) {
        this.merchandiseList = newVal
      },
      deep: true,
      immediate: true,
    },
  },
  components: {},
}
</script>
<style lang="scss" scoped>
.list-wrap {
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  height: 100%;
  overflow-y: scroll;
  .scroll-wrap {
    flex-shrink: 0;
    height: 100%;
  }
}
.item {
  display: flex;
  padding: 16rpx 32rpx;
  background: #fff;
  flex-direction: column;
  margin-bottom: 16rpx;
  .checkBox {
    margin-top: 4rpx;
  }
  .infos {
    font-size: 28rpx;
    line-height: 42rpx;
    display: flex;
    span {
      color: #191919;
      flex-shrink: 0;
    }
    view {
      color: #4c4c4c;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      padding-right: 20rpx;
    }
  }
  .top-content {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10rpx;
    border-bottom: 1rpx solid #e5e5e5;
  }
  .bottom-content {
    display: flex;
    justify-content: space-between;
    padding-top: 16rpx;
    align-items: center;
    font-size: 28rpx;
    line-height: 28rpx;
    .infos {
      padding-right: 12rpx;
    }
  }
}
</style>
