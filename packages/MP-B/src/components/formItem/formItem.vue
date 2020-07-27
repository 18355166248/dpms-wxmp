<template>
  <div class="dpms-cell-group">
    <div class="dpms-cell" data-layout-align="space-between center">
      <div class="dpms-cell-title">
        <span>{{ title }}</span>
        <span v-if="isRequired" data-text-red-color>*</span>
      </div>
      <div class="dpms-cell-value" data-layout-align="space-between center">
        <div class="van-field__body">
          <input
            v-if="inputType === 'text'"
            type="text"
            :placeholder="placeholder"
            placeholder-style="font-size: 34rpx;font-weight: 400;color: rgba(0, 0, 0, 0.25);"
            @input="bindChangeModel"
          />
          <picker
            v-if="inputType === 'picker' && mode === 'selector'"
            :range="pickerArray"
            :value="pickerIndex"
            @change="bindChangeModel"
          >
            <view class="picker">
              {{ pickerArray[pickerIndex] }}
            </view>
          </picker>
          <picker
            v-if="inputType === 'picker' && mode === 'date'"
            :mode="mode"
            :end="endDate"
            @change="bindChangeModel"
          >
            <view class="picker">
              {{ pickerIndex }}
            </view>
          </picker>
        </div>
        <text v-if="isArrowRight" class="iconfont icon-arrow-right" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: [
    'title',
    'isArrowRight',
    'isRequired',
    'inputType',
    'placeholder',
    'pickerArray',
    'value',
    'mode',
    'endDate',
  ],
  data() {
    return {
      pickerIndex: 0,
    }
  },
  methods: {
    bindChangeModel(e) {
      this.pickerIndex = e.detail.value
      this.$emit('input', e.detail.value)
    },
  },
}
</script>

<style lang="scss" scoped>
[data-layout-align] {
  display: flex;
  justify-content: flex-start;
  align-content: stretch;
  align-items: stretch;
}

[data-layout-align='space-between center'] {
  justify-content: space-between;
  align-items: center;
  align-content: center;
  max-width: 100%;
}

[data-text-red-color] {
  color: #eb4d4b !important;
}

.dpms-cell-group {
  width: 750rpx;
  height: 112rpx;
  .dpms-cell {
    height: 112rpx;
    margin: 0 32rpx;
    border-bottom: 2rpx solid rgba(0, 0, 0, 0.15);
    .dpms-cell-title {
      width: 211rpx;
      span {
        font-size: 34rpx;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.9);
        margin-left: 4rpx;
      }
    }

    .dpms-cell-value {
      font-size: 34rpx;
      font-weight: 400;
      text-align: right;
      color: rgba(0, 0, 0, 0.5);
      .iconfont {
        margin-left: 4rpx;
        color: rgba(0, 0, 0, 0.25);
      }
    }
  }
}
</style>
