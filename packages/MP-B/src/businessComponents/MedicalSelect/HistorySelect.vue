<template>
  <div v-if="visible">
    <div class="mask"></div>
    <div class="inner">
      <div class="head">
        选择历史病历
        <div class="iconfont icon-plus" @click="close" />
      </div>
      <div class="body" v-if="histories.length">
        <div class="tabs">
          <div
            class="tab"
            :class="{
              active: h.medicalRecordId === curHistory.medicalRecordId,
            }"
            v-for="h in histories"
            :key="h.medicalRecordId"
            @click="tabChange(h)"
          >
            <div>{{ h.timeFormated }}</div>
          </div>
        </div>
        <div class="content">
          <div class="flex1">
            <div>{{ curHistory.medicalInstitutionSimpleCode }}</div>
            <div>{{ curHistory.doctorStaffName }}</div>
          </div>
          <div class="flex1">
            <button :disabled="allBtnDisabled" @click="copyAll">
              复用全部
            </button>
          </div>
          <div
            class="item"
            :class="{ active: activedContents.some((a) => a.key === c.key) }"
            v-for="c in contents"
            :key="c.key"
            @click="itemClick(c)"
          >
            <div class="tit">{{ c.name }}</div>
            {{ c.content }}
          </div>
        </div>
      </div>
      <div v-else class="empty">
        <image mode="aspectFit" src="../../static/empty.png" />
        暂无历史病历
      </div>
    </div>
  </div>
</template>
<script>
import diagnosisAPI from '@/APIS/diagnosis/diagnosis.api.js'
import moment from 'moment'
export default {
  props: {
    visible: Boolean,
    patientId: [Number, String],
  },
  data() {
    return {
      histories: [],
      curHistory: null,
      activedContents: [],
    }
  },
  computed: {
    contents() {
      return [
        { key: 'mainComplaint', name: '主诉' },
        { key: 'presentIllnessHistory', name: '现病史' },
        { key: 'pastIllnessHistory', name: '既往史' },
        { key: 'symptom', name: '口腔检查' },
        { key: 'rayExamination', name: '辅助检查' },
        { key: 'diagnosisDesc', name: '诊断' },
        { key: 'treatmentProgram', name: '治疗方案' },
        { key: 'dispose', name: '处置' },
        { key: 'doctorAdvice', name: '医嘱' },
      ]
        .map((c) => ({
          ...c,
          content: this.curHistory?.medicalRecordVO[c.key],
        }))
        .filter((c) => c.content)
    },
    allBtnDisabled() {
      return this.activedContents.length === this.contents.length
    },
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    async getMedicalHistories() {
      const res = await diagnosisAPI.getMedicalHistories({
        patientId: this.patientId,
        startTime: moment().subtract(1, 'years').startOf('day').valueOf(),
        endTime: moment().endOf('day').valueOf(),
      })
      this.histories = res.data.map((d) => ({
        ...d,
        timeFormated: moment(d.visTime).format('YYYY-MM-DD HH:mm:ss'),
      }))
      this.curHistory = this.histories[0]
    },
    itemClick(c) {
      if (this.activedContents.some((a) => a.key === c.key)) return
      this.activedContents.push(c)
    },
    copyAll() {
      this.activedContents = this.contents
    },
    tabChange(h) {
      this.curHistory = h
    },
  },
  watch: {
    visible(newVal, oldVal) {
      if (newVal === oldVal) return
      if (newVal) {
        this.getMedicalHistories()
      }
    },
    activedContents(newVal, oldVal) {
      this.$emit('change', this.activedContents)
      this.$utils.show('添加成功')
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
      .flex1 {
        color: #4c4c4c;
        display: flex;
        justify-content: space-between;
        padding: 16rpx;
      }
      button {
        height: 56rpx;
        line-height: 52rpx;
        border: 2rpx solid #5cbb89;
        border-radius: 30rpx;
        color: #5cbb89;
        background: transparent;
        font-size: inherit;
        width: 100%;
        &[disabled] {
          border-color: #d9d9d9;
          background: #f5f5f5;
          color: #bfbfbf;
        }
      }
      .item {
        padding: 16rpx;
        color: #191919;
        border-radius: 8rpx;
        margin-bottom: 16rpx;
        word-break: break-all;
        &.active {
          color: #5cbb89;
          background: #eef8f3;
        }
        .tit {
          font-weight: bold;
          margin-bottom: 6rpx;
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
