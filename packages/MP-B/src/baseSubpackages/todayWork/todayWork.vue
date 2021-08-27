<template>
  <view class="todayWork-page-view">
    <view class="h100">
      <view class="todayWork" v-if="roles && roles.length > 0">
        <fixed-filter :scrollTop="scrollTop">
          <view class="todayWork-header-wrapper">
            <picker
              @change="bindPickerChange"
              :value="roleIndex"
              :range="roleNames"
            >
              <view class="todayWork-header">
                <text class="fz-34"
                  >当前角色：{{ roles[roleIndex].displayName || '--' }}</text
                >
                <text class="todayWork-header-txt">
                  <text class="iconfont icon-retweet"></text>
                  切换角色
                </text>
              </view>
            </picker>
            <view class="pv-12">
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
          </view>
        </fixed-filter>
        <view
          v-if="dataSourceStatus.request === 'success'"
          class="today-work-list"
        >
          <template v-if="dataSource.length > 0">
            <view v-for="item in dataSource" :key="item.appointmentId">
              <card
                @card-click="
                  toPage('/pages/patient/patient', {
                    patientId: item.patientDTO.patientId,
                  })
                "
                :cornerMarker="item.acrossInstitutionAppointmentFlag"
                :marginConfig="{ position: ['left', 'right', 'bottom'] }"
                :name="item.patientDTO.patientName"
                :avatarUrl="item.patientDTO.avatarUrl"
                :gender="item.patientDTO.gender"
                :medicalRecordNo="item.patientDTO.medicalRecordNo"
                :status="item.registerStatus"
                :infos="[
                  { label: '联系电话', value: item.patientDTO.mobile },
                  {
                    label: '预约时间',
                    value: [
                      item.appointmentBeginTimestamp,
                      item.appointmentEndTimestamp,
                    ],
                  },
                ]"
                :patient="item.patientDTO"
              >
                <template v-slot:footer-right>
                  <template v-if="curRoleKey === 'DOCTOR'">
                    <view class="flex doctorConsulantList">
                      <view
                        class="button"
                        @click.stop=""
                        v-if="
                          item.registerStatus !==
                            REGISTER_ENUM.REGISTER_LEAVE.value &&
                          statusTextArray[item.appointmentId].length > 0
                        "
                      >
                        <picker
                          @change="consultationChange"
                          :value="statusTextValue[item.appointmentId]"
                          :range="statusTextArray[item.appointmentId]"
                          range-key="text"
                          :id="item.appointmentId"
                        >
                          <view class="flex"
                            >{{
                              statusTextArray[item.appointmentId][
                                statusTextValue[item.appointmentId]
                              ].text
                            }}
                            <view class="iconfont icon-arrow-down"></view>
                          </view>
                        </picker>
                      </view>
                      <button
                        :disabled="disabled"
                        class="button inverted-button"
                        @click.stop="
                          toPage('/baseSubpackages/apptForm/apptForm', {
                            type: 'editRegister',
                            appointmentId: item.appointmentId,
                          })
                        "
                        v-if="canRegistration(item)"
                      >
                        挂号
                      </button>
                      <button
                        class="button inverted-button"
                        @click.stop="
                          consultationAction(
                            {
                              registerId: item.registerId,
                              registerStatus: item.registerStatus,
                              appointmentId: item.appointmentId,
                            },
                            REGISTER_ENUM.REGISTER_REGISTERED.value,
                          )
                        "
                        v-if="canReception(item)"
                      >
                        接诊
                      </button>
                      <button
                        class="button inverted-button"
                        @click.stop="
                          consultationAction(
                            {
                              registerId: item.registerId,
                              registerStatus: item.registerStatus,
                              appointmentId: item.appointmentId,
                            },
                            REGISTER_ENUM.REGISTER_CONSULTING.value,
                          )
                        "
                        v-if="canFinish(item)"
                      >
                        治疗完成
                      </button>
                      <button
                        class="button inverted-button"
                        @click.stop="
                          consultationAction(
                            {
                              registerId: item.registerId,
                              registerStatus: item.registerStatus,
                              appointmentId: item.appointmentId,
                            },
                            REGISTER_ENUM.REGISTER_TREATING.value,
                          )
                        "
                        v-if="canLeave(item)"
                      >
                        已离开
                      </button>
                      <button
                        :disabled="disabled || item.medicareRegister"
                        class="button inverted-button"
                        @click.stop="
                          consultationAction(
                            {
                              registerId: item.registerId,
                              registerStatus: item.registerStatus,
                              appointmentId: item.appointmentId,
                            },
                            REGISTER_ENUM.REGISTER_TREATED.value,
                          )
                        "
                        v-if="canUndo(item)"
                      >
                        回退
                      </button>
                    </view>
                  </template>
                  <template v-else-if="curRoleKey === 'CONSULTANT'">
                    <view class="flex doctorConsulantList">
                      <view
                        class="button"
                        @click.stop=""
                        v-if="
                          item.registerStatus !==
                            REGISTER_ENUM.REGISTER_LEAVE.value &&
                          statusTextArray[item.appointmentId].length > 0
                        "
                      >
                        <picker
                          @change="consultationChange"
                          :value="statusTextValue[item.appointmentId]"
                          :range="statusTextArray[item.appointmentId]"
                          range-key="text"
                          :id="item.appointmentId"
                        >
                          <view class="flex"
                            >{{
                              statusTextArray[item.appointmentId][
                                statusTextValue[item.appointmentId]
                              ].text
                            }}
                            <view class="iconfont icon-arrow-down"></view>
                          </view>
                        </picker>
                      </view>
                      <button
                        :disabled="disabled"
                        class="button inverted-button"
                        @click.stop="
                          consultationAction(
                            {
                              registerId: item.registerId,
                              registerStatus: item.registerStatus,
                              appointmentId: item.appointmentId,
                            },
                            REGISTER_ENUM.REGISTER_REGISTERED.value,
                          )
                        "
                        v-if="canConsulting(item)"
                      >
                        开始咨询
                      </button>
                      <button
                        :disabled="disabled"
                        class="button inverted-button"
                        @click.stop="
                          consultationAction(
                            {
                              registerId: item.registerId,
                              registerStatus: item.registerStatus,
                              appointmentId: item.appointmentId,
                            },
                            REGISTER_ENUM.REGISTER_CONSULTING.value,
                          )
                        "
                        v-if="canConsultTreatment(item)"
                      >
                        接诊
                      </button>
                      <button
                        :disabled="disabled"
                        class="button inverted-button"
                        @click.stop="
                          consultationAction(
                            {
                              registerId: item.registerId,
                              registerStatus: item.registerStatus,
                              appointmentId: item.appointmentId,
                            },
                            REGISTER_ENUM.REGISTER_TREATING.value,
                          )
                        "
                        v-if="canConsultFinish(item)"
                      >
                        治疗完成
                      </button>
                      <button
                        :disabled="disabled"
                        class="button inverted-button"
                        @click.stop="
                          consultationAction(
                            {
                              registerId: item.registerId,
                              registerStatus: item.registerStatus,
                              appointmentId: item.appointmentId,
                            },
                            REGISTER_ENUM.REGISTER_TREATED.value,
                          )
                        "
                        v-if="canLeave(item)"
                      >
                        已离开
                      </button>
                      <button
                        :disabled="disabled || item.medicareRegister"
                        class="button inverted-button"
                        @click.stop="
                          consultationAction(
                            {
                              registerId: item.registerId,
                              registerStatus: item.registerStatus,
                              appointmentId: item.appointmentId,
                            },
                            REGISTER_ENUM.REGISTER_LEAVE.value,
                          )
                        "
                        v-if="canUndo(item)"
                      >
                        回退
                      </button>
                    </view>
                  </template>
                  <template v-else>
                    <view
                      class="receptionist"
                      v-if="showRecepitionButton(item)"
                    >
                      <view class="flex">
                        <button
                          :disabled="disabled"
                          class="button"
                          @click.stop="
                            toPage('/baseSubpackages/apptForm/cancleAppt', {
                              appointmentId: item.appointmentId,
                            })
                          "
                          v-if="showCancelAppointment(item)"
                        >
                          取消
                        </button>
                        <button
                          :disabled="disabled"
                          class="button"
                          @click.stop="cancelRegister(item)"
                          v-if="showCancelRegister(item)"
                        >
                          取消
                        </button>
                      </view>
                      <view class="flex">
                        <button
                          :disabled="disabled"
                          class="button"
                          @click.stop="
                            toPage('/baseSubpackages/apptForm/apptForm', {
                              type: 'editAppt',
                              appointmentId: item.appointmentId,
                            })
                          "
                          v-if="showEdit(item)"
                        >
                          编辑
                        </button>
                        <view
                          class="button"
                          @click.stop=""
                          v-if="
                            item.registerStatus !==
                              REGISTER_ENUM.REGISTER_LEAVE.value &&
                            statusTextArray[item.appointmentId].length > 0
                          "
                        >
                          <picker
                            @change="consultationChange"
                            :value="statusTextValue[item.appointmentId]"
                            :range="statusTextArray[item.appointmentId]"
                            range-key="text"
                            :id="item.appointmentId"
                          >
                            <view class="flex"
                              >{{
                                statusTextArray[item.appointmentId][
                                  statusTextValue[item.appointmentId]
                                ].text
                              }}
                              <view class="iconfont icon-arrow-down"></view>
                            </view>
                          </picker>
                        </view>
                        <button
                          :disabled="disabled"
                          class="button inverted-button"
                          @click.stop="
                            toPage('/baseSubpackages/apptForm/apptForm', {
                              type: 'editRegister',
                              appointmentId: item.appointmentId,
                            })
                          "
                          v-if="canRegistration(item)"
                        >
                          挂号
                        </button>
                        <button
                          :disabled="disabled"
                          class="button inverted-button"
                          @click.stop="
                            consultationAction(
                              {
                                registerId: item.registerId,
                                registerStatus: item.registerStatus,
                                appointmentId: item.appointmentId,
                              },
                              REGISTER_ENUM.REGISTER_REGISTERED.value,
                            )
                          "
                          v-if="canReception(item)"
                        >
                          接诊
                        </button>
                        <button
                          :disabled="disabled"
                          class="button inverted-button"
                          @click.stop="
                            consultationAction(
                              {
                                registerId: item.registerId,
                                registerStatus: item.registerStatus,
                                appointmentId: item.appointmentId,
                              },
                              REGISTER_ENUM.REGISTER_CONSULTING.value,
                            )
                          "
                          v-if="canFinish(item)"
                        >
                          治疗完成
                        </button>
                        <button
                          :disabled="disabled"
                          class="button inverted-button"
                          @click.stop="
                            consultationAction(
                              {
                                registerId: item.registerId,
                                registerStatus: item.registerStatus,
                                appointmentId: item.appointmentId,
                              },
                              REGISTER_ENUM.REGISTER_TREATING.value,
                            )
                          "
                          v-if="canLeave(item)"
                        >
                          已离开
                        </button>
                        <button
                          :disabled="disabled || item.medicareRegister"
                          class="button inverted-button"
                          @click.stop="
                            consultationAction(
                              {
                                registerId: item.registerId,
                                registerStatus: item.registerStatus,
                                appointmentId: item.appointmentId,
                              },
                              REGISTER_ENUM.REGISTER_TREATED.value,
                            )
                          "
                          v-if="canUndo(item)"
                        >
                          回退
                        </button>
                      </view>
                    </view>
                  </template>
                </template>
              </card>
            </view>
            <load-more
              :status="dataSourceStatus.status"
              iconSize="20"
            ></load-more>
          </template>
          <template v-else>
            <empty :disabled="true" text="暂无今日就诊数据"></empty>
          </template>
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
        </view>
        <view
          v-else-if="dataSourceStatus.request === 'error'"
          class="error-wrapper"
        >
          <request-error @click="emitPullDownRefresh"></request-error>
        </view>
      </view>
      <view v-else class="h100">
        <empty :disabled="true"></empty>
      </view>
    </view>
  </view>
</template>

<script>
import moment from 'moment'
import diagnosisApi from '@/APIS/diagnosis/diagnosis.api'
import appointmentAPI from 'APIS/appointment/appointment.api'
import card from '@/components/card/card.vue'
import empty from '@/components/empty/empty.vue'
import loadMore from '@/components/load-more/load-more.vue'
import requestError from '@/components/request-error/request-error.vue'
import fixedFilter from '@/components/fixed-filter/fixed-filter.vue'
import qs from 'qs'
import fixedFooter from '@/components/fixed-footer/fixed-footer.vue'
import { globalEventKeys } from '@/config/global.eventKeys.js'
import { mapState } from 'vuex'

/**
 * 重大重构：调整了员工的权限
 * 由于3.4.9调整了权限控制，所有的角色权限通过统一的menu-all接口获取。
 *
 **/
export default {
  data() {
    return {
      title: '今日就诊',
      roles: [],
      selectedRole: {},
      surplusRoles: [],
      dataSource: [],
      patientSearchKey: '',
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
      enumValue: ['switch-consultant', 'switch-receptionist', 'switch-doctor'], // 用于筛选当前角色可以请求
      enumMap: {
        'switch-consultant': 'CONSULTANT',
        'switch-receptionist': 'RECEPTIONIST',
        'switch-doctor': 'DOCTOR',
      }, // 菜单权限与枚举映射关系
      REGISTER_ENUM: this.$dpmsUtils.getEnums('Register'),
      TODAY_WORK_ROLE_TYPE_ENUM: this.$dpmsUtils.getEnums('TodayWorkRoleType'),
      APPOINTMENT_STATUS_ENUM: this.$dpmsUtils.getEnums('AppointmentStatus'),
      isWeakflow: 0,
      statusTextValue: {},
      statusTextArray: {},
      disabled: false,
    }
  },
  onLoad() {
    // 小程序请求数据，一般写在健壮的onLoad， 因为onShow会导致返回页面也加载
    this.loadCurrentStaff()

    uni.$on(globalEventKeys.apptFormWithSaveSuccess, (apptData) => {
      this.updateAppt(apptData)
    })

    // 监听事件
    uni.$on(globalEventKeys.cancleApptSuccess, (val) => {
      const rowIndex = this.dataSource.findIndex(
        (item) => item.appointmentId === val.appointmentId,
      )
      this.dataSource.splice(rowIndex, 1)
    })
    //获得强弱流程
    this.getWeakFlow()
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
    async getWeakFlow() {
      const res = await diagnosisApi.getWeakFlow()
      this.isWeakflow = res.data?.isWeakflow
    },
    // 取消挂号
    cancelRegister(record) {
      uni.showModal({
        title: '提示',
        content: '即将执行取消挂号操作，取消后将无法恢复，是否继续操作？',
        success: (res) => {
          if (res.confirm) {
            diagnosisApi
              .updateRegisterStatus({
                registerId: record.registerId,
                status: this.REGISTER_ENUM.REGISTER_CANCELED.value,
              })
              .then(() => {
                this.$dpmsUtils.show('取消成功', { icon: 'success' })
                this.emitPullDownRefresh()
              })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
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
      this.$dpmsUtils.push({
        url: `${url}?${qs.stringify(params, {
          arrayFormat: 'comma', // a: [1, 2] => a=1,2
        })}`,
      })
    },
    // 触发下拉事件
    emitPullDownRefresh() {
      uni.startPullDownRefresh()
    },
    // 初始化默认选中项
    initSelectedRole(distinctRoles) {
      if (distinctRoles.length > 0) {
        this.selectedRole = distinctRoles[0]
        // picker 选中的index
        this.roleIndex = this.roles.findIndex(
          (item) => item.enumValue === this.selectedRole.enumValue,
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
     * 前台角色：可能有新建挂号、预约转挂号、编辑预约、取消预约、取消挂号，除此外如果挂号状态：2， 前台同时还包含了医生的角色权限，并且判断逻辑也一致。如：doctorOperated
     * 医生与咨询角色平行的，都可以有接诊按钮。解释：如果医生操作接诊，咨询还是可以操作接诊。治疗完成也是同样逻辑
     * 医生角色：可能有接诊、治疗完成。根据doctorOperated判断，如果doctorOperated: false，为接诊。如果doctorOperated: true，始终显示治疗完成
     * 咨询角色：可能有接诊、治疗完成。根据consultedOperated判断，如果consultedOperated: false，为接诊。如果consultedOperated: true，始终显示治疗完成
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
            registerStatus: this.REGISTER_ENUM.REGISTER_REGISTERED.value,
            patientDTO: appt.patient,
            doctorOperated: false,
            consultedOperated: false,
          }
          delete newRowData.appointmentBeginTimeStamp
          delete newRowData.appointmentEndTimeStamp

          //状态设置
          this.enumStatus([newRowData])

          this.dataSource = [newRowData, ...this.dataSource]
        }
      }
    },
    // 获取列表数据
    async loadData() {
      //没有权限的情况下，防止页面报错卡死
      if (!this.selectedRole?.enumValue) {
        return uni.stopPullDownRefresh()
      }
      if (this.selectedRole) {
        this.dataSourceStatus.loading = true
        this.dataSourceStatus.status = 'loading'

        const urlMap = {
          'switch-receptionist': 'getTodayReceptionistList',
          'switch-doctor': 'getTodayDoctorList',
          'switch-consultant': 'getTodayConsultant',
        }

        uni.showLoading({
          title: '数据加载中',
          mask: true,
        })

        const [listErr, listRes] = await this.$dpmsUtils.asyncTasks(
          diagnosisApi[urlMap[this.selectedRole.enumValue]]({
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

          //根据不同的角色，枚举不同状态
          this.enumStatus(records)

          this.dataSource =
            current === 1 ? records : this.dataSource.concat(records)

          this.total = total

          if (this.total === this.dataSource.length) {
            this.dataSourceStatus.status = 'noMore'
          }
        }
        uni.hideLoading()
        this.dataSourceStatus.loading = false
      }
      uni.stopPullDownRefresh()
    },
    enumStatus(records) {
      const {
        curRoleKey,
        REGISTER_ENUM,
        isWeakflow,
        statusTextArray,
        statusTextValue,
      } = this
      switch (curRoleKey) {
        case 'RECEPTIONIST':
        case 'DOCTOR':
          records &&
            records.forEach((v) => {
              switch (v.registerStatus) {
                //就诊状态为已预约、已确认、迟到xx分钟时
                //强流程：默认按钮为挂号，下拉按钮为：已离开
                //弱流程：默认按钮为挂号，下拉按钮为：挂号、接诊、治疗完成、已离开
                case REGISTER_ENUM.REGISTER_CONFIRM?.value:
                case REGISTER_ENUM.REGISTER_APPOINTED?.value:
                  if (isWeakflow === 1) {
                    statusTextArray[v.appointmentId] = [
                      // {
                      //   status: REGISTER_ENUM.REGISTER_APPOINTED?.value,
                      //   text: '挂号',
                      // },
                      {
                        status: REGISTER_ENUM.REGISTER_REGISTERED?.value,
                        text: '接诊',
                      },
                      {
                        status: REGISTER_ENUM.REGISTER_CONSULTING?.value,
                        text: '治疗完成',
                      },
                      {
                        status: REGISTER_ENUM.REGISTER_TREATING?.value,
                        text: '已离开',
                      },
                    ]
                  } else {
                    statusTextArray[v.appointmentId] = [
                      {
                        status: REGISTER_ENUM.REGISTER_TREATING?.value,
                        text: '已离开',
                      },
                    ]
                  }
                  statusTextValue[v.appointmentId] = 0
                  break
                //就诊状态为已挂号
                //强流程：默认按钮为接诊，下拉按钮为：已离开、回退
                //弱流程：默认按钮为接诊，下拉按钮为：治疗完成、已离开、回退
                case REGISTER_ENUM.REGISTER_REGISTERED?.value:
                  if (isWeakflow === 1) {
                    statusTextArray[v.appointmentId] = [
                      {
                        status: REGISTER_ENUM.REGISTER_CONSULTING?.value,
                        text: '治疗完成',
                      },
                      {
                        status: REGISTER_ENUM.REGISTER_TREATING?.value,
                        text: '已离开',
                      },
                    ]
                  } else {
                    statusTextArray[v.appointmentId] = [
                      {
                        status: REGISTER_ENUM.REGISTER_TREATING?.value,
                        text: '已离开',
                      },
                    ]
                  }
                  if (!v.medicareRegister) {
                    statusTextArray[v.appointmentId].push({
                      status: REGISTER_ENUM.REGISTER_TREATED?.value,
                      text: '回退',
                    })
                  }
                  statusTextValue[v.appointmentId] = 0
                  break
                //就诊状态为咨询中
                //强流程：默认按钮为治疗完成，下拉按钮为：已离开、回退
                //弱流程：默认按钮为治疗完成，下拉按钮为：接诊、治疗完成、已离开、回退
                case REGISTER_ENUM.REGISTER_CONSULTING?.value:
                  statusTextArray[v.appointmentId] = [
                    // {
                    //   status: REGISTER_ENUM.REGISTER_REGISTERED?.value,
                    //   text: '接诊',
                    // },
                    {
                      status: REGISTER_ENUM.REGISTER_CONSULTING?.value,
                      text: '治疗完成',
                    },
                    {
                      status: REGISTER_ENUM.REGISTER_TREATING?.value,
                      text: '已离开',
                    },
                  ]
                  if (!v.medicareRegister) {
                    statusTextArray[v.appointmentId].push({
                      status: REGISTER_ENUM.REGISTER_TREATED?.value,
                      text: '回退',
                    })
                  }
                  statusTextValue[v.appointmentId] = 0
                  break
                //就诊状态为治疗中
                //强流程：默认按钮为治疗完成，下拉按钮为：已离开、回退
                //弱流程：默认按钮为治疗完成，下拉按钮为：已离开、回退
                case REGISTER_ENUM.REGISTER_TREATING?.value:
                  statusTextArray[v.appointmentId] = [
                    {
                      status: REGISTER_ENUM.REGISTER_TREATING?.value,
                      text: '已离开',
                    },
                  ]
                  if (!v.medicareRegister) {
                    statusTextArray[v.appointmentId].push({
                      status: REGISTER_ENUM.REGISTER_TREATED?.value,
                      text: '回退',
                    })
                  }
                  statusTextValue[v.appointmentId] = 0
                  break
                //就诊状态为治疗完成
                //强流程：默认按钮为已离开，下拉按钮为：回退
                //弱流程：默认按钮为已离开，下拉按钮为：回退
                case REGISTER_ENUM.REGISTER_TREATED?.value:
                  statusTextArray[v.appointmentId] = []
                  if (!v.medicareRegister) {
                    statusTextArray[v.appointmentId].push({
                      status: REGISTER_ENUM.REGISTER_TREATED?.value,
                      text: '回退',
                    })
                  }
                  statusTextValue[v.appointmentId] = 0
                  break
                default:
                  statusTextArray[v.appointmentId] = []
                  statusTextValue[v.appointmentId] = 0
                  break
              }
            })
          break
        case 'CONSULTANT':
          records &&
            records.forEach((v) => {
              switch (v.registerStatus) {
                //就诊状态为已挂号
                //强流程：默认按钮为开始咨询，下拉按钮为：已离开、回退
                //弱流程：默认按钮为开始咨询，下拉按钮为：接诊、治疗完成、已离开、回退
                case REGISTER_ENUM.REGISTER_REGISTERED?.value:
                  if (isWeakflow === 1) {
                    statusTextArray[v.appointmentId] = [
                      {
                        status: REGISTER_ENUM.REGISTER_CONSULTING?.value,
                        text: '接诊',
                      },
                      {
                        status: REGISTER_ENUM.REGISTER_TREATING?.value,
                        text: '治疗完成',
                      },
                      {
                        status: REGISTER_ENUM.REGISTER_TREATED?.value,
                        text: '已离开',
                      },
                    ]
                  } else {
                    statusTextArray[v.appointmentId] = [
                      {
                        status: REGISTER_ENUM.REGISTER_TREATED?.value,
                        text: '已离开',
                      },
                    ]
                  }
                  if (!v.medicareRegister) {
                    statusTextArray[v.appointmentId].push({
                      status: REGISTER_ENUM.REGISTER_LEAVE?.value,
                      text: '回退',
                    })
                  }
                  statusTextValue[v.appointmentId] = 0
                  break
                //就诊状态为咨询中
                //强流程：默认按钮为接诊，下拉按钮为：已离开、回退
                //弱流程：默认按钮为接诊，下拉按钮为：治疗完成、已离开、回退
                case REGISTER_ENUM.REGISTER_CONSULTING?.value:
                  statusTextArray[v.appointmentId] = [
                    {
                      status: REGISTER_ENUM.REGISTER_TREATING?.value,
                      text: '治疗完成',
                    },
                    {
                      status: REGISTER_ENUM.REGISTER_TREATED?.value,
                      text: '已离开',
                    },
                  ]
                  if (!v.medicareRegister) {
                    statusTextArray[v.appointmentId].push({
                      status: REGISTER_ENUM.REGISTER_LEAVE?.value,
                      text: '回退',
                    })
                  }
                  statusTextValue[v.appointmentId] = 0
                  break
                //就诊状态为治疗中
                //强流程：默认按钮为治疗完成，下拉按钮为：已离开、回退
                //弱流程：默认按钮为治疗完成，下拉按钮为：已离开、回退
                case REGISTER_ENUM.REGISTER_TREATING?.value:
                  statusTextArray[v.appointmentId] = [
                    {
                      status: REGISTER_ENUM.REGISTER_TREATED?.value,
                      text: '已离开',
                    },
                  ]
                  if (!v.medicareRegister) {
                    statusTextArray[v.appointmentId].push({
                      status: REGISTER_ENUM.REGISTER_LEAVE?.value,
                      text: '回退',
                    })
                  }
                  statusTextValue[v.appointmentId] = 0
                  break
                //就诊状态为治疗完成
                //强流程：默认按钮为已离开，下拉按钮为：回退
                //弱流程：默认按钮为已离开，下拉按钮为：回退
                case REGISTER_ENUM.REGISTER_TREATED?.value:
                  statusTextArray[v.appointmentId] = []
                  if (!v.medicareRegister) {
                    statusTextArray[v.appointmentId].push({
                      status: REGISTER_ENUM.REGISTER_LEAVE?.value,
                      text: '回退',
                    })
                  }
                  statusTextValue[v.appointmentId] = 0
                  break
                default:
                  statusTextArray[v.appointmentId] = []
                  statusTextValue[v.appointmentId] = 0
                  break
              }
            })
          break
        default:
          break
      }
    },
    // 获取角色列表
    async loadCurrentStaff() {
      // 今日工作的角色枚举
      const { pageElementsList } = this.menu

      // 需要筛选的菜单枚举值enumValue
      const roles = pageElementsList
        .filter((element) => this.enumValue.includes(element.enumValue))
        .sort((prev, next) => prev.sort - next.sort)

      this.roles = roles
      this.initSelectedRole(roles)

      uni.startPullDownRefresh()
    },
    // 角色切换
    bindPickerChange(e) {
      this.roleIndex = e.target.value
      this.selectedRole = this.roles[this.roleIndex]
      this.emitPullDownRefresh()
    },
    //以下是前台权限判断
    canRegistration(record) {
      return (
        record.registerStatus === this.REGISTER_ENUM.REGISTER_CONFIRM?.value ||
        record.registerStatus === this.REGISTER_ENUM.REGISTER_APPOINTED?.value
      )
    },
    // 咨询师新增就诊流程"开始咨询"，对应就诊状态"已挂号"
    canConsulting(record) {
      return (
        record.registerStatus === this.REGISTER_ENUM.REGISTER_REGISTERED?.value
      )
    },
    // 咨询师的就诊流程"接诊"，对应就诊状态"咨询中"
    canConsultTreatment(record) {
      return (
        record.registerStatus === this.REGISTER_ENUM.REGISTER_CONSULTING?.value
      )
    },
    // 咨询师的就诊流程"治疗完成"，对应就诊状态"治疗中"
    canConsultFinish(record) {
      return (
        record.registerStatus === this.REGISTER_ENUM.REGISTER_TREATING?.value
      )
    },
    canReception(record) {
      return (
        record.registerStatus ===
          this.REGISTER_ENUM.REGISTER_CONSULTING?.value ||
        record.registerStatus === this.REGISTER_ENUM.REGISTER_REGISTERED?.value
      )
    },
    canFinish(record) {
      return (
        record.registerStatus === this.REGISTER_ENUM.REGISTER_TREATING?.value
      )
    },
    canLeave(record) {
      return (
        record.registerStatus === this.REGISTER_ENUM.REGISTER_TREATED?.value
      )
    },
    canUndo(record) {
      return record.registerStatus === this.REGISTER_ENUM.REGISTER_LEAVE?.value
    },
    showCancelAppointment(item) {
      return (
        item.registerStatus === this.REGISTER_ENUM.REGISTER_APPOINTED?.value ||
        item.registerStatus === this.REGISTER_ENUM.REGISTER_CONFIRM?.value
      )
    },
    showCancelRegister(item) {
      return (
        item.registerStatus === this.REGISTER_ENUM.REGISTER_REGISTERED?.value
      )
    },
    showEdit(item) {
      return (
        item.registerStatus === this.REGISTER_ENUM.REGISTER_APPOINTED?.value ||
        item.registerStatus === this.REGISTER_ENUM.REGISTER_CONFIRM?.value
      )
    },
    showRecepitionButton(item) {
      return item.registerStatus !== this.REGISTER_ENUM.REGISTER_CANCELED?.value
    },
    consultationChange(e) {
      const { id, value: indexId } = e.target
      const record = this.dataSource.find((v) => {
        return v.appointmentId === Number(id)
      })
      const value = this.statusTextArray[Number(id)][indexId].status

      console.log('consultationChange status', value)

      this.consultationAction(record, value)
    },
    //今日工作流程 从pc端搬运而来
    consultationAction(record, value) {
      const { registerId, registerStatus, appointmentId } = record
      const { REGISTER_ENUM, TODAY_WORK_ROLE_TYPE_ENUM, curRoleKey } = this
      let todayWorkRoleType
      let status
      if (curRoleKey === 'DOCTOR') {
        todayWorkRoleType = TODAY_WORK_ROLE_TYPE_ENUM.DOCTOR?.value
      }

      if (this.curRoleKey === 'RECEPTIONIST') {
        todayWorkRoleType = TODAY_WORK_ROLE_TYPE_ENUM.RECEPTIONIST?.value
      }

      if (this.curRoleKey === 'CONSULTANT') {
        todayWorkRoleType = TODAY_WORK_ROLE_TYPE_ENUM.CONSULTANT?.value
        if (value === REGISTER_ENUM.REGISTER_REGISTERED.value) {
          console.log('已挂号', value)
          uni.showLoading()
          this.disabled = true
          status = REGISTER_ENUM.REGISTER_CONSULTING.value
          console.log('next 咨询中', status)

          diagnosisApi
            .updateRegisterStatusForward({
              registerId,
              appointmentId,
              status,
              todayWorkRoleType,
            })
            .then(() => {
              this.$dpmsUtils.show('开始咨询', { icon: 'success' })
              this.emitPullDownRefresh()
              this.disabled = false
              uni.hideLoading()
            })
            .catch(() => {
              this.disabled = false
              uni.hideLoading()
            })
          return
        }
        if (value === REGISTER_ENUM.REGISTER_CONSULTING.value) {
          console.log('咨询中', 3, value)
          uni.showLoading()
          this.disabled = true
          status = REGISTER_ENUM.REGISTER_TREATING.value
          console.log('next 治疗中', status)

          diagnosisApi
            .updateRegisterStatusForward({
              registerId,
              appointmentId,
              status,
              todayWorkRoleType,
            })
            .then(() => {
              this.$dpmsUtils.show('接诊成功', { icon: 'success' })
              this.emitPullDownRefresh()
              this.disabled = false
              uni.hideLoading()
            })
            .catch(() => {
              this.disabled = false
              uni.hideLoading()
            })
          return
        }
        if (value === REGISTER_ENUM.REGISTER_TREATING?.value) {
          console.log('治疗中', 4)
          uni.showLoading()
          this.disabled = true
          status = REGISTER_ENUM.REGISTER_TREATED?.value
          console.log('next 治疗完成5', status)

          diagnosisApi
            .updateRegisterStatusForward({
              registerId,
              status,
              todayWorkRoleType,
              appointmentId,
            })
            .then(() => {
              this.$dpmsUtils.show('治疗完成', { icon: 'success' })
              this.emitPullDownRefresh()
              this.disabled = false
              uni.hideLoading()
            })
            .catch((err) => {
              this.disabled = false
              uni.hideLoading()
            })
          return
        }
        if (value === REGISTER_ENUM.REGISTER_TREATED?.value) {
          console.log('治疗完成5', value)
          uni.showLoading()
          this.disabled = true
          const status = REGISTER_ENUM.REGISTER_LEAVE?.value
          console.log('已离开', 8, status)
          diagnosisApi
            .updateRegisterStatusForward({
              registerId,
              status,
              todayWorkRoleType,
              appointmentId,
            })
            .then(() => {
              this.$dpmsUtils.show('已离开', { icon: 'success' })
              this.emitPullDownRefresh()
              this.disabled = false
              uni.hideLoading()
            })
            .catch((err) => {
              this.disabled = false
              uni.hideLoading()
            })
          return
        }
        if (value === REGISTER_ENUM.REGISTER_LEAVE?.value) {
          uni.showModal({
            title: '确定要回退就诊流程?',
            success: ({ confirm, cancel }) => {
              if (confirm) {
                const status = REGISTER_ENUM.REGISTER_REGISTERED?.value

                if (registerStatus === status) {
                  appointmentAPI
                    .appointmentUpdateStatus({
                      appointmentId,
                      appointmentStatus: 2,
                    })
                    .then(() => {
                      this.$dpmsUtils.show('回退成功', { icon: 'success' })
                      this.emitPullDownRefresh()
                      this.disabled = false
                    })
                    .catch(() => {
                      this.disabled = false
                    })
                } else {
                  diagnosisApi
                    .registerUpdateStatus({
                      registerId,
                      todayWorkRoleType: todayWorkRoleType,
                    })
                    .then(() => {
                      this.$dpmsUtils.show('回退成功', { icon: 'success' })
                      this.emitPullDownRefresh()
                      this.disabled = false
                    })
                    .catch(() => {
                      this.disabled = false
                    })
                }
              }
              if (cancel) {
                console.log(cancel)
              }
            },
          })
        }
      } else {
        if (value === REGISTER_ENUM.REGISTER_APPOINTED?.value) {
          return toPage('/baseSubpackages/apptForm/apptForm', {
            type: 'editRegister',
            appointmentId: record.appointmentId,
          })
        }
        if (value === REGISTER_ENUM.REGISTER_REGISTERED?.value) {
          uni.showLoading()
          this.disabled = true
          const status = REGISTER_ENUM.REGISTER_TREATING.value
          diagnosisApi
            .updateRegisterStatusForward({
              registerId,
              appointmentId,
              status,
              todayWorkRoleType,
            })
            .then(() => {
              this.$dpmsUtils.show('接诊成功', { icon: 'success' })
              this.emitPullDownRefresh()
              this.disabled = false
              uni.hideLoading()
            })
            .catch(() => {
              this.disabled = false
              uni.hideLoading()
            })
          return
        }
        if (value === REGISTER_ENUM.REGISTER_CONSULTING?.value) {
          uni.showLoading()
          this.disabled = true
          const status = REGISTER_ENUM.REGISTER_TREATED.value
          diagnosisApi
            .updateRegisterStatusForward({
              registerId,
              appointmentId,
              status,
              todayWorkRoleType,
            })
            .then(() => {
              this.$dpmsUtils.show('治疗完成', { icon: 'success' })
              this.emitPullDownRefresh()
              this.disabled = false
              uni.hideLoading()
            })
            .catch(() => {
              this.disabled = false
              uni.hideLoading()
            })
          return
        }
        if (value === REGISTER_ENUM.REGISTER_TREATING?.value) {
          uni.showLoading()
          this.disabled = true
          const status = REGISTER_ENUM.REGISTER_LEAVE?.value
          diagnosisApi
            .updateRegisterStatusForward({
              registerId,
              status,
              todayWorkRoleType,
              appointmentId,
            })
            .then(() => {
              this.$dpmsUtils.show('已离开', { icon: 'success' })
              this.emitPullDownRefresh()
              this.disabled = false
              uni.hideLoading()
            })
            .catch((err) => {
              this.disabled = false
              uni.hideLoading()
            })
          return
        }
        if (value === REGISTER_ENUM.REGISTER_TREATED?.value) {
          uni.showModal({
            title: '确定要回退就诊流程?',
            success: ({ confirm, cancel }) => {
              if (confirm) {
                const status = REGISTER_ENUM.REGISTER_REGISTERED?.value

                if (registerStatus === status) {
                  appointmentAPI
                    .appointmentUpdateStatus({
                      appointmentId,
                      appointmentStatus: 2,
                    })
                    .then(() => {
                      this.$dpmsUtils.show('回退成功', { icon: 'success' })
                      this.emitPullDownRefresh()
                      this.disabled = false
                    })
                    .catch(() => {
                      this.disabled = false
                    })
                } else {
                  diagnosisApi
                    .registerUpdateStatus({ registerId, todayWorkRoleType: 1 })
                    .then(() => {
                      this.$dpmsUtils.show('回退成功', { icon: 'success' })
                      this.emitPullDownRefresh()
                      this.disabled = false
                    })
                    .catch(() => {
                      this.disabled = false
                    })
                }
              }
              if (cancel) {
                console.log(cancel)
              }
            },
          })
        }
      }
    },
    emitPullDownRefresh() {
      uni.startPullDownRefresh()
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
    ...mapState('workbenchStore', ['menu']),
    curRoleKey() {
      if (
        this.TODAY_WORK_ROLE_TYPE_ENUM?.properties &&
        this.selectedRole.enumValue
      ) {
        const propKey = this.enumMap[this.selectedRole.enumValue]

        return this.TODAY_WORK_ROLE_TYPE_ENUM?.[propKey].key
      }
      return null
    },
    roleNames() {
      return this.roles.map((item) => item.displayName)
    },

    isShowNewBtn() {
      if (this.selectedRole && this.TODAY_WORK_ROLE_TYPE_ENUM?.RECEPTIONIST) {
        const propKey = this.enumMap[this.selectedRole.enumValue]

        return propKey === this.TODAY_WORK_ROLE_TYPE_ENUM?.RECEPTIONIST?.key
      }
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

    .flex {
      display: flex;
    }

    .doctorConsulantList {
      position: relative;
      left: 20rpx;
    }

    .receptionist {
      width: 666rpx;
      position: relative;
      left: -30rpx;
      display: flex;
      justify-content: space-between;
      margin: 0rpx 16rpx;
    }

    .button {
      display: inline-block;
      padding: 0 32rpx;
      margin-right: 18rpx;
      line-height: 56rpx;
      border-radius: 28rpx;
      font-size: 28rpx;
      color: $dpms-color-primary;
      border: 2rpx solid $dpms-color-primary;
      background: #fff;

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
