<template>
  <view class="charge-wrap">
    <!--    <view>top</view>-->
    <!--    <view>bottom</view>-->
  </view>
  <!--  <view >-->
  <!--    <empty :disabled="true" text="暂无数据"></empty>-->
  <!--  </view>-->
</template>
<script>
export default {
  name: 'charge',
  data() {
    return {}
  },
  computed: {},
  onLoad() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  methods: {},
  watch: {
    watchData: {
      handler(newVal, oldVal) {},
      deep: true,
      immediate: true,
    },
  },
  components: {},
}
</script>
<style lang="scss" scoped>
.charge-wrap {
  padding: 12px;
  flex-grow: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
