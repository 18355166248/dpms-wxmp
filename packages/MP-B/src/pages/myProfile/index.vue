<template>
  <div>
    <formItem
      title="姓名"
      isRequired
      inputType="text"
      placeholder="请输入姓名"
      v-model="form.name"
    ></formItem>
    <formItem
      title="性别"
      isArrowRight
      isRequired
      inputType="picker"
      :pickerArray="sex"
      mode="selector"
      v-model="form.sex"
    ></formItem>
    <formItem
      title="出生日期"
      isArrowRight
      inputType="picker"
      mode="date"
      :endDate="endDate"
      v-model="form.date"
    ></formItem>
    <formItem
      title="手机号"
      isRequired
      inputType="text"
      placeholder="请输入手机号"
      v-model="form.phone"
    ></formItem>
    <formItem
      title="岗位"
      isArrowRight
      isRequired
      inputType="picker"
      mode="selector"
      :pickerArray="job"
      v-model="form.job"
    ></formItem>

    <button @click="saveMyProfile">
      保存
    </button>
  </div>
</template>

<script>
import formItem from '../../components/formItem/formItem'
import moment from 'moment'

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
      endDate: moment().format('YYYY-MM-DD'),
      sex: ['男', '女'],
      job: ['医生', '护士', '洁牙师'],
    }
  },
  components: {
    formItem,
  },
  methods: {
    saveMyProfile() {
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
