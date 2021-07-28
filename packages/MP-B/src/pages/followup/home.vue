<template>
  <view class="followup-home" @click="hideDropDownBox">
    <calendar
      :value="calendarDate"
      @change="dateChange"
      @collapseChange="collapseChange"
      ref="Calendar"
    />
    <view class="toolbar-wrap">
      <view class="icon-whole iconfont" @click="showFilterModal"></view>
      <text class="date">6月30日 星期三</text>
      <text class="return" @click="goBackToday">返回今天</text>
    </view>
    <view class="follow-node-list">
      <view class="follow-node-item">
        <view class="name-status">
          <text class="name">普通术后随访</text>
          <view class="status-wrap">
            <view class="dot"></view>
            <text>已随访</text>
          </view>
        </view>
        <view class="detail">
          <view class="basic">
            <text>王一博</text>
            <view class="icon-nan iconfont male"></view>
            <view class="iconfont iconphone"></view>
            <text class="phone">17600020002</text>
            <view class="icon-shengri iconfont"></view>
            <text class="age">22岁</text>
          </view>
          <view class="line-info-wrap">
            <view class="left">计划节点时间：</view>
            <view class="right">2021-06-30 8:00</view>
          </view>
          <view class="line-info-wrap">
            <view class="left">随访方式：</view>
            <view class="right">人工随访</view>
          </view>
          <view class="line-info-wrap">
            <view class="left">计划随访人：</view>
            <view class="right">陈医生</view>
          </view>
          <view class="line-info-wrap">
            <view class="left">随访机构：</view>
            <view class="right">北吉熊连锁合肥分店</view>
          </view>
          <view class="operate">
            <view class="more" @click.stop="showDropDownBox">
              更多
              <view class="drop-down" v-if="dropDownBoxVisible">
                <view class="stop">终止</view>
                <view class="delete">删除</view>
              </view>
            </view>
            <view class="carry mid" @click="handleCarry">执行</view>
            <view class="inspect" @click="handleInspect">查看</view>
          </view>
        </view>
      </view>
    </view>

    <view class="pop-mask" v-if="filterModal">
      <view class="filter-box-wrap">
        <view class="inner">
          <view class="header">
            <text class="clear" @click="handleReset">清空</text>
            <text>筛选</text>
            <view
              class="icon-ar-close iconfont"
              @click="hideFilterModal"
            ></view>
          </view>
          <view class="status-wrap filter-type">
            <text>按随访状态查看</text>
            <view class="list">
              <view
                :class="[
                  'status-item',
                  statusIndex === index ? 'selected' : '',
                  index % 3 === 1 && index === statusList.length - 1
                    ? 'fix'
                    : '',
                ]"
                v-for="(item, index) in statusList"
                :key="index"
                @click="handleStatusSelect(index)"
              >
                {{ item }}
              </view>
            </view>
          </view>
          <view class="institution-wrap filter-type" v-if="!isSingle">
            <text>按随访机构查看</text>
            <view class="list">
              <view class="status-item">{{
                institutionList[0].medicalInstitutionSimpleCode
              }}</view>
            </view>
            <text>大区</text>
            <view class="list">
              <view
                class="status-item"
                v-for="(item, key) in regionList"
                :key="key"
              >
                {{ item.medicalInstitutionSimpleCode }}
              </view>
            </view>
            <text>连锁直营</text>
            <view class="list">
              <view
                class="status-item"
                v-for="(item, key) in directList"
                :key="key"
              >
                {{ item.medicalInstitutionSimpleCode }}
              </view>
            </view>
          </view>
          <view class="customer-wrap filter-type">
            <text>按随访人查看</text>
            <input
              class="search"
              placeholder="搜索随访人"
              placeholder-style="color: #bfbfbf; font-size: 28rpx;"
              @focus="goSearch"
            />
          </view>
          <view class="pop-bottom"
            ><view class="ensure" @click="handleEnsure">确认</view></view
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import calendar from '@/businessComponents/calendar/calendar'
import followConfigData from './Data.js'
import systemAPI from '@/APIS/system.api.js'
import { getStorage, STORAGE_KEY } from '@/utils/storage'
export default {
  components: {
    calendar,
  },
  data() {
    return {
      // 日历组件日期
      calendarDate: moment().format('YYYY-MM-DD'),
      statusList: followConfigData.status,
      filterModal: false,
      dropDownBoxVisible: false,
      isSingle: false,
      institutionList: [],
      regionList: [],
      directList: [],
      statusIndex: 0,
    }
  },
  created() {
    this.loginForm = getStorage(STORAGE_KEY.LOGIN_INFO)
    this.medicalInstitution = getStorage(STORAGE_KEY.MEDICALINSTITUTION)

    // 如果是单店，不用显示随访状态筛选
    if (this.medicalInstitution.institutionChainType === 1) {
      this.isSingle = true
    } else {
      console.log(this.loginForm, this.medicalInstitution)

      systemAPI
        .getInstitutionListScrm({
          memberName: this.loginForm.memberCode,
          username: this.loginForm.username,
        })
        .then((res) => {
          this.institutionList = res.data
          console.log('res', res.data)
          this.regionList = res.data[0].children.filter(
            (i) => i.medicalInstitutionType === 3,
          )
          this.directList = res.data[0].children.filter(
            (i) => i.medicalInstitutionType !== 3,
          )
        })
    }
  },
  methods: {
    dateChange({ fulldate }) {
      console.log(this.$refs.Calendar)
      this.calendarDate = moment(String(fulldate))
    },
    collapseChange(status) {
      console.log('status', status)
    },
    handleEnsure() {
      this.filterModal = false
    },
    goBackToday() {
      console.log(111, moment().format('YYYY-MM-DD'))
      // this.calendarDate = moment().format('YYYY-MM-DD')
      // this.$refs.Calendar.update_month()
      // this.$refs.Calendar.get_date(moment().format('YYYY-MM-DD'))
      this.calendarDate = moment().format('YYYY-MM-DD')
      this.$refs.Calendar.doc_list_update()
      this.$refs.Calendar.update_month()
    },
    handleCarry() {},
    handleInspect() {},
    showDropDownBox() {
      this.dropDownBoxVisible = true
    },
    hideDropDownBox(e) {
      this.dropDownBoxVisible = false
    },
    showFilterModal() {
      this.filterModal = true
    },
    handleStatusSelect(index) {
      this.statusIndex = index
    },
    hideFilterModal() {
      this.filterModal = false
    },
    handleReset() {
      this.statusIndex = 0
    },
    goSearch() {
      console.log(333)
      wx.navigateTo({
        url: '/pages/followup/search',
      })
    },
  },
}
</script>
<style lang="scss" scoped>
view {
  box-sizing: border-box;
}
page {
  width: 100%;
  height: 100%;
}
.followup-home {
  width: 100%;
  position: relative;
}
.toolbar-wrap {
  margin-top: 16rpx;
  widows: 100%;
  height: 76rpx;
  opacity: 1;
  background: #feffff;
  box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0 32rpx 0 45rpx;
  justify-content: space-between;
  > view {
    color: #6cc194;
    font-size: 36rpx;
  }
  .date {
    font-size: 28rpx;
    font-family: PingFangSC, PingFangSC-Regular;
    color: rgba(0, 0, 0, 0.9);
  }
  .return {
    font-size: 28rpx;
    font-family: PingFangSC, PingFangSC-Regular;
    color: #5cbb89;
  }
}
.follow-node-list {
  width: 702rpx;
  margin: 24px auto;

  .follow-node-item {
    box-sizing: border-box;
    width: 100%;
    height: 440rpx;
    opacity: 1;
    background: #feffff;
    border-radius: 8rpx;
    box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
    padding: 24rpx;

    .name-status {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .name {
        opacity: 1;
        font-size: 34rpx;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.9);
      }
      .status-wrap {
        display: flex;
        align-items: center;
        .dot {
          width: 16rpx;
          height: 16rpx;
          opacity: 1;
          background: #5cbb89;
          border-radius: 50%;
          margin-right: 8rpx;
        }
      }
    }

    .detail {
      margin-top: 24rpx;
      .basic {
        display: flex;
        align-items: center;
        .male {
          color: #1890ff;
          margin: 0 35rpx 0 12rpx;
        }
        > text {
          font-size: 28rpx;
          font-family: PingFangSC, PingFangSC-Regular;
          color: #191919;
        }
        > view {
          color: #7f7f7f;
        }
        .phone {
          margin: 0 28rpx 0 15rpx;
        }
        .age {
          margin-left: 12rpx;
        }
      }
      .line-info-wrap {
        display: flex;
        align-items: center;
        margin-top: 16rpx;
        .left {
          width: 196rpx;
          font-size: 28rpx;
          font-family: PingFangSC, PingFangSC-Regular;
          color: #4c4c4c;
        }
        .right {
          font-size: 28rpx;
          font-family: PingFangSC, PingFangSC-Regular;
          color: #191919;
        }
      }
      .operate {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .more {
          font-size: 28rpx;
          font-family: PingFangSC, PingFangSC-Regular;
          color: #4c4c4c;
          position: relative;
          .drop-down {
            position: absolute;
            width: 152rpx;
            height: 204rpx;
            opacity: 1;
            background: #ffffff;
            box-shadow: 0rpx 4rpx 16rpx 6rpx rgba(0, 0, 0, 0.08);
            left: 50%;
            transform: translateX(-50%);
            top: 56rpx;
            > view {
              font-size: 28rpx;
              font-family: PingFangSC, PingFangSC-Regular;
              color: #4c4c4c;
              width: 152rpx;
              height: 96rpx;
              line-height: 96rpx;
              text-align: center;
            }
            .stop {
              border-bottom: 1px solid #e5e5e5;
            }
          }
        }
        .carry,
        .inspect {
          text-align: center;
          line-height: 56rpx;
          width: 120rpx;
          height: 56rpx;
          opacity: 1;
          background: #ffffff;
          border: 2rpx solid #5cbb89;
          border-radius: 30rpx;
          font-size: 28rpx;
          font-family: PingFangSC, PingFangSC-Regular;
          color: #5cbb89;
        }
        .mid {
          margin: 0 16rpx 0 32rpx;
        }
      }
    }
  }
}
.pop-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  opacity: 1;
  background: rgba(0, 0, 0, 0.5);
  .filter-box-wrap {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 750rpx;
    overflow-y: scroll;
    height: 80%;
    opacity: 1;
    background: #ffffff;
    border-radius: 24rpx 24rpx 0rpx 0rpx;
    .inner {
      position: relative;
      width: 750rpx;
      opacity: 1;
      background: #ffffff;
      border-radius: 24rpx 24rpx 0rpx 0rpx;
      padding-bottom: 296rpx;
      padding-top: 111rpx;
    }
    .header {
      z-index: 10;
      position: fixed;
      left: 0;
      top: 20%;
      display: flex;
      width: 100%;
      height: 111rpx;
      padding: 0 32rpx;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      border-bottom: 1px solid #e5e5e5;
      .clear {
        font-size: 28rpx;
        font-family: PingFangSC, PingFangSC-Regular;
        color: #5cbb89;
      }
    }
    .filter-type {
      width: 100%;
      padding: 32rpx;
      border-bottom: 1px solid #e5e5e5;
      > text {
        font-size: 34rpx;
        font-family: PingFangSC, PingFangSC-Regular;
        color: #191919;
        display: block;
      }
      .list {
        margin-top: 16rpx;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      .status-item {
        width: 218rpx;
        height: 68rpx;
        opacity: 1;
        background: #ffffff;
        border: 1rpx solid rgba(0, 0, 0, 0.15);
        border-radius: 8rpx;
        margin-bottom: 16rpx;
        font-size: 28rpx;
        font-family: PingFangSC, PingFangSC-Regular;
        color: #595959;
        text-align: center;
        line-height: 68rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 24rpx;
        &.selected {
          background: #eef8f3;
          border: 1rpx solid #5cbb89;
          color: #5cbb89;
        }
      }
      .fix {
        transform: translateX(-234rpx);
      }
    }
    .customer-wrap {
      .search {
        margin-top: 22rpx;
        width: 686rpx;
        height: 72rpx;
        opacity: 1;
        background: #ffffff;
        border: 1rpx solid #d9d9d9;
        border-radius: 8rpx;
      }
    }
    .pop-bottom {
      position: sticky;
      left: 0;
      bottom: 0;
      background: #fff;
      .ensure {
        width: 686rpx;
        height: 80rpx;
        opacity: 1;
        background: #5cbb89;
        border-radius: 40rpx;
        font-size: 36rpx;
        font-family: PingFangSC, PingFangSC-Regular;
        line-height: 80rpx;
        color: #ffffff;
        text-align: center;
        z-index: 100;
      }
    }
  }
}
</style>
