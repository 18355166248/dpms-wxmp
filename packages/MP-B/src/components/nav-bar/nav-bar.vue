<template>
  <view class="nav-bar" :style="{ height: navHeight + 'px' }">
    <view
      class="navbar-action-wrap"
      @click="onClickLeft"
      :style="{ top: navTop, height: capsuleHeight, lineHeight: capsuleHeight }"
    >
      <view class="navbar-action-wrap-left"
        ><text class="iconfont icon-menu fz-38 mr-20"></text>
        <text class="fz-34 mr-10 name">{{ navLeftText }} </text>
        <spin v-if="navLeftLoading" :iconSize="18" color="#fff"></spin>
      </view>
    </view>
  </view>
</template>

<script>
import spin from '@/components/spin/spin.vue'

export default {
  name: 'NavBar',
  props: {
    navLeftLoading: {
      type: Boolean,
      default: false,
    },
    navLeftText: {
      type: String,
      default: '',
    },
    backgroundColor: {
      type: String,
      default: '#FFFFFF',
    },
    navHeight: {
      type: String,
      default: '',
    },
    navTop: {
      type: String,
      default: '',
    },
    capsuleHeight: {
      type: String,
      default: '',
    },
  },

  components: {
    spin,
  },

  methods: {
    onClickLeft() {
      this.$emit('click')
    },
  },
}
</script>
<style lang="scss" scoped>
.nav-bar {
  width: 100%;
  position: relative;
  top: 0;
  left: 0;
  z-index: 10;
  flex-shrink: 0;
  overflow: hidden;
  color: #fff;
}
/* components/navbar/index.wxss */

.navbar-title {
  width: 100%;
  box-sizing: border-box;
  padding-left: 115px;
  padding-right: 115px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  position: absolute;
  left: 0;

  color: #333;
  font-size: 16px;
  font-weight: bold;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.navbar-action-wrap {
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  position: absolute;
  left: 16px;
  z-index: 11;

  &-left {
    display: flex;
    align-items: center;
    .name {
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 380rpx;
      white-space: nowrap;
    }
  }
}

.navbar-action-group {
  border: 1px solid #f0f0f0;
  border-radius: 20px;
  overflow: hidden;
}

.navbar-action_item {
  padding: 3px 0;
  color: #333;
}

.navbar-action-group .navbar-action_item {
  border-right: 1px solid #f0f0f0;
  padding: 3px 14px;
}

.navbar-action-group .last {
  border-right: none;
}
</style>
