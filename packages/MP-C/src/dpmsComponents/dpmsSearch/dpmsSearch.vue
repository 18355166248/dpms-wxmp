<template>
  <div :class="['dpmsSearch', showCancel ? 'search-show-action' : '']">
    <div class="search__content search__content--square">
      <div class="cell cell--borderless field">
        <div class="field__left-icon">
          <i class="iconfont icon-search"><!----></i>
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
            />
            <i class="iconfont icon-close" v-if="showClearBtn" @click="onClear"
              ><!----></i
            >
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
      this.$emit('cancel', { value: e.detail.value })
    },
    onChange(e) {
      this.inputValue = e.target.value
      this.$emit('change', { value: e.detail.value })
    },
    onSearch(e) {
      this.$emit('search', { value: e.detail.value })
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
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  box-sizing: border-box;
  padding: 20rpx 24rpx;
  background-color: #fff;
  .search__content {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    padding-left: 16rpx;
    background-color: #f7f8fa;
    border-radius: 4rpx;
  }
  .cell {
    position: relative;
    display: flex;
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
    color: #323233;
    font-size: 28rpx;
    line-height: 48rpx;
    flex: 1;
    padding: 10rpx 16rpx 10rpx 0;
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
  }

  .icon {
    position: relative;
    display: inline-block;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
  }
  .field__control {
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
  .field__control {
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
    display: -webkit-box;
    display: -webkit-flex;
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
  }
  .search__action {
    padding: 0 16rpx;
    color: #323233;
    font-size: 28rpx;
    line-height: 68rpx;
  }

  .icon-clear {
    color: #c8c9cc;
    font-size: 30rpx;
    padding: 0 10rpx;
  }
}
.search-show-action {
  padding-right: 0;
}
</style>
