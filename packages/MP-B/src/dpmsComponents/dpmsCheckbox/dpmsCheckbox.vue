<template>
  <view class="dpms-checkbox" @click="onCheckboxChange">
    <slot v-if="$slots.icon" name="icon"></slot>
    <template v-else>
      <dpmsIcons v-if="icon" :type="icon" :size="iconSize" :color="iconColor" />
      <view
        v-else
        class="dpms-checkbox__inner"
        :class="['dpms-checkbox__inner--' + shape]"
        :style="{
          width: iconSize + 'rpx',
          height: iconSize + 'rpx',
          backgroundColor: innerBackgroundColor,
          borderColor: innerBorderColor,
        }"
      >
        <dpmsIcons
          v-if="currentValue"
          type="icon-check"
          :size="iconSize - 6"
          :color="isDisabled ? 'rgb(190, 190, 190)' : '#fff'"
        />
      </view>
    </template>
    <text
      v-if="$slots.default"
      class="dpms-checkbox__label"
      :style="mTitleStlye"
    >
      <slot></slot>
    </text>
  </view>
</template>

<script>
export default {
  name: 'dpmsCheckbox',
  props: {
    shape: {
      type: String,
      default: 'round',
    },
    value: {
      type: Boolean,
      default: false,
    },
    label: {
      type: [String, Number],
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: null,
    },
    iconSize: {
      type: Number,
      default: 32,
    },
    primaryColor: {
      type: String,
      default: '#5cbb89',
    },
    titleStyle: {
      type: Object,
      default: () => {
        return {}
      },
    },
    preventClick: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isGroup() {
      let parent = this.getParent()
      if (parent) {
        return true
      }
      return false
    },
    isDisabled() {
      if (this.isGroup) {
        return this.getParent().disabled || this.disabled
      }
      return this.disabled
    },
    isOverLimit() {
      if (this.isGroup) {
        let parent = this.getParent()
        if (parent.max) {
          let parentValue = parent.currentValue || []
          if (parentValue.length >= parent.max) {
            return true
          }
        }
      }
      return false
    },
    mTitleStlye() {
      let titleStyle = Object.assign({}, this.titleStyle || {})
      let arr = Object.keys(titleStyle)
        .map((key) => {
          if (key === 'color' && this.disabled) {
            return null
          }
          return `${key}:${titleStyle[key]}`
        })
        .filter((v) => v)
      return arr.join(';')
    },
    innerBackgroundColor() {
      if (this.isDisabled) {
        return '#ebedf0'
      }
      if (this.currentValue) {
        return this.primaryColor
      }
      return '#fff'
    },
    innerBorderColor() {
      if (this.isDisabled) {
        return this.$commonCss.borderColor
      }
      if (this.currentValue) {
        return this.primaryColor
      }
      return this.$commonCss.borderColor
    },
    iconColor() {
      if (this.isDisabled) {
        return '#ebedf0'
      }
      if (this.currentValue) {
        return this.primaryColor
      }
      return this.$commonCss.borderColor
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        this.currentValue = value
      },
    },
  },
  data() {
    return {
      currentValue: null,
    }
  },
  methods: {
    // 获取dpmsCheckboxGroup组件
    getParent() {
      let parent = this.$parent
      if (parent) {
        let parentName = parent.$options.name
        while (parentName !== 'dpmsCheckboxGroup') {
          parent = parent.$parent
          if (parent) {
            parentName = parent.$options.name
          } else {
            return null
          }
        }
        return parent
      }
      return null
    },
    // 点击触发
    onCheckboxChange() {
      if (
        !this.isDisabled &&
        !this.preventClick &&
        (!this.isOverLimit || this.currentValue)
      ) {
        this.toggleValue()
      }
    },
    // 主动调用方法触发
    toggle() {
      if (!this.isDisabled && (!this.isOverLimit || this.currentValue)) {
        this.toggleValue()
      }
    },
    // 切换状态
    toggleValue() {
      this.currentValue = !this.currentValue
      this.$emit('input', this.currentValue)
      this.$emit('change', this.currentValue)
      let parent = this.getParent()
      if (parent) {
        parent.onCheckboxChange(this.label)
      }
    },
    // 根据dpmsCheckboxGroup组件的值设置当前checkbox的值
    setValue(groupValue) {
      groupValue = groupValue || []
      this.currentValue = groupValue.includes(this.label)
    },
    // dpmsCheckboxGroup组件直接设置当前checkbox的值
    directSetValue(value) {
      let parent = this.getParent()
      if (parent) {
        if (value !== this.currentValue) {
          parent.onCheckboxChange(this.label, false)
        }
      }
    },
    // dpmsCheckboxGroup组件直接反向设置当前checkbox的值
    reverseValue() {
      let parent = this.getParent()
      if (parent) {
        parent.onCheckboxChange(this.label, false)
      }
    },
  },
  created() {
    let parent = this.getParent()
    if (parent) {
      this.setValue(parent.value)
    }
  },
}
</script>

<style lang="scss">
.dpms-checkbox {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  align-items: center;
}

.dpms-checkbox__label {
  font-size: 32rpx;
  margin-left: 16rpx;
  color: #333;

  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 734rpx;
  white-space: nowrap;
}

.dpms-checkbox__inner {
  border-width: 2rpx;
  border-style: solid;
  background-color: #fff;
  /* #ifndef APP-NVUE */
  display: flex;
  box-sizing: border-box;
  /* #endif */
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.dpms-checkbox__inner--round {
  border-radius: 50%;
}
</style>
