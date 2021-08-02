<template>
  <view v-if="nodeList.length > 0" class="nodeDetail">
    <view v-for="(item, index) in nodeData" :key="index">
      <view class="nodeBox">
        <view class="left">
          <span
            :class="['circular', `followState_${item.nodeFollowUpStatus}`]"
          ></span>
          <span class="text">第{{ index + 1 }}次随访：</span>
          <span>{{ item.nodeTime }}</span>
        </view>
        <view class="right">
          <span :class="['states', `state_${item.nodeFollowUpStatus}`]">{{
            item.nodeFollowUpStatus | getFollowStateText
          }}</span>
          <span
            v-if="openIndex.findIndex((v) => v == index) != -1"
            class="icon-arrow iconfont icon-up"
            @click="onOpen(index)"
          ></span>
          <span
            v-else
            class="icon-arrow iconfont icon-down"
            @click="onOpen(index)"
          ></span>
        </view>
      </view>
      <view
        class="nodeContent"
        v-if="openIndex.findIndex((v) => v == index) != -1"
      >
        <view class="box">
          <view class="title">随访内容</view>
          <view v-for="(msg, idx) in item.messageContentList" :key="msg.id">
            <textShrink
              v-if="msg.contentType === 1 && idx < 3"
              title="【文字】"
              :content="msg.text"
              :enterWidth="622"
              bgColor="#fff"
              :mb="16"
              :p="16"
            />
            <message v-if="msg.contentType !== 1 && idx < 3" :message="msg" />
          </view>
          <view v-if="item.messageContentList.length > 3" class="tip">
            更多内容或详情登录PC端查看
          </view>
          <view>
            <view class="row">
              <span class="left">相关医生：</span>
              <span class="right">{{ item.relatedDoctorName }}</span>
            </view>
            <view class="row">
              <span class="left">随访项目：</span>
              <span class="right">
                <text-shrink
                  :content="item.showItem"
                  :enterWidth="458"
                  :changeColor="true"
                />
              </span>
            </view>
            <view class="row">
              <span class="left">{{
                item.nodeFollowUpStatus == 31 || item.nodeFollowUpStatus == 35
                  ? '实际随访时间：'
                  : '计划随访时间：'
              }}</span>
              <span class="right">{{ item.showTime }}</span>
            </view>
            <view class="row">
              <span class="left">{{
                item.nodeFollowUpStatus == 31 || item.nodeFollowUpStatus == 35
                  ? '实际随访人：'
                  : '计划随访人：'
              }}</span>
              <span class="right">{{ item.showName }}</span>
            </view>
            <view
              class="row"
              v-if="
                item.nodeFollowUpStatus == 31 || item.nodeFollowUpStatus == 35
              "
            >
              <span class="left">沟通方式：</span>
              <span class="right">{{
                item.communicationType | getInitialCommunicationType
              }}</span>
            </view>
            <view
              class="row"
              v-if="
                item.nodeFollowUpStatus == 31 || item.nodeFollowUpStatus == 35
              "
            >
              <span class="left">随访结果：</span>
              <span class="right">
                <text-shrink
                  :content="item.followUpResult"
                  :enterWidth="458"
                  :changeColor="true"
                />
              </span>
            </view>
          </view>
          <view class="btnBox" v-if="item.nodeFollowUpStatus == 10">
            <view class="btn" @click="handleCarry(item.id)">执行</view>
            <view class="btn" @click="handleStop(item.id)">终止</view>
            <view class="btn" @click="handleDelete(item.id)">删除</view>
          </view>
          <view class="btnBox" v-if="item.nodeFollowUpStatus == 31">
            <view class="btn" @click="handleCarry(item.id)">重新随访</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import message from './message'
import moment from 'moment'
import _ from 'lodash'
import followupAPI from '@/APIS/followup/followup.api.js'
import textShrink from '@/components/textShrink/textShrink.vue'

export default {
  name: '',
  components: {
    message,
    textShrink,
  },
  props: {
    nodeList: {
      type: Array,
      default: [],
    },
    followUpNodeId: {
      type: Number,
      default: null,
    },
    followUpPlanId: {
      type: Number,
      default: null,
    },
    customer: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      openIndex: [],
      nodeData: [],
    }
  },
  watch: {
    followUpNodeId: {
      handler(newVal, oldVal) {
        if (newVal > 0 && this.nodeList.length > 0) {
          this.setShowData()
        }
      },
      deep: true,
      immediate: true,
    },
    nodeList: {
      handler(newVal, oldVal) {
        if (this.followUpNodeId > 0 && newVal.length > 0) {
          this.setShowData()
        }
      },
      deep: true,
      immediate: true,
    },
  },
  filters: {
    getFollowStateText(state) {
      if (state == 10) {
        return '待随访'
      } else if (state == 31) {
        return '随访失败'
      } else if (state == 35) {
        return '已随访'
      } else if (state == 40) {
        return '终止随访'
      }
    },
    // 获取沟通方式默认值
    getInitialCommunicationType(followUpWay) {
      switch (followUpWay) {
        case 1:
          return '手机'
        case 2:
          return '座机'
        case 3:
          return '微信'
        case 4:
          return '公众号'
        case 5:
          return '企微'
        default:
          return '其他'
      }
    },
  },
  methods: {
    onOpen(index) {
      const idx = this.openIndex.findIndex((v) => v == index)
      if (idx != -1) {
        this.openIndex.splice(idx, 1)
      } else {
        this.openIndex.push(index)
      }
    },
    setShowData() {
      this.openIndex.push(
        this.nodeList.findIndex((v) => v.id == this.followUpNodeId),
      )
      let cloneData = _.cloneDeep(this.nodeList)
      this.nodeList.map((v, index) => {
        let date = moment(v.planFollowUpDate).format('YYYY-MM-DD')
        let time = moment(v.planFollowUpTime).format('HH:mm')
        cloneData[index].nodeTime = `${date} ${time}`
        if (v.nodeFollowUpStatus == 31 || v.nodeFollowUpStatus == 35) {
          cloneData[index].showTime = moment(v.realFollowUpTime).format(
            'YYYY-MM-DD HH:mm',
          )
          cloneData[index].showName = v.realFollowUpUserName
        } else {
          cloneData[index].showTime = `${date} ${time}`
          cloneData[index].showName = v.planFollowUpUserName
        }
        let items = ''
        if (v.followUpItems && v.followUpItems.length > 0) {
          v.followUpItems.map((item) => {
            if (item.appointmentItemId) {
              items = item.appointmentItemName
                ? items == ''
                  ? items + item.appointmentItemName
                  : items + ',' + item.appointmentItemName
                : items
            }
          })
        }

        cloneData[index].showItem = items
      })
      this.nodeData = cloneData
    },
    handleCarry(followUpNodeId) {
      uni.navigateTo({
        url:
          '/pages/followup/execute?' +
          `&followUpPlanId=${this.followUpPlanId}` +
          `&followUpNodeId=${followUpNodeId}`,
      })
    },
    handleStop(followUpNodeId) {
      uni.navigateTo({
        url:
          '/pages/followup/terminationNode?' +
          `&followUpPlanId=${this.followUpPlanId}` +
          `&followUpNodeId=${followUpNodeId}`,
      })
    },
    handleDelete(followUpNodeId) {
      uni.showModal({
        title: '确认删除该条数据吗？',
        success: async ({ confirm }) => {
          if (confirm) {
            this.$dpmsUtils.showLoading('请稍后...')
            const res = await followupAPI.deleteChildrenCurrentItem({
              followUpNodeId: followUpNodeId,
              followUpPlanId: this.followUpPlanId,
            })
            this.$dpmsUtils.clearLoading()
            if (res.code === 0) {
              this.$dpmsUtils.show('删除成功', { icon: 'success' })
              uni.$emit('followUpDetailUpdate')
              uni.$emit('followUpHomeUpdate')
            }
          }
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.nodeDetail {
  //
  width: 100%;
  background-color: rgba(0, 0, 0, 0.06);
  .nodeBox {
    width: 662rpx;
    height: 96rpx;
    background-color: #fff;
    margin-bottom: 2rpx;
    padding: 0 44rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      .circular {
        display: inline-block;
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        margin-right: 20rpx;
      }
      .text {
        font-size: 28rpx;
        color: #191919;
        margin-right: 12rpx;
      }
    }
    .right {
      text-align: center;
      .states {
        margin-right: 12rpx;
        font-size: 28rpx;
      }

      .icon-arrow {
        font-size: 40rpx;
      }
    }
  }
  .nodeContent {
    width: 100%;
    .box {
      padding: 32rpx 48rpx;
      .title {
        font-size: 28rpx;
        font-weight: 500;
        color: #191919;
        margin-bottom: 16rpx;
      }
      .tip {
        height: 56rpx;
        line-height: 56rpx;
        background: #fefcec;
        font-size: 24rpx;
        color: #f86e21;
        padding: 0 24rpx;
        margin-bottom: 32rpx;
      }
    }
    view {
      .row {
        margin-bottom: 16rpx;
        display: flex;
        width: 654rpx;
        flex-wrap: wrap;
        .left {
          width: 30%;
          font-size: 28rpx;
          color: #4c4c4c;
        }
        .right {
          width: 70%;
          font-size: 28rpx;
          color: #191919;
          word-wrap: break-word;
        }
      }
    }
    .btnBox {
      display: flex;
      justify-content: flex-end;
      .btn {
        padding: 0 32rpx;
        height: 56rpx;
        border: 1px solid #5cbb89;
        border-radius: 30rpx;
        font-size: 28rpx;
        line-height: 56rpx;
        color: #5cbb89;
        text-align: center;
        margin-left: 16rpx;
      }
    }
  }
}
// 已随访
.followState_35 {
  background-color: #5cbb89;
}
// 待随访
.followState_10 {
  background-color: #faad14;
}
// 随访失败
.followState_31 {
  background-color: #e64040;
}
// 终止随访
.followState_40 {
  background-color: #7f7f7f;
}
// 已随访
.state_35 {
  color: #5cbb89;
}
// 待随访
.state_10 {
  color: #faad14;
}
// 随访失败
.state_31 {
  color: #e64040;
}
// 终止随访
.state_40 {
  color: #7f7f7f;
}
</style>
