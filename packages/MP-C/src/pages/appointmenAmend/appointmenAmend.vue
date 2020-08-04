<template>
  <div class="page-bg content">
    <scroll-view>
      <dpmsCellPicker
        title="预约门店"
        v-model="form.store"
        :list="store"
        isLink
      />
      <dpmsCellPicker
        title="门店地址"
        v-model="form.storeAddress"
        :list="store"
      />
      <dpmsCellPicker
        title="预约医生"
        v-model="form.doctor"
        :list="store"
        isLink
      />
      <dpmsCellPicker
        title="预约项目"
        v-model="form.appointmentProject"
        :list="store"
      />
      <dpmsCellPicker
        title="预约日期"
        v-model="form.appointmentData"
        :list="store"
        mode="date"
        :end="end"
      />
      <dpmsCellInput
        title="预约人员"
        v-model="form.appointmentPerson"
        :list="store"
      />
      <dpmsCellInput
        title="预约备注"
        v-model="form.appointmentMemo"
        :list="store"
      />
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
      store: ['1店', '2店'],
      end: moment().format('YYYY-MM-DD'),
      form: {
        store: '',
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
</style>
