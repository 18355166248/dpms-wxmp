<template>
  <view class="amount">
    <input
      v-if="focused"
      :cursor-spacing="180"
      focus
      type="digit"
      @blur="focused = false"
      :value="currentValue"
      @input="change"
    />
    <view v-else @click="focused = true" class="amount-text">{{
      currentValue | inventoryToThousand
    }}</view>
  </view>
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 99999999,
    },
    errorText: {
      type: String,
      default: '金额不能超过99999999',
    },
    value: {
      type: Number,
    },
    precision: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      focused: false,
      currentValue: this.value,
    }
  },
  computed: {},
  watch: {
    value: {
      // immediate: true,
      handler: 'updateValue',
    },
  },
  methods: {
    updateValue(val) {
      this.currentValue = val
      if (this.focused) {
        this.$emit('input', this.currentValue)
        this.$emit('on-change', this.currentValue)
      }
    },
    change(event) {
      let reg = /^\d+\.?\d{0,4}$/
      let val = event.target.value.trim()
      if (!val) {
        this.updateValue(0)
        return ''
      }
      if (Number(val) > this.max) {
        uni.showToast({
          icon: 'none',
          title: this.errorText,
        })
        this.updateValue(this.max)
        return this.max
      }
      if (reg.test(val)) {
        this.updateValue(Number(val))
      } else {
        return this.currentValue
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.amount {
  width: 100%;
  height: 100%;
  padding-left: 32rpx;
  box-sizing: border-box;
  font-size: 30rpx;
  > view {
    box-sizing: inherit;
  }
  input {
    width: 100%;
    text-align: right;
  }
  &-text {
    width: 100%;
    min-width: 180rpx;
    height: 48rpx;
    padding: 0 12rpx;
    text-align: center;
    line-height: 48rpx;
    border-radius: 8rpx;
    background-color: #f5f5f5;
  }
}
</style>
