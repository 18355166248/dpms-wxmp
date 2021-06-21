<template>
  <scroll-view>
    <div data-layout-align="space-between center">
      <div class="search-input">
        <dpmsSearch
          type="text"
          confirmType="search"
          placeholder="请输入姓名/拼音/手机号/病历号查找患者"
          v-model="searchValue"
          @change="changeValue"
          @search="searchPatients"
          @clear="cancelSearch"
        />
      </div>
      <div class="create-patient" @click="toCreatePatient">新建</div>
    </div>

    <FilterArea @getList="getList" :isAddToday.sync="isAddToday"></FilterArea>

    <div
      class="search-tip-text pt-28 pl-24 pr-24"
      v-if="searchValue && isSearchedValue && patientList.length === 0"
    >
      没有找到“
      <span class="patient-name">{{ isSearchedValue }}</span>
      ”这个患者
    </div>

    <!-- 历史搜索 -->
    <div class="mt-20 history-search-section" v-if="searchRecords.length !== 0">
      <div data-layout-align="space-between center">
        <span class="title">历史搜索</span>
        <span class="iconfont icon-delete" @click="clearHistorySearch"></span>
      </div>
      <span
        class="history-search-text"
        v-for="(searchRecord, index) in searchRecords"
        :key="index"
        @click="chooseSearchRecord(searchRecord, index)"
      >
        {{
          searchRecord.length > 10
            ? `${searchRecord.substring(0, 10)}...`
            : searchRecord
        }}
      </span>
    </div>

    <!-- 搜索列表 -->
    <div v-if="patientList.length !== 0">
      <div v-for="patient in patientList" :key="patient.patientId">
        <div @click="clickPatientCard(patient)">
          <card
            :name="patient.patientName"
            :avatarUrl="patient.avatarUrl"
            :gender="patient.gender"
            :medicalRecordNo="patient.medicalRecordNo"
            :infos="[{ label: '联系电话', value: patient.mobile }]"
            :patient="patient"
          />
        </div>
      </div>
      <load-more :status="dataSourceStatus.status" />
    </div>
    <empty :disabled="true" v-else-if="dataSourceStatus.status !== 'loading'" />
  </scroll-view>
</template>

<script>
import patientAPI from '@/APIS/patient/patient.api'
import loadMore from '@/components/load-more/load-more.vue'
import FilterArea from './modules/FilterArea.vue'
import { globalEventKeys } from 'config/global.eventKeys.js'
import empty from '@/components/empty/empty.vue'

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
      isAddToday: '',
      dataSourceStatus: {
        // 数据列表的状态
        loading: true,
        status: 'loading',
        request: 'loading',
      },
      paramsObj: {},
      filterParamsObj: {
        time: {
          dateType: 1,
          registerBeginMilliSecond: '',
          registerEndMilliSecond: '',
        },
        doctor: {
          doctorType: 1,
          doctorId: '',
        },
      },
    }
  },
  components: {
    loadMore,
    FilterArea,
    empty,
  },
  onLoad(option) {
    this.paramsObj = option
    this.searchRecords = uni.getStorageSync('searchPatientHistory') || []
    if (this.paramsObj.type === '3') {
      this.filterParamsObj.time.dateType = this.paramsObj.type
      this.filterParamsObj.time.registerBeginMilliSecond = new Date().setHours(
        0,
        0,
        0,
        0,
      )
      this.filterParamsObj.time.registerEndMilliSecond =
        new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1
      this.isAddToday = true
    }
    this.init()
  },
  onReachBottom() {
    if (this.patientList.length < this.total) {
      this.current += 1
      this.getPatients()
    }
  },
  methods: {
    getList(params, type) {
      this.current = 1
      // 先清空筛选入参，再更新入参
      for (const key in this.filterParamsObj[type]) {
        this.filterParamsObj[key] = ''
      }
      for (const key in params) {
        this.filterParamsObj[type][key] =
          params[key] === 'all' ? '' : params[key]
      }
      this.getPatients()
    },
    init() {
      this.current = 1
      this.getPatients()
    },
    toCreatePatient() {
      this.$dpmsUtils.push({
        url:
          '/pages/patient/createPatient/createPatient?type=' +
          this.paramsObj.type,
      })
    },
    //更新搜索框的值
    changeValue(param) {
      if (!param.value.trim()) {
        this.patientList = []
      } else {
        this.isSearchedValue = ''
      }
      this.searchValue = param.value
    },
    async getPatients() {
      uni.showLoading({
        title: '数据加载中',
        mask: true,
      })

      let {
        data: { total, current, records },
      } = await patientAPI.getPatientList({
        regularParam: this.searchValue,
        current: this.current,
        size: this.size,
        dateType: this.filterParamsObj.time.dateType,
        registerBeginMilliSecond: this.filterParamsObj.time
          .registerBeginMilliSecond,
        registerEndMilliSecond: this.filterParamsObj.time
          .registerEndMilliSecond,
        doctorType: this.filterParamsObj.doctor.doctorType,
        doctorId: this.filterParamsObj.doctor.doctorId,
      })

      this.isSearchedValue = this.searchValue
      uni.hideLoading()

      if (current === 1) {
        this.patientList = records
      } else {
        this.patientList = this.patientList.concat(records)
      }
      this.total = total

      if (total === this.patientList.length) {
        this.dataSourceStatus.status = 'noMore'
      } else {
        this.dataSourceStatus.status = 'more'
      }
    },
    //执行搜索
    searchPatients() {
      if (!this.searchValue.trim()) {
        this.current = 1
        this.getPatients()
        return
      }

      //搜索历史列表数据：最多显示10条
      let searchList = [
        ...new Set([this.searchValue, ...this.searchRecords]),
      ].filter((v, index) => index < 10)

      this.searchRecords = searchList
      uni.setStorageSync('searchPatientHistory', searchList)

      console.log('----搜索后 历史值----', this.searchRecords)

      this.current = 1
      this.getPatients()
    },
    //取消搜索
    cancelSearch() {
      this.searchValue = ''
      this.isSearchedValue = ''
      this.current = 1
      this.patientList = []
      this.getPatients()
    },
    //选择搜索历史中某一个历史
    chooseSearchRecord(searchRecord, index) {
      console.log('----选择时 历史值----', this.searchRecords)
      console.log('--###--', searchRecord)

      this.searchValue = searchRecord

      //更新搜索历史顺序
      this.searchRecords.unshift(...this.searchRecords.splice(index, 1))
      //this.searchRecords.map((a, b) => a)
      uni.setStorageSync('searchPatientHistory', this.searchRecords)

      this.getPatients()
    },
    clearHistorySearch() {
      this.searchRecords = []
      uni.setStorageSync('searchPatientHistory', [])
    },
    // 点击患者卡片
    clickPatientCard({ patientId, patientName }) {
      if (this.paramsObj.type === 'source') {
        uni.$emit('onSourceValueSelected', { patientId, patientName })
        return this.$dpmsUtils.back()
      }
      if (
        this.paramsObj.type === 'createAppt' ||
        this.paramsObj.type === 'editAppt' ||
        this.paramsObj.type === 'createRegister' ||
        this.paramsObj.type === 'editRegister'
      ) {
        uni.$emit(globalEventKeys.selectPatientCardFromSearchPatient, {
          patientId,
          params: this.paramsObj,
        })
        return this.$dpmsUtils.back()
      }
      this.toPatient(patientId)
    },
    toPatient(id) {
      this.$dpmsUtils.push({
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
