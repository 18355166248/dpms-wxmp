<template>
  <div
    :class="[
      'dpms-cell',
      hideBorderBottom ? 'hideBorder' : '',
      wrap ? 'wrap' : '',
      disabled ? 'disabled' : '',
    ]"
    @click="cellClick"
  >
    <div :class="['dpms-cell__title', required ? 'required' : '']">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="dpms-cell__value text-ellipsis" :class="{ wrap: wrap }">
      <text
        class="dpms-cell-placeholder"
        :style="placeholderStyle || ''"
        v-if="placeholder && (!value && value !== 0)"
        >{{ placeholder }}</text
      >

      <text v-if="value || value === 0">{{ value }}</text>
      <slot v-else />
    </div>

    <text v-if="isLink" class="iconfont icon-arrow-right" />
    <slot v-else name="right-icon" />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: String,
    },
    required: {
      type: Boolean,
      required: false,
    },
    isLink: {
      type: Boolean,
      required: false,
    },
    placeholder: String,
    placeholderStyle: String,
    disabled: {
      type: Boolean,
      required: false,
    },
    hideBorderBottom: {
      type: Boolean,
      required: false,
    },
    wrap: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    cellClick() {
      if (this.disabled) return
      this.$emit('cellclick')
    },
  },
}
</script>

<style lang="scss" scoped>
.dpms-cell {
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 35rpx 32rpx;
  overflow: hidden;
  color: #323233;
  font-size: 34rpx;
  background-color: #fff;
  &.wrap {
    flex-wrap: wrap;
  }
  &.disabled {
    .dpms-cell__title,
    .dpms-cell__value .dpms-cell-placeholder {
      color: rgba(0, 0, 0, 0.5);
    }
  }
  .dpms-cell__title {
    position: relative;
    padding-right: 48rpx;
    &.required:after {
      position: absolute;
      content: '*';
      color: #eb4d4b;
      right: 24rpx;
      top: 5rpx;
    }
  }

  .dpms-cell__value {
    flex: 1;
    text-align: right;
    color: rgba(0, 0, 0, 0.5);
    padding-right: 10rpx;
    overflow: hidden;
    &.wrap {
      flex: none;
      width: 100%;
      text-align: left;
    }
    .dpms-cell-placeholder {
      color: rgba(0, 0, 0, 0.25);
    }
  }

  .icon-arrow-right {
    color: rgba(0, 0, 0, 0.25);
  }

  &:after {
    position: absolute;
    box-sizing: border-box;
    transform-origin: center;
    content: ' ';
    pointer-events: none;
    top: auto;
    right: 0;
    bottom: 0;
    left: 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    transform: scaleY(0.5);
  }
  &.hideBorder:after {
    display: none;
  }
}
</style>
