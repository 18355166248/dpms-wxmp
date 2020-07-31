<template>
  <view style="overflow-y: auto;" class="todayWork-wrpper">
    <scroll-view class="todayWork">
      <view class="todayWork-header">
        <text>当前角色：前台</text>
        <text>切换角色</text>
      </view>
      <dpmsSearch @change="change" @search="search"></dpmsSearch>

      <view
        v-if="
          selectedRole.roleTodayWorkRelationList &&
          selectedRole.roleTodayWorkRelationList.length > 0
        "
      >
        <view
          v-for="item in selectedRole.roleTodayWorkRelationList"
          :key="item.roleTodayWorkRelationId"
        >
          <today-work-card></today-work-card>
        </view>
      </view>
      <view v-else>
        空数据
      </view>
    </scroll-view>
  </view>
</template>

<script>
import moment from 'moment'
import roleApi from '@/APIS/role/role.api'
import diagnosisApi from '@/APIS/diagnosis/diagnosis.api'
import todayWorkCard from './today-work-card.vue'

export default {
  data() {
    return {
      title: '今日工作',
      roles: [],
      selectedRole: {},
      surplusRoles: [],
    }
  },

  onLoad() {
    // 小程序请求数据，一般写在健壮的onLoad， 因为onShow会导致返回页面也加载
    this.init()
  },
  onPullDownRefresh() {
    this.init()
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

          distinctRoles.splice(index, 1)

          this.surplusRoles = distinctRoles
          console.log('this.surplusRoles:', this.surplusRoles)
        }
      }
    },
    init() {
      console.log('this.$utils:', this.$utils)

      roleApi
        .getCurrentStaff()
        .then((res) => {
          console.log('res:', res)

          const nonDuplicateData = this.useConsolidateData(res.data)
          this.roles = nonDuplicateData
          this.initSelectedRole(nonDuplicateData)
          // 今日工作的角色枚举
          const TODAY_WORK_ROLE_TYPE_ENUM = this.$utils.getEnums(
            'TodayWorkRoleType',
          )
          console.log('TODAY_WORK_ROLE_TYPE_ENUM:', TODAY_WORK_ROLE_TYPE_ENUM)
          // 请求成功,隐藏加载状态
        })
        .catch((err) => {
          console.log('err:', err)
          // 请求失败,隐藏加载状态
        })
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
  },
  computed: {
    dataSource() {
      const urlMap = {
        1: 'getTodayReceptionistList',
        2: 'getTodayDoctorList',
        3: 'getTodayConsultant',
      }

      console.log('diagnosisApi:', diagnosisApi)
      console.log(
        'urlMap[this.selectedRole.todayWorkRoleType]:',
        urlMap[this.selectedRole.todayWorkRoleType],
      )

      if (this.selectedRole.todayWorkRoleType) {
        diagnosisApi[urlMap[this.selectedRole.todayWorkRoleType]]({
          beginTime: moment().startOf('day').valueOf(),
          endTime: moment().endOf('day').valueOf(),
        })
          .then((res) => {
            console.log('res:', res)
          })
          .catch((err) => {
            console.log('err:', err)
            // 请求失败,隐藏加载状态
          })
          .finally(() => {
            uni.stopPullDownRefresh()
          })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.todayWork-wrpper {
  height: 100%;
  overflow-y: auto;

  .todayWork {
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx 15rpx;
      background: coral;
    }
  }
}
</style>
