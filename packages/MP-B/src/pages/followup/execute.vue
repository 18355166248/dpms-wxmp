<template>
  <div class="executeForm">
    <dpmsForm ref="executeForm" :model="form" :rules="rules">
      <dpmsCell title="实际随访时间" :value="form.currentTime" />
      <dpmsCell title="实际随访人" :value="form.followUpName" />
      <dpmsCellPicker
        title="随访状态"
        required
        placeholder="请选择随访状态"
        v-model="form.executeStatus"
        :list="followUpStateList"
        defaultType="executeStatus"
        :defaultProps="{ label: 'followUpStateText', value: 'executeStatus' }"
        isLink
      />
      <dpmsCellPicker
        title="沟通方式"
        required
        placeholder="请选择沟通方式"
        v-model="form.communicationType"
        :list="communicationTypeList"
        defaultType="communicationType"
        :defaultProps="{
          label: 'communicationTypeText',
          value: 'communicationType',
        }"
        isLink
      />
      <div class="remark" :class="{ 'pb-68': isPhoneXCeil }">
        <view
          class="title"
          :class="{
            'required-icon': true,
          }"
          >随访结果</view
        >
        <textarea
          class="txt"
          placeholder-style="font-size: 34rpx;font-weight: 400;color: rgba(0, 0, 0, 0.25);"
          placeholder="请输入随访结果 (200字以内)"
          maxlength="200"
          v-model="form.followUpResult"
        />
      </div>
      <picker
        range-key="label"
        :range="templateList"
        :value="templateIndex"
        @change="onChange"
        mode="selector"
      >
        <view class="template">选择结果模板</view>
      </picker>
      <button
        class="ensurebutton"
        :class="{ 'bt-68': isPhoneXCeil }"
        @click="submit"
        :disabled="disabledSaveBtn"
        :loading="disabledSaveBtn"
      >
        确定
      </button>
      <view class="bottomSpace" v-if="isPhoneXCeil"></view>
    </dpmsForm>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { mapState } from 'vuex'
import followupAPI from '@/APIS/followup/followup.api.js'
import { getStorage, STORAGE_KEY } from '@/utils/storage'

export default {
  data() {
    return {
      disabledSaveBtn: false,
      followUpStateList: [
        { followUpStateText: '已随访', executeStatus: 35 },
        { followUpStateText: '随访失败', executeStatus: 31 },
      ], // 随访状态列表
      communicationTypeList: [
        { communicationTypeText: '手机', communicationType: 1 },
        { communicationTypeText: '座机', communicationType: 2 },
        { communicationTypeText: '微信', communicationType: 3 },
        { communicationTypeText: '公众号', communicationType: 4 },
        { communicationTypeText: '企微', communicationType: 5 },
        { communicationTypeText: '其它', communicationType: 6 },
      ], // 沟通方式列表
      templateList: [],
      form: {},
      planId: null,
      nodeId: null,
      // 注意设置了type: 'any'再设置required无效
      rules: {
        executeStatus: [
          {
            required: true,
            message: '请选择随访状态',
          },
        ],
        communicationType: [
          {
            required: true,
            message: '请选择沟通方式',
          },
        ],
        followUpResult: [
          {
            required: true,
            message: '请输入随访结果',
          },
          {
            max: 200,
            message: '随访结果不应该超过 200 字',
          },
        ],
      },
      templateLabel: '',
      templateIndex: 0,
      maxLen: 200,
    }
  },
  computed: {
    ...mapState('systemStore', ['isPhoneXCeil']),
  },
  onLoad(params) {
    this.planId = params.followUpPlanId
    this.nodeId = params.followUpNodeId
    this.initializeBaseData()
  },
  methods: {
    // 获取节点详情
    initializeBaseData() {
      // 计划详情
      let that = this
      const staff = getStorage(STORAGE_KEY.STAFF)
      followupAPI.getDetailService({ id: this.planId }).then((res) => {
        if (res.code == 0) {
          const { data } = res
          const currentNode = data.nodeList.find((v) => v.id == this.nodeId)
          this.form = {
            currentTime: moment().format('YYYY-MM-DD HH:mm'),
            followUpName: staff.username,
            ...that.getInitialExecuteStatusByNodeSendStatus(
              data.followUpWay,
              currentNode.nodeSendStatus,
            ),
            // 设置默认'沟通方式'
            communicationTypeText: '手机',
            communicationType: 1,
            // ...that.getInitialCommunicationType(data.followUpWay),
            followUpResult: '',
            realFollowUpUserId: staff.staffId,
          }
        }
      })
      // 所有结果模板列表
      followupAPI.getAllResultsService().then((res) => {
        if (res.code == 0) {
          this.templateList = []
          this.templateLabel = res.data?.followUpResultTemplateVOList[0].title
          res.data?.followUpResultTemplateVOList.map((v) => {
            this.templateList.push({
              label: v.title,
              value: v.content,
            })
          })
        }
      })
    },
    // 获取表单'随访状态'默认值
    getInitialExecuteStatusByNodeSendStatus(followUpWay, nodeSendStatus) {
      if (followUpWay === 1) {
        // 人工，默认已随访
        return {
          executeStatus: 35,
          followUpStateText: '已随访',
        }
      } else {
        // 个微、企微、公众号
        if (nodeSendStatus === 35) {
          return {
            executeStatus: 35,
            followUpStateText: '已随访',
          }
        } else if (nodeSendStatus === 31) {
          return {
            executeStatus: 31,
            followUpStateText: '随访失败',
          }
        } else {
          return {
            executeStatus: 35,
            followUpStateText: '已随访',
          }
        }
      }
    },
    // 获取沟通方式默认值
    getInitialCommunicationType(followUpWay) {
      switch (followUpWay) {
        case 2: // 个人微信
          return {
            communicationTypeText: '微信',
            communicationType: 3,
          } // 微信
        case 3: // 公众号
          return {
            communicationTypeText: '公众号',
            communicationType: 4,
          } // 公众号
        case 4: // 企业微信
          return {
            communicationTypeText: '企微',
            communicationType: 5,
          } // 企微
        case 1: // 人工
          return {
            communicationTypeText: '手机',
            communicationType: 1,
          } // 手机
        default:
          return {
            communicationTypeText: '手机',
            communicationType: 1,
          } // 手机
      }
    },
    onChange(e) {
      this.templateIndex = e.detail.value
      const content = this.templateList[this.templateIndex].value
      this.form = {
        ...this.form,
        followUpResult: this.form.followUpResult + content,
      }
    },
    // 点击确定
    submit() {
      if (this.form.followUpResult.length > this.maxLen) {
        this.form.followUpResult = this.form.followUpResult.slice(
          0,
          this.maxLen,
        )
      }
      console.log('form', this.form.followUpResult)
      this.$dpmsUtils.formValidate(
        this.rules,
        this.form,
        (err, fileds, formValue) => {
          this.form = formValue
          if (err) {
            this.$dpmsUtils.show(err[0]?.message)
            return
          }
          //保存患者时，添加禁用和loading效果
          this.disabledSaveBtn = true
          let params = {
            ...this.form,
            followUpNodeId: this.nodeId,
            followUpPlanId: this.planId,
            realFollowUpTime: moment(this.form.currentTime).valueOf(),
          }
          followupAPI.executeNode(params).then((res) => {
            this.disabledSaveBtn = false
            if (res.code == 0) {
              let pages = getCurrentPages() //获取页面栈
              if (pages[pages.length - 2]?.route === 'pages/followup/detail') {
                console.log('detail')
                uni.$emit('followUpDetailUpdate')
                uni.$emit('followUpHomeUpdate')
              } else {
                console.log('home')
                uni.$emit('followUpHomeUpdate')
              }
              this.$dpmsUtils.back()
            }
          })
        },
      )
    },
    showBtn() {
      this.disabledSaveBtn = false
    },
    hideBtn() {
      this.disabledSaveBtn = true
    },
  },
}
</script>

<style lang="scss" scoped>
.executeForm {
  margin-bottom: 80rpx;
  // 页面元素少的时候，整个页面没撑起来
  min-height: calc(100vh - 80rpx);
}

.remark {
  background: #ffffff;
  width: 100vw;
  margin-bottom: 15rpx;
}
.required-icon {
  &::after {
    content: '*';
    color: #eb4d4b;
  }
}
.title {
  font-size: 35rpx;
  color: #4c4c4c;
  line-height: 40rpx;
  padding-left: 32rpx;
  padding-top: 32rpx;
}
.txt {
  padding: 32rpx;
  padding-top: 16rpx;
  width: 686rpx;
  height: 340rpx;
}

.ensurebutton {
  height: 80rpx;
  background: #5cbb89;
  border-radius: 40rpx;
  margin-top: 320rpx;
  color: #fff;
  line-height: 80rpx;
  position: fixed;
  bottom: 0;
  width: 750rpx;
  z-index: 9;
}
.bt-68 {
  bottom: 68rpx;
  z-index: 9;
}

.template {
  padding-right: 32rpx;
  text-align: right;
}

.bottomSpace {
  height: 68rpx;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 9;
}
</style>
