<template>
  <div>
    <dpmsForm ref="myProfileForm" :model="form" :rules="rules">
      <dpmsCellInput
        required
        title="姓名"
        placeholder="请输入姓名"
        v-model="form.name"
      />
      <dpmsCellPicker
        required
        title="性别"
        placeholder="请选择性别"
        v-model="form.sex"
        :list="sexs"
        listKey="sex"
        isLink
      />
      <dpmsCellPicker
        title="出生日期"
        placeholder="请选择出生日期"
        v-model="form.date"
        mode="date"
        :end="endDate"
      />
      <dpmsCellInput
        required
        title="手机号"
        placeholder="请输入手机号"
        v-model="form.phone"
      />
      <dpmsCellPicker
        required
        title="岗位"
        placeholder="请选择岗位"
        v-model="form.job"
        :list="jobs"
        listKey="job"
        isLink
      />
    </dpmsForm>

    <button @click="saveMyProfile">
      保存
    </button>
  </div>
</template>

<script>
import moment from 'moment'
import AsyncValidator from 'async-validator'

console.log(moment().format('YYYY-MM-DD'))

export default {
  data() {
    return {
      form: {
        name: '',
        sex: '',
        date: '',
        phone: '',
        job: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入姓名',
          },
          {
            min: 1,
            max: 30,
            message: '姓名长度为1-30个字',
          },
        ],
        sex: {
          required: true,
          message: '请选择性别',
        },
        phone: {
          required: true,
          message: '请输入手机号',
        },
        job: {
          required: true,
          message: '请选择岗位',
        },
      },
      endDate: moment().format('YYYY-MM-DD'),
      sexs: ['男', '女'],
      jobs: ['医生', '护士', '洁牙师'],
    }
  },
  methods: {
    saveMyProfile() {
      this.$refs.myProfileForm.validate((err, fileds) => {
        console.log(err, '*******', fileds)
        console.log('&&&', this.form)
        if (err) {
          this.show(err[0]?.message)
          return
        }
        //成功执行
      })
    },
  },
}
</script>

<style scoped>
button {
  width: 620rpx;
  height: 78rpx;
  line-height: 78rpx;
  background: #5cbb89;
  border-radius: 8rpx;
  font-size: 36rpx;
  font-weight: 400;
  text-align: center;
  color: #ffffff;
  margin-top: 56rpx;
}
</style>
