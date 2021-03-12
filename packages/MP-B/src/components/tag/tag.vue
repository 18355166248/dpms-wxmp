<template>
  <view
    v-if="text"
    :class="[
      'tag',
      'tag--' + type,
      disabled === true || disabled === 'true' ? 'tag--disabled' : '',
      inverted === true || inverted === 'true' ? type + '-tag--inverted' : '',
      circle === true || circle === 'true' ? 'tag--circle' : '',
      mark === true || mark === 'true' ? 'tag--mark' : '',
      'tag--' + size,
    ]"
    @click="onClick()"
  >
    <text
      :class="[
        type === 'default' ? 'tag--default' : 'tag-text--' + type,
        inverted === true || inverted === 'true' ? 'tag-text--' + type : '',
        size === 'small' ? 'tag-text--small' : '',
      ]"
      >{{ text }}</text
    >
  </view>
</template>

<script>
/**
 * Tag 标签
 * @description 用于展示1个或多个文字标签，可点击切换选中、不选中的状态
 * @property {String} text 标签内容
 * @property {String} size = [normal|small] 大小尺寸
 * 	@value normal 正常
 * 	@value small 小尺寸
 * @property {String} type = [default|primary|success｜warning｜error｜royal]  颜色类型
 * 	@value default 灰色
 * 	@value primary 蓝色
 * 	@value success 绿色
 * 	@value warning 黄色
 * 	@value error 红色
 * 	@value royal 紫色
 * @property {Boolean} disabled = [true|false] 是否为禁用状态
 * @property {Boolean} inverted = [true|false] 是否无需背景颜色（空心标签）
 * @property {Boolean} circle = [true|false] 是否为圆角
 * @event {Function} click 点击 Tag 触发事件
 */

export default {
  name: 'tag',
  props: {
    color: {
      type: String,
    },
    type: {
      // 标签类型default、primary、success、warning、error、royal
      type: String,
      default: 'default',
    },
    size: {
      // 标签大小 normal, small
      type: String,
      default: 'normal',
    },
    // 标签内容
    text: {
      type: String,
      default: '',
    },
    disabled: {
      // 是否为禁用状态
      type: [Boolean, String],
      default: false,
    },
    inverted: {
      // 是否为空心
      type: [Boolean, String],
      default: false,
    },
    circle: {
      // 是否为圆角样式
      type: [Boolean, String],
      default: false,
    },
    mark: {
      // 是否为标记样式
      type: [Boolean, String],
      default: false,
    },
  },
  computed: {},
  methods: {
    onClick() {
      console.log(this)
      if (this.disabled === true || this.disabled === 'true') {
        return
      }
      this.$emit('click')
    },
  },
}
</script>

<style lang="scss" scoped>
$uni-color-primary: #1890ff;
$uni-color-error: #fa541c;
$tag-pd: 0px 16rpx;
$tag-small-pd: 0px 16rpx;
$amount: 0.1;

.tag {
  /* #ifndef APP-NVUE */
  display: inline-flex;
  /* #endif */
  padding: $tag-pd;
  font-size: 28rpx;
  height: 44rpx;
  line-height: 44rpx;
  justify-content: center;
  color: $uni-text-color;
  border-radius: $uni-border-radius-base;
  background-color: $uni-bg-color-grey;
  border-width: 1rpx;
  border-style: solid;
  border-color: $uni-bg-color-grey;
  margin-right: 8rpx;
}

.tag--circle {
  border-radius: 22rpx;
}

.tag--mark {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 22rpx;
  border-bottom-right-radius: 22rpx;
}

.tag--disabled {
  opacity: 0.5;
}

.tag--small {
  padding: $tag-small-pd;
  font-size: $uni-font-size-sm;
}

.tag--default {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.tag-text--small {
  font-size: $uni-font-size-sm !important;
}

.tag-text {
  color: $uni-text-color-inverse;
  font-size: $uni-font-size-base;
}

.tag-text--primary {
  color: $uni-color-primary !important;
}

.tag-text--success {
  color: $uni-color-success !important;
}

.tag-text--warning {
  color: $uni-color-warning !important;
}

.tag-text--error {
  color: $uni-color-error !important;
}

.tag--primary {
  color: $uni-color-primary;
  background-color: rgba($uni-color-primary, $amount);
}

.primary-tag--inverted {
  color: $uni-color-primary;
  background-color: rgba($uni-color-primary, $amount);
  border-width: 1rpx;
  border-style: solid;
  border-color: $uni-color-primary;
}

.tag--success {
  color: $uni-color-success;
  background-color: rgba($uni-color-success, $amount);
}

.success-tag--inverted {
  color: $uni-color-success;
  background-color: rgba($uni-color-success, $amount);
  border-width: 1rpx;
  border-style: solid;
  border-color: $uni-color-success;
}

.tag--warning {
  color: $uni-color-warning;
  background-color: rgba($uni-color-warning, $amount);
}

.warning-tag--inverted {
  color: $uni-color-warning;
  background-color: rgba($uni-color-warning, $amount);
  border-width: 1rpx;
  border-style: solid;
  border-color: $uni-color-warning;
}

.tag--error {
  color: $uni-color-error;
  background-color: rgba($uni-color-error, $amount);
}

.error-tag--inverted {
  color: $uni-color-error;
  background-color: rgba($uni-color-error, $amount);
  border-width: 1rpx;
  border-style: solid;
  border-color: $uni-color-error;
}

.tag--inverted {
  color: $uni-text-color;
  background-color: $uni-bg-color;
  border-width: 1rpx;
  border-style: solid;
  border-color: $uni-bg-color-grey;
}
</style>
