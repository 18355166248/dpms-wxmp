<template>
  <actionSheet
    class="select-popup"
    @close="close"
    @sure="confirm"
    sure-text="确定"
    v-if="show"
  >
    <view class="content">
      <view class="select-popup-header">
        <view @click="clear" class="confirm">清空</view>
        <view v-if="title" class="title">选择{{ title }}</view>
        <view
          @click="close"
          class="iconfont icon-ar-close"
          style="font-size: 48rpx;"
        ></view>
      </view>
      <view class="select-popup-content">
        <scroll-view scroll-y="true" class="select-popup-scroll">
          <dpmsCheckboxGroup
            v-model="checkedList"
            ref="checkboxGroupRef"
            v-if="list && list.length"
          >
            <div class="appt-collapse">
              <div
                v-for="(item, index) in list"
                :key="index"
                class="select-item"
              >
                {{ item.label || item[defaultProps.label] }}
                <dpmsCheckbox
                  shape="square"
                  :label="item.value || item[defaultProps.value]"
                  :value="item.checked || item[defaultProps.checked]"
                ></dpmsCheckbox>
              </div>
            </div>
          </dpmsCheckboxGroup>
          <empty :disabled="true" text="暂无数据" v-if="list.length === 0" />
        </scroll-view>
      </view>
    </view>
  </actionSheet>
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

    //清除
    clear() {
      this.$refs.checkboxGroupRef.clearAll()
    },
  },
}
</script>

<style lang="scss" scoped>
.select-popup {
  .content {
    height: 100%;
    overflow: hidden;
  }

  .select-popup-header {
    padding: 32rpx 32rpx;
    display: flex;
    border-bottom: 1px solid #e5e5e5;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    border-radius: 24rpx 24rpx 0 0;
    background: #ffffff;
    .title {
      color: #191919;
      font-size: 34rpx;
    }

    .close {
      color: #595959;
    }

    .confirm {
      color: #5cbb89;
      font-size: 30rpx;
    }
  }

  .select-popup-content {
    .select-popup-scroll {
      max-height: 425rpx;
      overflow: auto;
      display: flex;
      align-items: center;
    }
    .appt-collapse {
      background: #ffffff;
      .select-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 36rpx 32rpx;
        border-bottom: 1px solid #e5e5e5;
      }
    }
  }
}
</style>
