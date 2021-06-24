<template>
  <div class="staffList pt-56">
    <dpmsCheckboxGroup v-model="checked">
      <div
        v-for="staff in staffList"
        :key="staff.staffId"
        class="checkedLabel"
        @click="onCheckStaff(staff.staffId)"
      >
        <dpmsCheckbox
          shape="square"
          :key="staff.staffId"
          :label="staff.staffId"
        >
          {{ staff.staffName }}
        </dpmsCheckbox>
      </div>
    </dpmsCheckboxGroup>
    <div class="mt-56 tc">
      <button class="submit" @click="onSave">保存</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      staffList: [],
      checked: [], // 选中值
      key: '', // 返回时透传的key
    }
  },
  created() {},
  onLoad: function ({ title, checked, key }) {
    if (title) {
      uni.setNavigationBarTitle({
        title: title,
      })
    }
    this.staffList = uni.getStorageSync('apptStaffSelectList')
    this.key = key
    this.checked = checked.split(',').map((v) => Number(v))
  },
  methods: {
    onSave() {
      uni.$emit('updateApptStaffCheckedList', {
        key: this.key,
        value: this.checked,
      })
      this.$dpmsUtils.back()
    },
    // 保证未指定医生和其他选项互斥
    onCheckStaff(staffId) {
      if (this.checked.length === 0) {
        this.checked = [-1]
        return
      }

      if (staffId === -1) {
        this.checked = [-1]
      } else {
        if (this.checked.includes(-1)) {
          this.checked.splice(0, 1)
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.staffList {
  .checkedLabel {
    // display: flex;
    align-items: center;
    padding: 24rpx;
  }
  .submit {
    width: 620rpx;
    border: none;
    background-color: $common-color;
    border-radius: 8rpx;
    font-size: 36rpx;
    color: #fff;
    letter-spacing: 10rpx;
  }
}
</style>
