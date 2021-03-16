<template>
  <div v-if="visible">
    <div class="mask"></div>
    <div class="inner">
      <div class="head">
        选择模板
        <div class="iconfont icon-plus" @click="close" />
      </div>
      <div class="body" v-if="templateTypes.length">
        <div class="tabs">
          <div
            class="tab"
            :class="{
              active:
                curTemplateType.patientMedicalRecordTemplateTypeId ===
                t.patientMedicalRecordTemplateTypeId,
            }"
            v-for="t in templateTypes"
            :key="t.patientMedicalRecordTemplateTypeId"
            @click="tabChange(t)"
          >
            <div>{{ t.patientMedicalRecordTemplateTypeName }}</div>
          </div>
        </div>
        <div class="content">
          <div
            class="item"
            :class="{
              active:
                activedTemplate.patientMedicalRecordTemplateId ===
                t.patientMedicalRecordTemplateId,
            }"
            v-for="t in templates"
            :key="t.patientMedicalRecordTemplateId"
            @click="itemClick(t)"
          >
            {{ t.patientMedicalRecordTemplateName }}
          </div>
        </div>
      </div>
      <div v-else class="empty">
        <image mode="aspectFit" src="../../static/empty.png" />
        暂无模板
      </div>
    </div>
  </div>
</template>
<script>
import patientAPI from '@/APIS/patient/patient.api.js'
export default {
  props: {
    visible: Boolean,
  },
  data() {
    return {
      templateTypes: [],
      curTemplateType: null,
      activedTemplate: {},
      templates: [],
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    async getMedicalTemplateTypes() {
      const res = await patientAPI.getMedicalTemplateTypes()
      this.templateTypes = res.data
      this.curTemplateType = this.templateTypes[0]
    },
    async getMedicalTemplates() {
      const res = await patientAPI.getMedicalTemplates({
        patientMedicalRecordTemplateTypeId: this.curTemplateType
          .patientMedicalRecordTemplateTypeId,
        size: 100,
      })
      this.templates = res.data.records
    },
    tabChange(t) {
      this.curTemplateType = t
    },
    itemClick(t) {
      this.activedTemplate = t
    },
  },
  watch: {
    visible(newVal, oldVal) {
      if (newVal === oldVal) return
      if (newVal) {
        this.getMedicalTemplateTypes()
      }
    },
    curTemplateType(newVal) {
      if (newVal) {
        this.getMedicalTemplates()
      }
    },
    activedTemplate(newVal) {
      if (newVal) {
        this.$emit('change', newVal)
        this.$utils.show('添加成功')
      }
    },
  },
}
</script>
<style scoped lang="scss">
@keyframes open {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0%);
  }
}
.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
}
.inner {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  background: white;
  border-radius: 24rpx 24rpx 0 0;
  height: 80%;
  animation: open 0.6s;
  .head {
    height: 110rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #191919;
    font-size: 34rpx;
    border-bottom: solid 2rpx #e5e5e5;
    .icon-plus {
      position: absolute;
      right: 0;
      top: 0;
      padding: 30rpx;
      color: #595959;
      transform: rotateZ(45deg);
      font-size: 48rpx;
    }
  }
  .body {
    display: flex;
    font-size: 28rpx;
    height: calc(100% - 110rpx);
    .tabs {
      background: #f0f0f0;
      width: 250rpx;
      flex: none;
      color: #4c4c4c;
      overflow: auto;
      overscroll-behavior: contain;
      .tab {
        border-left: 8rpx solid transparent;
        padding-left: 32rpx;
        height: 112rpx;
        &.active {
          background: white;
          border-color: #5cbb89;
          > div {
            border-bottom: none;
          }
        }
        > div {
          border-bottom: solid 1rpx rgba(0, 0, 0, 0.15);
          height: 100%;
          display: flex;
          align-items: center;
          margin-right: 32rpx;
        }
      }
    }
    .content {
      color: #191919;
      padding: 16rpx;
      flex: auto;
      overflow: auto;
      overscroll-behavior: contain;
      .item {
        padding: 0 16rpx;
        height: 68rpx;
        line-height: 68rpx;
        color: #191919;
        border-radius: 8rpx;
        margin-bottom: 16rpx;
        &.active {
          color: #5cbb89;
          font-weight: bold;
          background: #eef8f3;
        }
      }
    }
  }
  .empty {
    color: #7f7f7f;
    font-size: 34rpx;
    text-align: center;
    padding-top: 120rpx;
    image {
      width: 320rpx;
      height: 320rpx;
      display: block;
      margin: auto;
      margin-bottom: 36rpx;
    }
  }
}
</style>
