<template>
  <view class="dayTable">
    <scroll-view
      class="calendar_body"
      :style="scrollHeight"
      :scroll-y="isScroll"
      :scroll-top="scrollTop"
      @scroll="scroll"
    >
      <!-- 默认底色表格 -->
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
          <view class="right_content"></view>
        </view>
      </view>

      <!-- 会议区域 -->
      <view class="calendar_meeting">
        <!-- 已创建的会议 -->
        <view
          v-for="(item, index) in meetingList"
          :key="index"
          :style="item.style"
          class="meeting_a"
          @click="showDetail(index, $event)"
          @longtap="longTapWithEdit($event, item)"
        >
          <view class="create_content_box">
            <view class="meeting_content_time">{{ item.time }}</view>
            <view class="meeting_content_name">{{ item.meetingName }}</view>
          </view>
        </view>

        <!-- 				<view v-if="meetingDetail" class='meeting_detail' :class="meetingDetail.class" :style="meetingDetail.style">
					<view>会议发起人</view>
					<view>{{meetingDetail.time}}</view>
					<view>{{meetingDetail.meetingName}}</view>
					<view>区域/地点</view>
				</view>
 -->
        <!-- 创建会议 -->
        <view
          v-if="isCreate"
          class="meeting_create"
          :style="createMeet.style"
          @touchstart.stop="touchMeetingStart"
          @touchmove.stop="touchMeetingMove"
          @touchend.stop="touchMeetingEnd"
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

          <view :style="createMeet.trueStyle" class="meeting_left_time">
            <view class="left_Time_show">{{ createMeet.startTimeShow }}</view>
            <view class="left_Time_show endTimeText">{{ createMeet.endTimeShow }}</view>
          </view>
          <view class="create_content_box">
            <view class="meeting_content">
              {{ createMeet.startTime }} - {{ createMeet.endTime }}
            </view>
            <text class="meeting_content">{{ createMeet.meetingName }}</text>
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
import { mapState, mapMutations } from 'vuex';
let timeOutEvent = 0;
let scrollYtop = 0;
let hidID = -1;

function vibrate() {
  uni.vibrateShort();
}

export default {
  props: {
    chooseDateProp: String,
    hourHeight: Number, //表格单元高度
    // uMinute: Number, //表格单元时长
    // showMin: Number, //显示单元时长
    defaultChooseLong: Number, //默认点击所占时长
    scrollHeight: String,
  },
  data() {
    return {
      chooseDate: this.chooseDateProp,
      unitHeight: 16,
      unitMinute: 15,
      showMinute: 60,
      defaultChoose: 8,
      scale: 0,
      minRatio: 0,
      minAll: 0,
      defaultList: [],
      meetingList: [],
      nowLine: '',
      startId: 0,
      isCreate: false,
      createMeet: '',
      isScroll: true,
      nowTime: {},
      scrollTop: 0,
      timeId: -1,
      isToday: 0,
      meetingDetail: '',
    };
  },
  //如果将chooseDate放入vuex 监听可使用下面方法
  // watch: {
  //   chooseDate: function(n, o) {
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
  //     'chooseDate'
  //   ]),

  // },
  created() {
    this.unitHeight = parseInt(this.hourHeight / 4) || 16; //16px
    // this.unitMinute = parseInt(this.uMinute) || 15; //15分钟
    // this.showMinute = parseInt(this.showMin) || 60; //60分钟
    this.defaultChoose = parseInt(this.defaultChooseLong / 15) || 8; //120分钟
    this.minMute = parseInt(this.showMin) || 1;

    this.minRatio = this.showMinute / this.unitMinute; //4
    this.minAll = 1440 / this.unitMinute; //96
    //后续修改
    this.scrollTop = this.unitHeight * 36;
    this.getDefaultTable();
    this.getMeetingList();
    this.isTodayFun(this.chooseDate);
  },
  methods: {
    showError(message) {
      uni.showToast({
        title: message,
        icon: 'none',
        duration: 2000,
      });
    },
    scroll(e) {
      //手机端区别手指滚动和点击操作
      clearTimeout(timeOutEvent);
      scrollYtop = e.detail.scrollTop;
    },
    //判断是否为今天
    isTodayFun(d) {
      let isToday;
      let td = new Date();
      td = new Date(td.getFullYear(), td.getMonth(), td.getDate());
      let od = new Date(d);
      od = new Date(od.getFullYear(), od.getMonth(), od.getDate());
      let xc = od - td;
      let result = '';
      if (xc < 0) {
        isToday = -1;
      } else if (xc == 0) {
        isToday = 0;
      } else {
        isToday = 1;
      }
      this.isToday = isToday;
      if (this.isToday == 0) {
        this.getTimeNow();
      }
    },
    //获取当前时间imeNow
    getTimeNow() {
      let self = this;
      let hidId = -1;
      let nowDate = new Date();
      let hour = nowDate.getHours(); //获取当前小时数(0-23)
      let min = nowDate.getMinutes(); //获取当前分钟数(0-59)
      let top = (hour * self.minRatio + min / self.unitMinute) * self.unitHeight - 1;
      let timeLine = 'top:' + top + 'px;';
      let text = nowDate.toString().substring(15, 21);
      //是否隐藏上下时间线
      if (min < 15) {
        hidId = hour * self.minRatio;
      } else if (min > 45) {
        hidId = (hour + 1) * self.minRatio;
      }
      self.nowLine = timeLine;
      self.nowTime = {
        line: timeLine,
        text: text,
      };
      if (hidId > -1) {
        self.defaultList[hidId].hidClass = 'font-size:0;';
      }
      hidID = hidId;
      let timeId = hour * self.minRatio + Math.floor(min / self.unitMinute);

      self.timeId = timeId;
      this.scrollTop = timeId * this.unitHeight - 50;
    },
    //获取表格默认数据
    getDefaultTable() {
      let self = this;
      let list = [],
        // all = self.minAll,
        rat = this.minRatio;
      for (let i = 0; i < 97; i++) {
        let time = '',
          timeClass = '';
        let hour = Math.floor(i / rat);
        hour = hour < 10 ? '0' + hour : hour;

        if (i % rat === 0) {
          time = hour + ':00';
          timeClass = 'hasTime';
        } else {
          time = hour + ':' + (i % rat) * self.unitMinute;
        }
        list.push({
          trClass: timeClass,
          timeTitle: time,
        });
      }
      this.defaultList = list;
    },
    //整理会议列表数据
    getMeetingList() {
      let meetingList = [
        {
          isMe: true,
          meetingName: '会议测试测试测试测试测试测试gggggggggggddddd',
          startTime: '2019-07-31 06:00:00',
          endTime: '2019-07-31 08:30:02',
        },
        {
          isMe: false,
          meetingName: '其他人的会议',
          startTime: '2019-07-31 04:15:00',
          endTime: '2019-07-31 05:30:02',
        },
        {
          isMe: true,
          meetingName: '测试讨论bugdfdfsdfdsf会议',
          startTime: '2019-07-31 15:15:00',
          endTime: '2019-07-31 15:30:02',
        },
      ];
      let list = [];
      for (let i = 0; i < meetingList.length; i++) {
        let start = meetingList[i].startTime.substring(11, 16).split(':');
        let end = meetingList[i].endTime.substring(11, 16).split(':');

        let st = parseInt(start[0] * this.minRatio) + parseInt(start[1] / this.unitMinute);
        let ed = parseInt(end[0] * this.minRatio) + parseInt(end[1] / this.unitMinute);

        let height = 'height:' + (ed - st) * this.unitHeight + 'px;';
        let top = 'top:' + st * this.unitHeight + 'px;';
        let isFlex = '';
        let bgClass = 'blurBg';
        // if ((ed - st) < 2) {
        //   isFlex = "isFlex "
        // }
        if (!meetingList[i].isMe) {
          bgClass = 'redBg ';
        }

        list.push({
          top: st * this.unitHeight,
          style: height + top,
          meetingName: meetingList[i].meetingName,
          time:
            meetingList[i].startTime.substring(5, 16) +
            '-' +
            meetingList[i].endTime.substring(11, 16),
          isFlex: isFlex,
          startId: st,
          endId: ed,
          bgClass: bgClass,
        });
      }
      this.meetingList = list;
    },
    //点击会议列表
    showDetail(index, e) {
      this.scrollTop = scrollYtop;

      if (!!this.isCreate) {
        this.isCreate = false;
        this.createMeet = '';
        return;
      }
      if (this.meetingDetail != '' && this.meetingDetail.index == index) {
        this.meetingDetail = '';
        return;
      }
      let y = e.touches[0].clientY;
      let newShow = this.meetingList[index],
        detailClass = '',
        style = '';
      if (y > 300) {
        detailClass = 'meeting_detail_top';
        style = 'top:' + (newShow.top - 112) + 'px;';
      } else {
        detailClass = 'meeting_detail_bottom';
        style = 'top:' + (newShow.endId * this.unitHeight + 12) + 'px;';
      }
      this.meetingDetail = {
        index: index,
        class: detailClass,
        style: style,
        meetingName: newShow.meetingName,
        time: newShow.time,
      };
    },

    //是否隐藏时间
    isHidTime(id) {
      let timeId = this.timeId;
      if (id == timeId || id == timeId + 1) {
        return true;
      } else {
        return false;
      }
    },
    //会议是否冲突
    hasMeeting(idSt, idEnd) {
      let hasMeeting = this.meetingList.some(function (item) {
        return (
          (idSt > item.startId - 0.1 && idSt < item.endId) ||
          (idEnd > item.startId && idEnd < item.endId + 0.1) ||
          (idSt < item.startId && idEnd > item.endId)
        );
      });
      return hasMeeting;
    },
    //判断是否为过去时间
    isOldtime(startId, touchid) {
      let nowDate = new Date();
      let timeNowId = nowDate.getHours() * 4 + Math.ceil(nowDate.getMinutes() / 15);
      if (touchid < timeNowId) {
        return -1; //过去时间不能预定
      } else {
        if (startId < timeNowId) {
          return timeNowId; //开始时间为timeNowId
        }
        return 0; //开始时间不变
      }
    },
    //创建会议渲染
    createMeeting() {
      let self = this;
      let id = parseInt(this.startId);
      let top = '',
        stId = 0,
        endId = 0,
        height = '';
      let startTime = '';
      let endTime = '';
      if (id < 2) {
        id = 2;
      } else if (id > 89) {
        // endId = 96;
        id = 90;
        stId = 88;
      } else {
        stId = id - 2;
        // endId = id + 6;
      }

      //当前建会判断；
      if (this.isToday === 0) {
        let isOld = this.isOldtime(stId, id);
        if (isOld === -1) {
          this.showError('过去时间不可预订');
          timeOutEvent = 1;
          return;
        } else if (isOld > 0) {
          stId = isOld;
          id = stId + 2;
        }
      }
      endId = stId + this.defaultChoose;
      let test = this.defaultChoose - 1.9;
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

      top = stId * self.unitHeight;
      startTime = self.defaultList[stId].timeTitle;
      endTime = self.defaultList[endId].timeTitle;
      height = self.unitHeight * (endId - stId);
      let startTimeShow = startTime,
        endTimeShow = endTime;

      if (!!self.isHidTime(stId) && self.isToday == 0) {
        startTimeShow = '';
      }

      let meeting = {
        isFlex: '',
        trueStyle: 'top:0;height:' + height + 'px;',
        style: 'top:' + top + 'px;height:' + height + 'px;',
        meetingName: '再次点击新建日程',
        time: startTime + ' - ' + endTime,
        length: endId - stId,
        idSt: stId,
        idEnd: endId,
        height: height,
        top: top,
        startTime: startTime,
        endTime: endTime,
        startTimeShow: startTimeShow,
        endTimeShow: endTimeShow,
      };

      console.log(meeting);

      this.isCreate = true;
      this.createMeet = meeting;
      this.startTop = top;
    },
    //点击开始
    touchSt(e) {
      console.log(e);

      this.scrollTop = scrollYtop;
      let self = this;
      if (e.target.offsetLeft < 50) {
        return;
      }
      if (this.meetingDetail != '') {
        this.meetingDetail = '';
        return;
      }
      let item = e.target.offsetTop / self.unitHeight;
      self.startId = item;
      clearTimeout(timeOutEvent);
      if (self.isToday == -1) {
        this.showError('过去时间不可预订');
        timeOutEvent = 1;
        return;
      }
      timeOutEvent = setTimeout(function () {
        //长按要执行的内容
        timeOutEvent = 0;
        //显示方块
        self.startY = e.touches[0].clientY;
        if (!!self.isCreate) {
          self.isCreate = false;
          self.createMeet = '';
          return;
        }
        self.createMeeting();
      }, 50); //设置定时如果点击创会30-60之间，长按创会则设置300-600之间
    },
    touchEn() {
      let self = this;
      clearTimeout(timeOutEvent); //清除定时器
      if (timeOutEvent == 0) {
        //创建会议
        this.isScroll = true;
        let idSt = self.createMeet.idSt,
          endId = self.createMeet.idEnd;
        if (!!this.hasMeeting(idSt, endId)) {
          this.showError('会议冲突');
          self.isCreate = false;
          self.createMeet = '';
          return;
        }
        timeOutEvent = 1;
      }
    },
    //上边框滑动开始
    moveTopStart(id, e) {
      this.scrollTop = scrollYtop;
      this.topId = parseInt(id);
      this.startY = e.touches[0].clientY;
    },
    //上边框滑动中
    moveTopm(e) {
      let self = this;
      let startY = self.startY;
      let topId = parseInt(self.topId);
      //移动会议方块
      let y = e.touches[0].clientY;
      let nid = Math.floor((y - startY) / self.unitHeight); //移动单元格个数

      let stId = topId + nid,
        endId = self.createMeet.idEnd;
      let top = topId * self.unitHeight + (y - startY); //top值
      let trueTextTop = stId * self.unitHeight - top; //字体样式
      let height = (endId - topId) * self.unitHeight - (y - startY); //会议高度

      if (height < self.minMute * self.unitHeight || height > self.unitHeight * 16) {
        //订会时间不小于15分钟或者不大于4个小时
        return;
      }
      let startTime = self.defaultList[stId].timeTitle;
      let endTime = self.defaultList[endId].timeTitle;

      let startTimeShow = startTime,
        endTimeShow = endTime;
      if (self.isToday == 0) {
        if (!!self.isHidTime(stId)) {
          startTimeShow = '';
        }
        if (!!self.isHidTime(endId)) {
          endTimeShow = '';
        }
      }
      let isFlex = '';
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
      if (self.isToday == 0 && stId < this.timeId + 1) {
        return;
      }
      if ((y - startY) % self.unitHeight === 0 || (startY - y) % self.unitHeight === 0) {
        vibrate();
        let meeting = {
          isFlex: isFlex,
          trueStyle: 'top:0px;height:' + height + 'px;',
          style: 'top:' + top + 'px;height:' + height + 'px;',
          meetingName: '再次点击新建日程',
          idSt: stId,
          idEnd: endId,
          length: height / self.unitHeight,
          top: top,
          height: height,
          startTime: startTime,
          endTime: endTime,
          startTimeShow: startTimeShow,
          endTimeShow: endTimeShow,
        };
        self.createMeet = meeting;
      } else {
        let len = endId - stId; //会议时常所占单元格
        let meeting2 = {
          isFlex: isFlex,
          trueStyle: 'top:' + trueTextTop + 'px;height:' + len * self.unitHeight + 'px;',
          style: 'top:' + top + 'px;height:' + height + 'px;',
          meetingName: '再次点击新建日程',
          idSt: stId,
          idEnd: endId,
          length: len,
          top: top,
          height: height,
          startTime: startTime,
          endTime: endTime,
          startTimeShow: startTimeShow,
          endTimeShow: endTimeShow,
        };
        self.createMeet = meeting2;
      }
    },
    //上边框滑动结束
    moveTopEnd() {
      let self = this;
      vibrate();
      let meeting = self.createMeet;
      // let trueHeight = (meeting.idEnd-meeting.idSt) * self.unitHeight;
      let trueHeight = meeting.length * self.unitHeight;
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
        let top = meeting.idSt * self.unitHeight;
        let style = 'top:' + top + 'px;height:' + trueHeight + 'px;';
        let startTime = self.defaultList[meeting.idSt].timeTitle;
        let endTime = self.defaultList[meeting.idEnd].timeTitle;
        let startTimeShow = startTime,
          endTimeShow = endTime;
        if (self.isToday == 0) {
          if (!!self.isHidTime(meeting.idSt)) {
            startTimeShow = '';
          }
          if (!!self.isHidTime(meeting.idEnd)) {
            endTimeShow = '';
          }
        }
        let NewcreateMeet = {
          isFlex: self.createMeet.isFlex,
          trueStyle: 'top:0px;height:' + trueHeight + 'px;',
          style: style,
          meetingName: meeting.meetingName,
          idSt: meeting.idSt,
          idEnd: meeting.idEnd,
          length: meeting.length,
          height: trueHeight,
          top: top,
          startTime: startTime,
          endTime: endTime,
          startTimeShow: startTimeShow,
          endTimeShow: endTimeShow,
        };
        self.createMeet = NewcreateMeet;
      }
    },
    //拉下边框下移开始
    moveBottomStart(id, e) {
      this.scrollTop = scrollYtop;
      this.bottomId = parseInt(id);
      this.endY = e.touches[0].clientY;
    },
    //拉下边框下移中
    moveBottomm(e) {
      let self = this;
      let endY = self.endY;
      let defaultId = parseInt(self.bottomId);
      //移动会议方块
      let y = e.touches[0].clientY;
      let nid = Math.ceil((y - endY) / self.unitHeight);
      let top = self.createMeet.top;
      let height = y - endY + (defaultId - self.createMeet.idSt) * self.unitHeight;
      //到最小单元格不允许移动 或者是超过4个小时
      if (height < self.minMute * self.unitHeight || height > self.unitHeight * 16) {
        return;
      }

      let startTime = self.defaultList[self.createMeet.idSt].timeTitle;
      let endTime = self.defaultList[defaultId + nid].timeTitle;
      let startTimeShow = startTime,
        endTimeShow = endTime;
      if (self.isToday == 0) {
        if (!!self.isHidTime(self.createMeet.idSt)) {
          startTimeShow = '';
        }
        if (!!self.isHidTime(defaultId + nid)) {
          endTimeShow = '';
        }
      }
      let isFlex = '';
      // if ((height) < self.unitHeight * 2) {
      //   isFlex = "isFlex"
      // }
      //该判断功能暂定
      let end = defaultId + nid;
      // let hasMeeting = this.meetingList.some(function(item) {
      // 	return end > item.startId + 0.1 && self.createMeet.idSt < item.startId;
      // });
      // if (!!hasMeeting) {
      // 	return;
      // }
      if ((y - endY) % self.unitHeight === 0 || (endY - y) % self.unitHeight === 0) {
        vibrate();
        let meeting = {
          isFlex: isFlex,
          trueStyle: 'top:0px;height:' + height + 'px;',
          style: 'top:' + top + 'px;height:' + height + 'px;',
          meetingName: '再次点击新建日程',
          idSt: self.createMeet.idSt,
          idEnd: end,
          length: height / self.unitHeight,
          height: height,
          top: top,
          startTime: startTime,
          endTime: endTime,
          startTimeShow: startTimeShow,
          endTimeShow: endTimeShow,
        };
        self.createMeet = meeting;
      } else {
        let len = end - self.createMeet.idSt;
        let meeting2 = {
          isFlex: isFlex,
          trueStyle: 'top:0px;height:' + len * self.unitHeight + 'px;',
          style: 'top:' + top + 'px;height:' + height + 'px;',
          meetingName: '再次点击新建日程',
          idSt: self.createMeet.idSt,
          idEnd: end,
          length: len,
          height: height,
          top: top,
          startTime: startTime,
          endTime: endTime,
          startTimeShow: startTimeShow,
          endTimeShow: endTimeShow,
        };
        self.createMeet = meeting2;
      }
    },
    //拉下边框下移结束
    moveBottomEnd(e) {
      let self = this;
      vibrate();
      let meeting = self.createMeet;
      let trueHeight = meeting.length * self.unitHeight;
      // if (!!this.hasMeeting(meeting.idSt, meeting.idEnd)) {
      //   this.showError("会议冲突")
      //   self.isCreate = false;
      //   self.createMeet = "";
      //   return;
      // }
      if (trueHeight > meeting.height) {
        let style = 'top:' + meeting.top + 'px;height:' + trueHeight + 'px;';
        let startTime = self.defaultList[meeting.idSt].timeTitle;
        let endTime = self.defaultList[meeting.idEnd].timeTitle;

        let startTimeShow = startTime,
          endTimeShow = endTime;
        if (self.isToday == 0) {
          if (!!self.isHidTime(meeting.idSt)) {
            startTimeShow = '';
          }
          if (!!self.isHidTime(meeting.idEnd)) {
            endTimeShow = '';
          }
        }
        let NewcreateMeet = {
          isFlex: meeting.isFlex,
          trueStyle: 'top:0px;height:' + trueHeight + 'px;',
          style: style,
          meetingName: meeting.meetingName,
          idSt: meeting.idSt,
          idEnd: meeting.idEnd,
          length: meeting.length,
          height: trueHeight,
          top: meeting.top,
          startTime: startTime,
          endTime: endTime,
          startTimeShow: startTimeShow,
          endTimeShow: endTimeShow,
        };
        self.createMeet = NewcreateMeet;
      }
    },
    //点击创建的会议开始
    touchMeetingStart(e) {
      let self = this;
      self.scrollTop = scrollYtop;
      self.meetingTouchStartY = e.touches[0].clientY;
      self.meetingTouchStartOff = e.currentTarget.offsetTop;
      self.meetingTouchIdSt = self.createMeet.idSt;
      self.isScroll = false;
    },
    //点击创建的会议移动中
    touchMeetingMove(e) {
      let self = this;
      let y = e.touches[0].clientY;
      let ny = y - self.meetingTouchStartY; //移动相对位移
      let nid = Math.floor(ny / self.unitHeight); //移动的单元格个数

      let meeting = self.createMeet;
      let top = meeting.top + ny; //top值

      let idSt = self.meetingTouchIdSt + nid;
      let idEnd = idSt + meeting.length;

      if (idSt < 0) {
        return;
      } else if (idEnd > this.minAll) {
        return;
      }
      //不能超过时间线之前
      if (self.isToday == 0 && idSt < this.timeId + 1) {
        return;
      }
      // let hasMeeting = this.meetingList.some(function(item) {
      // 	return idSt < item.endId - 0.1 && idEnd > item.endId || idEnd > item.startId - 0.1 && idSt < item.startId;
      // });
      // if (!!hasMeeting) {
      // 	return;
      // }
      let startTime = self.defaultList[idSt].timeTitle;
      let endTime = self.defaultList[idEnd].timeTitle;
      let startTimeShow = startTime,
        endTimeShow = endTime;
      if (self.isToday == 0) {
        if (!!self.isHidTime(idSt)) {
          startTimeShow = '';
        }
        if (!!self.isHidTime(idEnd)) {
          endTimeShow = '';
        }
      }
      let trueTextTop = idSt * self.unitHeight - top;

      let NewcreateMeet = {
        isFlex: meeting.isFlex,
        trueStyle: 'top:' + trueTextTop + 'px;height:' + meeting.height + 'px;',
        style: 'top:' + top + 'px;height:' + meeting.height + 'px;',
        meetingName: meeting.meetingName,
        idSt: idSt,
        idEnd: idEnd,
        length: meeting.length,
        height: meeting.height,
        top: meeting.top,
        startTime: startTime,
        endTime: endTime,
        startTimeShow: startTimeShow,
        endTimeShow: endTimeShow,
      };
      self.createMeet = NewcreateMeet;
      if (trueTextTop == 0) {
        vibrate();
      }
    },
    //点击创建的会议移动结束
    touchMeetingEnd(e) {
      this.isScroll = true;
      let self = this;
      let y = e.currentTarget.offsetTop;
      let absY = Math.abs(y - self.meetingTouchStartOff);
      if (absY == 0) {
        //后期即为点击会议事件
        this.showError('预订功能敬请期待');
        let params = {
          startTime: this.chooseDate + ' ' + self.createMeet.startTime + ':00',
          endTime: this.chooseDate + ' ' + self.createMeet.endTime + ':00',
        };
        self.$emit('bookMeeting', params);
        return;
      }
      //拖动会议单元格修正
      vibrate();
      let meeting = self.createMeet;
      let trueTop = meeting.idSt * self.unitHeight;
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
      if (trueTop != meeting.top) {
        let style = 'top:' + trueTop + 'px;height:' + meeting.height + 'px;';
        let startTime = self.defaultList[meeting.idSt].timeTitle,
          endTime = self.defaultList[meeting.idEnd].timeTitle;
        let startTimeShow = startTime,
          endTimeShow = endTime;
        if (self.isToday == 0) {
          if (!!self.isHidTime(meeting.idSt)) {
            startTimeShow = '';
          }
          if (!!self.isHidTime(meeting.idEnd)) {
            endTimeShow = '';
          }
        }
        let NewcreateMeet = {
          isFlex: meeting.isFlex,
          trueStyle: 'top:0px;height:' + meeting.height + 'px;',
          style: style,
          meetingName: meeting.meetingName,
          idSt: meeting.idSt,
          idEnd: meeting.idEnd,
          length: meeting.length,
          height: meeting.height,
          top: trueTop,
          startTime: startTime,
          endTime: endTime,
          startTimeShow: startTimeShow,
          endTimeShow: endTimeShow,
        };
        self.createMeet = NewcreateMeet;
      }
    },

    // 长按卡片新增编辑卡片
    longTapWithEdit(e, meetInfo) {
      console.log(e);
      console.log(meetInfo);
    },
  },
};
</script>

<style lang="scss">
$timeSize: 12px;
$borderColor: #ddd;

.create_content_box {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.dayTable {
  border-top: 1px solid $borderColor;
  width: 100%;
  background-color: #ffffff;
}

.calendar_body::-webkit-scrollbar {
  display: none;
}

.calendar_body {
  height: 100vh;
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
    }

    .right_content {
      border-top: 1px solid #ffffff;
      height: 15px;
      width: calc(100vw - 50px);
    }

    .hasTime {
      font-size: $timeSize;
    }

    .hasTime .right_content {
      border-color: $borderColor;
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
      border-radius: 4px;
      border: 1px solid #ccc;
      background-color: #fff;
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

    .meeting_detail_top {
      // top: -114px;
    }

    .meeting_detail_bottom {
      // bottom: -114px;
    }

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

    .meeting_content_time {
      margin-left: 5px;
      min-width: 135px;
    }

    .meeting_content_name {
      // line-height: 100%;
      margin-left: 5px;
      width: 250px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
      background-color: #3788c8;
      z-index: 990;
      font-size: $timeSize;

      .meeting_content {
        color: #ffffff;
        margin-left: 5px;
        // line-height: 100%;
      }

      .radius {
        width: 80px;
        height: 80px;
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
        top: -40px;
        left: 0;
      }

      .radius_second {
        bottom: -40px;
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
        color: #1994fd;
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
