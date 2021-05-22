<template>
  <div class="arrearsPatient-wrapper">
    <view class="filter">
      <view class="uni-list-cell">
        <view
          :class="['left', isFilter ? 'right' : '']"
          @click.native="onFilterClick"
        >
          {{ isFilter ? '已按条件筛选' : '筛选' }}
          <view class="iconfont icon-filter"></view>
        </view>
      </view>
    </view>
    <wyb-table
      v-if="contents.length !== 0"
      :headers="headers"
      :contents="contents"
      height="93.5vh"
      :first-line-fixed="true"
      firstColBgColor="#ffffff"
      :dataSourceStatus="dataSourceStatus"
      :bottom-computed-fixed="true"
    />
    <view class="content" v-if="contents.length === 0">
      <empty :disabled="true" img="../../static/empty.png" text="暂无数据" />
    </view>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import moment from 'moment'
import billAPI from 'APIS/bill/bill.api'

export default {
  name: 'arrearsPatient',
  data() {
    return {
      headers: [
        {
          label: '病历号',
          key: 'medicalRecordNo',
        },
        {
          label: '患者姓名',
          key: 'patientName',
        },
        {
          label: '联系电话',
          key: 'phoneNumber',
        },
        {
          label: '备用号码',
          key: 'alternatePhoneNumber',
        },
        {
          label: '性别',
          key: 'gender',
        },
        {
          label: '年龄',
          key: 'age',
        },
        {
          label: '患者所属机构',
          key: 'medicalInstitutionName',
        },
        {
          label: '欠费总额',
          key: 'totalArrears',
        },
        {
          label: '应收金额',
          key: 'totalReceivable',
        },
        {
          label: '已收总额',
          key: 'totalReceived',
        },
      ],
      contents: [],
      total: 0,
      current: 0,
      size: 10,
      isFilter: false,
      dataSourceStatus: 'loading',
    }
  },
  onLoad() {
    this.init()
    uni.$on('emitPage', () => {
      if (this.contents.length < this.total) {
        this.current += 1
        this.loadData()
      }
    })
    uni.$on('finFilter', (type) => {
      if (type === 'empty') this.isFilter = false
      else if (type === 'filter') this.isFilter = true
      this.loadData()
    })
  },
  beforeDestroy() {
    uni.$off('emitPage')
    uni.$off('finFilter')
  },
  computed: {
    ...mapState('finaceReport', ['patientInfo']),
  },
  methods: {
    ...mapMutations('finaceReport', ['clearState']),
    init() {
      this.current = 1
      this.loadData()
    },
    async loadData() {
      uni.showLoading({
        title: '数据加载中',
        mask: true,
      })
      this.dataSourceStatus = 'loading'
      const params = {
        search: this.patientInfo,
      }
      let {
        data: { total, records },
      } = await billAPI.getArrearsList({
        current: this.current,
        size: this.size,
        ...params,
      })

      records = records.map((item) => {
        const utilPriceList = [
          'totalArrears',
          'totalReceivable',
          'totalReceived',
        ]
        utilPriceList.forEach((it) => {
          item[it] = this.$utils.formatPrice(item[it])
        })
        return item
      })
      if (this.current === 1) {
        this.contents = records
      } else {
        this.contents = this.contents.concat(records)
      }
      this.total = total
      if (total === this.contents.length) {
        this.dataSourceStatus = 'noMore'
      } else {
        this.dataSourceStatus = 'more'
      }
      uni.hideLoading()
    },
    onFilterClick() {
      const filter = JSON.stringify(['patientInfo'])
      this.$utils.push({
        url: `/pages/finance-report/filter?filter=${filter}`,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.arrearsPatient-wrapper {
  background: rgba(0, 0, 0, 0.04);
  overflow-y: auto;
  .filter {
    background: #ffffff;
    height: 80rpx;
    display: flex;
    .uni-list-cell {
      width: 100vw;
      .left {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      }
      .right {
        color: #5cbb89;
      }
      .iconfont {
        font-size: 28rpx;
        margin-left: 20rpx;
      }
    }
  }
  .content {
    margin-top: 1.5vh;
    background: #ffffff;
    height: calc(98.5vh - 80rpx);
  }
}
</style>
