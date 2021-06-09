<template>
  <div class="apptDpmsList">
    <dpmsCheckboxGroup v-model="checked" v-if="list && list.length">
      <dpmsCollapse class="mb-56">
        <dpmsCollapseItem
          v-for="apptType in list"
          :key="apptType.appointmentSettingsAppointmentItemTypeName"
          :title="apptType.appointmentSettingsAppointmentItemTypeName"
          showAnimation
          open
        >
          <div class="apptCollapse">
            <div
              v-for="(appt, index) in apptType.list"
              :key="appt.appointmentSettingsAppointmentItemId"
              :class="['appt', index === 0 && 'first']"
            >
              <dpmsCheckbox
                shape="square"
                :key="appt.appointmentSettingsAppointmentItemId"
                :label="appt.appointmentSettingsAppointmentItemId"
                >{{ appt.appointmentSettingsAppointmentItemName }}</dpmsCheckbox
              >
            </div>
          </div>
        </dpmsCollapseItem>
      </dpmsCollapse>
    </dpmsCheckboxGroup>

    <view v-else>
      <empty :disabled="true" v-if="isAppt" text="暂无预约项目" />
      <empty :disabled="true" v-else text="暂无就诊项目" />
    </view>
    <div class="mt-56">
      <dpmsButton @click="onSave" v-if="list && list.length" />
      <!-- <button class="button" @click.stop="this.$utils.back()" v-else>
        取消
      </button> -->
    </div>
  </div>
</template>

<script>
import { colorNumberList } from './colorNumberList'
import empty from '@/components/empty/empty.vue'

export default {
  components: {
    empty,
  },
  data() {
    return {
      list: this.formatList(uni.getStorageSync('apptItemList')),
      checked: [],
      isAppt: false,
    }
  },
  onLoad({ checked, isAppt }) {
    this.isAppt = isAppt == 'true'
    if (checked) {
      this.checked = checked.split(',').map((v) => Number(v))
    }
  },
  created() {},
  methods: {
    onSave() {
      uni.$emit('updateApptItemCheckedList', this.checked)

      this.$utils.back()
    },
    // 格式化列表进行展示
    formatList(list) {
      if (!Array.isArray(list)) return

      const listClone = JSON.parse(JSON.stringify(list))

      // 预约项目没有 settingsAppointmentItemTypeId 的放进未分组
      const apptItemList = {}
      // 预约项目列表
      let apptItemArr = []

      listClone.forEach((apptItem) => {
        apptItem.appointmentSettingsAppointmentItemName =
          apptItem.appointmentSettingsAppointmentItemName.zh_CN

        if (!apptItem.appointmentSettingsAppointmentItemTypeId) {
          if (apptItemList.noGroup) {
            apptItemList.noGroup.list.push(apptItem)
          } else {
            apptItemList.noGroup = {
              appointmentSettingsAppointmentItemTypeName: '未分组',
              list: [apptItem],
            }
          }
        } else {
          if (apptItemList[apptItem.appointmentSettingsAppointmentItemTypeId]) {
            apptItemList[
              apptItem.appointmentSettingsAppointmentItemTypeId
            ].list.push(apptItem)
          } else {
            const colorNo = colorNumberList.find(
              (colorItem) =>
                colorItem.color ===
                apptItem.appointmentSettingsAppointmentItemTypeColorNo,
            )?.border

            apptItemList[apptItem.appointmentSettingsAppointmentItemTypeId] = {
              appointmentSettingsAppointmentItemTypeName:
                apptItem.appointmentSettingsAppointmentItemTypeName,
              appointmentSettingsAppointmentItemTypeColorNo: colorNo,
              list: [apptItem],
            }
          }
        }
      })

      if (apptItemList.noGroup) {
        apptItemArr.push(apptItemList.noGroup)

        delete apptItemList.noGroup
      }

      apptItemArr = [...apptItemArr, ...Object.values(apptItemList)]

      return apptItemArr
    },
  },
}
</script>

<style lang="scss" scoped>
.apptDpmsList {
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
}
</style>
