<template>
  <view class="inputNum">
    <view class="inputNum-min">
      <text class="iconfont icon-minus-circle" @click="handleMinus"></text>
    </view>
    <view class="inputNum-input">
      <input
        v-model="inputNumber"
        @change="_input"
        type="number"
        @focus="_focus"
        @blur="_blur"
      />
    </view>
    <view class="inputNum-max">
      <text class="iconfont icon-plus-fill" @click="handleAdd"></text>
    </view>
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
      default: null,
    },
    step: {
      type: Number,
      default: 1,
    },
    value: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      inputNumber: this.value || this.min,
    }
  },
  watch: {
    value(val) {
      this.inputNumber = +val || this.min
    },
  },
  methods: {
    _input(event) {
      if (Number(event.target.value) > this.max) {
        this.inputNumber = this.max
      } else {
        this.inputNumber = Number(event.target.value) || this.min
      }
      this.$emit('input', this.inputNumber)
      this.$emit('on-change', this.inputNumber)
    },
    _focus() {},
    _blur() {},
    handleAdd() {
      if (this.max && this.inputNumber == this.max) return
      this.inputNumber = this.inputNumber += this.step
      this.$emit('input', this.inputNumber)
      this.$emit('on-change', this.inputNumber)
    },
    handleMinus() {
      if (this.inputNumber == this.min) return
      this.inputNumber = this.inputNumber -= this.step
      this.$emit('input', this.inputNumber)
      this.$emit('on-change', this.inputNumber)
    },
  },
}
</script>
<style lang="scss" scoped>
.inputNum {
  box-sizing: border-box;
  width: 208rpx;
  display: flex;
  align-items: center;
  > view {
    box-sizing: inherit;
  }
  &-min,
  &-max {
    font-size: 35rpx;
  }
  &-min {
    color: rgba(0, 0, 0, 0.45);
  }
  &-input {
    flex: 1;
    height: 48rpx;
    margin: 0 11rpx;
    background: #f5f5f5;
    border-radius: 8rpx;
    line-height: 48rpx;
    padding: 4rpx;
    input {
      width: 100%;
      color: #191919;
      font-size: 28rpx;
      text-align: center;
    }
  }
  &-max {
    color: $common-color;
  }
}
</style>
