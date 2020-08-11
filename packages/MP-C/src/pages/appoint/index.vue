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
      <dpmsCellPicker
        defaultType="value"
        :list="doctorTimeFilter"
        v-model="form.timeStamp"
        title="预约时间"
        placeholder="请选择时间"
        required
        isLink
      />
      <dpmsCellPicker
        defaultType="id"
        :defaultProps="{
          label: 'personnelName',
          value: 'id',
        }"
        :list="personnelList"
        v-model="form.personnelId"
        title="预约人员"
        placeholder="请选择预约人员"
        required
        isLink
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
      <a href>《预约服务协议》</a>
    </div>
    <dpmsButton :disabled="btnDisabled" text="确认预约" @click="submit" />
    <dpmsBottomPicker :visible.sync="doctorPickerVisible" title="选择医生">
      <div
        class="doctor"
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
    </dpmsBottomPicker>
    <dpmsBottomPicker :visible.sync="itemPickerVisible" title="选择项目">
      <div
        class="item"
        v-for="itm in items"
        :key="itm.itemId"
        @click="itemClick(itm)"
      >
        <image :src="itm.itemThumbnailUrl" />
        <div class="info">
          <div class="name">{{ itm.itemName }}</div>
          <div>{{ itm.itemBriefIntroduction }}</div>
        </div>
      </div>
    </dpmsBottomPicker>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import { getStorage, STORAGE_KEY } from '@/utils/storage'
import appointAPI from '../../APIS/appoint/appoint.api'
export default {
  data() {
    return {
      userId: getStorage(STORAGE_KEY.STAFF).id,
      shopId: '',
      shopDetail: {},
      form: {
        doctorId: '',
        itemId: [],
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
      selectedItems: [],
      personnelList: [],
      doctorPickerVisible: false,
      itemPickerVisible: false,
    }
  },
  computed: {
    ...mapState('loginStore', ['MEDICALINSTITUTION']),
    selectedItemsText() {
      return this.selectedItems.map((itm) => itm.itemName).join('，')
    },
    doctorTimeFilter() {
      return this.doctorTime.map((v) => ({
        label: moment(v.startAvailableDateStamp).format('HH:mm'),
        value: v.startAvailableDateStamp,
      }))
    },
    startDate() {
      return this.shopDetail.preAdvanceDayOfAppointmentTime
        ? moment(this.shopDetail.preAdvanceDayOfAppointmentTime).format(
            'YYYY-MM-DD',
          )
        : ''
    },
    endDate() {
      return this.shopDetail.nextAdvanceDayOfAppointmentTime
        ? moment(this.shopDetail.nextAdvanceDayOfAppointmentTime).format(
            'YYYY-MM-DD',
          )
        : ''
    },
  },
  watch: {
    'form.date': function (newVal) {
      if (newVal) {
        this.getDoctorTime(newVal)
      }
    },
  },
  onLoad(params) {
    console.log(`new appoint`, params)
    this.shopId = params.shopId
  },
  methods: {
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
          networkAppointmentItemList: this.form.itemId.map((v) => ({
            itemId: v.itemId,
            itemName: v.itemName,
            itemType: v.itemTypeId,
            itemTypeName: v.itemTypeName,
          })),
          shopId: this.shopId,
          userId: this.userId,
          ...this.form,
          timeStamp: '',
          itemId: '',
        }
        this.btnDisabled = true
        appointAPI
          .creatAppt({ appointmentJsonStr: JSON.stringify(param) })
          .then((res) => {
            let { data } = res

            this.btnDisabled = false
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
          this.form.timeStamp = ''
        })
    },
    async getDoctors(id) {
      const res = await appointAPI.getDoctorList({
        medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
        filterInstitutionId: id,
      })
      this.dockers = res.data.doctorList
    },
    async getItems() {
      const res = await appointAPI.getItemList({
        medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
      })
      this.items = res.data.itemList.filter((v) => v.canAppointment)
    },
    async getPersonnelList() {
      const res = await appointAPI.getPersonnelList({
        userId: this.userId,
      })
      this.personnelList = res.data
    },
    async getShopDetail() {
      const res = await appointAPI.getShopDetail({
        shopId: this.shopId,
      })
      this.shopDetail = res.data
      this.getDoctors(this.shopDetail.settingsShopId)
    },
    dockerClick(d) {
      this.form.doctorId = d.doctorId
      if (this.form.date) {
        this.getDoctorTime(this.form.date)
      }
      this.doctor = d
      this.doctorPickerVisible = false
    },
    itemClick(itm) {
      if (this.selectedItems.find((si) => si.itemId === itm.itemId)) return
      this.selectedItems = [...this.selectedItems, itm]
      this.form.itemId = this.selectedItems
    },
    async init() {
      this.$utils.showLoading()
      await this.getItems()
      await this.getPersonnelList()
      await this.getShopDetail()
      this.$utils.clearLoading()
    },
  },
  created() {
    this.init()
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
  a {
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
    margin-bottom: 8rpx;
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
  image {
    width: 184rpx;
    height: 140rpx;
    flex: none;
    margin-right: 24rpx;
  }
  .name {
    color: rgba(0, 0, 0, 0.9);
    font-size: 34rpx;
    margin-bottom: 8rpx;
  }
}
</style>
