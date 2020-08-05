<template>
  <div class="page-bg content">
    <scroll-view>
      <div class="info">
        <dpmsCellPicker
          title="预约门店"
          v-model="form.storeName"
          :list="storeList"
          isLink
        />
        <span class="iconfont icon-right"></span>
      </div>
      <div class="info">
        <dpmsCellPicker
          title="门店地址"
          v-model="form.storeAddress"
          :list="storeList"
        />
        <span class="iconfont icon-right"></span>
      </div>
      <div class="info">
        <dpmsCellPicker
          title="预约医生"
          v-model="form.doctor"
          :list="storeList"
          isLink
        />
        <span class="iconfont icon-right"></span>
      </div>
      <div class="info">
        <dpmsCellPicker
          title="预约项目"
          v-model="form.appointmentProject"
          :list="storeList"
        />
        <span class="iconfont icon-right"></span>
      </div>
      <div class="info">
        <dpmsDatePicker
          title="预约日期"
          v-model="form.appointmentData"
          mode="date"
          :end="end"
        />
        <span class="iconfont icon-right"></span>
      </div>
      <dpmsCellInput title="预约人员" v-model="form.appointmentPerson" />
      <dpmsCellInput title="预约备注" v-model="form.appointmentMemo" />
      <div class="operation">
        <div class="protocol">
          <checkbox class="check" checked disabled></checkbox>
          <span>我已知悉并同意</span>
          <span @click="open">《预约服务协议》</span>
        </div>
        <div class="btn">
          <button @click="amend">确认修改</button>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  data() {
    return {
      storeList: ['1店', '2店'],
      end: moment().format('YYYY-MM-DD'),
      form: {
        storeName: '',
        storeAddress: '',
        doctor: '',
        appointmentProject: '',
        appointmentData: '',
        appointmentPerson: '',
        appointmentMemo: '',
      },
    }
  },
  mounted() {},
  methods: {
    open() {
      console.log('打开协议')
    },
    amend() {
      console.log('确认修改')
    },
  },
}
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
  background: rgba($color: #000000, $alpha: 0.04);
}
.operation {
  .protocol {
    margin-top: 32rpx;
    margin-bottom: 48rpx;
    padding-left: 32rpx;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    .check {
      zoom: 50%;
    }
    span:first-child {
      color: #999999;
    }
    span:last-child {
      color: #5cbb89;
    }
  }
  .btn {
    padding: 0 64rpx;
    button {
      border-radius: 8px;
      border: none;
      font-size: 36rpx;
      background: #5cbb89;
      color: #fff;
      margin-bottom: 24rpx;
    }
  }
}
.info {
  position: relative;
  .icon-right {
    position: absolute;
    top: 44rpx;
    right: 40rpx;
    color: rgba(0, 0, 0, 0.25);
  }
}
</style>
