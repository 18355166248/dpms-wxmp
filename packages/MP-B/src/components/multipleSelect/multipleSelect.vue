<template>
  <u-popup
    :safe-area-inset-bottom="true"
    class="select-popup"
    mode="bottom"
    v-model="show"
    @close="close"
  >
    <view class="select-popup-header border-after">
      <view @click="close" class="close">取消</view>
      <view v-if="title" class="title">{{ title }}</view>
      <view @click="confirm" class="confirm">确定</view>
    </view>
    <view class="select-popup-content">
      <scroll-view scroll-y="true" class="select-popup-scroll">
        <dpmsCheckboxGroup v-model="checkedList" v-if="list && list.length">
          <div class="appt-collapse">
            <div v-for="(item, index) in list" :key="index" class="select-item">
              <dpmsCheckbox
                shape="square"
                :label="item.value || item[defaultProps.value]"
              >
                {{ item.label || item[defaultProps.label] }}
              </dpmsCheckbox>
            </div>
          </div>
        </dpmsCheckboxGroup>
        <empty :disabled="true" text="暂无数据" v-if="list.length === 0" />
      </scroll-view>
    </view>
  </u-popup>
</template>

<script>
export default {
  name: 'multipleSelect',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    // 列表数据
    list: {
      type: Array,
      default: () => {
        return []
      },
    },
    // 已选数据
    value: {
      type: Array,
      default: () => {
        return []
      },
    },
    // 修改对应label和value
    defaultProps: {
      type: Object,
      default: () => {
        return {}
      },
    },
    // 标题
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      show: false,
      checkedList: [],
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.show = true
      }
    },
    value: {
      handler(newVal, oldVal) {
        if (newVal.length > 0) {
          this.checkedList = newVal
        }
      },
      immediate: true, // 值为true或false，默认false
      deep: false, // 值为true或false，默认false
    },
  },
  computed: {},
  created() {},
  onLoad() {},
  // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
  onReady() {},
  methods: {
    // 取消
    close() {
      this.show = false
      this.$emit('close')
    },

    // 确定
    confirm() {
      this.close()
      this.$emit('confirm', this.checkedList)
    },
  },
}
</script>

<style lang="scss" scoped>
.select-popup {
  .border-after::after {
    position: absolute;
    box-sizing: border-box;
    transform-origin: center;
    content: ' ';
    pointer-events: none;
    top: auto;
    right: 0;
    bottom: 0;
    left: 0;
    border-bottom: 1px solid #e5e5e5;
    transform: scaleY(0.5);
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: rgb(229, 229, 229);
  }

  .select-popup-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 9;
    background: #ffffff;
    padding: 24rpx;
    height: 80rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;

    .title {
      font-size: 34rpx;
    }

    .close {
      color: rgba(0, 0, 0, 0.45);
    }

    .confirm {
      color: #5cbb89;
    }
  }

  .select-popup-content {
    margin-top: 80rpx;

    .select-popup-scroll {
      max-height: 40vh;
      overflow: auto;
      display: flex;
      align-items: center;
    }
    .appt-collapse {
      padding-left: 32rpx;
      .appt {
        height: 112rpx;
        line-height: 112rpx;
        border-top: 1rpx solid rgba($color: #000000, $alpha: 0.15);
        color: rgba($color: #000000, $alpha: 0.9);
        font-size: 34rpx;
        &.first {
          border-top: none;
        }
      }
      .select-item {
        padding: 32rpx 0;
        border-bottom: 1px solid rgb(229, 229, 229);
      }
    }
  }
}
</style>
