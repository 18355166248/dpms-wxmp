<template>
  <view class="checkstand-wrap">
    <div class="content-wrapper">
      <chargestand-title>
        <div slot="content" class="flex">
          <div class="iconfont icon-savings" style="font-size: 36rpx;margin-right: 11rpx"></div>
          <div class="ellipsis" style="width: 550rpx">支付方式（应收金额{{ 4022 }}）</div>
        </div>
        <div slot="extra">
          <span class="iconfont icon-right" style="font-size: 36rpx"></span>
        </div>
      </chargestand-title>
      <dpmsCellInput
        type="number"
        title="支付宝"
        :value="testValue1"
      />
      <dpmsCellInput
        type="number"
        title="储值卡"
        :value="testValue2"
      />
      <div v-if="true" class="validateCount">
        支付总金额不能大于应收金额
      </div>
      <chargestand-title>
        <div slot="content" class="flex">
          <div class="iconfont icon-customer-management" style="font-size: 36rpx;margin-right: 11rpx"></div>
          <div class="ellipsis" style="width: 550rpx">开单时间</div>
        </div>
        <div slot="extra">
          <div style="padding-left: 36rpx" @click="toggleInfomation = !toggleInfomation">
            <template v-if="toggleInfomation">
              <span class="iconfont icon-closed" style="font-size: 22rpx" />
            </template>
            <template v-else>
              <span class="iconfont icon-open" style="font-size: 22rpx" />
            </template>
          </div>
        </div>
      </chargestand-title>
      <dpmsCell
        title="收费时间"
        value="2021-04-20 18:56"
      />
      <dpmsCell
        title="收费人"
        value="张三"
      />
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
        <dpmsCellPicker
          title="医生"
          placeholder="请选择医生"
          :list="doctorList"
          :defaultProps="{ label: 'staffName', value: 'staffId' }"
          defaultType="staffId"
          v-model="form.doctorStaffId"
        />
        <dpmsCellPicker
          title="护士"
          placeholder="请选择护士"
          :list="nurseList"
          :defaultProps="{ label: 'staffName', value: 'staffId' }"
          defaultType="staffId"
          v-model="form.nurseStaffId"
        />
        <dpmsCellPicker
          title="咨询师"
          placeholder="请选择咨询师"
          :list="consultantList"
          :defaultProps="{ label: 'staffName', value: 'staffId' }"
          defaultType="staffId"
          v-model="form.consultedStaffId"
        />
        <dpmsCellPicker
          title="销售人员"
          placeholder="请选择销售人员"
          :list="salesManList"
          :defaultProps="{ label: 'staffName', value: 'staffId' }"
          defaultType="staffId"
          v-model="form.salesManStaffId"
        />
        <dpmsCellPicker
          title="其他人员"
          placeholder="请选择其他人员"
          :list="otherList"
          :defaultProps="{ label: 'staffName', value: 'staffId' }"
          defaultType="staffId"
          v-model="form.otherStaffId"
        />
        <dpmsCell title="备注" hideBorderBottom/>
        <view class="memo">
          <textarea
            v-model="form.memo"
            auto-height
            placeholder="请输入备注"
            placeholder-style="font-size: 34rpx; font-weight: 400; color: rgba(0, 0, 0, 0.25);"
            :maxlength="500"
            @focus="bindFocus"
            @blur="closeBlur"
          />
        </view>
      </template>
      <chargestand-title>
        <div slot="content" class="flex">
          <div class="iconfont icon-detail" style="font-size: 36rpx;margin-right: 11rpx"></div>
          <div class="ellipsis" style="width: 550rpx">项目明细</div>
        </div>
      </chargestand-title>
      <dpmsCell
        title="项目名称"
        value="¥50.00盒子×️2"
      />
      <dpmsCell
        title="项目名称"
        value="¥50.00盒子×️2"
      />
      <dpmsCell
        title="项目名称"
        value="¥50.00盒子×️2"
      />
      <dpmsCell
        title="项目名称"
        value="¥50.00盒子×️2"
      />
      <div class="empty-wrapper"></div>
    </div>
    <div class="footer-wrapper flexBt">
      <div>
        <div style="height: 36rpx" class="flexAlign">
          <span style="font-size: 28rpx;color: #191919">
            实收:
          </span>
          <span style="font-size: 28rpx;color: #FA5151">
            200,950.00
          </span>
        </div>
        <div style="height: 32rpx" class="flexAlign">
          <span style="font-size: 22rpx;color: #4C4C4C">欠费:</span>
          <span style="font-size: 22rpx;color: #191919">20.00</span>
          <span style="font-size: 22rpx;color: #4C4C4C">找零:</span>
          <span style="font-size: 22rpx;color: #191919">0.00</span>
        </div>
      </div>
      <div class="btn-wrapper flexBt">
        <button class="save-btn">保存</button>
        <button class="charge-btn">收费</button>
      </div>
    </div>
  </view>
</template>
<script>
import ChargestandTitle from '@/pages/charge/components/checkstandstandTitle';
import patientAPI from '@/APIS/patient/patient.api'
import inputMixins from 'mpcommon/mixins/inputMixins'
import chargeAPI from 'APIS/charge/charge.api';
import moment from 'moment'

export default {
  name: 'checkstand',
  mixins: [inputMixins],
  data() {
    return {
      form: {
        payChannelList: [],
        doctorStaffId: '',
        nurseStaffId:'',
        consultedStaffId:'',
        salesManStaffId:'',
        otherStaffId:'',
        memo:'',
        registerTime:'',
      },
      testValue1: 4000,
      testValue2: 400,
      toggleInfomation: false,
      otherList:[],
      visitTimeList:[]
    };
  },
  components: {
    ChargestandTitle,
  },
  computed: {
    doctorList() {
      return this.otherList.filter(item => item.position === 2)
    },
    nurseList() {
      return this.otherList.filter(item => item.position === 6)
    },
    consultantList() {
      return this.otherList.filter(item => item.position === 4)
    },
    salesManList() {
      return this.otherList.filter(item => item.position === 16)
    }
  },
  onLoad() {
    this.loadListData()
  },
  onShow() {},
  onHide() {},
  onUnload() {},
  methods: {
    registerTimeLabel(record) {
      console.log(record);
      return 123132
    },
    loadListData() {
      patientAPI.getStaffList().then(res => {
        this.otherList = res.data
      })
      // todo patientId由上游传过来
      chargeAPI.getRegisterList({
        patientId:351013
      }).then(res => {
        this.visitTimeList = this.formatRegister(res.data)
        if(this.visitTimeList.length) {
          // this.form = Object.assign(this.form,{registerTime:this.visitTimeList[0].registerTime})
          // 如果有值第一次做回显
          this.backVisitTimeDate(this.visitTimeList[0])
        }
      })
    },
    formatRegister(list) {
      return list.map(item => {
        item.labelStr = moment(item.registerTime).format("YYYY-MM-DD HH:mm") + ' ' + item.medicalInstitutionSimpleCode
        return item
      })
    },
    backVisitTimeDate(data) {
      const { form } = this
      const updateObj = {
        registerTime : data.registerTime
      }
      // 如果已经有值则不联动
      // 回显医生
      if(!form.doctorStaffId && data.doctorStaffId) {
        updateObj.doctorStaffId = data.doctorStaffId
      }
      // 回显其他
      if(!form.otherStaffId && data.otherStaffId) {
        updateObj.otherStaffId = data.otherStaffId
      }
      // 回显咨询师
      if(!form.consultedStaffId && data.consultedStaffId) {
        updateObj.consultedStaffId = data.consultedStaffId
      }
      this.form = Object.assign(this.form,updateObj)
    },
    onRegisterTime(v, record) {
      console.log('record', record);
      this.backVisitTimeDate(record)
    }
  },
  watch: {
    watchData: {
      handler(newVal, oldVal) {},
      deep: true,
      immediate: true,
    },
  },
};
</script>
<style lang="scss" scoped>
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
      color: #FA5151;
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

  .footer-wrapper {
    flex: 0 0 92rpx;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    background: #fff;
    padding: 0 32rpx;
    box-sizing: border-box;

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
        color: #5CBB89;
        border: 2rpx solid #5cbb89;
        margin-right: 16rpx;
      }

      .charge-btn {
        color: #fff;
        background: #5CBB89;
      }
    }
  }
}
</style>
