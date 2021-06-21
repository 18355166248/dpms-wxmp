<template>
  <section>
    <div class="filter-area">
      <div
        class="filter-item"
        :class="{ active: selectTab === 'time' }"
        @click="clickTab('time')"
      >
        <span>{{ selectTimeItem }}：</span>
        <span class="text-over">{{ selectTime || '全部' }}</span>
        <u-icon
          :name="selectTab === 'time' ? 'arrow-up' : 'arrow-down'"
          class="arrow-icon"
        ></u-icon>
      </div>
      <div
        class="filter-item"
        :class="{ active: selectTab === 'doctor' }"
        @click="clickTab('doctor')"
      >
        <span>{{ selectDoctorItem }}：</span>
        <span class="text-over">{{ selectDoctor || '全部' }}</span>
        <u-icon
          :name="selectTab === 'doctor' ? 'arrow-up' : 'arrow-down'"
          class="arrow-icon"
        ></u-icon>
      </div>
    </div>
    <u-tabs
      v-if="showTabs && selectTab === 'time'"
      :list="timeList"
      :current="timeTab"
      :is-scroll="false"
      :bold="false"
      active-color="#5CBB89"
      :bar-width="barWidth"
      :bar-height="barHeight"
      @change="changeTab"
    ></u-tabs>
    <u-tabs
      v-if="showTabs && selectTab === 'doctor'"
      :list="doctorList"
      :current="doctorTab"
      :is-scroll="false"
      :bold="false"
      active-color="#5CBB89"
      :bar-width="barWidth"
      :bar-height="barHeight"
      @change="changeTab"
    ></u-tabs>

    <uni-calendar
      ref="calendar"
      :insert="false"
      :range="true"
      :clearDate="false"
      @confirm="confirmCalendar"
      @close="cancelCalendar"
    />
    <u-select
      v-model="showDoctorItems"
      :list="doctorItems"
      :mask-close-able="false"
      @confirm="confirmSelect"
      @cancel="cancelSelect"
    ></u-select>
  </section>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import institutionAPI from '@/APIS/institution/institution.api.js'

export default {
  name: 'FilterArea',
  props: {
    // 由新增患者处点击进入
    isAddToday: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectTab: '',
      showTabs: false,
      timeList: [
        {
          name: '初诊时间',
          key: 1,
        },
        {
          name: '上次就诊时间',
          key: 2,
        },
        {
          name: '创建时间',
          key: 3,
        },
      ],
      doctorList: [
        {
          name: '初诊医生',
          key: 1,
        },
        {
          name: '上次就诊医生',
          key: 2,
        },
      ],
      selectTimeItem: '初诊时间',
      selectTime: '',
      selectDoctorItem: '初诊医生',
      selectDoctor: '',
      // 初始值设定为'-'，不用高亮
      timeTab: '-',
      doctorTab: '-',
      // 此处barWidth、barHeight直接写在u-tabs的属性上面会不生效
      barWidth: 60,
      barHeight: 4,
      showDoctorItems: false,
      doctorItems: [
        {
          value: 'all',
          label: '全部',
        },
      ],
    }
  },
  computed: {
    ...mapState('workbenchStore', {
      medicalInstitution: (state) => state.medicalInstitution,
    }),
  },
  created() {
    this.getDoctorList()
    uni.$on('chooseCalendarOption', (name) => {
      let beginTime = ''
      let endTime = ''
      switch (name) {
        case 'today':
          beginTime = moment().startOf('day').format('x')
          endTime = moment().endOf('day').format('x')
          this.selectTime = '今天'
          break
        case 'yesterday':
          beginTime = moment().subtract(1, 'day').startOf('day').format('x')
          endTime = moment().subtract(1, 'day').endOf('day').format('x')
          this.selectTime = '昨天'
          break
        case 'thisMonth':
          beginTime = moment().startOf('month').format('x')
          endTime = moment().endOf('month').format('x')
          this.selectTime = '本月'
          break
        case 'lastMonth':
          beginTime = moment().subtract(1, 'month').startOf('month').format('x')
          endTime = moment().subtract(1, 'month').endOf('month').format('x')
          this.selectTime = '上月'
          break
        default:
          break
      }
      this.handleTime(beginTime, endTime)
    })
  },
  onReady() {
    if (this.isAddToday) {
      this.selectTimeItem = '创建时间'
      this.selectTime = '今天'
      this.selectTab = 'time'
      this.showTabs = true
      this.timeTab = 2
    }
  },
  beforeDestroy() {
    uni.$off('chooseCalendarOption')
  },
  methods: {
    // 获取本机构在职医生列表
    async getDoctorList() {
      const res = await institutionAPI.getStaffListByPosition({
        position: 2,
        workStatus: 1,
        medicalInstitutionId: this.medicalInstitution.medicalInstitutionId,
      })
      if (res.data && res.data.length > 0) {
        let data = res.data
        res.data.forEach((val) => {
          this.$set(val, 'value', val.staffId)
          this.$set(val, 'label', val.staffName)
        })
        this.doctorItems = [...this.doctorItems, ...data]
      }
    },
    confirmSelect(e) {
      this.selectDoctor = e[0].label
      // 只有当选择了具体项，才表示tab的name显示到上面去
      if (!isNaN(this.doctorTab)) {
        this.selectDoctorItem = this.doctorList[this.doctorTab].name
      }
      let params = {
        doctorType: 1,
        doctorId: e[0].value,
      }
      params.doctorType = this.doctorList.filter(
        (val) => val.name === this.selectDoctorItem,
      )[0].key
      this.doctorTab = '-'
      this.$emit('getList', params, 'doctor')
    },
    cancelSelect() {
      this.doctorTab = '-'
    },
    changeTab(index) {
      if (this.selectTab === 'time') {
        this.timeTab = index
        this.openCalendar()
      } else if (this.selectTab === 'doctor') {
        this.doctorTab = index
        this.showDoctorItems = true
      }
    },
    clickTab(type) {
      // 1.判断是否显示下面的tabs
      if (type !== this.selectTab) {
        this.showTabs = true
      } else {
        this.showTabs = !this.showTabs
      }

      // 2.判断是否显示active模式
      if (!this.showTabs) {
        this.selectTab = type !== this.selectTab ? type : ''
      } else {
        this.selectTab = type
      }
    },
    confirmCalendar({ range, fulldate }) {
      const { before, after, data } = range
      let beginTime = ''
      let endTime = ''
      // 在未选择时间时，当作选择了全部时间段处理
      if (!before) {
        this.selectTime = ''
      } else {
        this.selectTime = '自定义'
        if (data.length === 0) {
          beginTime = moment(fulldate).startOf('day').format('x')
          endTime = moment(fulldate).endOf('day').format('x')
        } else {
          // 按照大小顺序取
          if (before > after) {
            beginTime = moment(after).startOf('day').format('x')
            endTime = moment(before).endOf('day').format('x')
          } else {
            beginTime = moment(before).startOf('day').format('x')
            endTime = moment(after).endOf('day').format('x')
          }
        }
      }
      this.handleTime(beginTime, endTime)
    },
    cancelCalendar() {
      this.timeTab = '-'
    },
    handleTime(beginTime, endTime) {
      // 只有当选择了具体项，才表示tab的name显示到上面去
      if (!isNaN(this.timeTab)) {
        this.selectTimeItem = this.timeList[this.timeTab].name
      }
      let params = {
        dateType: 1,
        registerBeginMilliSecond: beginTime,
        registerEndMilliSecond: endTime,
      }
      params.dateType = this.timeList.filter(
        (val) => val.name === this.selectTimeItem,
      )[0].key
      this.timeTab = '-'

      this.$emit('getList', params, 'time')
    },
    openCalendar() {
      this.$refs.calendar.open()
    },
  },
}
</script>

<style lang="scss" scoped>
.filter-area {
  background-color: #fff;
  padding: 20rpx 24rpx;
  border-bottom: 1rpx solid #e5e5e5;
  font-size: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .filter-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    flex-shrink: 0;
    color: #4c4c4c;
    .arrow-icon {
      margin-left: 10rpx;
    }
    .text-over {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 118rpx;
    }
  }
  .active {
    color: #5cbb89;
  }
}
</style>
