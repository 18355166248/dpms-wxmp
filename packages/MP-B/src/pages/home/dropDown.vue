<template>
  <view class="dropdown">
    <view v-show="show" class="dropdown-mask" @click="handlerMask"></view>
    <view @click="toggleDropdown" id="J_DropdownMenuBtn"><slot></slot></view>
    <view
      v-show="show"
      class="dropdown-menu-wrapper"
      id="J_DropdownMenuWrapper"
    >
      <view class="arrow"></view>
      <view class="dropdown-menu">
        <view
          class="dropdown-menu-item"
          v-for="item in list"
          :key="item.value"
          @click="handlerItem(item.value)"
        >
          <view class="icon-wrapper">
            <text :class="['iconfont', item.icon ? item.icon : '']"></text>
          </view>
          <text>{{ item.name }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'dropdown',

  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      show: false,
    }
  },
  methods: {
    toggleDropdown() {
      this.show = !this.show
    },
    handlerItem(value) {
      this.show = false
      this.$emit('select', value)
    },
    handlerMask() {
      this.show = false
      this.$emit('close')
    },
  },
}
</script>

<style scoped lang="scss">
.dropdown {
  position: relative;
  z-index: 100;

  .arrow {
    position: absolute;
    left: 50%;
    bottom: -16rpx;
    width: 0;
    height: 0;
    transform: translateX(-50%);
    border: 16rpx solid transparent;
    border-bottom-color: #4c4c4c;
    border-top: 0;
  }

  .dropdown-menu {
    position: absolute;
    right: 12rpx;
    top: 85rpx;

    z-index: 101;
    list-style: none;
    background-color: #4c4c4c;
    border-radius: 8rpx;
    padding-left: 0;

    .dropdown-menu-item {
      display: flex;
      align-items: center;
      color: #fff;
      padding: 32rpx 60rpx;
      border-bottom: 2rpx solid #595959;
      font-size: 34rpx;
      white-space: nowrap;

      .icon-wrapper {
        width: 42rpx;
        height: 42rpx;
        margin-right: 20rpx;
        .iconfont {
          font-size: 42rpx;
        }
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }
  .dropdown-mask {
    top: 0;
    left: 0;
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 99;
    touch-action: none;
  }
}
</style>
