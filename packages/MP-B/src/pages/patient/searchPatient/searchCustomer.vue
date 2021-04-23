<template>
  <scroll-view class="searchCustomer">
    <div data-layout-align="space-between center">
      <div class="search-input">
        <dpmsSearch
          type="text"
          confirmType="search"
          placeholder="搜索客户"
          v-model="searchValue"
          @change="changeValue"
          @search="searchCustomers"
          @clear="cancelSearch"
        />
      </div>
    </div>

    <!-- 搜索提示、结果文字 -->
    <div
      class="search-tip-text pt-28 pl-24 pr-24"
      v-if="customerList.length === 0 && isSearchedValue"
    >
      没有找到“
      <span class="patient-name">{{ isSearchedValue }}</span>
      ”这个客户
    </div>

    <!-- 搜索列表 -->
    <div v-if="customerList.length !== 0">
      <div v-for="customer in customerList" :key="customer.customerId">
        <div @click="clickPatientCard(customer)" class="card">
          <div class="title">
            <div class="name">
              {{ customer.customerName }}
            </div>
            <tag :text="customer.genderText" :circle="false" type="error"></tag>
          </div>
          <div class="moble">手机号：{{ customer.mobile }}</div>
        </div>
      </div>
      <load-more :status="dataSourceStatus.status" />
    </div>
  </scroll-view>
</template>

<script>
import patientAPI from '@/APIS/patient/patient.api'
import tag from '@/components/tag/tag.vue'
import loadMore from '@/components/load-more/load-more.vue'

export default {
  data() {
    return {
      searchValue: '', //搜索框输入的值
      isSearchedValue: '', //执行搜索的值
      customerList: [], //患者列表
      searchRecords: [], //搜索历史列表
      current: 1, //默认展示 第一页数据
      size: 10, //默认展示 15条数据
      total: 1, //默认 总条目，
      dataSourceStatus: {
        // 数据列表的状态
        loading: true,
        status: 'loading',
        request: 'loading',
      },
      paramsObj: {},
      GENDER_ENUM: this.$utils.getEnums('Gender'),
    }
  },
  components: {
    tag,
  },
  onLoad(option) {
    this.paramsObj = option
    this.searchRecords = uni.getStorageSync('searchPatientHistory') || []
    this.init()
  },
  onReachBottom() {
    if (this.customerList.length < this.total) {
      this.current += 1
      this.getCustomers()
    }
  },
  methods: {
    init() {
      this.current = 1
      this.customerList = []
    },
    //更新搜索框的值
    changeValue(param) {
      if (!param.value.trim()) {
        this.customerList = []
      } else {
        this.isSearchedValue = ''
      }
      this.searchValue = param.value
    },
    async getCustomers() {
      uni.showLoading({
        title: '数据加载中',
        mask: true,
      })

      const {
        data: { total, current, records },
      } = await patientAPI.getCustomerStaffList({
        regularParam: this.searchValue,
        current: this.current,
        size: this.size,
      })

      this.isSearchedValue = this.searchValue
      uni.hideLoading()

      records &&
        records.forEach((element) => {
          element.genderText = this.GENDER_ENUM?.properties[
            element.gender
          ]?.zh_CN
        })

      if (current === 1) {
        this.customerList = records
      } else {
        this.customerList = this.customerList.concat(records)
      }
      this.total = total

      if (total === this.customerList.length) {
        this.dataSourceStatus.status = 'noMore'
      } else {
        this.dataSourceStatus.status = 'more'
      }
    },
    //执行搜索
    searchCustomers() {
      this.current = 1
      this.getCustomers()
    },
    //取消搜索
    cancelSearch() {
      this.searchValue = ''
      this.isSearchedValue = ''
      this.current = 1
      this.getCustomers()
    },
    // 点击患者卡片
    clickPatientCard({ customerId, customerName }) {
      uni.$emit('onSourceValueSelected', {
        patientId: customerId,
        patientName: customerName,
      })
      return this.$utils.back()
    },
  },
}
</script>

<style lang="scss" scoped>
.searchCustomer {
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

  .card {
    background: #feffff;
    border-radius: 8rpx;
    margin: 32rpx;
    height: 160rpx;
    .title {
      padding: 24rpx;
      display: flex;
      padding-bottom: 18rpx;
    }
    .name {
      margin-right: 20rpx;
      font-size: 34rpx;
      font-weight: 500;
    }
    .moble {
      padding-left: 24rpx;
      color: rgba(0, 0, 0, 0.65);
      font-size: 28rpx;
    }
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
    width: 740rpx;
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
    width: 740rpx;
  }
  .create-patient {
    margin-right: 24rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #5cbb89;
  }
}
</style>
