<template>
  <div>
    <dpmsForm ref="myProfileForm" :rules="rules">
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
        title="联系电话"
        placeholder="请输入联系电话"
        v-model="form.phone"
      />
      <dpmsCellPicker
        required
        title="岗位"
        placeholder="请选择岗位"
        v-model="form.job"
        :list="job"
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

console.log(moment().format('YYYY-MM-DD'))

export default {
  data() {
    return {
      form: {
        name: '',
        date: '',
        phone: '',
        job: '',
      },
      rules: {
        name: {
          required: true,
          message: '请输入姓名',
          min: 0,
          max: 50,
        },
        sex: {
          required: true,
          message: '请选择性别',
        },
      },
      endDate: moment().format('YYYY-MM-DD'),
      sexs: ['男', '女'],
      job: ['医生', '护士', '洁牙师'],
    }
  },
  methods: {
    saveMyProfile() {
      this.$refs.myProfileForm.validate((err, fileds) => {
        console.log(err, fileds)
        if (err) {
          this.show(err[0]?.message)
        }
        //成功执行
      })

      console.log(this.form)
      // console.log(this.$refs.nameInput.inputValue + '\n' + this.$refs.phoneInput.inputValue)
      // console.log(this.$refs.sexPicker)
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
