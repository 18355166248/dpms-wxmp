<template>
  <div class="personas">
    <div
      v-if="list.length !== 0"
      class="pb-120"
      :class="{ 'pb-188': isPhoneXCeil }"
    >
      <div class="tagContent" v-for="patientTag in list" :key="patientTag.id">
        <div class="tagTitle">
          {{ patientTag.name }}
        </div>
        <div class="tagBody">
          <div class="plus" @click="jumpAdd(patientTag.id)">
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
      <button
        class="ensurebutton"
        :class="{ 'bt-68': isPhoneXCeil }"
        @click="onSave"
      >
        保存
      </button>
      <view class="bottomSpace" v-if="isPhoneXCeil"></view>
    </div>
    <div v-else>
      <empty :disabled="true" text="暂无患者标签数据"></empty>
    </div>
  </div>
</template>

<script>
import patientAPI from '@/APIS/patient/patient.api'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      list: [],
      checked: [],
    }
  },
  onLoad({ checked }) {
    if (checked) {
      this.checked = checked.split(',').map((v) => Number(v))
    }
  },
  onShow() {
    this.loadPatientTags()
  },
  computed: {
    ...mapState('systemStore', ['isPhoneXCeil']),
  },
  methods: {
    onSave() {
      uni.$emit('updateTagsCheckedList', this.checked)
      this.$dpmsUtils.back()
    },
    insertId(id) {
      this.checked.push(Number(id))
    },
    removeId(id) {
      this.checked = this.checked.filter((v) => {
        return v !== Number(id)
      })
    },
    jumpAdd(groupId) {
      this.$dpmsUtils.push({
        url: '/pages/patient/createPatient/addPersonas?groupId=' + groupId,
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
.personas {
  .pb-188 {
    padding-bottom: 188rpx !important;
  }
  .pb-120 {
    padding-bottom: 120rpx;
  }
  .bt-68 {
    bottom: 68rpx !important;
  }
  .bottomSpace {
    height: 68rpx;
    background-color: #fff;
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 9;
  }
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
      width: 64rpx;
      height: 64rpx;
      background: #5cbb89;
      border-radius: 4rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tagList {
      display: flex;
      width: 600rpx;
      flex-wrap: wrap;
    }
    .tag {
      border: 1rpx solid rgba(0, 0, 0, 0.15);
      border-radius: 10rpx;
      line-height: 65rpx;
      text-align: center;
      margin-left: 16rpx;
      margin-bottom: 16rpx;
      color: #595959;
      font-size: 30rpx;
      padding-left: 30rpx;
      padding-right: 30rpx;
    }
    .tagChecked {
      background: #eef8f3;
      border: 1rpx solid #5cbb89;
      border-radius: 10rpx;
      line-height: 65rpx;
      color: #5cbb89;
      text-align: center;
      margin-left: 16rpx;
      margin-bottom: 16rpx;
      font-size: 30rpx;
      padding-left: 30rpx;
      padding-right: 30rpx;
    }
    .icon-plus {
      color: #fff;
      font-size: 32rpx;
    }
  }
}
</style>
