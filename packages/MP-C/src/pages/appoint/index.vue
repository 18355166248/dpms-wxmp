<template>
  <div>
    <dpmsForm ref="editForm" :model="form" :rules="rules">
      <dpmsCell
        title="预约门店"
        placeholder="请选择门店"
        :value="shopDetail.shopName"
      ></dpmsCell>
      <dpmsCell
        title="门店地址"
        placeholder="请选择地址"
        :value="shopDetail.shopAddress"
      />
      <dpmsCell
        title="预约医生"
        placeholder="请选择医生"
        :value="doctor.doctorName"
        isLink
        @cellclick="doctorPickerVisible = true"
      />
      <dpmsCell
        title="预约项目"
        placeholder="请选择项目"
        :value="selectedItemsText"
        isLink
        @cellclick="itemPickerVisible = true"
      />
      <dpmsDatePicker
        v-model="form.date"
        placeholder="请选择日期"
        title="预约日期"
        :start="startDate"
        :end="endDate"
        required
        isLink
      />
      <dpmsCell
        title="预约时间"
        placeholder="请选择时间"
        :value="timeStampFilter"
        required
        isLink
        @cellclick="doctorTimePickerVisible = true"
      />
      <dpmsCell
        title="预约人员"
        placeholder="请选择预约人员"
        :value="personnel.personnelName"
        required
        isLink
        @cellclick="personnelPickerVisible = true"
      />
      <dpmsCellInput
        title="预约备注"
        placeholder="请输入备注"
        inputType="text"
        v-model="form.appointmentMemo"
      />
    </dpmsForm>
    <div class="agree">
      <dpmsCheckbox
        class="checkbox"
        @change="(v) => (btnDisabled = !v)"
      />我已知悉并同意
      <text @click="showContent = true">《预约服务协议》</text>
    </div>
    <dpmsButton
      :disabled="btnDisabled"
      :text="networkAppointmentId ? '修改预约' : '确认预约'"
      @click="submit"
    />
    <dpmsBottomPicker
      class="dpmsBottomPicker"
      :visible.sync="doctorPickerVisible"
      title="选择医生"
      needCloseBtn
    >
      <div
        class="doctor"
        :class="{ active: form.doctorId === d.doctorId }"
        v-for="d in dockers"
        :key="d.doctorId"
        @click="dockerClick(d)"
      >
        <image :src="d.doctorAvatarUrl" />
        <div class="info">
          <div class="name">{{ d.doctorName }}</div>
          <div>擅长: {{ d.goodAt }}</div>
        </div>
      </div>
      <empty v-if="!dockers.length" :disabled="true" text="暂无可预约医生" />
    </dpmsBottomPicker>
    <dpmsBottomPicker
      class="dpmsBottomPicker"
      :visible.sync="doctorTimePickerVisible"
      title="选择时间"
    >
      <div class="time">
        <div
          class="info"
          :class="{ active: form.timeStamp === time.value }"
          v-for="time in doctorTimeFilter"
          :key="time.value"
          @click="doctorTimeClick(time.value)"
        >
          {{ time.label }}
        </div>
      </div>
      <empty
        v-if="!doctorTimeFilter.length"
        :disabled="true"
        text="暂无可预约时间"
      />
    </dpmsBottomPicker>
    <dpmsBottomPicker
      class="dpmsBottomPicker"
      :visible.sync="personnelPickerVisible"
      title="选择预约人员"
    >
      <div
        class="personnel"
        v-for="p in personnelList"
        :key="p.id"
        :class="{ active: form.personnelId === p.id }"
        @click="personnelClick(p)"
      >
        <div class="row1">
          <div>
            {{ p.personnelName }}/{{
              Gender_ENUM.properties[p.gender].text.zh_CN
            }}
          </div>
          <div>
            {{ ContactLabel_ENUM.properties[p.contactLabel].text.zh_CN }}
          </div>
        </div>
        <div>{{ p.mobile }}</div>
      </div>
      <empty
        v-if="!personnelList.length"
        :disabled="true"
        text="暂无可预约人员"
      />
      <button
        v-if="personnelList.length < 10"
        style="margin-bottom: 32rpx;"
        @click="
          $utils.push({ url: '/pages/personManagement/personManagement' })
        "
      >
        新增人员
      </button>
    </dpmsBottomPicker>
    <dpmsBottomPicker
      class="dpmsBottomPicker"
      :visible.sync="itemPickerVisible"
      title="选择项目"
      needCloseBtn
    >
      <div
        class="item"
        :class="{
          active: form.itemList.map((v) => v.itemId).includes(itm.itemId),
        }"
        v-for="itm in items"
        :key="itm.itemId"
        @click="itemClick(itm)"
      >
        <image :src="itm.itemThumbnailUrl" />
        <div class="info">
          <div class="name">{{ itm.itemName }}</div>
          <div class="txt">{{ itm.itemBriefIntroduction }}</div>
        </div>
      </div>
      <empty v-if="!items.length" :disabled="true" text="暂无可预约项目" />
    </dpmsBottomPicker>
    <modal
      :show="showContent"
      title="预约服务协议"
      confirm-color="#5cbb89"
      :show-cancel="false"
      @close="showContent = false"
    >
      <view
        style="padding: 32rpx 24rpx;"
        v-html="institutionInfo.bookingInformation"
      ></view>
    </modal>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import { getStorage, STORAGE_KEY } from '@/utils/storage'
import appointAPI from '../../APIS/appoint/appoint.api'
import appointmentAPI from '@/APIS/appointment/appointment.api'
import institutionAPI from '@/APIS/institution/institution.api'
import empty from '@/components/empty/empty.vue'
import modal from '@/components/modal/neil-modal.vue'
export default {
  data() {
    return {
      userId: getStorage(STORAGE_KEY.STAFF).id,
      showContent: false,
      shopId: '',
      itemId: '',
      networkAppointmentId: '',
      apiUrl: 'creatAppt',
      editData: {},
      shopDetail: {},
      form: {
        doctorId: '',
        itemList: [],
        date: '',
        timeStamp: '',
        personnelId: '',
        appointmentMemo: '',
      },
      rules: {
        date: {
          required: true,
          message: '请选择预约日期',
        },
        timeStamp: {
          required: true,
          message: '请选择预约时间',
        },
        personnelId: {
          required: true,
          message: '请选择预约人员',
        },
      },
      btnDisabled: true,
      doctor: {},
      dockers: [],
      doctorTime: [],
      items: [],
      personnelList: [],
      personnel: {},
      doctorPickerVisible: false,
      itemPickerVisible: false,
      doctorTimePickerVisible: false,
      personnelPickerVisible: false,
      ContactLabel_ENUM: this.$utils.getEnums('ContactLabel'),
      Gender_ENUM: this.$utils.getEnums('Gender'),
      institutionInfo: {},
    }
  },
  components: {
    empty,
    modal,
  },
  computed: {
    ...mapState('loginStore', ['MEDICALINSTITUTION']),
    selectedItemsText() {
      return this.form.itemList.map((itm) => itm.itemName).join('，')
    },
    doctorTimeFilter() {
      return this.doctorTime.map((v) => ({
        label: moment(v.startAvailableDateStamp).format('HH:mm'),
        value: v.startAvailableDateStamp,
      }))
    },
    startDate() {
      let shopStartDate = moment(
        this.shopDetail.preAdvanceDayOfAppointmentTime,
      ).valueOf()
      return moment(Math.max(moment().valueOf(), shopStartDate)).format(
        'YYYY-MM-DD',
      )
    },
    endDate() {
      return this.shopDetail.nextAdvanceDayOfAppointmentTime
        ? moment(this.shopDetail.nextAdvanceDayOfAppointmentTime).format(
            'YYYY-MM-DD',
          )
        : ''
    },
    timeStampFilter() {
      return this.form.timeStamp
        ? moment(this.form.timeStamp).format('HH:mm')
        : ''
    },
  },
  watch: {
    'form.date': function (newVal, oldVal) {
      if (newVal && oldVal) {
        this.form.timeStamp = ''
      }
      this.getDoctorTime(newVal)
    },
  },
  onLoad(params) {
    this.shopId = params.shopId
    this.itemId = params.itemId
    this.form.doctorId = params.doctorId
    // 编辑模式
    if (params.networkAppointmentId) {
      this.networkAppointmentId = params.networkAppointmentId
      this.apiUrl = 'updateAppt'
      this.createEdit(params.networkAppointmentId)
    }
  },
  onShow() {
    this.init()
  },
  methods: {
    createEdit(id) {
      uni.setNavigationBarTitle({ title: '修改预约' })
      appointmentAPI
        .getAppointmentDetail({
          networkAppointmentId: id,
        })
        .then((res) => {
          const { data } = res
          this.editData = data
          this.form = {
            doctorId: data.doctorId,
            itemList: data.networkAppointmentItemList,
            date: moment(data.appointmentBeginTimeStamp).format('YYYY-MM-DD'),
            timeStamp: data.appointmentBeginTimeStamp,
            personnelId: data.personnelId,
            appointmentMemo: data.appointmentMemo,
          }
        })
    },
    submit() {
      this.$refs.editForm.validate((err, fileds) => {
        if (err) {
          this.$utils.show(err[0].message)
          return
        }

        let timeStamp = this.doctorTime.filter(
          (v) => v.startAvailableDateStamp === this.form.timeStamp,
        )
        let param = {
          medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
          appointmentBeginTimeStamp: timeStamp[0].startAvailableDateStamp,
          appointmentEndTimeStamp: timeStamp[0].endAvailableDateStamp,
          networkAppointmentItemList: this.form.itemList.map((v) => ({
            itemId: v.itemId,
            itemName: v.itemName,
            itemType: v.itemTypeId,
            itemTypeName: v.itemTypeName,
          })),
          shopId: this.shopId,
          userId: this.userId,
          ...this.form,
          timeStamp: '',
          itemList: '',
        }
        if (this.networkAppointmentId) {
          param.networkAppointmentId = this.networkAppointmentId
        }
        this.btnDisabled = true
        appointAPI[this.apiUrl]({ appointmentJsonStr: JSON.stringify(param) })
          .then((res) => {
            let that = this
            this.$utils.show('预约成功', {
              duration: 1000,
              complete() {
                setTimeout(() => {
                  that.$utils.replace({
                    url: '/pages/myAppointment/myAppointment',
                  })
                }, 1000)
              },
            })
          })
          .catch(() => {
            this.btnDisabled = false
          })
      })
    },
    getDoctorTime(date) {
      appointAPI
        .getTime({
          medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
          doctorId: this.form.doctorId,
          shopId: this.shopId,
          dateStr: date,
        })
        .then((res) => {
          let { data } = res
          this.doctorTime = data.filter((v) => v.isShow)

          // 如果编辑状态，原始时间已不可预约，插入原始时间
          if (
            this.form.timeStamp &&
            !this.doctorTime
              .map((v) => v.startAvailableDateStamp)
              .includes(this.form.timeStamp)
          ) {
            this.doctorTime.unshift({
              startAvailableDateStamp: this.editData.appointmentBeginTimeStamp,
              endAvailableDateStamp: this.editData.appointmentEndTimeStamp,
            })
          }
        })
    },
    async getDoctors(id) {
      const res = await appointAPI.getDoctorList({
        medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
        filterInstitutionId: id,
      })
      this.dockers = res.data.doctorList
      if (this.form.doctorId && this.dockers.length > 0) {
        const doctor = this.dockers.find((doctor) => {
          return doctor.doctorId === Number(this.form.doctorId)
        })
        if (doctor) {
          this.doctor = doctor
        }
      }
    },
    async getItems() {
      const res = await appointAPI.getItemList({
        medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
      })
      this.items = res.data.itemList.filter((v) => v.canAppointment)
      // 默认选择参数中的项目
      if (this.itemId && this.items.length > 0) {
        const item = this.items.find(
          (item) => item.itemId === Number(this.itemId),
        )
        if (item) {
          this.form.itemList = [item]
        }
      }
    },
    async getPersonnelList() {
      const res = await appointAPI.getPersonnelList({ userId: this.userId })
      this.personnelList = res.data
    },
    async getShopDetail() {
      const res = await appointAPI.getShopDetail({ shopId: this.shopId })
      this.shopDetail = res.data
      this.getDoctors(this.shopDetail.settingsShopId)
    },
    async getInstitutionInfo() {
      const res = await institutionAPI.getInstitutionInfo({
        medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
      })
      this.institutionInfo = res.data.institutionIntroduce
    },
    dockerClick(d) {
      this.form.doctorId = d.doctorId
      if (this.form.date) {
        this.getDoctorTime(this.form.date)
      }
      this.doctor = d
      this.doctorPickerVisible = false
    },
    doctorTimeClick(value) {
      this.form.timeStamp = value
      this.doctorTimePickerVisible = false
    },
    personnelClick(p) {
      this.personnel = p
      this.form.personnelId = p.id
      this.personnelPickerVisible = false
    },
    itemClick(itm) {
      const selectIndex = this.form.itemList.findIndex(
        (si) => si.itemId === itm.itemId,
      )

      if (selectIndex > -1) {
        this.form.itemList.splice(selectIndex, 1)

        return
      }
      this.form.itemList = [...this.form.itemList, itm]
    },
    async init() {
      this.$utils.showLoading()
      await Promise.all([
        this.getItems(),
        this.getPersonnelList(),
        this.getShopDetail(),
        this.getInstitutionInfo(),
      ])
      this.$utils.clearLoading()
    },
  },
}
</script>

<style lang="scss">
.agree {
  color: rgba(153, 153, 153, 1);
  font-size: 24rpx;
  padding: 20rpx 32rpx;
  display: flex;
  align-items: center;
  .checkbox {
    margin-right: 10rpx;
  }
  text {
    color: rgba(92, 187, 137, 1);
  }
}
button {
  width: 620rpx;
  height: 78rpx;
  line-height: 78rpx;
  background: #5cbb89;
  border-radius: 8rpx;
  font-size: 36rpx;
  font-weight: 400;
  text-align: center;
  color: #ffffff;
  margin-top: 40rpx;
}
.doctor {
  margin-bottom: 16rpx;
  border-radius: 8rpx;
  box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.09);
  display: flex;
  padding: 32rpx 24rpx;
  color: rgba(0, 0, 0, 0.5);
  font-size: 28rpx;
  line-height: 1.6;
  overflow: hidden;
  &.active {
    border: 1rpx solid #5cbb89;
    position: relative;
    ::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border-top: 40rpx solid #5cbb89;
      border-left: 40rpx solid transparent;
    }
  }
  image {
    width: 120rpx;
    height: 120rpx;
    flex: none;
    margin-right: 32rpx;
    border-radius: 50%;
  }
  .name {
    color: rgba(0, 0, 0, 0.9);
    font-size: 34rpx;
    margin-bottom: 12rpx;
  }
}
.item {
  margin-bottom: 16rpx;
  border-radius: 8rpx;
  box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.09);
  display: flex;
  padding: 32rpx 24rpx;
  color: rgba(0, 0, 0, 0.5);
  font-size: 28rpx;
  line-height: 1.6;
  overflow: hidden;
  &.active {
    border: 1rpx solid #5cbb89;
    position: relative;
    ::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border-top: 40rpx solid #5cbb89;
      border-left: 40rpx solid transparent;
    }
  }
  image {
    width: 156rpx;
    height: 140rpx;
    flex: none;
    margin-right: 24rpx;
  }
  .name {
    color: rgba(0, 0, 0, 0.9);
    font-size: 34rpx;
    margin-bottom: 12rpx;
  }
  .txt {
    height: 86rpx;
    overflow: hidden;
  }
}
.time {
  display: flex;
  flex-wrap: wrap;
  margin-right: -50rpx;
  .info {
    width: 150rpx;
    height: 68rpx;
    line-height: 68rpx;
    text-align: center;
    color: rgba(0, 0, 0, 0.65);
    font-size: 28rpx;
    background: #f5f5f5;
    border-radius: 2rpx;
    margin-bottom: 32rpx;
    margin-right: 34rpx;
    &.active {
      background: #5cbb89;
      color: #fff;
    }
  }
}
.personnel {
  margin-bottom: 16rpx;
  border-radius: 8rpx;
  box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.09);
  padding: 32rpx 24rpx;
  color: rgba(0, 0, 0, 0.5);
  font-size: 28rpx;
  line-height: 1.6;
  overflow: hidden;
  &.active {
    border: 1rpx solid #5cbb89;
    position: relative;
    ::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border-top: 40rpx solid #5cbb89;
      border-left: 40rpx solid transparent;
    }
  }
  .row1 {
    display: flex;
    justify-content: space-between;
  }
}
.dpmsBottomPicker .empty {
  padding: 100rpx 0;
}
</style>
