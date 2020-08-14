<template>
  <div class="apptDpmsList">
    <div v-if="list.length !== 0">
      <dpmsCheckboxGroup v-model="checked">
        <dpmsCollapse class="mb-56">
          <dpmsCollapseItem
            v-for="patientTag in list"
            :key="patientTag.name"
            :title="patientTag.name"
            showAnimation
            open
          >
            <div class="apptCollapse">
              <div
                v-for="(tag, index) in patientTag.tagInfoDTOList"
                :key="tag.id"
                :class="['appt', index === 0 && 'first']"
              >
                <dpmsCheckbox shape="square" :key="tag.id" :label="tag.id">
                  {{ tag.name }}
                </dpmsCheckbox>
              </div>
            </div>
          </dpmsCollapseItem>
        </dpmsCollapse>
      </dpmsCheckboxGroup>
      <div class="mt-56">
        <dpmsButton @click="onSave" />
      </div>
    </div>
    <div v-else>
      <empty :disabled="true" text="暂无患者标签数据"></empty>
    </div>
  </div>
</template>

<script>
import patientAPI from '@/APIS/patient/patient.api'

export default {
  data() {
    return {
      list: uni.getStorageSync('patientTagsList'),
      checked: [],
    }
  },
  onLoad({ checked }) {
    if (checked) {
      this.checked = checked.split(',').map((v) => Number(v))
    }
  },
  onShow() {
    if (!uni.getStorageSync('patientTagsList').length) {
      this.loadPatientTags()
    }
  },
  methods: {
    onSave() {
      uni.$emit('updateTagsCheckedList', this.checked)
      this.$utils.back()
    },
    async loadPatientTags() {
      let res = await patientAPI.getPatientTags()
      let patientTagsList = res.data.filter((v) => v.tagInfoDTOList.length > 0)
      uni.setStorageSync('patientTagsList', patientTagsList)
      this.list = patientTagsList
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
      border-top: 1px solid rgba($color: #000000, $alpha: 0.15);
      color: rgba($color: #000000, $alpha: 0.9);
      font-size: 34rpx;

      &.first {
        border-top: none;
      }
    }
  }
}
</style>
