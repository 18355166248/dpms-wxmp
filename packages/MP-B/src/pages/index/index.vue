<template>
  <view class="apptView">
    <!-- <dpmsDrawer maskClose ref="dpmsDrawer" width="320" />

    <calendar
      :value="date"
      @collapseChange="collapseChange"
      @change="changeCalendar"
    />

    <view class="apptCardInfo">
      <view class="topGray"></view>
      <view v-if="showSearch">
        <dpmsSearch
          showCancel
          @cancel="cancel"
          @change="change"
          @search="search"
        />
      </view>
      <view v-else class="curCardInfo">
        <view>医生: 张医生</view>
        <view class="rightCardInfo">
          <span class="iconfont icon-search" @click="showSearch = true" />
          <span class="iconfont icon-menu" @click="openDrawer" />
        </view>
      </view>
    </view>

    <view v-if="showSearch">
      <view class="tc mt-20">请输入姓名/拼音/联系电话查找患者预约记录</view>
    </view>
    <dayTable
      :class="showSearch ? 'hidden' : ''"
      :style="{
        width: '100%',
        height: retract ? 'calc(100% - 284rpx)' : 'calc(100% - 724rpx)',
      }"
      :apptList="list"
      :chooseDateProp="date"
    /> -->
    <scroll-view scroll-y class="h100">
      <dpmsForm ref="dpmsForm" :rules="rules">
        <dpmsCellTimePicker
          required
          title="预约开始时间"
          v-model="form.startTime"
        />
        <dpmsCellInput
          title="持续时间"
          placeholder="请输入持续时间"
          v-model="form.duration"
        />
        <dpmsCellPicker
          required
          :list="multiArray"
          v-model="form.doctor"
          listKey="visType"
          title="就诊类型"
          placeholder="请选择就诊类型"
        />
        <dpmsCellPicker
          required
          :list="multiArray"
          v-model="form.doctor"
          listKey="staffName"
          title="医生"
          placeholder="请选择医生"
        />
        <dpmsCellPicker
          title="诊所"
          :value="form.medicalInstitutionSimpleCode"
        />
        <dpmsCellPicker
          required
          mode="multiple"
          :list="multiArray"
          v-model="form.help"
          listKey="staffName"
          title="助理"
          placeholder="请选择助理"
        />
        <dpmsCellPicker
          required
          mode="multiple"
          :list="multiArray"
          v-model="form.nurse"
          listKey="staffName"
          title="护士"
          placeholder="请选择护士"
        />
        <dpmsCellPicker
          required
          :list="multiArray"
          v-model="form.dentalHygienist"
          listKey="staffName"
          title="洁牙师"
          placeholder="请选择洁牙师"
        />
        <dpmsCellPicker
          required
          :list="multiArray"
          v-model="form.consultant"
          listKey="staffName"
          title="咨询师"
          placeholder="请选择咨询师"
        />
        <dpmsCellPicker
          required
          :list="multiArray"
          v-model="form.institutionConsultingRoomId"
          listKey="institutionConsultingRoomName"
          title="诊室"
          placeholder="请选择诊室"
        />
        <dpmsCell
          title="诊所"
          :value="form.medicalInstitutionSimpleCode"
          isLink
        />
        <button @click="submit">提交</button>
      </dpmsForm>
    </scroll-view>
  </view>
</template>

<script>
import moment from 'moment'
import AsyncValidator from 'async-validator'

export default {
  data() {
    return {
      title: 'Hello',
      retract: true, // 日历展开: false 收缩: true
      showSearch: false, // 搜索患者
      list: [
        {
          1: {
            list: [
              {
                meetingName: '1',
                // startTime: '2020-07-22 10:00:00',
                startTimeStamp: 1595642400000,
                endTimeStamp: 1595646000000,
              },
              {
                meetingName: '2',
                startTimeStamp: 1595638800000,
                endTimeStamp: 1595645100000,
              },
              {
                meetingName: '3',
                startTimeStamp: 1595646900000,
                endTimeStamp: 1595651400000,
              },
            ],
          },
        },
      ],
      date: moment().format('YYYY-MM-DD'),

      pickerArray: [
        {
          id: 0,
          name: '美国',
        },
        {
          id: 1,
          name: '中国',
        },
        {
          id: 2,
          name: '巴西',
        },
        {
          id: 3,
          name: '日本',
        },
      ],
      multiArray: [
        [
          {
            id: 0,
            name: '美国',
          },
          {
            id: 1,
            name: '中国',
          },
        ],
        [
          {
            id: 3,
            name: '洛杉矶',
          },
          {
            id: 4,
            name: '程度',
          },
        ],
      ],
      form: { duration: 30 },
      pickerIndex: undefined,
      rules: {
        doctor: {
          required: true,
          message: '请输入医生',
        },
        tel: {
          required: true,
          message: '请输入手机号',
        },
      },
    }
  },
  onLoad() {},
  watch: {
    date(newVal) {
      if (newVal !== moment().format('YYYY-MM-DD')) {
        this.list = [
          {
            1: {
              list: [
                {
                  meetingName: '1',
                  // startTime: '2020-07-22 10:00:00',
                  startTimeStamp: 1595565000000,
                  endTimeStamp: 1595572200000,
                },
              ],
            },
          },
        ]

        return
      }

      this.list = [
        {
          1: {
            list: [
              {
                meetingName: '1',
                // startTime: '2020-07-22 10:00:00',
                startTimeStamp: 1595642400000,
                endTimeStamp: 1595646000000,
              },
              {
                meetingName: '2',
                startTimeStamp: 1595638800000,
                endTimeStamp: 1595645100000,
              },
              {
                meetingName: '3',
                startTimeStamp: 1595646900000,
                endTimeStamp: 1595651400000,
              },
            ],
          },
        },
      ]
    },
  },
  methods: {
    collapseChange(val) {
      this.retract = val
    },
    cancel() {
      this.showSearch = false
    },
    search(value) {
      console.log('search', value)
    },
    change(value) {
      console.log('change', value)
    },
    openDrawer() {
      this.$refs.dpmsDrawer.open()
    },
    changeCalendar({ fulldate }) {
      this.date = fulldate
    },

    submit() {
      this.$refs.dpmsForm.validate((err, fileds) => {
        console.log(err, fileds)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
page {
  width: 100%;
  height: 100%;
}
.apptView {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .apptCardInfo {
    position: relative;
    z-index: 1;
    .topGray {
      width: 100%;
      height: 16rpx;
      background-color: #f2f3f5;
    }
    .curCardInfo {
      box-sizing: border-box;
      padding: 0 8px;
      font-size: 26rpx;
      width: 100%;
      height: 55rpx;
      line-height: 55rpx;
      box-shadow: 0 5rpx 8rpx #00000033;
      display: flex;
      justify-content: space-between;

      .rightCardInfo {
        span:first-child {
          font-size: 32rpx;
          margin-right: 10rpx;
        }
        span:last-child {
          font-size: 30rpx;
        }
      }
    }
  }
}
</style>
