<template>
  <view class="checkbox" @click="handleClick">
    <view class="checkbox-icon" v-if="mode == 'select'">
      <text
        v-if="checked"
        :class="{ disable_color: disabled }"
        class="iconfont icon-checked-circle"
      ></text>
      <template v-else>
        <text v-if="disabled" class="icon_disable"></text>
        <text v-else class="iconfont icon-check-circle-no"></text>
      </template>
    </view>
    <slot />
  </view>
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      checked: this.value,
    }
  },
  watch: {
    value(val) {
      this.checked = val
    },
  },
  methods: {
    handleClick() {
      if (this.disabled) return
      this.checked = !this.checked
      // 兼容处理model event 只能识别input事件
      this.$emit('input', this.checked)
      this.$emit('on-change', this.checked)
    },
  },
}
</script>
<style lang="scss" scoped>
.icon-check-circle-no {
  color: #d9d9d9;
  font-size: 40rpx;
}
.icon-checked-circle {
  color: $common-color;
  font-size: 40rpx;
}
.disable_color {
  color: #f5f5f5;
}
.icon_disable {
  box-sizing: border-box;
  display: inline-block;
  padding: 1rpx;
  width: 38rpx;
  height: 38rpx;
  background: #f5f5f5;
  border: 1rpx solid #d9d9d9;
  border-radius: 50%;
}
.checkbox {
  position: relative;
}
.checkbox-icon {
  box-sizing: border-box;
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  text-align: center;
  line-height: 40rpx;
  top: 50%;
  right: 34rpx;
  transform: translateY(-50%);
  z-index: 1;
}
</style>
