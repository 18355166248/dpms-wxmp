<template>
  <view v-if="!currentStaffStatus.loading" class="todayWork-page-view">
    <view v-if="currentStaffStatus.request !== 'error'" class="h100">
      <view
        class="todayWork"
        v-if="
          selectedRole.roleTodayWorkRelationList &&
          selectedRole.roleTodayWorkRelationList.length > 0
        "
      >
        <fixed-filter :scrollTop="scrollTop">
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
            <dpmsSearch
              @change="searchChange"
              @search="emitPullDownRefresh"
              @clear="handleClear"
              type="text"
              v-model="patientSearchKey"
              confirmType="search"
              placeholder="搜索患者"
            ></dpmsSearch>
          </view>
        </fixed-filter>

        <view
          v-if="dataSourceStatus.request === 'success'"
          class="today-work-list"
        >
          <template v-if="dataSource.length > 0">
            <view
              v-for="item in dataSource"
              :key="item.roleTodayWorkRelationId"
            >
              <card
                @card-click="
                  toPage('/pages/patient/patient', {
                    patientId: item.patientDTO.patientId,
                  })
                "
                :cornerMarker="
                  item.acrossInstitutionAppointmentFlag ? '跨' : null
                "
                :name="item.patientDTO.patientName"
                :avatarUrl="item.patientDTO.avatarUrl"
                :gender="item.patientDTO.gender"
                :age="item.patientDTO.age"
                :status="item.registerStatus"
                :infos="[
                  { label: '联系方式', value: item.patientDTO.mobile },
                  {
                    label: '预约时间',
                    value: [
                      item.appointmentBeginTimestamp,
                      item.appointmentEndTimestamp,
                    ],
                  },
                ]"
              >
                <template v-slot:footer-right>
                  <template v-if="curRoleKey === 'DOCTOR'">
                    <button
                      class="button inverted-button"
                      v-if="item.doctorOperated"
                      @click.stop="
                        finishTreatment(
                          {
                            registerId: item.registerId,
                            type: 'REGISTER_TREATED',
                          },
                          'DOCTOR',
                        )
                      "
                    >
                      治疗完成
                    </button>
                    <button
                      class="button inverted-button"
                      v-else
                      @click.stop="
                        treating(
                          {
                            registerId: item.registerId,
                            type: 'REGISTER_TREATING',
                          },
                          'DOCTOR',
                        )
                      "
                    >
                      接诊
                    </button>
                  </template>
                  <template v-else-if="curRoleKey === 'CONSULTANT'">
                    <button
                      class="button"
                      v-if="item.consultedOperated"
                      @click.stop="
                        treating(
                          {
                            registerId: item.registerId,
                            type: 'REGISTER_TREATING',
                          },
                          'CONSULTANT',
                        )
                      "
                    >
                      接诊
                    </button>
                    <button
                      class="button inverted-button"
                      v-else
                      @click.stop="
                        finishTreatment(
                          {
                            registerId: item.registerId,
                            type: 'REGISTER_TREATED',
                          },
                          'CONSULTANT',
                        )
                      "
                    >
                      治疗完成
                    </button>
                  </template>

                  <template v-else>
                    <template v-if="item.registerStatus === 1">
                      <button
                        class="button inverted-button"
                        @click.stop="
                          toPage('/baseSubpackages/apptForm/apptForm', {
                            type: 'editRegister',
                            appointmentId: item.appointmentId,
                          })
                        "
                      >
                        挂号
                      </button>
                      <button
                        class="button"
                        @click.stop="
                          toPage('/baseSubpackages/apptForm/apptForm', {
                            type: 'editAppt',
                            appointmentId: item.appointmentId,
                          })
                        "
                      >
                        编辑
                      </button>
                      <button
                        class="button"
                        @click.stop="
                          toPage('/baseSubpackages/apptForm/cancleAppt', {
                            appointmentId: item.appointmentId,
                          })
                        "
                      >
                        取消
                      </button>
                    </template>
                    <template v-else>
                      <button
                        v-if="item.registerStatus === 2"
                        class="button inverted-button"
                        @click.stop="
                          cancleRegister({
                            registerId: item.registerId,
                            type: 'REGISTER_CANCELED',
                          })
                        "
                      >
                        取消
                      </button>

                      <button
                        class="button inverted-button"
                        v-if="item.doctorOperated"
                        @click.stop="
                          finishTreatment(
                            {
                              registerId: item.registerId,
                              type: 'REGISTER_TREATED',
                            },
                            'DOCTOR',
                          )
                        "
                      >
                        治疗完成
                      </button>

                      <button
                        class="button inverted-button"
                        v-else
                        @click.stop="
                          treating(
                            {
                              registerId: item.registerId,
                              type: 'REGISTER_TREATING',
                            },
                            'DOCTOR',
                          )
                        "
                      >
                        接诊
                      </button>
                    </template>
                  </template>
                </template>
              </card>
            </view>
            <load-more
              :status="dataSourceStatus.status"
              iconSize="20"
            ></load-more>
            <view v-if="isShowNewBtn">
              <fixed-footer :bgColor="primaryColor">
                <button
                  v-if="isShowNewBtn"
                  class="todayWork-new"
                  @click="
                    toPage('/baseSubpackages/apptForm/apptForm', {
                      type: 'createRegister',
                    })
                  "
                >
                  新建挂号
                </button>
              </fixed-footer>
            </view>
          </template>

          <template v-else>
            <empty :disabled="true" text="暂无今日就诊数据"></empty>
          </template>
        </view>

        <view v-else-if="error" class="error-wrapper">
          <request-error @click="emitPullDownRefresh"></request-error>
        </view>
      </view>

      <view v-else class="h100">
        <empty @click="loadCurrentStaff"></empty>
      </view>
    </view>

    <view v-else class="error-wrapper">
      <request-error @click="loadCurrentStaff"></request-error>
    </view>
  </view>
</template>

<script>
import moment from 'moment'
import roleApi from '@/APIS/role/role.api'
import diagnosisApi from '@/APIS/diagnosis/diagnosis.api'
import card from '@/components/card/card.vue'
import empty from '@/components/empty/empty.vue'
import loadMore from '@/components/load-more/load-more.vue'
import requestError from '@/components/request-error/request-error.vue'
import fixedFilter from '@/components/fixed-filter/fixed-filter.vue'
import qs from 'qs'
import fixedFooter from '@/components/fixed-footer/fixed-footer.vue'
import { globalEventKeys } from '@/config/global.eventKeys.js'

export default {
  data() {
    return {
      title: '今日工作',
      roles: [],
      selectedRole: {},
      surplusRoles: [],
      dataSource: [],
      patientSearchKey: '',
      // 角色列表的状态
      currentStaffStatus: {
        loading: true,
        request: 'loading',
      },
      // 数据列表的状态
      dataSourceStatus: {
        loading: true,
        status: 'loading',
        request: 'loading',
      },

      scrollTop: 0,

      current: 1,
      total: 0,

      roleIndex: 0,
      primaryColor: this.$commonCss.commonColor,
      REGISTER_ENUM: this.$utils.getEnums('Register'),
      TODAY_WORK_ROLE_TYPE_ENUM: this.$utils.getEnums('TodayWorkRoleType'),
      APPOINTMENT_STATUS_ENUM: this.$utils.getEnums('AppointmentStatus'),
    }
  },
  onLoad() {
    console.log('APPOINTMENT_STATUS_ENUM:', this.APPOINTMENT_STATUS_ENUM)
    console.log('REGISTER_ENUM:', this.REGISTER_ENUM)
    // 小程序请求数据，一般写在健壮的onLoad， 因为onShow会导致返回页面也加载
    this.loadCurrentStaff()

    uni.$on(globalEventKeys.apptFormWithSaveSuccess, (apptData) => {
      console.log('apptData:', apptData)

      this.updateAppt(apptData)
    })
    // 监听事件
    uni.$on(globalEventKeys.cancleApptSuccess, (val) => {
      const rowIndex = this.dataSource.findIndex(
        (item) => item.appointmentId === val.appointmentId,
      )
      this.dataSource.splice(rowIndex, 1)
    })
  },
  onUnload() {
    uni.$off(globalEventKeys.cancleApptSuccess)
    uni.$off(globalEventKeys.apptFormWithSaveSuccess)
  },
  onPullDownRefresh() {
    this.current = 1
    this.loadData()
  },
  onReachBottom() {
    if (this.dataSource.length < this.total) {
      this.current += 1
      this.loadData()
    }
  },
  onPageScroll({ scrollTop }) {
    this.scrollTop = scrollTop
  },

  methods: {
    // 治疗完成
    finishTreatment(record, role) {
      this.changeStatus(record, role)
    },
    // 接诊
    treating(record, role) {
      this.changeStatus(record, role)
    },
    // 取消挂号
    cancleRegister(record) {
      uni.showActionSheet({
        itemList: ['确定'],
        success: (res) => {
          const status = this.REGISTER_ENUM.REGISTER_CANCELED.value

          this.changeStatus(record)
        },
        fail: function (res) {
          console.log(res.errMsg)
        },
      })
    },
    // 清空搜索
    handleClear() {
      this.patientSearchKey = ''
      this.emitPullDownRefresh()
    },
    // 搜索输入框改变
    searchChange(val) {
      this.patientSearchKey = val.value
    },
    // 页面跳转
    toPage(url, params) {
      console.log('params:', params)
      this.$utils.push({
        url: `${url}?${qs.stringify(params, {
          arrayFormat: 'comma', // a: [1, 2] => a=1,2
        })}`,
      })
    },
    // 触发下拉事件
    emitPullDownRefresh() {
      uni.startPullDownRefresh()
    },
    // 去重、合并角色数组
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
            (item) =>
              Number(item.todayWorkRoleType) ===
              this.TODAY_WORK_ROLE_TYPE_ENUM?.RECEPTIONIST?.value,
          )
          // 咨询师
          const secondLevelIndex = distinctRoles.findIndex(
            (item) =>
              Number(item.todayWorkRoleType) ===
              this.TODAY_WORK_ROLE_TYPE_ENUM?.CONSULTANT?.value,
          )
          // 医生
          const thirdLevelIndex = distinctRoles.findIndex(
            (item) =>
              Number(item.todayWorkRoleType) ===
              this.TODAY_WORK_ROLE_TYPE_ENUM?.DOCTOR?.value,
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
    /**
     * 就诊状态枚举值
     * REGISTER_APPOINTED(1, "已预约", "Appointed"),
     * REGISTER_REGISTERED(2, "已挂号", "Registered"),
     * REGISTER_CONSULTING(3, "咨询中", "Consulting"),
     * REGISTER_TREATING(4, "治疗中", "Treating"),
     * REGISTER_TREATED(5, "治疗完成", "Treated");
     * */

    /**
     *
     * 前台角色：可能有新建挂号、预约转挂号、编辑预约、取消预约、取消挂号，除此外如果挂号状态：2， 前台同时还包含了医生的角色权限，并且判断逻辑也一致。如：doctorOperated
     *
     * 医生与咨询角色平行的，都可以有接诊按钮。解释：如果医生操作接诊，咨询还是可以操作接诊。治疗完成也是同样逻辑
     *
     * 医生角色：可能有接诊、治疗完成。根据doctorOperated判断，如果doctorOperated: false，为接诊。如果doctorOperated: true，始终显示治疗完成
     * 咨询角色：可能有接诊、治疗完成。根据consultedOperated判断，如果consultedOperated: false，为接诊。如果consultedOperated: true，始终显示治疗完成
     *
     */
    updateAppt(apptData) {
      // editRegister
      // editAppt
      // createRegister

      const { appt, params } = apptData
      const { type } = params
      const rowIndex = this.dataSource.findIndex(
        (item) => item.appointmentId === Number(params.appointmentId),
      )

      if (rowIndex !== -1) {
        const { consultedOperated, doctorOperated } = this.dataSource[rowIndex]

        const {
          patient,
          patientId,
          appointmentBeginTimeStamp,
          appointmentEndTimeStamp,
          appointmentId,
        } = appt

        const { type } = params

        const newRowData = {
          appointmentBeginTimestamp: appointmentBeginTimeStamp,
          appointmentEndTimestamp: appointmentEndTimeStamp,
          appointmentId,
          consultedOperated,
          doctorOperated,
          patientId,
          patientDTO: patient,
        }

        if (type === 'editRegister') {
          newRowData.registerId = appt.registerId
          newRowData.registerStatus = this.REGISTER_ENUM.REGISTER_REGISTERED.value
        }

        if (type === 'editAppt') {
          newRowData.registerStatus = this.dataSource[rowIndex].registerStatus
        }

        this.$set(this.dataSource, rowIndex, newRowData)
      } else {
        if (type === 'createRegister') {
          const newRowData = {
            ...appt,
            appointmentBeginTimestamp: appt.appointmentBeginTimeStamp,
            appointmentEndTimestamp: appt.appointmentEndTimeStamp,
            registerStatus: this.REGISTER_ENUM.REGISTER_REGISTERED.value,
            patientDTO: appt.patient,
            doctorOperated: false,
            consultedOperated: false,
          }
          this.dataSource = [newRowData, ...this.dataSource]
          console.log('this.dataSource:', this.dataSource)
        }
      }
    },

    // 更新数据的挂号状态
    updateDataForRegisterStatus(registerId, registerStatus, type, role) {
      const rowIndex = this.dataSource.findIndex(
        (item) => item.registerId === registerId,
      )

      if (type === 'REGISTER_CANCELED') {
        this.dataSource.splice(rowIndex, 1)
      } else {
        const newRegisterStatus =
          registerStatus < this.dataSource[rowIndex].registerStatus
            ? this.dataSource[rowIndex].registerStatus
            : registerStatus

        const newRowData = {
          ...this.dataSource[rowIndex],
          registerStatus: newRegisterStatus,
        }

        if (role === 'DOCTOR') {
          newRowData.doctorOperated = true
        }
        if (role === 'CONSULTANT') {
          newRowData.consultedOperated = true
        }

        this.$set(this.dataSource, rowIndex, newRowData)
      }

      console.log('this.dataSource:', this.dataSource)
    },
    async changeStatus(record, role) {
      const status = this.REGISTER_ENUM[record.type].value

      uni.showLoading({
        title: '正在提交...',
        mask: true,
      })
      const tips = {
        REGISTER_CANCELED: '取消成功',
        REGISTER_TREATING: '接诊成功',
        REGISTER_TREATED: '治疗完成',
      }
      const [err, res] = await this.$utils.asyncTasks(
        diagnosisApi.updateRegisterStatus({
          registerId: record.registerId,
          status,
        }),
      )

      uni.hideLoading()

      if (res) {
        uni.showToast({
          icon: 'success',
          title: tips[record.type],
        })
        this.updateDataForRegisterStatus(
          record.registerId,
          status,
          record.type,
          role,
        )
      }
    },
    // 获取列表数据
    async loadData() {
      if (this.selectedRole.todayWorkRoleType) {
        this.dataSourceStatus.loading = true
        this.dataSourceStatus.status = 'loading'

        const urlMap = {
          [this.TODAY_WORK_ROLE_TYPE_ENUM?.RECEPTIONIST
            ?.value]: 'getTodayReceptionistList',
          [this.TODAY_WORK_ROLE_TYPE_ENUM?.DOCTOR?.value]: 'getTodayDoctorList',
          [this.TODAY_WORK_ROLE_TYPE_ENUM?.CONSULTANT
            ?.value]: 'getTodayConsultant',
        }

        const [listErr, listRes] = await this.$utils.asyncTasks(
          diagnosisApi[urlMap[this.selectedRole.todayWorkRoleType]]({
            beginTime: moment().startOf('day').valueOf(),
            endTime: moment().endOf('day').valueOf(),
            current: this.current,
            patientSearchKey: this.patientSearchKey,
          }),
        )

        if (listErr) {
          this.dataSourceStatus.request = 'error'
          this.dataSourceStatus.status = 'more'
        } else if (listRes) {
          this.dataSourceStatus.request = 'success'
          const { data } = listRes
          const { total, current, records } = data

          this.dataSource =
            current === 1 ? records : this.dataSource.concat(records)

          this.total = total

          if (this.total === this.dataSource.length) {
            this.dataSourceStatus.status = 'noMore'
          }
        }
        this.dataSourceStatus.loading = false
      }
      uni.stopPullDownRefresh()
    },
    // 获取角色列表
    async loadCurrentStaff() {
      // 今日工作的角色枚举

      this.currentStaffStatus.loading = true
      uni.showNavigationBarLoading()

      const [err, res] = await this.$utils.asyncTasks(roleApi.getCurrentStaff())

      if (err) {
        this.currentStaffStatus.request = 'error'
      } else if (res) {
        const nonDuplicateData = this.useConsolidateData(res.data)

        this.roles = nonDuplicateData

        this.initSelectedRole(nonDuplicateData)
        this.current = 1

        this.currentStaffStatus.request = 'success'
        uni.startPullDownRefresh()
      }
      this.currentStaffStatus.loading = false
      uni.hideNavigationBarLoading()
    },
    // 角色切换
    bindPickerChange(e) {
      this.roleIndex = e.target.value
      this.selectedRole = this.roles[this.roleIndex]
      this.emitPullDownRefresh()
    },
  },
  components: {
    card,
    empty,
    loadMore,
    requestError,
    fixedFilter,
    fixedFooter,
  },
  computed: {
    curRoleKey() {
      if (
        this.TODAY_WORK_ROLE_TYPE_ENUM?.properties &&
        this.selectedRole.todayWorkRoleType
      ) {
        return this.TODAY_WORK_ROLE_TYPE_ENUM?.properties[
          this.selectedRole.todayWorkRoleType
        ].key
      }
      return null
    },
    roleNames() {
      return this.roles.map((item) => item.name)
    },

    isShowNewBtn() {
      return (
        this.selectedRole.todayWorkRoleType ===
        this.TODAY_WORK_ROLE_TYPE_ENUM?.RECEPTIONIST?.value
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.todayWork-page-view {
  height: 100%;

  .error-wrapper {
    height: 100%;
  }
  .todayWork-header-wrapper {
    width: 100%;
  }

  .fixed {
    position: fixed;
    left: 0;
    top: 0;
  }

  .todayWork {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    background: rgba(0, 0, 0, 0.04);

    .button {
      display: inline-block;
      margin-left: 16rpx;
      padding: 0 32rpx;
      height: 56rpx;
      line-height: 56rpx;

      border-radius: 28rpx;

      font-size: 28rpx;

      color: $dpms-color-primary;
      border: 2rpx solid $dpms-color-primary;
      &::after {
        border: none;
      }
    }
    .inverted-button {
      background: $dpms-color-primary;
      color: #fff;
    }

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
    &-new {
      width: 100%;
      height: 90rpx;
      line-height: 90rpx;
      text-align: center;
      background-color: $dpms-color-primary;
      color: #fff;
      &::after {
        border: none;
      }
    }
  }
}
</style>
