<template>
  <div>
    <textarea
      class="textarea"
      v-model="value"
      placeholder-style="color: rgba(0,0,0,0.3);"
      :placeholder="`请输入${title}`"
    />
    <div class="panel">
      <div class="head">
        <div
          :class="{ active: selectType === 'dict' }"
          v-if="!key.includes('diagnosisDesc')"
          @click="selectType = 'dict'"
        >
          {{ title }}词条
        </div>
        <div
          :class="{ active: selectType === 'template' }"
          @click="selectType = 'template'"
        >
          {{ title }}模板
        </div>
      </div>
      <div class="body">
        <div class="tabs">
          <div
            class="tab"
            :class="{
              active: curDict.settingsDictTypeId === t.settingsDictTypeId,
            }"
            v-for="t in dicts"
            :key="t.settingsDictTypeId"
            @click="tabChange(t)"
          >
            <div>{{ t.settingsDictTypeName }}</div>
          </div>
        </div>
        <div class="content" v-if="selectType === 'dict'">
          <div
            v-for="c in curDict.DictVO"
            :key="c.settingsDictId"
            :class="{ active: activedContents.includes(c.settingsDictName) }"
            @click="contentClick(c)"
          >
            {{ c.settingsDictName }}
          </div>
        </div>
        <div class="templateContent" v-if="selectType === 'template'">
          <div
            v-for="c in curDict.DictVO"
            :key="c.settingsDictId"
            :class="{ active: activedContents.includes(c.settingsDictName) }"
            @click="contentClick(c)"
          >
            <div class="title">{{ c.settingsDictTitle }}</div>
            {{ c.settingsDictName }}
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <button @click="save">保 存</button>
    </div>
  </div>
</template>
<script>
import patientAPI from '@/APIS/patient/patient.api.js'
const keyPs = [
  {
    key: 'mainComplaint',
    func: 'getMainComplaintDict',
    prefix: 'chiefComplaint',
  },
  {
    key: 'presentIllnessHistory',
    func: 'getPresentIllnessHistoryDict',
    prefix: 'presentIllnessHistory',
  },
  { key: 'doctorAdvice', func: 'getDoctorAdviceDict', prefix: 'doctorAdvice' },
  { key: 'dispose', func: 'getDisposeDict', prefix: 'dispose' },
  { key: 'diagnosisDesc', prefix: 'diagnosis' },
  {
    key: 'pastIllnessHistory',
    func: 'getPastIllnessHistoryDict',
    prefix: 'pastIllnessHistory',
  },
  {
    key: 'checkNormalSymptoms',
    func: 'getExaminationDict',
    prefix: 'examination',
  },
  {
    key: 'checkRaySymptoms',
    func: 'getExaminationDict',
    prefix: 'examination',
  },
  {
    key: 'treatmentProgram',
    func: 'getTreatmentPlanDict',
    prefix: 'treatmentPlan',
  },
]
export default {
  data() {
    return {
      value: '',
      title: '',
      key: '',
      dicts: [],
      curDict: {},
      selectType: 'dict',
    }
  },
  computed: {
    activedContents() {
      return this.value.split('，')
    },
  },
  methods: {
    save() {
      uni.$emit('medicalRecordTextareaChange', {
        value: this.value,
        key: this.key,
      })
      this.$utils.back()
    },
    async getDict() {
      if (this.key.includes('diagnosisDesc')) {
        this.selectType = 'template'
        return
      }
      const kp = keyPs.find((kp) => this.key.includes(kp.key))
      const res = await patientAPI[kp.func]()
      function replaceKey(arr, key) {
        return arr.map((a) =>
          Object.keys(a).reduce(
            (r, k) => ({
              ...r,
              [k
                .replace(RegExp(kp.prefix, 'i'), '')
                .replace('DictVOS', 'DictVO')]: Array.isArray(a[k])
                ? replaceKey(a[k], key)
                : a[k],
            }),
            { DictVO: [] },
          ),
        )
      }
      this.dicts = replaceKey(res.data, kp.prefix)
      this.curDict = this.dicts[0]
    },
    tabChange(t) {
      this.curDict = t
    },
    contentClick({ settingsDictName }) {
      this.value += this.value ? `，${settingsDictName}` : settingsDictName
    },
    async getPatientRecordTemplate() {
      const res = await patientAPI.getPatientRecordTemplate()
      this.dicts = Object.keys(res.data).map((k, i) => ({
        settingsDictTypeId: i,
        settingsDictTypeName: k,
        DictVO: res.data[k][
          `${keyPs.find((kp) => this.key.includes(kp.key)).prefix}List`
        ]?.map((l, i) => ({
          settingsDictId: i,
          settingsDictName: l.medicalRecordContent,
          settingsDictTitle: l.patientMedicalRecordTemplateName,
        })),
      }))
      this.curDict = this.dicts[0]
    },
  },
  onLoad({ title, value, key }) {
    this.title = title
    this.key = key
    uni.setNavigationBarTitle({
      title,
    })
    this.value = value || ''
    this.getDict()
  },
  watch: {
    selectType(newVal) {
      if (!newVal) return
      ;(newVal === 'template' && this.getPatientRecordTemplate()) ||
        (newVal === 'dict' && this.getDict())
    },
  },
}
</script>

<style lang="scss" scoped>
.textarea {
  box-sizing: border-box;
  width: 100%;
  height: 360rpx;
  background: #ffffff;
  padding: 28rpx 32rpx;
  font-size: 30rpx;
  line-height: 1.5;
}
.panel {
  position: fixed;
  top: 376rpx;
  right: 0;
  bottom: 90rpx;
  left: 0;
  background: white;
  font-size: 28rpx;
  .head {
    display: flex;
    justify-content: center;
    color: #191919;
    font-size: 30rpx;
    font-weight: bold;
    > div {
      width: 50%;
      height: 96rpx;
      line-height: 96rpx;
      text-align: center;
      position: relative;
      &.active {
        color: #5cbb89;
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60rpx;
          height: 4rpx;
          background: #5cbb89;
          border-radius: 2rpx;
        }
      }
    }
  }
  .body {
    border-top: solid 2rpx #e5e5e5;
    display: flex;
    align-items: flex-start;
    font-size: 28rpx;
    height: calc(100% - 96rpx);
    .tabs {
      background: #f0f0f0;
      width: 250rpx;
      flex: none;
      color: #4c4c4c;
      height: 100%;
      overflow: auto;
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
      color: #595959;
      padding: 24rpx;
      padding-bottom: 0;
      flex: auto;
      height: 100%;
      overflow: auto;
      display: flex;
      box-sizing: border-box;
      align-content: flex-start;
      flex-wrap: wrap;
      > div {
        flex: auto;
        min-width: 34%;
        border: 1rpx solid rgba(0, 0, 0, 0.15);
        border-radius: 9rpx;
        box-sizing: border-box;
        min-height: 68rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16rpx 32rpx;
        word-break: break-all;
        margin: 8rpx;
        &.active {
          border-color: #5cbb89;
          background: #eef8f3;
          color: #5cbb89;
        }
      }
    }
    .templateContent {
      padding: 16rpx;
      padding-bottom: 0;
      color: #191919;
      flex: auto;
      height: 100%;
      overflow: auto;
      box-sizing: border-box;
      > div {
        border-radius: 8rpx;
        word-break: break-all;
        padding: 16rpx;
        margin-bottom: 16rpx;
        &.active {
          background: #eef8f3;
          color: #5cbb89;
        }
        .title {
          font-weight: bold;
          margin-bottom: 6rpx;
        }
      }
    }
  }
}
.bottom {
  height: 90rpx;
  button {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    height: 90rpx;
    background: #5cbb89;
    color: #ffffff;
    font-size: 36rpx;
    border-radius: 0;
  }
}
</style>
