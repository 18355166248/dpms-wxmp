<template>
  <scroll-view>
    <div data-layout-align="space-between center">
      <div class="search-input">
        <dpmsSearch
          type="text"
          confirmType="search"
          placeholder="搜索患者"
          :value="searchValue"
          @change="changeValue"
          @search="searchPatients"
          @clear="cancelSearch"
        />
      </div>
      <div class="create-patient" @click="toCreatePatient">新建</div>
    </div>

    <!-- 搜索提示、结果文字 -->
    <div class="search-tip-text pt-28" v-if="!isSearchedValue">
      请输入姓名/拼音/手机号查找患者
    </div>
    <div
      class="search-tip-text pt-28 pl-24 pr-24"
      v-if="isSearchedValue && patientList.length === 0"
    >
      没有找到“<span class="patient-name">{{ isSearchedValue }}</span
      >”这个患者
    </div>

    <!-- 历史搜索 -->
    <div class="mt-64 history-search-section" v-if="patientList.length === 0">
      <div data-layout-align="space-between center">
        <span class="title">历史搜索</span>
        <span
          class="iconfont icon-delete"
          @click="clearHistorySearch"
          v-if="searchRecords.length !== 0"
        ></span>
      </div>
      <span
        class="history-search-text"
        v-for="searchRecord in searchRecords"
        :key="searchRecord"
        @click="chooseSearchRecord(searchRecord)"
      >
        {{
          searchRecord.length > 10
            ? `${searchRecord.substring(0, 10)}...`
            : searchRecord
        }}
      </span>
    </div>

    <!-- 搜索列表 -->
    <div v-if="isSearchedValue && patientList.length != 0">
      <div v-for="parient in patientList" :key="parient.patientId">
        <div @click="toPatient(parient.patientId)">
          <card
            :name="parient.patientName"
            :avatarUrl="parient.avatarUrl"
            :gender="parient.gender"
            :age="parient.age"
            :infos="[{ label: '联系电话', value: parient.mobile }]"
          />
        </div>
      </div>
      <load-more :status="dataSourceStatus.status" />
    </div>
  </scroll-view>
</template>

<script>
import patientAPI from '@/APIS/patient/patient.api'
import loadMore from '@/components/load-more/load-more.vue'

export default {
  data() {
    return {
      searchValue: '', //搜索框输入的值
      isSearchedValue: '', //执行搜索的值
      patientList: [], //患者列表
      searchRecords: [], //搜索历史列表
      current: 1, //默认展示 第一页数据
      size: 10, //默认展示 15条数据
      total: 1, //默认 总条目，
      // 数据列表的状态
      dataSourceStatus: {
        loading: true,
        status: 'loading',
        request: 'loading',
      },
    }
  },
  onLoad() {
    this.searchRecords = uni.getStorageSync('searchPatientHistory') || []
  },
  onReachBottom() {
    if (this.patientList.length < this.total) {
      this.current += 1
      this.getPatients()
    }
  },
  methods: {
    toCreatePatient() {
      this.$utils.push({
        url: '/pages/patient/createPatient/createPatient',
      })
    },
    //更新搜索框的值
    changeValue(param) {
      this.searchValue = param.value
    },
    getPatients() {
      let that = this
      patientAPI
        .getPatientList({
          regularParam: this.isSearchedValue,
          current: this.current,
          size: this.size,
        })
        .then((res) => {
          //TODO：搜索患者

          const { total, current, records } = res.data

          if (current === 1) {
            that.patientList = records
          } else {
            that.patientList = that.patientList.concat(records)
          }
          that.total = total

          if (total === that.patientList.length) {
            this.dataSourceStatus.status = 'noMore'
          }
        })
        .catch(() => {
          //
        })
    },
    //执行搜索
    searchPatients() {
      if (!this.searchValue) {
        return
      }
      this.isSearchedValue = this.searchValue

      //搜索历史列表数据：最多显示10条
      let searchList = [
        ...new Set([
          this.isSearchedValue,
          ...uni.getStorageSync('searchPatientHistory'),
        ]),
      ].filter((v, index) => index < 10)

      this.searchRecords = searchList
      uni.setStorageSync('searchPatientHistory', searchList)

      this.getPatients()
    },
    //取消搜索
    cancelSearch() {
      this.searchValue = ''
      this.isSearchedValue = ''
      this.patientList = []
    },
    //选择搜索历史中某一个历史
    chooseSearchRecord(searchRecord) {
      this.searchValue = searchRecord
    },
    clearHistorySearch() {
      this.searchRecords = []
      uni.setStorageSync('searchPatientHistory', [])
    },
    toPatient(id) {
      this.$utils.push({
        url: '/pages/patient/patient?patientId=' + id,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
[data-layout-align] {
  display: flex;
  justify-content: flex-start;
  align-content: stretch;
  align-items: stretch;
}

[data-layout-align='space-between center'] {
  justify-content: space-between;
  align-items: center;
  align-content: center;
  max-width: 100%;
}

.search-tip-text {
  font-size: 28rpx;
  font-weight: 400;
  text-align: center;
  color: rgba(0, 0, 0, 0.65);
  .patient-name {
    color: rgba(92, 187, 137, 1);
  }
}

.history-search-section {
  width: 704rpx;
  padding: 0 24rpx;
  .title {
    font-size: 34rpx;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.9);
  }
  .icon-delete {
    color: rgba(0, 0, 0, 0.25);
  }
  .history-search-text {
    height: 68rpx;
    line-height: 68rpx;
    padding: 0 24rpx;
    font-size: 28rpx;
    font-weight: 400;
    text-align: center;
    background: #e7e7e7;
    border-radius: 2rpx;
    color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    margin: 24rpx 16rpx 0 0;
  }
}

.search-input {
  width: 670rpx;
}
.create-patient {
  margin-right: 24rpx;
  font-size: 28rpx;
  font-weight: 400;
  color: #5cbb89;
}
</style>
