<template>
  <view class="dayTable" id="dayTableId">
    <scroll-view
      class="calendar_body"
      :style="scrollHeight"
      :scroll-y="isScroll"
      :scroll-top="scrollTop"
      @scroll="scroll"
      scroll-with-animation
    >
      <!-- 表格 -->
      <!-- @touchstart="touchSt(index,$event)" @touchend="touchEn(index)" -->
      <view class="calendar_table" @click="touchSt($event)">
        <view
          v-for="(item, index) in defaultList"
          :key="index"
          :ref="index"
          class="cal_tr"
          :class="item.trClass"
          :style="{ height: unitHeight + 'px;' + item.hidClass }"
        >
          <view class="left_time">{{ item.timeTitle }}</view>
          <view
            class="right_content"
            :style="{
              backgroundColor: item.bgColor,
              borderColor: item.bgColor,
            }"
          ></view>
        </view>
      </view>

      <!-- 已预约卡片 -->
      <view class="calendar_meeting">
        <view
          v-for="(item, index) in meetingList"
          :key="index"
          :style="item.style + item.$config.style"
          class="meeting_a"
          @click="showDetail(index, $event)"
          @longtap="longTapWithEdit($event, item)"
        >
          <view class="metting-inner">
            <view
              v-if="item.acrossInstitutionAppointmentFlag"
              class="acrossClinic"
            />
            <view
              v-if="item.acrossInstitutionAppointmentFlag"
              class="acrossClinicText"
              >跨</view
            >
            <view class="metting_content_box meetCard">
              <view
                class="docorator"
                :style="{
                  backgroundColor: getDocoratorColor(item.appointmentStatus),
                }"
              />
              <view
                :class="[
                  'meeting_content_name',
                  item.duration === 1 ? 'durationOne' : '',
                ]"
              >
                {{ item.patient.patientName }}{{ getGenderText(item) }}
              </view>
              <view class="meeting_content_center">
                <view
                  v-for="apptItem in item.appointmentResourceMap
                    .COMMON_DATA_APPOINTMENT_ITEM"
                  :key="apptItem.appointmentSettingsAppointmentItemId"
                  class="apptItem"
                  :style="{
                    backgroundColor:
                      apptItem.appointmentSettingsAppointmentItemTypeColor,
                    color: getApptItemColor(
                      apptItem.appointmentSettingsAppointmentItemTypeColor,
                    ),
                  }"
                >
                  {{ apptItem.appointmentSettingsAppointmentItemName }}
                </view>
              </view>
              <view class="meeting_content_time">{{ item.time }}</view>
            </view>
          </view>
        </view>
        <!-- 创建会议 -->
        <view
          id="createApptId"
          v-if="isCreate"
          class="meeting_create"
          :style="createMeet.style"
          @touchstart.stop="touchMeetingStart"
          @touchmove.stop="touchMeetingMove"
          @touchend.stop="!createApptClick && touchMeetingEnd($event)"
        >
          <view
            class="radius_first radius"
            @touchstart.stop="moveTopStart(createMeet.idSt, $event)"
            @touchmove.stop="moveTopm"
            @touchend.stop="moveTopEnd"
          >
            <view></view>
          </view>
          <view
            class="radius_second radius"
            @touchstart.stop="moveBottomStart(createMeet.idEnd, $event)"
            @touchmove.stop="moveBottomm"
            @touchend.stop="moveBottomEnd"
          >
            <view></view>
          </view>

          <!-- 左侧时间点 -->
          <view :style="createMeet.trueStyle" class="meeting_left_time">
            <view class="left_Time_show">{{ createMeet.startTimeShow }}</view>
            <view class="left_Time_show endTimeText">{{
              createMeet.endTimeShow
            }}</view>
          </view>

          <!-- 时间,预约项目,名字显示区 -->
          <view class="metting_content_box hasAppt">
            <text
              v-if="createMeet.patient"
              :class="{
                meeting_content_name: true,
                durationOne: createMeet.duration === 1,
              }"
            >
              {{ createMeet.patient.patientName
              }}{{ getGenderText(createMeet) }}
            </text>
            <text
              v-else
              class="meeting_content_name"
              :class="{ durationOne: createMeet.duration === 1 }"
              >再次点击新建预约</text
            >
            <text class="meeting_content_center" />
            <view class="meeting_content_time">
              {{ createMeet.time }}
            </view>
          </view>
        </view>
      </view>

      <!-- block -->
      <view class="calendar_meeting">
        <view
          v-for="(item, index) in blockEventList"
          :key="index"
          :style="item.style + item.$config.style"
          class="meeting_a"
        >
          <view class="metting-inner">
            <view class="metting_content_box meetCard">
              <view
                class="docorator"
                style="background: rgba(0, 0, 0, 0.65);"
              />
              <view class="meeting_content_name">
                {{ item.businessName }} (日程)
              </view>
              <view class="meeting_content_center">
                <view
                  :key="item.appointmentBlockEventId"
                  class="apptItem"
                  style="
                    background: #f6f6f6;
                    border: 1px solid rgba(0, 0, 0, 0.15);
                  "
                >
                  {{ item.appointmentBlockEventName }}
                </view>
              </view>
              <view class="meeting_content_time">{{ item.time }}</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 时间线刻度 -->
      <view v-if="isToday == 0" class="time_now" :style="nowTime.line">
        <view class="left_text_red">{{ nowTime.text }}</view>
        <view class="left_text_radio"></view>
        <view class="time_line"></view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import moment from 'moment'
import { scheduleTableUtil } from './dayTable.util.js'
import { dataDictUtil } from 'utils/dataDict.util'
import { colorNumberList } from '@/baseSubpackages/apptForm/colorNumberList.js'
import { numberRangeUtil } from './numberRange.util'
import { frontAuthUtil } from '@/utils/frontAuth.util'
import { apptDataService } from '../../../src/baseSubpackages/apptForm/apptData.service'

const windowHeight = uni.getSystemInfoSync().windowHeight

let timeOutEvent = 0
let scrollYtop = 0
let hidID = -1

/* 测试数据1 start */
const curDay = moment()

function vibrate() {
  uni.vibrateShort()
}

const defaultMeet = { patient: undefined }

export default {
  props: {
    chooseDateProp: String,
    hourHeight: Number, //表格单元高度
    uMinute: Number, //表格单元时长
    // showMin: Number, //显示单元时长
    defaultChooseLong: Number, //默认点击所占时长
    scrollHeight: String,
    apptList: Array,
    scheduleList: Array, // 排班时间列表
    retract: Boolean, // 日历展开: false 收缩: true 用于更新视图的高度
    blockEvent: Array, //block事件
  },
  data() {
    return {
      unitHeight: 16, // 每个颗粒度高度的多少
      unitMinute: 15, // 时间细分颗粒度
      showMinute: 60, // 展示时间颗粒度
      defaultChoose: 8,
      scale: 0,
      minRatio: 0,
      minAll: 0,
      defaultList: [],
      meetingList: [],
      nowLine: '',
      startId: 0,
      isCreate: false,
      createMeet: defaultMeet,
      isScroll: true,
      nowTime: {},
      scrollTop: 0,
      timeId: -1,
      isToday: 0,
      meetingDetail: '',
      editMeet: false, // 编辑会话中
      tableToTop: 0, // dayTable距离页面顶部距离
      moveTimer: undefined, // 移动拖拽时的定时器
      VIS_TYPE_ENUM: this.$utils.getEnums('VisType'),
      APPOINTMENT_STATUS_ENUM: this.$utils.getEnums('AppointmentStatus'),
      GENDER_ENUM: this.$utils.getEnums('Gender'),
      isHeaderWithLargeArea: frontAuthUtil.check(
        '预约中心/预约视图/新建修改、取消、日志',
      ),
      createApptClick: false,
      blockEventList: [],
    }
  },
  //如果将chooseDateProp放入vuex 监听可使用下面方法
  // watch: {
  //   chooseDateProp: function(n, o) {
  //     if (hidID > -1) {
  //       this.defaultList[hidID].hidClass = "font-size:12px;"
  //     }
  //     this.isCreate = false;
  //     this.createMeet = "";
  //     this.getMeetingList();
  //     this.isTodayFun(n);
  //   },
  // },
  // computed: {
  //   ...mapState([
  //     'chooseDateProp'
  //   ]),
  // },
  created() {
    this.appointmentStatusColorMap = {
      [this.APPOINTMENT_STATUS_ENUM.APPOINTMENT.value]: '#FED700',
      [this.APPOINTMENT_STATUS_ENUM.REGISTERED.value]: '#f04965',
      [this.APPOINTMENT_STATUS_ENUM.TREATED.value]: '#1890ff',
      [this.APPOINTMENT_STATUS_ENUM.CONSULTATION.value]: '#00e6f1',
      [this.APPOINTMENT_STATUS_ENUM.TREATING.value]: '#facc14',
      [this.APPOINTMENT_STATUS_ENUM.UNDETERMINED.value]: '#727efc',
      [this.APPOINTMENT_STATUS_ENUM.CONFIRM.value]: '#55D24A',
    }

    this.unitHeight = parseInt(this.hourHeight / 4) || 13.5 //16px
    this.unitMinute = parseInt(this.uMinute) || 15 //15分钟
    this.showMinute = parseInt(this.showMin) || 60 //60分钟
    this.defaultChoose = parseInt(this.defaultChooseLong / 15) || 2 //30分钟
    this.minMute = parseInt(this.showMin) || 1

    this.minRatio = this.showMinute / this.unitMinute // 4 一个显示的时间段分几块
    this.minAll = 1440 / this.unitMinute // 96 (1400 = 24*60)

    Array.isArray(this.apptList) &&
      this.apptList.length > 0 &&
      this.getMeetingList()
  },
  mounted() {
    const query = uni.createSelectorQuery().in(this)
    this.createApptClick = false

    query
      .select('#dayTableId')
      .boundingClientRect((data) => {
        this.tableToTop = data.top
      })
      .exec()
  },
  watch: {
    //日程和预约需要一起计算宽度
    apptList(newVal) {
      Array.isArray(this.apptList) &&
        this.apptList.length > 0 &&
        this.getMeetingList(newVal, this.blockEventList)
    },
    //日程和预约需要一起计算宽度
    blockEvent(newVal) {
      Array.isArray(this.apptList) &&
        this.apptList.length > 0 &&
        this.getMeetingList(this.apptList, newVal)
    },
    scheduleList(newVal) {
      this.getDefaultTable()
      this.isTodayFun(this.chooseDateProp)
      setTimeout(() => {
        if (Array.isArray(newVal) && newVal.length > 0) {
          let beginWorkTime =
            moment(this.chooseDateProp).startOf('day').valueOf() +
            newVal[0].beginTimeMilliSecond
          beginWorkTime = moment(beginWorkTime)

          const hour = beginWorkTime.hour()
          const minutes = beginWorkTime.minute()
          const scale = hour * 4 + minutes / 15

          this.scrollTop = scale * this.unitHeight + 15
        } else {
          this.scrollTop = this.unitHeight * 36 + 15 // 默认9点开始
        }
      })
    },
    retract() {
      const query = uni.createSelectorQuery().in(this)
      query
        .select('#dayTableId')
        .boundingClientRect((data) => {
          this.tableToTop = data.top
        })
        .exec()
    },
  },
  methods: {
    showError(message) {
      uni.showToast({
        title: message,
        icon: 'none',
        duration: 2000,
      })
    },
    scroll(e) {
      //手机端区别手指滚动和点击操作
      clearTimeout(timeOutEvent)
      scrollYtop = e.detail.scrollTop
    },
    //判断是否为今天
    isTodayFun(d) {
      let isToday
      let td = new Date()
      td = new Date(td.getFullYear(), td.getMonth(), td.getDate())
      let od = new Date(d)
      od = new Date(od.getFullYear(), od.getMonth(), od.getDate())
      let xc = od - td
      let result = ''
      if (xc < 0) {
        isToday = -1
      } else if (xc == 0) {
        isToday = 0
      } else {
        isToday = 1
      }
      this.isToday = isToday

      if (this.isToday == 0) {
        this.getTimeNow()
      }
    },
    //获取当前时间imeNow
    getTimeNow() {
      let self = this
      let hidId = -1
      let nowDate = new Date()
      let hour = nowDate.getHours() //获取当前小时数(0-23)
      let min = nowDate.getMinutes() //获取当前分钟数(0-59)
      let top =
        (hour * self.minRatio + min / self.unitMinute) * self.unitHeight - 1
      let timeLine = 'top:' + top + 'px;'
      let text = nowDate.toString().substring(15, 21)
      //是否隐藏上下时间线
      if (min < 15) {
        hidId = hour * self.minRatio
      } else if (min > 45) {
        hidId = (hour + 1) * self.minRatio
      }
      self.nowLine = timeLine
      self.nowTime = {
        line: timeLine,
        text: text,
      }
      if (hidId > -1) {
        self.defaultList[hidId].hidClass = 'font-size:0;'
      }
      hidID = hidId
      let timeId = hour * self.minRatio + Math.floor(min / self.unitMinute)

      self.timeId = timeId
      // this.scrollTop = timeId * this.unitHeight - 50
    },
    //获取表格默认数据
    getDefaultTable() {
      let self = this
      let list = [],
        rat = this.minRatio
      for (let i = 0; i <= this.minAll; i++) {
        let time = '',
          timeClass = ''
        let hour = Math.floor(i / rat)
        hour = hour < 10 ? '0' + hour : hour

        if (i % rat === 0) {
          time = hour + ':00'
          timeClass = 'hasTime' // 整点添加类名
        } else if (i % rat === 2) {
          time = hour + ':30'
          timeClass = 'hasTime' // 整点添加类名
        } else {
          time = hour + ':' + (i % rat) * self.unitMinute
        }
        const bgColor = this.getBackgroundColorByScheduleItemList(time)
        list.push({
          trClass: timeClass,
          timeTitle: time,
          bgColor,
        })
      }
      this.defaultList = list
    },
    //整理会议列表数据
    getMeetingList(applist, blockEventList) {
      let meetingList = JSON.parse(JSON.stringify(applist))

      //此处计算卡片位置
      meetingList = scheduleTableUtil.getUnitAndOffset(meetingList)

      meetingList = meetingList[0][1].list

      let list = []
      for (let i = 0; i < meetingList.length; i++) {
        let startTime = moment(meetingList[i].startTimeStamp).format(
          'YYYY-MM-DD HH:mm',
        )
        let endTime = moment(meetingList[i].endTimeStamp).format(
          'YYYY-MM-DD HH:mm',
        )
        let start = startTime.substring(11, 16).split(':')
        let end = endTime.substring(11, 16).split(':')

        let st =
          parseInt(start[0] * this.minRatio) +
          parseInt(start[1] / this.unitMinute)
        let ed =
          parseInt(end[0] * this.minRatio) + parseInt(end[1] / this.unitMinute)

        let height = 'height:' + (ed - st) * this.unitHeight + 'px;'
        let top = 'top:' + st * this.unitHeight + 'px;'
        let isFlex = ''
        let bgClass = 'blurBg'
        // if ((ed - st) < 2) {
        //   isFlex = "isFlex "
        // }

        list.push({
          top: st * this.unitHeight,
          style: height + top,
          meetingName: meetingList[i].meetingName,
          time: startTime.substring(11, 16) + '-' + endTime.substring(11, 16),
          isFlex: isFlex,
          startId: st,
          endId: ed,
          duration: ed - st,
          bgClass: bgClass,
          ...meetingList[i],
        })
      }

      //此处计算block的位置
      this.meetingList = this.getBlockEventList(list, blockEventList)
    },
    //block事件列表
    getBlockEventList(list, blockEventList) {
      if (blockEventList.length < 1) {
        this.blockEventList = []
        return list
      }

      const _self = this

      //常规处理
      blockEventList = blockEventList.map((v) => {
        let startTime = moment(v.blockBeginTime).format('YYYY-MM-DD HH:mm')
        let endTime = moment(v.blockEndTime).format('YYYY-MM-DD HH:mm')
        let start = startTime.substring(11, 16).split(':')
        let end = endTime.substring(11, 16).split(':')

        let st =
          parseInt(start[0] * _self.minRatio) +
          parseInt(start[1] / _self.unitMinute)
        let ed =
          parseInt(end[0] * _self.minRatio) +
          parseInt(end[1] / _self.unitMinute)

        let diff = ed - st
        diff = diff < 2 ? 2 : diff

        let height = 'height:' + diff * _self.unitHeight + 'px;'
        let color = 'background: #f6f6f6 !important;'
        let top = 'top:' + st * _self.unitHeight + 'px;'
        let isFlex = ''
        let bgClass = 'blurBg'

        v.top = st * _self.unitHeight
        ;(v.style = height + top + color),
          (v.time =
            startTime.substring(11, 16) + '-' + endTime.substring(11, 16))
        v.isFlex = isFlex
        v.startId = st
        v.endId = ed
        ;(v.duration = ed - st), (v.bgClass = bgClass)
        return v
      })

      //此处需要赋予宽度width
      const [
        appList,
        finalblockEventList,
      ] = scheduleTableUtil.calcBlockPosition(list, blockEventList)

      this.blockEventList = finalblockEventList

      return appList
    },
    //点击会议列表
    showDetail(index, e) {
      if (this.editMeet) {
        this.editMeet = false
        return
      }

      this.scrollTop = scrollYtop

      if (!!this.isCreate) {
        this.isCreate = false
        this.createMeet = defaultMeet
        return
      }
      // if (this.meetingDetail != '' && this.meetingDetail.index == index) {
      //   this.meetingDetail = ''
      //   return
      // }
      // let y = e.touches[0].clientY
      // detailClass = '',
      // style = ''
      // if (y > 300) {
      //   detailClass = 'meeting_detail_top'
      //   style = 'top:' + (newShow.top - 112) + 'px;'
      // } else {
      //   detailClass = 'meeting_detail_bottom'
      //   style = 'top:' + (newShow.endId * this.unitHeight + 12) + 'px;'
      // }

      // this.meetingDetail = {
      //   index: index,
      //   class: detailClass,
      //   style: style,
      //   meetingName: newShow.meetingName,
      //   time: newShow.time,
      // }

      // 跨诊所, 非预约状态 不可编辑
      // if (this.isDisabled(this.meetingList[index])) return

      this.$emit('editAppt', this.meetingList[index])
    },
    //是否隐藏时间
    isHidTime(id) {
      let timeId = this.timeId
      if (id == timeId || id == timeId + 1) {
        return true
      } else {
        return false
      }
    },
    //会议是否冲突
    hasMeeting(idSt, idEnd) {
      let hasMeeting = this.meetingList.some(function (item) {
        return (
          (idSt > item.startId - 0.1 && idSt < item.endId) ||
          (idEnd > item.startId && idEnd < item.endId + 0.1) ||
          (idSt < item.startId && idEnd > item.endId)
        )
      })
      return hasMeeting
    },
    //判断是否为过去时间
    isOldtime(startId, touchid) {
      let nowDate = new Date()
      let timeNowId =
        nowDate.getHours() * 4 + Math.ceil(nowDate.getMinutes() / 15)
      if (touchid < timeNowId) {
        return -1 //过去时间不能预定
      } else {
        if (startId < timeNowId) {
          return timeNowId //开始时间为timeNowId
        }
        return 0 //开始时间不变
      }
    },
    // 创建会议渲染
    createMeeting() {
      let self = this
      let id = parseInt(this.startId)
      let top = '',
        stId = 0,
        endId = 0,
        height = ''
      let startTime = ''
      let endTime = ''
      if (id < 2) {
        id = 2
      } else if (id > 93) {
        // endId = 96;
        id = 92
        stId = 94
      } else {
        stId = id - 1
        // endId = id + 6;
      }

      //当前建会判断；
      // if (this.isToday === 0) {
      //   let isOld = this.isOldtime(stId, id)
      //   if (isOld === -1) {
      //     this.showError('过去时间不可预订')
      //     timeOutEvent = 1
      //     return
      //   } else if (isOld > 0) {
      //     stId = isOld
      //     id = stId + 2
      //   }
      // }
      endId = stId + this.defaultChoose
      // let test = this.defaultChoose - 1.9;
      // this.meetingList.forEach(function(item) {
      // 	if (id - item.endId < 2.1 && id - item.endId > -0.1) {
      // 		stId = item.endId;
      // 	}
      // 	// if (item.startId - id < 6.1 && item.startId - id > -0.1) {
      // 	//   endId = item.startId;
      // 	// }
      // 	if (item.startId - id < test && item.startId - id > -0.1) {
      // 		endId = item.startId;
      // 	}
      // });

      top = stId * self.unitHeight
      startTime = self.defaultList[stId].timeTitle
      endTime = self.defaultList[endId].timeTitle
      height = self.unitHeight * (endId - stId)
      let startTimeShow = startTime,
        endTimeShow = endTime

      if (!!self.isHidTime(stId) && self.isToday == 0) {
        startTimeShow = ''
      }

      let meeting = {
        ...this.createMeet,
        isFlex: '',
        trueStyle: 'top:0;height:' + height + 'px;',
        style: 'top:' + top + 'px;height:' + height + 'px;',
        length: endId - stId,
        idSt: stId,
        idEnd: endId,
        height: height,
        top: top,
        ...scheduleTableUtil.formatStartTimeAndEndTime(
          startTime,
          endTime,
          this.chooseDateProp,
        ),
        startTimeShow: startTimeShow,
        endTimeShow: endTimeShow,
      }

      this.isCreate = true
      this.createMeet = meeting
      this.startTop = top
    },
    // 点击创建
    touchSt(e) {
      if (!this.isHeaderWithLargeArea)
        returnappointment / appointment / mini - apps / create

      this.scrollTop = scrollYtop
      let self = this
      if (e.target.offsetLeft < 50) {
        return
      }
      if (this.meetingDetail != '') {
        this.meetingDetail = ''
        return
      }
      let item = e.target.offsetTop / self.unitHeight
      self.startId = item
      clearTimeout(timeOutEvent)
      // if (self.isToday == -1) {
      //   this.showError('过去时间不可预订')
      //   timeOutEvent = 1
      //   return
      // }
      timeOutEvent = setTimeout(function () {
        //长按要执行的内容
        timeOutEvent = 0
        //显示方块
        self.startY = e.touches[0].clientY
        if (!!self.isCreate) {
          self.clearCreateMeet()
          return
        }
        self.createMeeting()
      }, 50) //设置定时如果点击创会30-60之间，长按创会则设置300-600之间
    },
    touchEn() {
      let self = this
      clearTimeout(timeOutEvent) //清除定时器
      if (timeOutEvent == 0) {
        //创建会议
        this.isScroll = true
        let idSt = self.createMeet.idSt,
          endId = self.createMeet.idEnd
        if (!!this.hasMeeting(idSt, endId)) {
          this.showError('会议冲突')
          self.isCreate = false
          self.createMeet = defaultMeet
          return
        }
        timeOutEvent = 1
      }
    },
    //上边框滑动开始
    moveTopStart(id, e) {
      this.scrollTop = scrollYtop
      this.topId = parseInt(id)
      this.startY = e.touches[0].clientY
    },
    // 上边框滑动中
    moveTopm(e) {
      let self = this
      let startY = self.startY
      let topId = parseInt(self.topId)
      //移动会议方块
      let y = e.touches[0].clientY
      let nid = Math.floor((y - startY) / self.unitHeight) //移动单元格个数

      let stId = topId + nid,
        endId = self.createMeet.idEnd

      let top = topId * self.unitHeight + (y - startY) //top值
      let trueTextTop = stId * self.unitHeight - top //字体样式
      let height = (endId - topId) * self.unitHeight - (y - startY) //会议高度

      // 订会时间不小于15分钟或者不大于4个小时 height > self.unitHeight * 16
      // 这里处理了可以拖拽到15分钟
      if (height < 5 || stId < 0) {
        return
      }

      this.onWatchMove('top')

      let startTime = self.defaultList[stId].timeTitle
      let endTime = self.defaultList[endId].timeTitle

      let startTimeShow = startTime,
        endTimeShow = endTime
      if (self.isToday == 0) {
        if (!!self.isHidTime(stId)) {
          startTimeShow = ''
        }
        if (!!self.isHidTime(endId)) {
          endTimeShow = ''
        }
      }
      let isFlex = ''
      // if ((height) < self.unitHeight * 2) {
      //   isFlex = "isFlex"
      // }
      //该判断功能暂定
      // let hasMeeting = this.meetingList.some(function(item) {
      // 	return stId < item.endId - 0.1 && endId > item.endId;
      // });
      // if (!!hasMeeting) {
      // 	return;
      // }
      //不得超过当前时间
      // if (self.isToday == 0 && stId < this.timeId + 1) {
      //   return
      // }
      if (
        (y - startY) % self.unitHeight === 0 ||
        (startY - y) % self.unitHeight === 0
      ) {
        vibrate()
        let meeting = {
          ...this.createMeet,
          isFlex: isFlex,
          trueStyle: 'top:0px;height:' + height + 'px;',
          style: 'top:' + top + 'px;height:' + height + 'px;',
          idSt: stId,
          idEnd: endId,
          length: height / self.unitHeight,
          top: top,
          height: height,
          ...scheduleTableUtil.formatStartTimeAndEndTime(
            startTime,
            endTime,
            this.chooseDateProp,
          ),
          startTimeShow: startTimeShow,
          endTimeShow: endTimeShow,
        }
        self.createMeet = meeting
      } else {
        let len = endId - stId //会议时常所占单元格
        let meeting2 = {
          ...this.createMeet,
          isFlex: isFlex,
          trueStyle:
            'top:' + trueTextTop + 'px;height:' + len * self.unitHeight + 'px;',
          style: 'top:' + top + 'px;height:' + height + 'px;',
          // meetingName: '再次点击新建日程',
          idSt: stId,
          idEnd: endId,
          length: len,
          top: top,
          height: height,
          startTime: startTime,
          endTime: endTime,
          startTimeShow: startTimeShow,
          endTimeShow: endTimeShow,
        }
        self.createMeet = meeting2
      }
    },
    //上边框滑动结束
    moveTopEnd() {
      let self = this
      vibrate()
      let meeting = self.createMeet
      // let trueHeight = (meeting.idEnd-meeting.idSt) * self.unitHeight;
      let trueHeight = meeting.length * self.unitHeight
      // if (self.isToday == 0) {
      //   //如果是今天需判断是否当前时间之前
      //   let isOld = this.isOldtime(meeting.idSt, meeting.idSt);
      //   if (isOld == -1) {
      //     this.showError("过去时间不可订")
      //     self.isCreate = false;
      //     self.createMeet = "";
      //     return;
      //   }
      // }
      // if (!!this.hasMeeting(meeting.idSt, meeting.idEnd)) {
      //   this.showError("会议冲突")
      //   self.isCreate = false;
      //   self.createMeet = "";
      //   return;
      // }
      if (trueHeight > meeting.height) {
        let top = meeting.idSt * self.unitHeight
        let style = 'top:' + top + 'px;height:' + trueHeight + 'px;'
        let startTime = self.defaultList[meeting.idSt].timeTitle
        let endTime = self.defaultList[meeting.idEnd].timeTitle
        let startTimeShow = startTime,
          endTimeShow = endTime
        if (self.isToday == 0) {
          if (!!self.isHidTime(meeting.idSt)) {
            startTimeShow = ''
          }
          if (!!self.isHidTime(meeting.idEnd)) {
            endTimeShow = ''
          }
        }
        let NewcreateMeet = {
          ...meeting,
          isFlex: self.createMeet.isFlex,
          trueStyle: 'top:0px;height:' + trueHeight + 'px;',
          style: style,
          idSt: meeting.idSt,
          idEnd: meeting.idEnd,
          duration: meeting.idEnd - meeting.idSt,
          length: meeting.length,
          height: trueHeight,
          top: top,
          ...scheduleTableUtil.formatStartTimeAndEndTime(
            startTime,
            endTime,
            this.chooseDateProp,
          ),
          startTimeShow: startTimeShow,
          endTimeShow: endTimeShow,
        }
        self.createMeet = NewcreateMeet

        self.createMeet.patient &&
          self.$emit('changeCard', {
            meet: self.createMeet,
            type: 'moveTop',
          })
      }
    },
    //拉下边框下移开始
    moveBottomStart(id, e) {
      this.scrollTop = scrollYtop
      this.bottomId = parseInt(id)
      this.endY = e.touches[0].clientY
    },
    //拉下边框下移中
    moveBottomm(e) {
      let self = this
      let endY = self.endY
      let defaultId = parseInt(self.bottomId)
      //移动会议方块
      let y = e.touches[0].clientY
      let nid = Math.ceil((y - endY) / self.unitHeight)
      let top = self.createMeet.top
      let height =
        y - endY + (defaultId - self.createMeet.idSt) * self.unitHeight

      // 计算后的底部id 如果等于97就设为96
      let end = defaultId + nid
      //到最小单元格不允许移动 或者是超过4个小时 height > self.unitHeight * 16
      // 设置可以拖拽到15分钟
      if (height < 5 || end > 96) {
        return
      }

      this.onWatchMove('bottom')

      let startTime = self.defaultList[self.createMeet.idSt].timeTitle
      let endTime = self.defaultList[end].timeTitle
      let startTimeShow = startTime,
        endTimeShow = endTime
      if (self.isToday == 0) {
        if (!!self.isHidTime(self.createMeet.idSt)) {
          startTimeShow = ''
        }
        if (!!self.isHidTime(end)) {
          endTimeShow = ''
        }
      }
      let isFlex = ''
      // if ((height) < self.unitHeight * 2) {
      //   isFlex = "isFlex"
      // }
      //该判断功能暂定
      // let hasMeeting = this.meetingList.some(function(item) {
      // 	return end > item.startId + 0.1 && self.createMeet.idSt < item.startId;
      // });
      // if (!!hasMeeting) {
      // 	return;
      // }
      if (
        (y - endY) % self.unitHeight === 0 ||
        (endY - y) % self.unitHeight === 0
      ) {
        vibrate()
        let meeting = {
          ...this.createMeet,
          isFlex: isFlex,
          trueStyle: 'top:0px;height:' + height + 'px;',
          style: 'top:' + top + 'px;height:' + height + 'px;',
          idSt: self.createMeet.idSt,
          idEnd: end,
          length: height / self.unitHeight,
          height: height,
          top: top,
          ...scheduleTableUtil.formatStartTimeAndEndTime(
            startTime,
            endTime,
            this.chooseDateProp,
          ),
          startTimeShow: startTimeShow,
          endTimeShow: endTimeShow,
        }
        self.createMeet = meeting
      } else {
        let len = end - self.createMeet.idSt
        let meeting2 = {
          ...this.createMeet,
          isFlex: isFlex,
          trueStyle: 'top:0px;height:' + len * self.unitHeight + 'px;',
          style: 'top:' + top + 'px;height:' + height + 'px;',
          // meetingName: '再次点击新建日程',
          idSt: self.createMeet.idSt,
          idEnd: end,
          length: len,
          height: height,
          top: top,
          startTime: startTime,
          endTime: endTime,
          startTimeShow: startTimeShow,
          endTimeShow: endTimeShow,
        }
        self.createMeet = meeting2
      }
    },
    //拉下边框下移结束
    moveBottomEnd(e) {
      let self = this
      vibrate()
      let meeting = self.createMeet
      let trueHeight = meeting.length * self.unitHeight
      // if (!!this.hasMeeting(meeting.idSt, meeting.idEnd)) {
      //   this.showError("会议冲突")
      //   self.isCreate = false;
      //   self.createMeet = "";
      //   return;
      // }
      if (trueHeight > meeting.height) {
        let style = 'top:' + meeting.top + 'px;height:' + trueHeight + 'px;'
        let startTime = self.defaultList[meeting.idSt].timeTitle
        let endTime = self.defaultList[meeting.idEnd].timeTitle

        let startTimeShow = startTime,
          endTimeShow = endTime
        if (self.isToday == 0) {
          if (!!self.isHidTime(meeting.idSt)) {
            startTimeShow = ''
          }
          if (!!self.isHidTime(meeting.idEnd)) {
            endTimeShow = ''
          }
        }
        let NewcreateMeet = {
          ...meeting,
          isFlex: meeting.isFlex,
          trueStyle: 'top:0px;height:' + trueHeight + 'px;',
          style: style,
          idSt: meeting.idSt,
          idEnd: meeting.idEnd,
          duration: meeting.idEnd - meeting.idSt,
          length: meeting.length,
          height: trueHeight,
          top: meeting.top,
          ...scheduleTableUtil.formatStartTimeAndEndTime(
            startTime,
            endTime,
            this.chooseDateProp,
          ),
          startTimeShow: startTimeShow,
          endTimeShow: endTimeShow,
        }
        self.createMeet = NewcreateMeet

        self.createMeet.patient &&
          self.$emit('changeCard', {
            meet: self.createMeet,
            type: 'moveBottom',
          })
      }
    },
    //拖拽整个会议开始
    touchMeetingStart(e) {
      let self = this
      self.scrollTop = scrollYtop
      self.meetingTouchStartY = e.touches[0].clientY
      self.meetingTouchStartOff = e.currentTarget.offsetTop
      self.meetingTouchIdSt = self.createMeet.idSt
      // self.isScroll = false
    },
    //拖拽整个会议移动中
    touchMeetingMove(e) {
      let self = this
      let y = e.touches[0].clientY
      let ny = y - self.meetingTouchStartY //移动相对位移
      let nid = Math.floor(ny / self.unitHeight) //移动的单元格个数

      let meeting = self.createMeet
      let top = meeting.top + ny //top值

      let idSt = self.meetingTouchIdSt + nid
      let idEnd = idSt + meeting.length

      if (
        idSt < 0 ||
        idEnd > this.minAll ||
        idSt > this.minAll - this.defaultChoose
      ) {
        return
      }

      this.onWatchMove(ny > 0 ? 'bottom' : 'top')

      //不能超过时间线之前
      // if (self.isToday == 0 && idSt < this.timeId + 1) {
      //   return
      // }
      // let hasMeeting = this.meetingList.some(function(item) {
      // 	return idSt < item.endId - 0.1 && idEnd > item.endId || idEnd > item.startId - 0.1 && idSt < item.startId;
      // });
      // if (!!hasMeeting) {
      // 	return;
      // }
      let startTime = self.defaultList[idSt].timeTitle
      let endTime = self.defaultList[idEnd].timeTitle
      let startTimeShow = startTime,
        endTimeShow = endTime
      if (self.isToday == 0) {
        if (!!self.isHidTime(idSt)) {
          startTimeShow = ''
        }
        if (!!self.isHidTime(idEnd)) {
          endTimeShow = ''
        }
      }
      let trueTextTop = idSt * self.unitHeight - top

      let NewcreateMeet = {
        ...meeting,
        isFlex: meeting.isFlex,
        trueStyle: 'top:' + trueTextTop + 'px;height:' + meeting.height + 'px;',
        style: 'top:' + top + 'px;height:' + meeting.height + 'px;',
        idSt: idSt,
        idEnd: idEnd,
        length: meeting.length,
        height: meeting.height,
        top: meeting.top,
        ...scheduleTableUtil.formatStartTimeAndEndTime(
          startTime,
          endTime,
          this.chooseDateProp,
        ),
        startTimeShow: startTimeShow,
        endTimeShow: endTimeShow,
      }
      self.createMeet = NewcreateMeet
      if (trueTextTop == 0) {
        vibrate()
      }
    },
    //拖拽整个会议移动结束
    touchMeetingEnd(e) {
      // this.isScroll = true
      let self = this
      let y = e.currentTarget.offsetTop
      let absY = Math.abs(y - self.meetingTouchStartOff)

      // 表示点击的左侧时间点
      if (e.target.offsetLeft === 0) {
        return
      }

      if (absY == 0) {
        // 点击编辑中的卡片 如果没有患者信息则需要跳转到新建预约页面, 否则不做任何操作
        if (!this.createMeet.patient) {
          self.$emit('createAppt', this.createMeet)
          this.createApptClick = true

          return
        }

        // 跨诊所, 非预约状态 不可编辑
        // if (this.isDisabled(this.createMeet)) return

        this.createApptClick = true
        self.$emit('editAppt', this.createMeet)

        return
      }
      //拖动会议单元格修正
      vibrate()
      let meeting = self.createMeet
      let trueTop = meeting.idSt * self.unitHeight
      // if (self.isToday == 0) {
      //   //如果是今天需判断是否当前时间之前
      //   let isOld = this.isOldtime(meeting.idSt, meeting.idSt);
      //   if (isOld == -1) {
      //     this.showError("过去时间不可订")
      //     self.isCreate = false;
      //     self.createMeet = "";
      //     return;
      //   }
      // }
      // if (!!this.hasMeeting(meeting.idSt, meeting.idEnd)) {
      // 	this.showError("会议冲突")
      // 	self.isCreate = false;
      // 	self.createMeet = "";
      // 	return;
      // }
      // console.log('meeting', meeting)

      if (meeting && meeting.patientId) {
        apptDataService.getApptVerify(
          meeting,
          () => {
            if (trueTop != meeting.top) {
              let style =
                'top:' + trueTop + 'px;height:' + meeting.height + 'px;'
              let startTime = self.defaultList[meeting.idSt].timeTitle,
                endTime = self.defaultList[meeting.idEnd].timeTitle
              let startTimeShow = startTime,
                endTimeShow = endTime
              if (self.isToday == 0) {
                if (!!self.isHidTime(meeting.idSt)) {
                  startTimeShow = ''
                }
                if (!!self.isHidTime(meeting.idEnd)) {
                  endTimeShow = ''
                }
              }
              let NewcreateMeet = {
                ...meeting,
                isFlex: meeting.isFlex,
                trueStyle: 'top:0px;height:' + meeting.height + 'px;',
                style: style,
                idSt: meeting.idSt,
                idEnd: meeting.idEnd,
                length: meeting.length,
                height: meeting.height,
                top: trueTop,
                ...scheduleTableUtil.formatStartTimeAndEndTime(
                  startTime,
                  endTime,
                  this.chooseDateProp,
                ),
                startTimeShow: startTimeShow,
                endTimeShow: endTimeShow,
              }
              self.createMeet = NewcreateMeet

              self.createMeet.patient &&
                self.$emit('changeCard', {
                  meet: self.createMeet,
                  type: 'touchMeeting',
                })
            }
            self.clearCreateMeet()
          },
          self.clearCreateMeet(),
          self.clearCreateMeet(),
          self.clearCreateMeet(),
        )
      }
    },
    // 长按卡片新增编辑卡片
    longTapWithEdit(e, meetInfo) {
      // 限制可编辑卡片 非预约状态 跨诊所不可编辑
      if (this.isDisabled(meetInfo) || !this.isHeaderWithLargeArea) return

      const {
        startTimeStamp,
        endTimeStamp,
        style,
        endId,
        startId,
        top,
      } = meetInfo
      const startTime = moment(startTimeStamp).format('HH:mm')
      const endTime = moment(endTimeStamp).format('HH:mm')
      const height = (endId - startId) * this.unitHeight

      // 格式化成编辑卡片的数据
      const meeting = {
        ...scheduleTableUtil.formatStartTimeAndEndTime(
          startTime,
          endTime,
          this.chooseDateProp,
        ),
        startTimeShow: startTime,
        endTimeShow: endTime,
        height,
        idEnd: endId,
        idSt: startId,
        isFlex: '',
        length: endId - startId,
        trueStyle: 'top:0;height:' + height + 'px;',
        ...meetInfo,
      }

      this.isCreate = true
      this.createMeet = meeting
      this.startTop = top
      this.editMeet = true
    },
    // 获取预约项目卡片颜色
    getApptItemColor(color) {
      const colorConfig = colorNumberList.find((v) => v.color === color)

      return colorConfig ? colorConfig.border : ''
    },
    getDocoratorColor(appointmentStatus) {
      return this.appointmentStatusColorMap[appointmentStatus]
    },
    // 清空创建的编辑卡片
    clearCreateMeet() {
      this.isCreate = false
      this.createMeet = defaultMeet
      this.createApptClick = false
    },
    getBackgroundColorByScheduleItemList(timeTitle) {
      if (timeTitle === '24:00') return
      // 如果属于正常班 => 白色
      // 如果属于休息班 => 红色
      // 如果属于正常班 又属于休息班 => 不应该存在这样的逻辑（数据异常导致）=> 白色
      // 如果不属于正常班也不属于休息班 => 灰色
      const rowStartTimestampByToday =
        moment(this.chooseDateProp + ' ' + timeTitle).valueOf() -
        moment(this.chooseDateProp).startOf('day')
      const rowEndTimestampByToday = rowStartTimestampByToday + 900000 - 1 // 900000 = 15分钟的毫秒数

      const abledItemList = this.scheduleList.filter(
        (item) => item.allowAppointmentStatus === 1,
      )
      const disabledItemList = this.scheduleList.filter(
        (item) => item.allowAppointmentStatus !== 1,
      )

      const rowInAbledItem = this.checkWhetherInStaffScheduleItemList(
        rowStartTimestampByToday,
        rowEndTimestampByToday,
        abledItemList,
      )
      const rowInDisabledItem = this.checkWhetherInStaffScheduleItemList(
        rowStartTimestampByToday,
        rowEndTimestampByToday,
        disabledItemList,
      )

      if (rowInAbledItem) {
        return 'white'
      }

      if (rowInDisabledItem) {
        return '#fff7f7'
      }

      return '#f6f6f6'
    },
    checkWhetherInStaffScheduleItemList(
      startTimestampByToday,
      endTimestampByToday,
      itemList,
    ) {
      return (
        itemList.filter((item) => {
          return numberRangeUtil.isOver(
            [startTimestampByToday, endTimestampByToday],
            [item.beginTimeMilliSecond, item.endTimeMilliSecond - 1],
          )
        }).length > 0
      )
    },
    getGenderText(apptInfo) {
      if (
        this.GENDER_ENUM &&
        this.GENDER_ENUM.properties &&
        this.VIS_TYPE_ENUM &&
        this.VIS_TYPE_ENUM.properties &&
        apptInfo &&
        apptInfo.patient &&
        apptInfo.patient.gender
      ) {
        return `（${
          this.GENDER_ENUM.properties[apptInfo.patient.gender].text.zh_CN
        }${
          apptInfo.visType && apptInfo.visTypeName
            ? '，' + apptInfo.visTypeName
            : ''
        }）`
      }

      return ''
    },
    /**
     * 监听拖拽 进行滚动
     * @params arrow (bottom, top)
     */
    onWatchMove(arrow) {
      if (!this.moveTimer) {
        const limit = 30
        let cardPosition = {}
        const query = uni.createSelectorQuery().in(this)
        query
          .select('#createApptId')
          .boundingClientRect((data) => {
            cardPosition = data
          })
          .exec()
        this.moveTimer = setTimeout(() => {
          clearTimeout(this.moveTimer)
          this.moveTimer = null

          if (arrow === 'top' && cardPosition.top - this.tableToTop < limit) {
            const scrollTop = this.scrollTop - limit
            this.scrollTop = scrollTop < 0 ? 0 : scrollTop
          }

          if (
            arrow === 'bottom' &&
            windowHeight - cardPosition.bottom < limit * 2
          ) {
            this.scrollTop += limit * 2
          }
        }, 500)
      }
    },
    // 判断预约卡片是否支持编辑
    isDisabled(appt) {
      // 非预约状态不可编辑
      const notApptStatus = !(
        this.APPOINTMENT_STATUS_ENUM.APPOINTMENT.value ===
          appt.appointmentStatus ||
        this.APPOINTMENT_STATUS_ENUM.CONFIRM.value === appt.appointmentStatus
      )

      const isCurInstitution = appt.acrossInstitutionAppointmentFlag
      return notApptStatus || isCurInstitution
    },
  },
}
</script>

<style lang="scss" scoped>
$timeSize: 12px;
$borderColor: #ddd;

.metting_content_box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-left: 12px;
  .meeting_content_time {
    min-width: 135px;
    height: 40rpx;
    line-height: 40rpx;
    flex: 0 0 40rpx;
  }

  .meeting_content_center {
    flex: 1 1 100%;
    min-height: 32px;
    overflow: hidden;
    .apptItem {
      display: inline-block;
      margin: 0 2px 4px 0;
      padding: 0 6px;
      line-height: 20px;
      border-radius: 4px;
      background-color: #eee;
    }
  }

  .meeting_content_name {
    width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 27px;
    line-height: 27px;
    flex: 0 0 27px;

    &.durationOne {
      line-height: 26rpx;
      font-size: 21rpx;
    }
  }
}

// .blockEvent {
//   width: calc((100% - 50px - 0px) / 1);
//   left: calc(50px + ((100% - 50px - 0px) / 1 + 2px) * 0);
//   background: #f6f6f6 !important;
// }

.meetCard {
  position: relative;
  box-sizing: border-box;
  border-left: none;

  .docorator {
    position: absolute;
    width: 4px;
    height: 100%;
    left: 0;
    top: 0;
  }
}

.dayTable {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
}

.calendar_body::-webkit-scrollbar {
  display: none;
}

.calendar_body {
  height: 100%;
  width: calc(100vw - 8px);
  position: relative;
  overflow-x: hidden;

  .calendar_table {
    margin-top: 15px;
    position: absolute;
    top: 0;
    // z-index: 10;

    .cal_tr {
      width: 100%;
      height: 16px;
      display: flex;
      font-size: 0;
      color: #808080;
    }

    .left_time {
      line-height: 0;
      width: 50px;
      text-align: center;
      color: rgba($color: #000000, $alpha: 0.25);
    }

    .right_content {
      border-top: 1rpx solid #ffffff;
      height: 15px;
      width: calc(100vw - 50px);
    }

    .hasTime {
      font-size: $timeSize;
    }

    .hasTime .right_content {
      border-color: $borderColor !important;
    }
  }

  .calendar_meeting {
    margin-top: 15px;
    position: absolute;
    top: 0;
    // height: 100%;
    width: 100%;

    .redBg {
      background-color: rgba(254, 222, 224, 1);
      color: #f65b67;
      // border-left: 4px solid #F65B67;
    }

    .blurBg {
      // border-left: 4px solid #34BDA0;
      color: #34bda0;
      background-color: rgba(222, 248, 234, 1);
    }

    .meeting_a {
      font-size: $timeSize;
      left: 50px;
      right: 0px;
      position: absolute;
      cursor: pointer;
      background-color: #fff;
      border-radius: 4px;
      overflow: hidden;
      box-sizing: border-box;

      .metting-inner {
        border: 1px solid #ccc;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        border-radius: 4px;

        > .acrossClinic {
          right: -1px;
          top: -1px;
          position: absolute;
          width: 0;
          height: 0;
          border-top: 56rpx solid rgb(246, 64, 74);
          border-left: 56rpx solid transparent;
        }
        .acrossClinicText {
          position: absolute;
          right: 4rpx;
          top: 2rpx;
          color: #fff;
          font-size: 22rpx;
        }
      }
    }

    .meeting_detail {
      width: calc(100% - 52px);
      left: 50px;
      // width: 99%;
      font-size: $timeSize;
      position: absolute;
      background-color: #ffffff;
      height: 100px;
      border-radius: 4px;
      box-shadow: 0 0 5px #999999;
      z-index: 999;
      box-sizing: border-box;
      padding: 10px;
    }

    // .meeting_detail_top {
    //   // top: -114px;
    // }

    // .meeting_detail_bottom {
    //   // bottom: -114px;
    // }

    .meeting_detail_top ::before {
      content: '';
      width: 0;
      height: 0;
      position: absolute;
      bottom: -7px;
      left: calc(50% - 6px);
      border-style: solid;
      border-width: 8px;
      border-color: #ffffff #ffffff transparent transparent;
      transform: rotate(135deg);
      box-shadow: 2px -2px 3px -1px #cccccf;
    }

    // 向上的气泡
    .meeting_detail_bottom:after {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      top: -7px;
      left: calc(50% - 6px);
      border-style: solid;
      border-width: 8px;
      border-color: transparent transparent #fff #fff;
      transform: rotate(135deg);
      box-shadow: -2px 2px 3px 0 rgba(0, 0, 0, 0.2);
    }

    .isFlex {
      align-items: center;
      display: flex;

      .meeting_content_name {
        width: 135px;
      }
    }

    .meeting_create {
      left: 50px;
      right: 0px;
      height: 63px;
      position: absolute;
      border-radius: 3px;
      background-color: rgba(92, 187, 137, 0.9);
      z-index: 990;
      font-size: $timeSize;

      .hasAppt {
        color: #ffffff;

        .durationOne {
          line-height: 28rpx;
        }
      }

      .radius {
        width: 20px;
        height: 20px;
        position: absolute;
        z-index: 999;
        cursor: pointer;

        display: flex;
        justify-content: center;
        align-items: center;

        view {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          border: 1rpx solid #3788c8;
          background-color: #ffffff;
        }
      }

      .radius_first {
        top: -10px;
        left: 0;
      }

      .radius_second {
        bottom: -10px;
        right: 0;
      }

      .meeting_left_time {
        position: absolute;
        left: -50px;
      }

      .left_Time_show {
        background-color: #ffffff;
        width: 50px;
        position: absolute;
        font-size: $timeSize;
        text-align: center;
        color: $common-color;
        line-height: 0;
      }

      .endTimeText {
        bottom: 0;
      }
    }
  }

  .time_now {
    margin-top: 15px;
    display: flex;
    align-items: center;
    width: 100vw;
    height: 0.5px;
    position: absolute;
    z-index: 50;

    .left_text_red {
      text-align: center;
      width: 50px;
      color: #ff0000;
      font-size: $timeSize;
      line-height: 0;
    }

    .left_text_radio {
      width: 4px;
      height: 4px;
      background-color: #ff0000;
      border: 1rpx solid #ffffff;
      border-radius: 50%;
      line-height: 0;
      margin-left: -3px;
    }

    .time_line {
      flex-grow: 1;
      border: 0.5px solid red;
    }
  }
}
</style>
