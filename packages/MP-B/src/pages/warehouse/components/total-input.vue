<template>
  <view class="total-input">
    <view v-if="isFocus" class="total-input-main">
      <input
        :focus="isFocus"
        v-model="inputNumber"
        type="digit"
        @blur="_blur"
        placeholder="请输入"
        @input="_input"
      />
    </view>
    <view v-else class="total-input-text" @click="isFocus = true">
      <text>{{ inputNumber | inventoryToThousand }}</text>
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
    value: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      isFocus: false,
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
      this.inputNumber = Number(event.target.value) || this.min
      this.$emit('input', this.inputNumber)
      this.$emit('on-change', this.inputNumber)
    },
    _blur() {
      this.isFocus = false
    },
  },
}
</script>
<style lang="scss" scoped>
.total-input {
  width: 100%;
  height: 100%;
  &-main {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    input {
      text-align: right;
      font-size: 28rpx;
    }
  }
  &-text {
    min-width: 180rpx;
    height: 48rpx;
    background-color: #f5f5f5;
    border-radius: 8rpx;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 28rpx;
  }
}
</style>
