<template>
  <view class="apptDpmsList">
    <scroll-view
      v-if="!isEmpty"
      style="height: calc(100% - 90rpx);"
      :scroll-x="false"
      :scroll-y="true"
    >
      <checkbox-group @change="checkboxChange">
        <uni-collapse :accordion="false">
          <uni-collapse-item
            v-for="apptType in groupTypeList"
            :key="apptType.id"
            :title="apptType.name"
            :border="true"
            title-border="show"
            :open="true"
          >
            <template v-slot:title>
              <view class="collapseItemTitle">{{ apptType.name }}</view>
            </template>
            <view class="collapseItemContainer">
              <label
                v-for="item in apptType.items"
                :key="item.id"
                class="apptItem"
              >
                <checkbox
                  :value="item.id"
                  :checked="checked.includes(item.id)"
                  class="checkbox"
                />
                {{ item.name }}
              </label>
            </view>
          </uni-collapse-item>
        </uni-collapse>
      </checkbox-group>
    </scroll-view>

    <view v-else>
      <empty :disabled="true" v-if="isAppt" text="暂无预约项目" />
      <empty :disabled="true" v-else text="暂无就诊项目" />
    </view>

    <view class="saveBtn" @click="onSave">保 存</view>
  </view>
</template>

<script>
import empty from '@/components/empty/empty.vue'

export default {
  components: {
    empty,
  },
  data() {
    return {
      checked: [],
      isAppt: false,
      isEmpty: false,
      groupTypeList: [],
    }
  },
  onLoad({ checked, isAppt, isEmpty }) {
    this.isAppt = isAppt == 'true'
    this.isEmpty = isEmpty == 'true'
    if (checked) {
      this.checked = checked.split(',').map((v) => Number(v)) || []
    }
    this.groupTypeList = this.getGroupListByType()
  },
  methods: {
    checkboxChange(e) {
      this.checked = e.detail.value.map((v) => Number(v)) || []
    },
    onSave() {
      uni.$emit('updateApptItemCheckedList', this.checked)
      this.$dpmsUtils.back()
    },
    // 根据预约类型进行分组
    getGroupListByType() {
      const list = uni.getStorageSync('apptItemList')
      if (!Array.isArray(list)) {
        return []
      }
      const typeList = []
      list.forEach((item) => {
        const foundType = typeList.find(
          (type) => type.id === item.appointmentSettingsAppointmentItemTypeId,
        )
        if (!foundType) {
          typeList.push({
            id: item.appointmentSettingsAppointmentItemTypeId,
            name: item.appointmentSettingsAppointmentItemTypeName,
            color: item.appointmentSettingsAppointmentItemTypeColorNo,
            items: [
              {
                id: item.appointmentSettingsAppointmentItemId,
                name: item.appointmentSettingsAppointmentItemName.zh_CN,
              },
            ],
          })
        } else {
          foundType.items.push({
            id: item.appointmentSettingsAppointmentItemId,
            name: item.appointmentSettingsAppointmentItemName.zh_CN,
          })
        }
      })

      return typeList
    },
  },
}
</script>

<style lang="scss" scoped>
.apptDpmsList {
  height: 100%;
  background: #ffffff;
  overflow-x: hidden;

  .checkbox {
    /deep/ .wx-checkbox-input {
      width: 32rpx;
      height: 32rpx;
      margin-bottom: 6rpx;
      margin-right: 16rpx;
    }

    /deep/ .wx-checkbox-input.wx-checkbox-input-checked {
      border: 1px solid #5cbb89;
      background: #5cbb89;
      color: #ffffff !important;
    }
  }

  .collapseItemTitle {
    background-color: rgba(0, 0, 0, 0.04);
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.5);
    height: 80rpx;
    line-height: 80rpx;
    padding-left: 32rpx;
    margin-right: -100rpx;
  }

  .collapseItemContainer {
    padding-left: 32rpx;
    .apptItem {
      height: 112rpx;
      line-height: 112rpx;
      color: #333333;
      font-size: 34rpx;
      display: block;
      border-top: 1rpx solid rgba(0, 0, 0, 0.15);

      &:first-child {
        border-top: none;
      }
    }
  }

  .saveBtn {
    background: #5cbb89;
    color: #ffffff;
    height: 90rpx;
    line-height: 90rpx;
    text-align: center;
    font-size: 36rpx;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }
}
</style>
