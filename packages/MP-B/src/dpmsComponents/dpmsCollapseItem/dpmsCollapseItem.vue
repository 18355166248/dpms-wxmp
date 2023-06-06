<template>
  <view
    :class="{
      'dpms-collapse-cell--disabled': disabled,
      'dpms-collapse-cell--notdisabled': !disabled,
      'dpms-collapse-cell--open': isOpen,
      'dpms-collapse-cell--hide': !isOpen,
    }"
    class="dpms-collapse-cell"
  >
    <view class="dpms-collapse-cell__title" @click="onClick">
      <image v-if="thumb" :src="thumb" class="dpms-collapse-cell__title-img" />
      <text class="dpms-collapse-cell__title-text">{{ title }}</text>
      <!-- #ifdef MP-ALIPAY -->
      <view
        :class="{
          'dpms-collapse-cell__title-arrow-active': isOpen,
          'dpms-collapse-cell--animation': showAnimation === true,
        }"
        class="dpms-collapse-cell__title-arrow"
      >
        <dpmsIcons color="#bbb" type="icon-arrow-down" />
      </view>
      <!-- #endif -->
      <!-- #ifndef MP-ALIPAY -->
      <dpmsIcons
        :class="{
          'dpms-collapse-cell__title-arrow-active': isOpen,
          'dpms-collapse-cell--animation': showAnimation === true,
        }"
        class="dpms-collapse-cell__title-arrow"
        color="#bbb"
        type="icon-arrow-down"
      />
      <!-- #endif -->
    </view>
    <view
      :class="{ 'dpms-collapse-cell__content--hide': !isOpen }"
      class="dpms-collapse-cell__content"
    >
      <view
        :class="{ 'dpms-collapse-cell--animation': showAnimation === true }"
        class="dpms-collapse-cell__wrapper"
        :style="{
          transform: isOpen ? 'translateY(0)' : 'translateY(-50%)',
          '-webkit-transform': isOpen ? 'translateY(0)' : 'translateY(-50%)',
        }"
      >
        <slot />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'dpmsCollapseItem',
  props: {
    title: {
      type: String,
      default: '',
    },
    name: {
      // 唯一标识符
      type: [Number, String],
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showAnimation: {
      type: Boolean,
      default: false,
    },
    open: {
      // 是否展开
      type: Boolean,
      default: false,
    },
    thumb: {
      // 缩略图
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isOpen: false,
    }
  },
  watch: {
    open(val) {
      this.isOpen = val
    },
  },
  inject: ['collapse'],
  created() {
    this.isOpen = this.open
    this.nameSync = this.name ? this.name : this.collapse.childrens.length
    this.collapse.childrens.push(this)
    if (String(this.collapse.accordion) === 'true') {
      if (this.isOpen) {
        let lastEl = this.collapse.childrens[this.collapse.childrens.length - 2]
        if (lastEl) {
          this.collapse.childrens[
            this.collapse.childrens.length - 2
          ].isOpen = false
        }
      }
    }
  },
  methods: {
    onClick() {
      if (this.disabled) {
        return
      }
      if (String(this.collapse.accordion) === 'true') {
        this.collapse.childrens.forEach((vm) => {
          if (vm === this) {
            return
          }
          vm.isOpen = false
        })
      }
      this.isOpen = !this.isOpen
      this.collapse.onChange && this.collapse.onChange()
      this.$forceUpdate()
    },
  },
}
</script>

<style lang="scss" scoped>
.dpms-collapse-cell {
  flex-direction: column;
}

.dpms-collapse-cell--hover {
  // background-color: $dpms-bg-color-hover;
}

.dpms-collapse-cell--open {
  // background-color: $dpms-bg-color-hover;
}

.dpms-collapse-cell--disabled {
  background-color: $dpms-bg-color-disabled;
  // opacity: 0.3;
}

.dpms-collapse-cell--hide {
  height: 82rpx;
  border-bottom: 1rpx solid rgba($color: #000000, $alpha: 0.15);
}

.dpms-collapse-cell--animation {
  // transition: transform 0.3s ease;
  transition-property: transform;
  transition-duration: 0.3s;
  transition-timing-function: ease;
}

.dpms-collapse-cell__title {
  padding: 12px 12px;
  position: relative;
  /* #ifndef APP-NVUE */
  display: flex;
  width: 100%;
  box-sizing: border-box;
  /* #endif */
  height: 82rpx;
  line-height: 82rpx;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.04);
  color: rgba(0, 0, 0, 0.5);
}

.dpms-collapse-cell__title:active {
  // background-color: $dpms-bg-color-hover;
}

.dpms-collapse-cell__title-img {
  height: $dpms-img-size-base;
  width: $dpms-img-size-base;
  margin-right: 20rpx;
}

.dpms-collapse-cell__title-arrow {
  text-align: center;
  width: 40rpx;
  height: 40rpx;
  line-height: 40rpx;
  transform: rotate(0deg);
  transform-origin: center center;
}

.dpms-collapse-cell__title-arrow-active {
  transform: rotate(180deg);
}

.dpms-collapse-cell__title-text {
  flex: 1;
  font-size: $dpms-font-size-base;
  /* #ifndef APP-NVUE */
  white-space: nowrap;
  color: inherit;
  /* #endif */
  /* #ifdef APP-NVUE */
  lines: 1;
  /* #endif */
  overflow: hidden;
  text-overflow: ellipsis;
}

.dpms-collapse-cell__content {
  overflow: hidden;
}

.dpms-collapse-cell__wrapper {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
}

.dpms-collapse-cell__content--hide {
  height: 0px;
  line-height: 0px;
}
</style>
