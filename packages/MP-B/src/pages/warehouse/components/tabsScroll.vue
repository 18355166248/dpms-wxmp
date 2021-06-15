<template>
  <view class="tabs">
    <view v-for="(item, index) in data" :key="index">{{ item.name }}</view>
  </view>
</template>
<script>
export default {
  props: {
    value: {
      type: String || Number,
      default: null,
    },
    // 列表数据源
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
    // 激活颜色
    activeColor: {
      type: String,
      default: 'red',
    },
    fieldKey: {
      type: String,
      default: 'key',
    },
    fieldName: {
      type: String,
      default: 'name',
    },
  },
  data() {
    return {}
  },
  created() {},
  methods: {},
}
</script>
