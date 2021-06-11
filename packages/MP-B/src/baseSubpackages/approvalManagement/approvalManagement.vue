<template>
  <view class="mainWrapper">
    <view class="topBar">
      <view>
        <span>我发起的</span>
      </view>
      <view>
        <span>我审核的</span>
      </view>
    </view>
    <view class="bodyDetails mh-48">
      <view class="typeSearch"
        >审批类型:
        <u-input v-model="value" :type="type" @click="show = true" border />
        <u-action-sheet
          :list="actionSheetList"
          v-model="show"
          @click="actionSheetCallback"
        ></u-action-sheet>
      </view>
      <div class="singleContainer"></div>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      value: '',
      type: 'select',
      actionSheetList: [
        {
          text: '全部',
        },
        {
          text: '收费',
        },
        {
          text: '借调',
        },
      ],
    }
  },
  methods: {
    // 点击actionSheet回调
    actionSheetCallback(index) {
      console.log(index)
      this.value = this.actionSheetList[index].text
    },
  },
}
</script>

<style lang="scss" scoped>
.mainWrapper {
  .topBar {
    height: 100rpx;
    display: flex;
    flex-direction: row;
    justify-content: center;
    > view {
      line-height: 100rpx;
      width: 100%;
      text-align: center;
    }
  }
  .bodyDetails {
    .singleContainer {
      border: 1px black;
      border-radius: 5px;
      width: 100%;
      height: 350rpx;
    }
  }
}
</style>
