<template>
  <div :class="['dpmsSearch', showCancel ? 'search-show-action' : '']">
    <div
      class="search__content search__content--square"
      :style="{ backgroundColor: leftBgColor }"
    >
      <div class="cell cell--borderless field">
        <div
          class="field__left-icon"
          :class="placeholderClass"
          :style="placeholderStyle"
        >
          <i class="iconfont icon-search"></i>
        </div>
        <div class="cell__value cell__value--alone field__value">
          <div class="field__body">
            <input
              :type="type"
              :confirm-type="confirmType"
              :placeholder="placeholder"
              class="field__control"
              :value="inputValue"
              @input="onChange"
              @confirm="onSearch"
              @blur="onToggleClear(false)"
              @focus="onToggleClear(true)"
              :placeholder-style="placeholderStyle"
              :placeholder-class="placeholderClass"
            />
            <i
              class="iconfont icon-close"
              v-if="showClearBtn"
              @click="onClear"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <div class="search__action" v-if="showCancel" @click="onCancel">
      {{ cancelText }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: 'text',
    },
    confirmType: {
      type: String,
      default: 'done',
    },
    placeholder: {
      type: String,
      default: '请输入搜索关键词',
    },
    showCancel: {
      type: Boolean,
      default: false,
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    leftBgColor: {
      type: String,
      default: '#fff',
    },
    placeholderStyle: {
      type: Object,
      default: {},
    },
    placeholderClass: {
      type: String,
      default: 'placeholderClass',
    },
  },
  computed: {
    showClearBtn() {
      // return this.isBlur && this.inputValue
      return this.inputValue
    },
  },
  data() {
    return {
      inputValue: this.value,
      isBlur: false,
    }
  },
  watch: {
    value(newVal) {
      this.inputValue = newVal
    },
  },
  methods: {
    onToggleClear(bool) {
      if (bool) {
        this.$emit('focus')
      } else {
        this.$emit('blur')
      }

      this.isBlur = bool
    },
    onCancel(e) {
      let value = this.$dpmsUtils.omitEmojiValueInString(e.detail.value)
      this.$emit('cancel', { value: value })
    },
    onChange(e) {
      let value = this.$dpmsUtils.omitEmojiValueInString(e.detail.value)

      // this.inputValue = e.target.value
      this.$emit('change', { value: value })
      this.$emit('input', value)

      return value
    },
    onSearch(e) {
      let value = this.$dpmsUtils.omitEmojiValueInString(e.detail.value)

      this.$emit('search', { value: value })
    },
    onClear() {
      this.$emit('clear', { value: '' })
      this.inputValue = ''
    },
  },
}
</script>

<style lang="scss">
.dpmsSearch {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  .search__content {
    display: flex;
    flex: 1;
    padding: 16rpx 28rpx;
    border-radius: 8rpx;
    font-weight: 300;
  }
  .cell {
    position: relative;
    display: flex;
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
    flex: 1;
    line-height: 36rpx;
    // padding: 10rpx 16rpx 10rpx 0;
    background-color: transparent;
    align-items: center;
  }
  .cell__value {
    position: relative;
    overflow: hidden;
    color: #969799;
    text-align: right;
    vertical-align: middle;
    word-wrap: break-word;
  }
  .cell__title,
  .cell__value {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
  }
  .field__left-icon {
    margin-right: 10rpx;
    // font-weight: 700;
    .icon-search {
      font-size: 36rpx;
      color: #bfbfbf;
      // padding-bottom: 4rpx;
    }
  }

  .icon {
    position: relative;
    display: inline-block;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
  }
  .field__control {
    font-size: 30rpx;
    display: block;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0;
    color: #323233;
    line-height: inherit;
    text-align: left;
    background-color: transparent;
    border: 0;
    resize: none;
  }
  .field__body {
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    .iconfont {
      opacity: 0.65;
    }
  }
  .field__value {
    overflow: visible;
    font-size: 28rpx;
  }
  .search__action {
    padding: 0 24rpx;
    color: $common-color;
    font-size: 30rpx;
    line-height: 68rpx;
  }

  .icon-clear {
    color: #c8c9cc;
    font-size: 30rpx;
    padding: 0 10rpx;
  }
  .placeholderClass {
    color: #bfbfbf;
    font-size: 28rpx;
  }
}
.search-show-action {
  padding-right: 0;
}
</style>
