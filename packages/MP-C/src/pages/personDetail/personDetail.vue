<template>
  <div class="content">
    <div class="personInfo">
      <div>
        <span>姓名</span>
        <span>{{ datail.personnelName }}</span>
      </div>
      <div>
        <span>性别</span>
        <span>{{ datail.gender == 1 ? '男' : '女' }}</span>
      </div>
      <div>
        <span>出生日期</span>
        <span>{{ datail.birthday }}</span>
      </div>
      <div>
        <span>联系电话标签</span>
        <span>{{ CONTACT_LABEL.properties[datail.contactLabel].zh_CN }}</span>
      </div>
      <div>
        <span>联系电话</span>
        <span>{{ datail.mobile }}</span>
      </div>
    </div>
    <div class="operation">
      <div class="btn">
        <button @click="deletePerson">移除</button>
        <button @click="amend">修改</button>
      </div>
    </div>
  </div>
</template>

<script>
import customerAPI from '@/APIS/customer/customer.api'
import { globalEventKeys } from '@/config/global.eventKeys'

export default {
  data() {
    return {
      datail: {},
      CONTACT_LABEL: this.$utils.getEnums('ContactLabel'),
    }
  },
  onLoad(info) {
    this.datail = JSON.parse(info.personDetail)
    console.log('qqqqqqqqqqqqqq', this.datail)
  },
  methods: {
    amend() {
      let amend = JSON.stringify(this.datail)
      this.$utils.push({
        url: '/pages/personAmend/personAmend?personDetail=' + amend,
      })
    },
    deletePerson() {
      uni.showModal({
        title: '移除人员',
        content:
          '移除后，将无法看到该人员的所有相关信息，也无法进行预约，是否再想想？',
        cancelText: '再想想',
        confirmText: '确认',
        confirmColor: '#5CBB89',
        success: (confirm) => {
          if (confirm.confirm) {
            this.del()
          }
        },
      })
    },
    del() {
      customerAPI
        .deleteCustomer({ personnelId: this.datail.id })
        .then((res) => {
          if (res.code == 0) {
            uni.$emit(globalEventKeys.updatePersonFormWithSaveSuccess, {
              isSuccess: true,
            })
            this.$utils.back()
            // this.$utils.replace({
            //   url: '/pages/personManagement/personManagement',
            // })
          }
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.content {
  padding-bottom: 118rpx;
  height: 100%;
  background: rgba($color: #000000, $alpha: 0.04);
}
.personInfo {
  padding-left: 32rpx;
  background: #fff;
  margin-bottom: 64rpx;
  div {
    height: 112rpx;
    line-height: 112rpx;
    position: relative;
    border-bottom: rgba($color: #000000, $alpha: 0.15) 2rpx solid;
    span:first-child {
      color: rgba($color: #000000, $alpha: 0.9);
      font-size: 34rpx;
    }
    span:last-child {
      position: absolute;
      right: 32rpx;
      color: rgba($color: #000000, $alpha: 0.5);
      font-size: 34rpx;
    }
  }
}
.operation {
  .btn {
    padding: 0 64rpx;
    button {
      border-radius: 8px;
      border: none;
      font-size: 36rpx;
    }
    button:first-child {
      background: #5cbb89;
      color: #fff;
      margin-bottom: 24rpx;
    }
    button:last-child {
      color: #5cbb89;
      border: 2rpx solid #5cbb89;
    }
  }
}
</style>
