<template>
  <view class="todayWork-wrpper" :style="{ paddingBottom: viewPadddingBottm }">
    <view class="todayWork">
      <view class="todayWork-header-wrapper">
        <picker
          @change="bindPickerChange"
          :value="roleIndex"
          :range="roleNames"
        >
          <view class="todayWork-header">
            <text>当前角色：{{ roles[roleIndex].name || '--' }}</text>

            <text class="todayWork-header-txt">
              <text class="iconfont icon-retweet"></text>
              切换角色
            </text>
          </view>
        </picker>
        <dpmsSearch @change="change" @search="search"></dpmsSearch>
      </view>

      <view
        v-if="
          selectedRole.roleTodayWorkRelationList &&
          selectedRole.roleTodayWorkRelationList.length > 0 &&
          dataSource.length > 0
        "
        class="today-work-list"
      >
        <view v-for="item in dataSource" :key="item.roleTodayWorkRelationId">
          <today-work-card :data="item"></today-work-card>
        </view>
        <uni-load-more :status="more" iconSize="20"></uni-load-more>
      </view>
      <view v-else>
        <empty></empty>
      </view>
    </view>
    <view v-if="isShowNewBtn" class="todayWork-wrpper-new">新建挂号</view>
  </view>
</template>

<script>
import moment from 'moment'
import roleApi from '@/APIS/role/role.api'
import diagnosisApi from '@/APIS/diagnosis/diagnosis.api'
import todayWorkCard from './today-work-card.vue'
import empty from '@/components/empty/empty.vue'
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'

export default {
  data() {
    return {
      title: '今日工作',
      roles: [],
      selectedRole: {},
      surplusRoles: [],
      dataSource: [],
      current: 1,
      total: 0,
      more: 'loading',
      roleIndex: 0,
    }
  },

  onLoad() {
    // 小程序请求数据，一般写在健壮的onLoad， 因为onShow会导致返回页面也加载
    uni.startPullDownRefresh()
  },
  onPullDownRefresh() {
    this.init()
  },
  onReachBottom() {
    if (this.dataSource.length < this.total) {
      this.current += 1
      this.loadData()
    }
  },

  methods: {
    useConsolidateData(dataSource) {
      const data = {}
      if (dataSource.length > 0) {
        dataSource.forEach((item) => {
          if (item.todayWorkRoleType) {
            if (data[item.todayWorkRoleType]) {
              if (
                data[item.todayWorkRoleType].roleTodayWorkRelationList &&
                item.roleTodayWorkRelationList
              ) {
                // 合并角色的今日工作列表

                const roleTodayWorkRelationList = [
                  ...data[item.todayWorkRoleType].roleTodayWorkRelationList,
                  ...item.roleTodayWorkRelationList,
                ]

                const distinctRoleTodayWorkRelationList = []

                // 去重，保证角色的今日工作列表的唯一性
                roleTodayWorkRelationList.forEach((item) => {
                  const index = distinctRoleTodayWorkRelationList.findIndex(
                    (record) => {
                      return record.todayWorkRoleType === item.todayWorkRoleType
                    },
                  )

                  if (index === -1) {
                    distinctRoleTodayWorkRelationList.push(item)
                  }
                })

                data.roleTodayWorkRelationList = distinctRoleTodayWorkRelationList
              }
            }

            if (item?.roleTodayWorkRelationList?.length > 0) {
              data[item.todayWorkRoleType] = item
            }
          }
        })
      }
      return Object.values(data)
    },
    // 初始化默认选中项
    initSelectedRole(distinctRoles) {
      if (distinctRoles.length > 0) {
        if (distinctRoles.length === 1) {
          this.selectedRole = distinctRoles[0]
        } else {
          // 当前选中的角色
          let index
          // 前台
          const highLevelIndex = distinctRoles.findIndex(
            (item) => Number(item.todayWorkRoleType) === 1,
          )
          // 咨询师
          const secondLevelIndex = distinctRoles.findIndex(
            (item) => Number(item.todayWorkRoleType) === 3,
          )
          // 医生
          const thirdLevelIndex = distinctRoles.findIndex(
            (item) => Number(item.todayWorkRoleType) === 2,
          )

          if (highLevelIndex > -1) {
            this.selectedRole = distinctRoles[highLevelIndex]

            index = highLevelIndex
          } else if (secondLevelIndex > -1) {
            this.selectedRole = distinctRoles[secondLevelIndex]

            index = secondLevelIndex
          } else {
            this.selectedRole = distinctRoles[thirdLevelIndex]

            index = thirdLevelIndex
          }
        }
        // picker 选中的index
        this.roleIndex = this.roles.findIndex(
          (item) =>
            item.todayWorkRoleType === this.selectedRole.todayWorkRoleType,
        )
      }
    },
    async loadData() {
      if (this.selectedRole.todayWorkRoleType) {
        const urlMap = {
          1: 'getTodayReceptionistList',
          2: 'getTodayDoctorList',
          3: 'getTodayConsultant',
        }
        this.more = 'loading'

        const [listErr, listRes] = await this.$utils.asyncTasks(
          diagnosisApi[urlMap[this.selectedRole.todayWorkRoleType]]({
            beginTime: moment('2020-7-1').startOf('day').valueOf(),
            endTime: moment().endOf('day').valueOf(),
            current: this.current,
          }),
        )

        if (listRes) {
          const { data } = listRes
          const { total, current, records } = data

          this.dataSource = this.dataSource.concat(records)
          this.total = total

          if (this.total === this.dataSource.length) {
            this.more = 'noMore'
          }
        }
      }
    },
    async init() {
      const [err, res] = await this.$utils.asyncTasks(roleApi.getCurrentStaff())
      // 今日工作的角色枚举
      // const TODAY_WORK_ROLE_TYPE_ENUM = this.$utils.getEnums(
      //   'TodayWorkRoleType',
      // )
      // console.log('TODAY_WORK_ROLE_TYPE_ENUM:', TODAY_WORK_ROLE_TYPE_ENUM)

      if (res) {
        const nonDuplicateData = this.useConsolidateData(res.data)
        this.roles = nonDuplicateData
        this.initSelectedRole(nonDuplicateData)
        this.current = 1

        this.loadData()
      }

      uni.stopPullDownRefresh()
    },
    bindPickerChange(e) {
      console.log('picker发送选择改变，携带值为', e.target.value)
      this.roleIndex = e.target.value
      this.selectedRole = this.roles[this.roleIndex]
    },
    cancel() {
      console.log('取消！')
    },
    change() {
      console.log('change！')
    },
    search() {
      console.log('搜索！')
    },
  },
  components: {
    todayWorkCard,
    empty,
    uniLoadMore,
  },
  computed: {
    roleNames() {
      return this.roles.map((item) => item.name)
    },
    viewPadddingBottm() {
      return this.selectedRole.todayWorkRoleType === 1 ? '90rpx' : 0
    },
    isShowNewBtn() {
      return this.selectedRole.todayWorkRoleType === 1
    },
  },
}
</script>

<style lang="scss" scoped>
.todayWork-wrpper {
  background: rgba(0, 0, 0, 0.04);

  .todayWork {
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 32rpx;
      font-size: 28rpx;
      background: #feffff;
      &-txt {
        color: $dpms-color-primary;
      }
    }
  }
  &-new {
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    height: 90rpx;
    line-height: 90rpx;
    text-align: center;
    background-color: $dpms-color-primary;
    color: #fff;
  }
}
</style>
