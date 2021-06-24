<template>
  <div class="ach_projectList">
    <dpmsCheckboxGroup v-model="checked" v-if="list && list.length">
      <div class="apptCollapse">
        <div
          v-for="item in list"
          :key="item.settingsChargeTypeId"
          style="margin-top: 24rpx;"
        >
          <dpmsCheckbox shape="square" :label="item.settingsChargeTypeId">{{
            item.settingsChargeTypeName
          }}</dpmsCheckbox>
          <div class="line"></div>
        </div>
      </div>
    </dpmsCheckboxGroup>
    <empty :disabled="true" text="暂无项目" v-if="list.length === 0" />
    <fixed-footer bgColor="#F5F5F5">
      <div class="mt-56">
        <dpmsButton @click="onSave" v-if="list && list.length" />
      </div>
    </fixed-footer>
  </div>
</template>

<script>
import empty from '@/components/empty/empty.vue'

export default {
  components: {
    empty,
  },
  data() {
    return {
      list: [],
      checked: [],
    }
  },
  onLoad({ checked }) {
    this.list = uni.getStorageSync('allProjectList')
    if (checked) {
      this.checked = checked.split(',').map((v) => Number(v))
    }
  },
  methods: {
    onSave() {
      uni.$emit(
        'achProjectList',
        this.checked.map((ele) => Number(ele)),
        this.list,
      )
      this.$dpmsUtils.back()
    },
  },
}
</script>

<style lang="scss" scoped>
.ach_projectList {
  height: 100%;
  .apptCollapse {
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
  }
  .line {
    width: 100%;
    height: 2rpx;
    background: #e5e5e5;
    margin-top: 24rpx;
    margin-bottom: 24rpx;
  }
}
</style>
