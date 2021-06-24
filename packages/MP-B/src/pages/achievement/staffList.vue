<template>
  <div class="ach_staffList">
    <dpmsCheckboxGroup v-model="checked" v-if="list && list.length">
      <div class="apptCollapse">
        <div
          v-for="item in list"
          :key="item.staffId"
          style="margin-top: 24rpx;"
        >
          <dpmsCheckbox
            shape="square"
            :label="item.staffId"
            :disabled="achFilterDisabled"
            >{{ item.staffName }}
          </dpmsCheckbox>
          <div class="line"></div>
        </div>
      </div>
    </dpmsCheckboxGroup>
    <empty :disabled="true" text="暂无数据" v-if="list.length === 0" />
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
      achFilterDisabled: false,
    }
  },
  onLoad({ checked, name }) {
    switch (name) {
      case 'nurse':
        this.list = uni.getStorageSync('allNurseList')
        break
      case 'doctor':
        this.list = uni.getStorageSync('allDoctorList')
        break
      case 'assistant':
        this.list = uni.getStorageSync('allAssistantList')
        break
      case 'consultant':
        this.list = uni.getStorageSync('allConsultantList')
        break
      default:
        break
    }
    if (checked) {
      this.checked = checked.split(',').map((v) => Number(v))
    }
    this.achFilterDisabled = uni.getStorageSync('achFilterDisabled') || false
  },
  methods: {
    onSave() {
      uni.$emit(
        'achStaffList',
        this.checked.map((ele) => Number(ele)),
        this.list,
      )
      this.$dpmsUtils.back()
    },
  },
}
</script>

<style lang="scss" scoped>
.ach_staffList {
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
