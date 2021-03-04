<template>
  <div class="apptDpmsList">
    <div v-if="list.length !== 0">
      <div class="tagContent" v-for="patientTag in list" :key="patientTag.id">
        <div class="tagTitle">
          {{ patientTag.name }}
        </div>
        <div class="tagBody">
          <div class="plus">
            <text class="iconfont icon-plus" />
          </div>
          <div class="tagList">
            <div v-for="tag in patientTag.tagInfoDTOList" :key="tag.id">
              <div
                class="tag"
                @click="insertId(tag.id)"
                v-if="!checked.includes(tag.id)"
              >
                {{ tag.name }}
              </div>
              <div
                class="tagChecked"
                @click="removeId(tag.id)"
                v-if="checked.includes(tag.id)"
              >
                {{ tag.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="ensurebutton" @click="onSave">
        保存
      </button>
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
    insertId(id) {
      this.checked.push(Number(id))
    },
    removeId(id) {
      this.checked = this.checked.filter((v) => {
        return v !== Number(id)
      })
    },
    async loadPatientTags() {
      let res = await patientAPI.getPatientTags()
      let patientTagsList = res.data.filter((v) => v.tagInfoDTOList?.length > 0)
      uni.setStorageSync('patientTagsList', patientTagsList)
      this.list = patientTagsList
    },
  },
}
</script>

<style lang="scss" scoped>
.apptDpmsList {
  .ensurebutton {
    width: 100%;
    position: fixed;
    bottom: 0;
    height: 90rpx;
    color: #ffffff;
    text-align: center;
    font-size: 36rpx;
    background: #5cbb89;
    border-radius: 0;
  }
  .tagContent {
    background: #fff;
    margin-bottom: 20rpx;
    .tagTitle {
      font-size: 30rpx;
      padding-top: 32rpx;
      padding-left: 32rpx;
      color: #595959;
    }
    .tagBody {
      display: flex;
      margin-top: 16rpx;
      padding-bottom: 20rpx;
    }
    .plus {
      margin-left: 32rpx;
      width: 68rpx;
      height: 68rpx;
      background: #5cbb89;
      border-radius: 4rpx;
    }
    .tagList {
      display: flex;
      width: 600rpx;
      flex-wrap: wrap;
    }
    .tag {
      width: 148rpx;
      height: 68rpx;
      border: 2rpx solid rgba(0, 0, 0, 0.15);
      border-radius: 10rpx;
      line-height: 65rpx;
      text-align: center;
      margin-left: 16rpx;
      margin-bottom: 16rpx;
      color: #595959;
    }
    .tagChecked {
      width: 148rpx;
      height: 68rpx;
      background: #eef8f3;
      border: 2rpx solid #5cbb89;
      border-radius: 10rpx;
      line-height: 65rpx;
      color: #5cbb89;
      text-align: center;
      margin-left: 16rpx;
      margin-bottom: 16rpx;
    }
    .icon-plus {
      color: #fff;
      position: relative;
      top: 12rpx;
      left: 18rpx;
    }
  }
}
</style>
