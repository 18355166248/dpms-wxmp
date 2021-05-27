<template>
  <div class="reconclieCalendar-wrapper">
    <div class="header flex-center">
      <span @click="subtractMonth" class="iconfont icon-arrow-left btn" />
      <picker mode="date" fields="month" :value="date" @change="bindDateChange">
        <span class="month-text">{{ monthValueFormat }}</span>
      </picker>
      <span @click="addMonth" class="iconfont icon-arrow-right btn" />
    </div>
    <div class="content">
      <template v-if="reconclieList.length">
        <div @click="reconclieItemClick(item)" class="reconclieItem flex-v-center" v-for="(item) in reconclieList" :key="item.statDate">
          <div class="date-wrapper flex-v-center">{{ item.statDate | filterDate('MM月DD日') }}</div>
          <div class="week-wrapper flex-v-center">{{ item.statDate | filterWeek}}</div>
          <div class="amount-wrapper">
            <div class="flex-h-between">
              <div>现金实收</div>
              <div v-if="item.cacheReceiveAmount === undefined">暂无数据</div>
              <div v-else>{{item.cacheReceiveAmount | thousandFormatter(2, '￥')}}</div>
            </div>
            <div class="flex-h-between">
              <div>新增欠款</div>
              <div v-if="item.arrearsAmount === undefined" style="color: rgba(82,196,26,1)">暂无数据</div>
              <div v-else style="color: rgba(82,196,26,1)">{{item.arrearsAmount | thousandFormatter(2, '￥')}}</div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <empty :disabled="true" img="../../static/empty.png" text="暂无数据" />
      </template>

    </div>
  </div>
</template>

<script>
import moment from 'moment';
import billAPI from 'APIS/bill/bill.api';
const arrearsAmount = {
  statDate: undefined,
  cacheReceiveAmount: undefined,
  arrearsAmount: undefined
}

export default {
  name: 'reconclieCalendar.vue',
  data() {
    return {
      monthValue: moment(new Date()).startOf('month').valueOf(),
      reconclieList: [],
    };
  },
  computed: {
    monthValueFormat() {
      return moment(this.monthValue).format('YYYY年MM月');
    },
    monthValueEnd() {
      return moment(this.monthValue).endOf('month').valueOf();
    },
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      billAPI.calendarList({
        statBeginDate: this.monthValue,
        statEndDate: this.monthValueEnd,
      }).then(res => {
        this.initData().then(defaultValue => {
          this.reconclieList = this._formatData(defaultValue,res.data);
        })

      });
    },
    initData() {
      return new Promise((resolve, reject) => {
        let result = Array.from({length: moment().daysInMonth()},(item,index) => ({
          day:index+1,
          dayValue:moment(this.monthValue).add(index,'day').valueOf()
        }))
        let nowDay = moment().startOf('day').valueOf()
        result = result.map(item => {
          if(item.dayValue <= nowDay) {
            item.cacheReceiveAmount = 0
            item.arrearsAmount = 0
          } else {
            item.cacheReceiveAmount = undefined
            item.arrearsAmount = undefined
          }
          item.statDate = item.dayValue
          return item
        })
        resolve(result)
      })
    },
    _formatData(defaultValue, resData) {
      let resDataObj = {}
      console.log('resData', resData);
      resData.forEach(item => {
        resDataObj[item.statDate] = item
      })
      return defaultValue.map(item => {
        if(resDataObj[item.statDate]) {
          item.cacheReceiveAmount = resDataObj[item.statDate]?.cacheReceiveAmount
          item.arrearsAmount = resDataObj[item.statDate]?.arrearsAmount
        }
        return item
      })
    },
    bindDateChange(e) {
      const date = e.mp.detail.value
      this.monthValue = moment(`${date}-01`).valueOf()
      this.loadData()
    },
    addMonth() {
      const temp = moment(this.monthValue).startOf('month').add('month', 1);
      this.monthValue = temp.valueOf();
      this.loadData();

    },
    subtractMonth() {
      const temp = moment(this.monthValue).startOf('month').subtract('month', 1);
      this.monthValue = temp.valueOf();
      this.loadData();
    },
    reconclieItemClick(record) {
      uni.navigateTo({
        url:`/pages/finance-report/reconclieCalendarDetail?statEndDate=${record.statDate}`,
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.reconclieCalendar-wrapper {
  .header {
    width: 750rpx;
    height: 96rpx;
    background: #fff;

    .month-text, .btn {
      font-size: 28rpx;
      color: rgba(0, 0, 0, 0.9);
    }

    .btn {
      padding: 20rpx 40rpx;
    }
  }

  .content {
    margin-top: 16rpx;
    .reconclieItem {
      width: 750rpx;
      padding: 0 32rpx;
      box-sizing: border-box;
      height: 120rpx;
      font-size: 28rpx;
      color: rgba(0,0,0,.9);
      background: #fff;
      border-bottom: 1rpx solid rgba(229,229,229,1);
      .date-wrapper {
        flex: 0 0 150rpx;
        height: 100%;
      }
      .week-wrapper {
        flex: 0 0 168rpx;
        height: 100%;
      }
      .amount-wrapper {
        height: 90rpx;
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-between;
      }
    }
  }

}
</style>
