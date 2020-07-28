<template>
  <div class="staffList pt-56">
    <checkbox-group @change="checkboxChange">
      <label
        v-for="staff in staffList"
        :key="staff.staffId"
        class="checkedLabel"
      >
        <checkbox :value="staff.staffId" :checked="staff.checked" />
        <span class="staffName">{{ staff.staffName }}</span>
      </label>
    </checkbox-group>
    <div class="mt-56 tc">
      <button class="submit" @click="onSave">保存</button>
    </div>
  </div>
</template>

<script>
import authAPI from 'APIS/patient/patient.api'
const staffTitle = {
  5: { title: '选择助理', key: 'ASSISTANT_MANAGER' },
  6: { title: '选择护士', key: 'NURSE' },
}
export default {
  data() {
    return {
      staffList: [],
      checkedList: [], // 选中列表
      key: '', // 后台数据接收key值
    }
  },
  created() {},
  onLoad: function ({ option, checked }) {
    if (option && staffTitle[option]) {
      uni.setNavigationBarTitle({
        title: staffTitle[option].title,
      })
      this.key = staffTitle[option].key

      authAPI
        .getStaffMapThroughPosition({
          positions: option,
          workStatus: 1,
        })
        .then((res) => {
          let staffList = []
          if (Array.isArray(res.data[this.key])) {
            staffList = res.data[this.key]
          }

          if (checked) {
            let checkedList = []
            checked = checked.split(',')
            staffList.forEach((staff) => {
              if (checked.includes(String(staff.staffId))) {
                staff.checked = true

                checkedList.push(staff)
              }
            })
            this.checkedList = checkedList
          }

          this.staffList = staffList
        })
        .catch()
    }
  },
  methods: {
    checkboxChange(e) {
      this.checkedList = this.staffList.filter((staff) =>
        e.detail.value.includes(String(staff.staffId)),
      )
    },
    onSave() {
      uni.$emit('apptFormWithUpdateStaffList', {
        key: [this.key + '_LIST'],
        value: this.checkedList,
      })

      this.flyUtil.back()
    },
  },
}
</script>

<style lang="scss" scoped>
.staffList {
  .checkedLabel {
    display: flex;
    align-items: center;
    padding: 24rpx;
    .staffName {
      margin-left: 20rpx;
    }
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
