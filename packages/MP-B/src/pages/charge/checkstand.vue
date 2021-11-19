<template>
  <view class="checkstand-wrap">
    <div class="content-wrapper">
      <chargestand-title>
        <div slot="content" class="flex">
          <div
            class="iconfont icon-savings"
            style="font-size: 36rpx; margin-right: 11rpx;"
          ></div>
          <div class="ellipsis" style="width: 550rpx;">
            支付方式（应收金额<span style="font-weight: bold;">
              {{ receivableAmount | thousandFormatter(2, '￥') }}</span
            >）
          </div>
        </div>
        <div slot="extra">
          <div style="padding-left: 36rpx;" @click="showActionSheet = true">
            <span class="iconfont icon-right" style="font-size: 36rpx;"></span>
          </div>
        </div>
      </chargestand-title>

      <div v-if="form.payChannelList.length > 0 && payTypes.length > 0">
        <dpmsCellInput
          v-for="item in form.payChannelList"
          :key="item.transactionChannelId"
          type="digit"
          :title="item.transactionChannelName"
          v-model="item.paymentAmount"
          @blur="changePayChannel($event, item)"
          :disabledProps="item.payStyle === 13"
        />
      </div>
      <div v-if="changeAmount > 0" class="validateCount">
        支付总金额不能大于应收金额
      </div>
      <chargestand-title>
        <div slot="content" class="flex">
          <div
            class="iconfont icon-customer-management"
            style="font-size: 36rpx; margin-right: 11rpx;"
          ></div>
          <div class="ellipsis" style="width: 550rpx;">开单信息</div>
        </div>
        <div slot="extra">
          <div
            style="padding-left: 36rpx;"
            @click="toggleInfomation = !toggleInfomation"
          >
            <template v-if="!toggleInfomation">
              <span class="iconfont icon-closed" style="font-size: 22rpx;" />
            </template>
            <template v-else>
              <span class="iconfont icon-open" style="font-size: 22rpx;" />
            </template>
          </div>
        </div>
      </chargestand-title>
      <dpmsCell title="收费时间" :value="nowDate" disabled />
      <dpmsCell title="收费人" :value="staff.staffName" disabled />
      <template v-if="toggleInfomation">
        <dpmsCellPicker
          title="就诊时间"
          placeholder="请选择就诊时间"
          :list="visitTimeList"
          :defaultProps="{ label: 'labelStr', value: 'registerTime' }"
          defaultType="registerTime"
          v-model="form.registerTime"
          @input="onRegisterTime"
        />
        <view
          @click="
            toUrl(
              `/pages/charge/chooseChargerItemStaff?type=doctor&required=${doctorRequire}`,
            )
          "
        >
          <dpmsCell
            title="医生"
            placeholder="请选择医生"
            isLink="true"
            :value="form.doctorStaffName"
            :required="doctorRequire"
          />
        </view>
        <view
          @click="
            toUrl(
              `/pages/charge/chooseChargerItemStaff?type=nurse&required=${nurseRequire}`,
            )
          "
        >
          <dpmsCell
            title="护士"
            placeholder="请选择护士"
            isLink="true"
            :value="form.nurseStaffName"
            :required="nurseRequire"
          />
        </view>
        <dpmsCellPicker
          title="咨询师"
          placeholder="请选择咨询师"
          :list="consultantList"
          :defaultProps="{ label: 'staffName', value: 'staffId' }"
          defaultType="staffId"
          v-model="form.consultedStaffId"
          @input="cellPickerChange($event, 'consultedStaffId')"
          :required="consultedRequire"
        />
        <dpmsCellPicker
          title="销售人员"
          placeholder="请选择销售人员"
          :list="salesManList"
          :defaultProps="{ label: 'staffName', value: 'staffId' }"
          defaultType="staffId"
          @input="cellPickerChange($event, 'salesManStaffId')"
          v-model="form.salesManStaffId"
        />
        <dpmsCell
          title="医生助理"
          placeholder="请选择医生助理"
          :value="assistantNames"
          isLink
          @cellclick="openAssistantList"
        />
        <multipleSelect
          title="医生助理"
          :list="assistantList"
          :value="form.assistantStaffIds"
          :visible="showAssistant"
          :defaultProps="{ label: 'staffName', value: 'staffId' }"
          @close="showAssistant = false"
          @confirm="handleSelectAssistant"
        />
        <dpmsCell title="备注" hideBorderBottom />
        <view class="memo">
          <textarea
            v-model="form.memo"
            auto-height
            placeholder="请输入备注"
            placeholder-style="font-size: 30rpx; font-weight: 400; color: rgba(0, 0, 0, 0.25);"
            :maxlength="150"
            @focus="bindFocus"
            @blur="closeBlur"
          />
        </view>
      </template>
      <chargestand-title>
        <div slot="content" class="flex">
          <div
            class="iconfont icon-detail"
            style="font-size: 36rpx; margin-right: 11rpx;"
          />
          <div class="ellipsis" style="width: 550rpx;">项目明细</div>
        </div>
      </chargestand-title>
      <div class="dispose-list">
        <div v-for="item in disposeList" :key="item.itemCode" class="dispose">
          <div class="name">{{ item.itemName }}</div>
          <div>{{ formatDisposeItem(item) }}</div>
        </div>
      </div>

      <div class="empty-wrapper"></div>
    </div>
    <div class="footer-wrapper">
      <div class="content-wrap">
        <div class="left-wrap">
          <div class="amount-wrap">
            <span class="black-big-font padding-r">实收:</span
            ><span class="red-color">{{
              paidAmount | thousandFormatter(2, '￥')
            }}</span>
          </div>
          <div class="amount-wrap">
            <view class="margin-r">
              <span class="gray-font padding-r">欠费:</span>
              <span class="black-font">{{
                oweAmount | thousandFormatter(2, '￥')
              }}</span>
            </view>
            <view class="margin-r">
              <span class="gray-font padding-r">找零:</span>
              <span class="black-font">{{
                changeAmount | thousandFormatter(2, '￥')
              }}</span>
            </view>
          </div>
        </div>
        <!--  收费和保存 -->
        <div class="btn-wrapper flexBt" v-if="canOperation">
          <button
            v-if="showSaveBtn"
            @click="onSubmitBill('save')"
            class="save-btn"
          >
            保存
          </button>
          <button
            v-if="btnPremisstion('new_bill_charges')"
            @click="onSubmitBill('charge')"
            class="charge-btn"
          >
            收费
          </button>
        </div>

        <div class="btn-wrapper flexBt" v-if="revokeOperation">
          <button class="charge-btn" @click="revokeApprove">
            撤回
          </button>
        </div>
      </div>
    </div>
    <!--支付方式-->
    <actionSheet
      @close="hideActionSheet"
      @sure="onSure"
      sure-text="确定"
      v-if="showActionSheet"
    >
      <view
        class="action-item"
        v-for="item in payTypes"
        :key="item.settingsPayTransactionChannelId"
      >
        {{ item.settingsPayTransactionChannelName }}
        <!-- 积分-->
        <template v-if="item.payStyle === 12 && integralToAmount >= 0"
          >&nbsp; &nbsp;(可抵现{{ integralToAmount | thousandFormatter }})
        </template>
        <!-- 储值卡和馈赠金相关 -->
        <template v-if="item.balance >= 0 && item.payStyle !== 12"
          >&nbsp; &nbsp;(余额{{ item.balance | thousandFormatter }})
        </template>

        <dpmsCheckbox
          :disabled="checkDisableFn(item)"
          shape="square"
          :value="item.checked"
          @input="payTypeChange($event, item)"
        >
        </dpmsCheckbox>
      </view>
    </actionSheet>
    <u-toast ref="uToast" />
    <!--  支付结果  -->
    <payResult @confirm="payResultConfirm" ref="payResultRef"></payResult>
    <!-- 审批弹框-->
    <approveModal
      @confirm="approveConfirm"
      @cancel="this.isLock = false"
      ref="approveModalRef"
    ></approveModal>
  </view>
</template>
<script>
import ChargestandTitle from '@/pages/charge/common/checkstandstandTitle'
import multipleSelect from '@/components/multipleSelect/multipleSelect'
import patientAPI from '@/APIS/patient/patient.api'
import inputMixins from 'mpcommon/mixins/inputMixins'
import billAPI from '@/APIS/bill/bill.api'
import moment from 'moment'
import { mapMutations, mapState } from 'vuex'
import { BigCalculate, changeTwoDecimal, numberUtils } from '@/utils/utils'
import payResult from './common/payResult'
import approveModal from './common/approveModal'

const STAFF_ENUMS = new Map([
  ['doctor', 2],
  ['nurse', 6],
  ['consultant', 4],
  ['salesMan', 16],
  ['assistant', 5],
])

export default {
  name: 'checkstand',
  mixins: [inputMixins],
  data() {
    return {
      form: {
        payChannelList: [],
        doctorStaffId: '',
        doctorStaffName: '',
        nurseStaffId: '',
        nurseStaffName: '',
        consultedStaffId: '',
        salesManStaffId: '',
        assistantStaffIds: [],
        memo: '',
        registerTime: '', //提交时为consultTime
        registerId: '', // 提交时为consultId
        source: 2, // 新增就诊记录上的字段，默认取2
      },
      toggleInfomation: true,
      allStaffList: [],
      visitTimeList: [],
      //支付方式
      payTypes: [],
      // 操作菜单
      showActionSheet: false,
      nowDate: moment(new Date().valueOf()).format('YYYY-MM-DD HH:mm'),
      staff: {},
      //医生是否为必填项
      doctorRequire: false,
      //护士是否为必填项
      nurseRequire: false,
      //咨询师是否为必填项
      consultedRequire: false,
      // 账单状态
      billStatus: -1,
      //能否撤回
      canRevoke: false,
      billSerialNo: '',
      // 医生助理
      showAssistant: false,
      assistantNames: '',
    }
  },
  components: {
    ChargestandTitle,
    payResult,
    approveModal,
    multipleSelect,
  },
  computed: {
    ...mapState('workbenchStore', ['menu', 'medicalInstitution']),
    ...mapState('patient', ['patientDetail', 'memberDetail']),
    ...mapState('dispose', [
      'disposeList',
      'receivableAmount',
      'realMainOrderDiscount',
      'realDiscountPromotionAmount',
      'checkStandStaffList',
    ]),
    ...mapState('checkstand', ['billType', 'chargeType']),

    showSaveBtn() {
      return !(this.billType === 4 || this.billType === 3)
    },
    paidAmount() {
      return this.form.payChannelList.reduce(
        (pre, item) => BigCalculate(Number(item.paymentAmount), '+', pre),
        0,
      )
    },
    oweAmount() {
      const { paidAmount, receivableAmount } = this
      return paidAmount < receivableAmount
        ? BigCalculate(receivableAmount, '-', paidAmount)
        : 0
    },
    changeAmount() {
      const { paidAmount, receivableAmount } = this
      return paidAmount > receivableAmount
        ? BigCalculate(paidAmount, '-', receivableAmount)
        : 0
    },
    doctorList() {
      return this.allStaffList.filter(
        (item) => item.position === STAFF_ENUMS.get('doctor'),
      )
    },
    nurseList() {
      return this.allStaffList.filter(
        (item) => item.position === STAFF_ENUMS.get('nurse'),
      )
    },
    consultantList() {
      const list = this.allStaffList.filter(
        (item) => item.position === STAFF_ENUMS.get('consultant'),
      )
      list.unshift({
        staffId: 1,
        staffName: '不选择咨询师',
      })
      return list
    },
    salesManList() {
      const list = this.allStaffList.filter(
        (item) => item.position === STAFF_ENUMS.get('salesMan'),
      )
      list.unshift({
        staffId: 1,
        staffName: '不选择销售人员',
      })
      return list
    },
    assistantList() {
      return this.allStaffList
        .filter((item) => item.position === STAFF_ENUMS.get('assistant'))
        .map((item) => {
          return {
            ...item,
            checked: false,
          }
        })
    },
    canOperation() {
      const {
        institutionChainType,
        topParentId,
        medicalInstitutionId,
      } = this.medicalInstitution
      // 1，单店，2，直营(如果topParentId===0则为总部，总部也是直营)，3，大区，4，加盟
      // 注意：web端与小程序的判断不一样！！！
      return !(
        institutionChainType === 3 ||
        (institutionChainType === 2 && topParentId === medicalInstitutionId) ||
        this.billStatus === 6
      )
    },
    // 是否能撤回
    revokeOperation() {
      return this.billStatus === 6 && this.canRevoke
    },
    //积分转金额
    integralToAmount() {
      const currentPoints =
        this.memberDetail?.memberDetailResponse?.currentPoints || 0
      const perForCash = this.memberDetail?.perForCash || 1

      return BigCalculate(currentPoints, '/', perForCash)
    },
  },
  watch: {
    'form.doctorStaffId': {
      handler(newVal) {
        if (newVal === '') {
          this.form.doctorStaffName = ''
          return
        }
        this.doctorList.forEach((item) => {
          if (item.staffId === newVal) {
            this.form.doctorStaffName = item.staffName
          }
        })
      },
      immediate: true,
    },
    'form.nurseStaffId': {
      handler(newVal) {
        if (newVal === '') {
          this.form.nurseStaffName = ''
          return
        }
        this.nurseList.forEach((item) => {
          if (item.staffId === newVal) {
            this.form.nurseStaffName = item.staffName
          }
        })
      },
      immediate: true,
    },
  },
  onLoad(query) {
    this.setCheckStandStaffList({})
    this.staff = uni.getStorageSync('staff')
    this.loadListData(query).then(() => {
      if (query) this.backData(query)
    })
    this.billStatus = Number(query?.billStatus)
    this.canRevoke = query?.canRevoke === 'true'
    this.billSerialNo = query?.billSerialNo
  },
  onShow() {
    this.btnPremisstion()
    this.getRequireConfig()
    this.form.doctorStaffId = this.checkStandStaffList?.doctorStaffId
    this.form.nurseStaffId = this.checkStandStaffList?.nurseStaffId
  },
  onUnload() {},
  methods: {
    ...mapMutations('dispose', [
      'setDisposeList',
      'setReceivableAmount',
      'setRealMainOrderDiscount',
      'setRealDiscountPromotionAmount',
      'setStaffList',
      'setCheckStandStaffList',
    ]),
    cellPickerChange(value, id) {
      if (value === 1) {
        this.form[id] = ''
      }
    },
    handleSelectAssistant(checkedList) {
      this.form.assistantStaffIds = checkedList
      this.assistantNames =
        checkedList.length > 0
          ? this.assistantList
              .filter((val) => checkedList.includes(val.staffId))
              .map((val) => val.staffName)
              .join(',')
          : ''
    },
    openAssistantList() {
      this.showAssistant = true
    },
    // 收费撤回
    revokeApprove() {
      if (!this.billSerialNo) {
        return
      }
      billAPI
        .revokeApprove({
          billSerialNo: this.billSerialNo,
        })
        .then((res) => {
          if (res?.code === 0) {
            uni.reLaunch({
              url: `/pages/charge/chargeForm?tab=1&patientId=${this.patientDetail.patientId}`,
            })
          }
        })
    },
    getRequireConfig() {
      billAPI
        .getChargeRequiredConfig()
        .then((res) => {
          if (res.data) {
            this.setChargeRequiredConfig(res.data)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    setChargeRequiredConfig(data) {
      const idsDic = {
        1: 'simpleBillEnumIds',
        2: 'ordinaryBillEnumIds',
        3: 'disposalBillEnumIds',
      }
      const ids = idsDic[this.chargeType]
      this.doctorRequire = data[ids]?.includes('2')
      this.consultedRequire = data[ids]?.includes('4')
      this.nurseRequire = data[ids]?.includes('6')
    },
    checkRequire(form) {
      if (this.doctorRequire && !form.doctorStaffId) {
        this.$refs.uToast.show({
          title: '请选择医生!',
          type: 'warning',
        })
        return false
      }
      if (this.nurseRequire && !form.nurseStaffId) {
        this.$refs.uToast.show({
          title: '请选择护士!',
          type: 'warning',
        })
        return false
      }
      if (this.consultedRequire && !form.consultedStaffId) {
        this.$refs.uToast.show({
          title: '请选择咨询师!',
          type: 'warning',
        })
        return false
      }
      return true
    },
    onSubmitBill(type) {
      if (this.isLock) {
        return
      }
      const { staff, nowDate, form, patientDetail, receivableAmount } = this
      if (this.changeAmount > 0) {
        return
      }
      if (!this.checkRequire(form)) {
        return
      }
      let orderPayItemList = this.disposeList

      let params = {
        billType: this.billType,
        cashierStaffId: staff.staffId,
        cashierTime: new Date(nowDate.replace(/-/g, '/')).valueOf(),
        consultId: form.registerId,
        consultSource: form.source,
        consultTime: form.registerTime,
        mainDiscountPromotionAmount: this.realDiscountPromotionAmount,
        mainOrderDiscount: this.realMainOrderDiscount,
        mainOrderDiscountIsmember: false,
        memo: form.memo,
        orderPayItemList: orderPayItemList, //列表
        patientId: patientDetail.patientId,
        payChannelList: form.payChannelList, //列表
        receivableAmount: receivableAmount,
        salesList: [],
      }
      if (form.doctorStaffId) {
        params.salesList.push({
          salesId: form.doctorStaffId,
          salesType: STAFF_ENUMS.get('doctor'),
        })
      }
      if (form.nurseStaffId) {
        params.salesList.push({
          salesId: form.nurseStaffId,
          salesType: STAFF_ENUMS.get('nurse'),
        })
      }
      if (form.consultedStaffId) {
        params.salesList.push({
          salesId: form.consultedStaffId,
          salesType: STAFF_ENUMS.get('consultant'),
        })
      }
      if (form.salesManStaffId) {
        params.salesList.push({
          salesId: form.salesManStaffId,
          salesType: STAFF_ENUMS.get('salesMan'),
        })
      }
      if (form.assistantStaffIds) {
        // 此处是个list，需要循环遍历下
        const temp = []
        this.assistantList.forEach((val) => {
          if (form.assistantStaffIds.includes(val.staffId)) {
            const tempItem = {
              salesId: val.staffId,
              salesName: val.staffName,
              salesType: STAFF_ENUMS.get('assistant'),
            }

            temp.push(tempItem)
          }
        })
        // this.assistantNames =
        //   temp.length > 0 ? temp.map((val) => val.staffName).join(',') : ''
        params.salesList = [...params.salesList, ...temp]
      }
      if (this.billSerialNo) {
        params.billSerialNo = this.billSerialNo
      }
      this.isLock = true
      if (type === 'save') {
        billAPI
          .saveOrderBill(params)
          .then((res) => {
            if (res.code === 0) {
              this.isLock = false
              uni.reLaunch({
                url: `/pages/charge/chargeForm?tab=1&patientId=${patientDetail.patientId}`,
              })
            }
          })
          .catch(() => {
            this.isLock = false
          })
      } else if (type === 'charge') {
        billAPI
          .orderPayOne(params)
          .then((res) => {
            const { code, data, message } = res
            if (code === 0 && data) {
              this.isLock = false
              this.$refs.payResultRef.open(data)
            } else if ([1000373, 1000377].includes(code)) {
              this.isLock = false
              try {
                const errData = JSON.parse(message)
                // 发起审核
                if (code === 1000373) {
                  //  打开审批弹框
                  this.$refs.approveModalRef.open(errData, params)
                } else {
                  //发起失败  给出错误提示
                  this.$refs.uToast.show({
                    title: errData?.approveReason || '审批发起失败',
                    type: 'error',
                  })
                }
              } catch (err) {
                this.isLock = false
              }
            }
          })
          .catch(() => {
            this.isLock = false
          })
      }
    },
    payResultConfirm() {
      this.isLock = false
      uni.reLaunch({
        url: `/pages/charge/chargeForm?tab=2&patientId=${this.patientDetail.patientId}`,
      })
    },
    // 确认审批
    approveConfirm() {
      this.isLock = false
      uni.reLaunch({
        url: `/pages/charge/chargeForm?tab=1&patientId=${this.patientDetail.patientId}`,
      })
    },
    backData(query) {
      if (query.billSerialNo) {
        this.billSerialNo = query.billSerialNo
        // 走编辑账单逻辑,通过接口获取值
        billAPI
          .getOrderDetail({
            billSerialNo: query.billSerialNo,
          })
          .then((res) => {
            const {
              orderPayItemList,
              payChannelList,
              receivableAmount,
              salesList,
              memo,
              consultTime,
              consultId,
              consultSource = 2,
              realMainOrderDiscount,
              promotionVOList,
            } = res.data

            this.payTypes = this.payTypes.filter((payItem) => {
              return payItem.isShow && payItem.payStyle !== 13
            })

            // 设置应收金额
            this.setReceivableAmount(changeTwoDecimal(receivableAmount))
            this.setDisposeList(
              orderPayItemList.map((item, index) => {
                item.pageSerialNo = index + 1
                return item
              }),
            )
            // 设置payChannelList
            this.setPayChannelList(payChannelList)
            // 回显人员
            salesList?.forEach((item) => {
              if (item.salesType === STAFF_ENUMS.get('doctor')) {
                this.form.doctorStaffId = item.salesId
                this.checkStandStaffList.doctorStaffId = item.salesId
              } else if (item.salesType === STAFF_ENUMS.get('nurse')) {
                this.form.nurseStaffId = item.salesId
                this.checkStandStaffList.nurseStaffId = item.salesId
              } else if (item.salesType === STAFF_ENUMS.get('consultant')) {
                this.form.consultedStaffId = item.salesId
              } else if (item.salesType === STAFF_ENUMS.get('salesMan')) {
                this.form.salesManStaffId = item.salesId
              }
              this.setCheckStandStaffList(this.checkStandStaffList)
            })
            // 医生助理多选
            this.form.assistantStaffIds = salesList
              ?.filter((val) => val.salesType === STAFF_ENUMS.get('assistant'))
              .map((val) => val.salesId)
            this.assistantNames = salesList
              ?.filter((val) => val.salesType === STAFF_ENUMS.get('assistant'))
              .map((val) => val.salesName)
              .join(',')
            // 回显备注
            this.form.memo = memo
            // 回显就诊时间就诊Id
            // this.form.registerTime = moment(consultTime).format(
            //   'YYYY-MM-DD HH:mm',
            // )
            this.form.registerTime = consultTime
            this.form.registerId = consultId
            this.form.source = consultSource
            // 回显setRealMainOrderDiscount
            this.setRealMainOrderDiscount(Math.ceil(realMainOrderDiscount))
            // 计算折扣金额
            let _singleDiscountAfterAmountTotal = orderPayItemList
              // .filter((item) => item.allBillDiscount)  //有整单折扣和不允许整单折扣的混合有bug
              .reduce((pre, item) => {
                return BigCalculate(pre, '+', item.singleDiscountAfterAmount)
              }, 0)
            let _promotionListTotal = (promotionVOList || [])
              .filter((item) => item.promotionType === 9)
              .reduce((pre, item) => {
                return BigCalculate(pre, '+', item.promotionAmount)
              }, 0)
            let _realDiscountPromotionAmount = BigCalculate(
              _singleDiscountAfterAmountTotal,
              '-',
              receivableAmount,
            )
            _realDiscountPromotionAmount = BigCalculate(
              _realDiscountPromotionAmount,
              '-',
              _promotionListTotal,
            )

            this.setRealDiscountPromotionAmount(_realDiscountPromotionAmount)
          })
      }
    },
    setPayChannelList(backChannelList) {
      // 处理储值卡，优惠卷收费的模式，此时没有backChannelList
      if (!backChannelList) {
        this.form.payChannelList = this.form.payChannelList.map((item) => {
          item.paymentAmount = this.receivableAmount
          return item
        })
        return
      }
      // 处理payType的checked属性
      const balanceMap = new Map()
      const selectedList = backChannelList.map(
        (item) => item.transactionChannelId,
      )
      this.payTypes = this.payTypes.map((item) => {
        if (item?.balance >= 0) {
          balanceMap.set(item.settingsPayTransactionChannelId, item.balance)
        }
        item.checked = selectedList.includes(
          item.settingsPayTransactionChannelId,
        )
        return item
      })
      // 生成新的payChannelList数据结构
      this.form.payChannelList = backChannelList.map((item) => {
        let balance =
          balanceMap.get(item.transactionChannelId) >= 0
            ? balanceMap.get(item.transactionChannelId)
            : undefined

        return {
          paymentAmount: item.paymentAmount,
          transactionChannelId: item.transactionChannelId,
          transactionChannelName: item.transactionChannelName,
          payStyle: item.payStyle,
          balance,
          transactionCode: item.transactionCode,
        }
      })
    },
    //支付金额变动
    changePayChannel(value, record) {
      if (!value) {
        value = 0
      } else if (value > 9999999.99) {
        value = 9999999.99
      }
      if (record.balance >= 0) {
        if (value > record.balance) {
          value = record.balance
          this.$refs.uToast.show({
            title: `不能超过${record.transactionChannelName}余额`,
            type: 'warning',
          })
        }
      }
      //积分
      if (record.payStyle === 12) {
        if (value > this.integralToAmount) {
          value = this.integralToAmount
          this.$refs.uToast.show({
            title: `不能超过当前积分可抵现金额`,
            type: 'warning',
          })
        }
      }

      record.paymentAmount = Number(value)
    },
    formatDisposeItem(item) {
      return (
        numberUtils.thousandFormatter(item.unitAmount) +
        (item.unit || '') +
        'x' +
        item.itemNum
      )
    },
    checkDisableFn(item) {
      const checked = item.checked
      const hasCheck = this.payTypes.filter((item) => item.checked)
      if (item.payStyle === 13) {
        return true
      }
      return (
        (hasCheck.length === 1 && checked) ||
        (hasCheck.length === 3 && !checked)
      )
    },
    toUrl(url) {
      this.$dpmsUtils.push({
        url,
      })
    },
    hideActionSheet() {
      // 重制payChannelList
      const selectKeys = this.form.payChannelList.map(
        (item) => item.transactionChannelId,
      )
      this.payTypes = this.payTypes.map((item) => {
        item.checked = selectKeys.includes(item.settingsPayTransactionChannelId)
        return item
      })
      this.showActionSheet = false
    },
    payTypeChange(value, record) {
      record.checked = value
    },
    onSure() {
      // 更新payChannelList
      let payChannelAcount = new Map()
      this.form.payChannelList.forEach((item) => {
        payChannelAcount.set(item.transactionChannelId, item.paymentAmount)
      })
      this.form.payChannelList = this.payTypes
        .filter((item) => item.checked)
        .map((item) => ({
          paymentAmount:
            payChannelAcount.get(item.settingsPayTransactionChannelId) || 0,
          transactionChannelId: item.settingsPayTransactionChannelId,
          transactionChannelName: item.settingsPayTransactionChannelName,
          payStyle: item.payStyle,
          balance: item.balance,
        }))
      this.showActionSheet = false
    },
    loadListData(query) {
      const flag = query.billSerialNo //判断是否回显应收金额
      patientAPI.getStaffList().then((res) => {
        this.allStaffList = res.data
        this.setStaffList(res.data)
      })

      billAPI
        .getRegisterAllList({
          patientId: this.patientDetail.patientId,
        })
        .then((res) => {
          this.visitTimeList = this.formatRegister(res.data)
          // if (this.visitTimeList.length) {
          //   // 如果有值第一次做回显
          //   this.backVisitTimeDate(this.visitTimeList[0])
          // }
        })
      return billAPI
        .getPayTransactionChannel({
          memberId: this.patientDetail?.memberId,
          enabled: true,
          customerId: this.patientDetail?.customerId,
        })
        .then((res) => {
          if (res?.data.length > 0) {
            if (this.billType === 3) {
              res.data = res.data.filter(
                (item) => item.payStyle !== 8 && item.payStyle !== 9,
              )
            }
            res.data.forEach((item, index) => {
              item.checked = false
              if (index === 0) {
                item.checked = true
                this.form.payChannelList = [
                  {
                    paymentAmount: flag ? 0 : this.receivableAmount,
                    transactionChannelId: item.settingsPayTransactionChannelId,
                    transactionChannelName:
                      item.settingsPayTransactionChannelName,
                    balance: item.balance,
                    payStyle: item.payStyle,
                  },
                ]
              }
            })

            this.payTypes = res.data.filter((item) => {
              return (
                item.isShow &&
                (item.payStyle !== 13 || (item.payStyle === 13 && flag))
              )
            })
          }
        })
    },
    formatRegister(list) {
      let enums = this.$dpmsUtils.getEnums('Register').properties

      return list.map((item) => {
        item.labelStr =
          moment(item.registerTime).format('YYYY-MM-DD HH:mm') +
          ' ' +
          item.medicalInstitutionSimpleCode +
          ' ' +
          enums[item.status]?.zh_CN
        return item
      })
    },
    backVisitTimeDate(data) {
      const { form } = this
      const updateObj = {
        registerTime: data.registerTime,
        registerId: data.registerId,
        source: data.source || 2,
      }

      // 如果已经有值则不联动
      // 所有回显都没有考虑过数据被删除过，会出现没有选中情况
      // 回显医生
      if (!form.doctorStaffId && data.doctorStaffId) {
        updateObj.doctorStaffId = data.doctorStaffId
      }
      // 回显护士
      if (!form.nurseStaffId && data.nurseStaffId) {
        updateObj.nurseStaffId = data.nurseStaffId
      }
      // 回显医生助理（多选）以前就是错的XXX
      if (
        !form?.assistantStaffIds?.length &&
        data.assistants &&
        data.assistants.length > 0
      ) {
        updateObj.assistantStaffIds = data.assistants.map(
          (item) => item.staffId,
        )
        this.assistantNames = data.assistants
          .map((item) => item.staffName)
          .join(',')
      }
      // 回显咨询师
      if (!form.consultedStaffId && data.consultedStaffId) {
        updateObj.consultedStaffId = data.consultedStaffId
      }
      this.form = Object.assign(this.form, updateObj)
      //选中项目默认为主单医生
      this.setDisposeList(
        this.disposeList.map((item) => {
          let list = []
          if (form.doctorStaffId) {
            list.push({
              salesId: form.doctorStaffId,
              salesType: STAFF_ENUMS.get('doctor'),
            })
          }
          if (form.nurseStaffId) {
            list.push({
              salesId: form.nurseStaffId,
              salesType: STAFF_ENUMS.get('nurse'),
            })
          }
          item.salesList = list
          return item
        }),
      )
      this.setCheckStandStaffList(this.form)
    },
    onRegisterTime(v, record) {
      this.backVisitTimeDate(record)
    },
  },
}
</script>
<style lang="scss" scoped>
.action-item {
  height: 112rpx;
  //width: 100%;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1rpx solid #f2f2f2;
  flex-shrink: 0;
  padding: 0 32rpx;
}

.action-item:first-child {
  border-top: none;
  border-radius: 24rpx 24rpx 0 0;
}

.checkstand-wrap {
  width: 750rpx;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .content-wrapper {
    flex: 1;
    width: 100%;
    background: #f5f5f5;
    overflow-y: scroll;

    .validateCount {
      width: 100%;
      height: 68rpx;
      background: #fff;
      padding: 0 32rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
      color: #fa5151;
    }

    .memo {
      width: 100%;
      padding: 0 32px 32rpx 32rpx;
      margin-top: -20rpx;
      background-color: #fff;
      color: #191919;
      font-size: 30rpx;
      box-sizing: border-box;
      textarea {
        width: 100%;
      }
    }

    .empty-wrapper {
      height: 244rpx;
    }
  }
  .dispose-list {
    .dispose {
      display: flex;
      justify-content: space-between;
      padding: 35rpx 32rpx;
      align-items: center;
      color: #4c4c4c;
      font-size: 30rpx;
      background-color: #fff;
      .name {
        max-width: 460rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
  }
  .footer-wrapper {
    width: 100%;
    background: #fff;
    box-sizing: border-box;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    .left-wrap {
      padding: 10rpx 0;

      .margin-r {
        margin-right: 32rpx;
      }

      .padding-r {
        padding-right: 10rpx;
      }

      .amount-wrap {
        color: #191919;
        display: flex;
        font-size: 22rpx;

        .black-big-font {
          font-size: 28rpx;
          color: #191919;
        }

        .gray-font {
          color: #4c4c4c;
        }

        .black-font {
          color: #191919;
        }

        .red-color {
          color: #fa5151;
          font-size: 28rpx;
          font-weight: 500;
        }
      }
    }
    .content-wrap {
      display: flex;
      height: 90rpx;
      padding: 0 32rpx;
      align-items: center;
      justify-content: space-between;
    }
    .btn-wrapper {
      box-sizing: border-box;

      button {
        width: 120rpx;
        height: 56rpx;
        line-height: 56rpx;
        font-size: 28rpx;
        border-radius: 30rpx;
        box-sizing: border-box;
      }

      .save-btn {
        background: #fff;
        color: #5cbb89;
        border: 2rpx solid #5cbb89;
        margin-right: 16rpx;
      }

      .charge-btn {
        color: #fff;
        background: #5cbb89;
      }
    }
  }
}
</style>
