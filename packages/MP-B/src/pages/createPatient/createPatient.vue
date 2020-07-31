<template>
  <div class="page-bg">
    <scroll-view scroll-y class="h100">
      <dpmsForm ref="createPatientForm" :rules="rules">
        <div class="category-title">基本信息1</div>
        <dpmsCellInput
          required
          title="姓名"
          placeholder="请输入姓名"
          v-model="form.patientName"
        />
        <dpmsCellPicker
          required
          title="性别"
          placeholder="请选择性别"
          v-model="form.gender"
          :list="sexArray"
          listKey="sex"
          isLink
        />
        <dpmsCellPicker
          title="出生日期"
          placeholder="请选择出生日期"
          v-model="form.birthday"
          mode="date"
          :end="end"
        />
        <dpmsCellPicker
          title="患者类型"
          placeholder="请选择患者类型"
          v-model="form.settingsTypeId"
          :list="patientType"
          listKey="patient"
          isLink
        />
        <dpmsCellPicker
          mode="region"
          :list="multiArray"
          v-model="form.tagList"
          listKey="name"
          title="用户画像"
          placeholder="请选择用户画像"
        />

        <div class="category-title">联系方式</div>
        <dpmsCellPicker
          required
          :list="contactLabels"
          v-model="form.contactLabel"
          listKey="contactLabel"
          title="联系电话标签"
          placeholder="请选择联系电话标签"
          isLink
        />
        <dpmsCellInput
          required
          title="联系电话"
          placeholder="请输入联系电话"
          v-model="form.mobile"
        />
        <dpmsCellInput
          title="备用号码"
          placeholder="请输入备用号码"
          v-model="form.alternateMobile"
        />
        <dpmsCellInput
          title="微信号"
          placeholder="请输入微信号"
          v-model="form.weChatId"
        />
        <dpmsCellInput title="QQ" placeholder="请输入QQ" v-model="form.qqNum" />
        <dpmsCellPicker
          mode="region"
          :list="multiArray"
          v-model="form.area"
          listKey="area"
          title="家庭住址"
          placeholder="请选择地区"
        />

        <div class="dpms-cell-group">
          <div class="dpms-cell" data-layout-align="space-between center">
            <input
              placeholder-style="font-size: 34rpx;font-weight: 400;color: rgba(0, 0, 0, 0.25);"
              placeholder="请输入详细住址"
            />
          </div>
        </div>
        <div class="mt-56 mb-82">
          <formButton @click="submit"></formButton>
        </div>
      </dpmsForm>
    </scroll-view>

    <!-- <div data-layout-align='space-between center'>
      <span>用户画像：</span>
      <span v-if="patientData.personas.length > 0">
        <span
          v-for="persona in patientData.personas"
          :key="persona"
        >{{persona}} </span>
      </span>
      <span v-else>请选择用户画像</span>
      <span @click="toPersonas">
        >
      </span>
    </div> -->
  </div>
</template>

<script>
import moment from 'moment'
import AsyncValidator from 'async-validator'

export default {
  data() {
    return {
      sexArray: ['男', '女'],
      patientType: ['普通', '临时'],
      contactLabels: ['本人', '父母', '子女', '亲戚'],
      end: moment().format('YYYY-MM-DD'),
      index: 0,
      form: {
        patientName: '',
        gender: '',
        birthday: '',
        settingsTypeId: '',
        tagList: '',
        contactLabel: '',
        mobile: '',
        alternateMobile: '',
        weChatId: '',
        qqNum: '',
        area: '',
        address: '',
      },
      rules: {
        patientName: {
          required: true,
          message: '请输入姓名',
          min: 0,
          max: 50,
        },
        gender: {
          required: true,
          message: '请选择性别',
        },
        contactLabel: {
          required: true,
          message: '请选择联系电话标签',
        },
        mobile: {
          type: 'number',
          required: true,
          message: '请输入联系电话',
          len: 11,
        },
        alternateMobile: {
          type: 'number',
          message: '请输入备用号码',
          len: 11,
        },
        weChatId: {
          message: '请输入微信号',
          min: 0,
          max: 20,
        },
        qqNum: {
          message: '请输入QQ',
          min: 0,
          max: 20,
        },
        address: {
          message: '请输入详细地址',
          min: 0,
          max: 100,
        },
      },
    }
  },
  methods: {
    bindDateChange: function (e) {
      this.patientData.date = e.detail.value
    },
    // toPersonas () {

    //   if (this.patientData.personas) {
    //     uni.navigateTo({
    //       url: '/pages/personas/index?personas=' + JSON.stringify(this.patientData.personas),
    //     })
    //   } else {
    //     uni.navigateTo({
    //       url: '/pages/personas/index',
    //     })
    //   }
    // },
    submit() {
      this.$refs.createPatientForm.validate((err, fileds) => {
        console.log(err, fileds)
        if (err) {
          this.$utils.show(err[0]?.message)
        }
        //成功执行
      })
    },
  },
  // onLoad: function (option) {
  //   this.patientData.personas = option.personas && JSON.parse(option.personas)
  // }
}
</script>

<style lang="scss" scoped>
.page-bg {
  height: 100%;
  background: rgba(0, 0, 0, 0.04);
}

[data-layout-align] {
  display: flex;
  justify-content: flex-start;
  align-content: stretch;
  align-items: stretch;
}

[data-layout-align='space-between center'] {
  justify-content: space-between;
  align-items: center;
  align-content: center;
  max-width: 100%;
}

.dpms-cell-group {
  width: 750rpx;
  height: 112rpx;
  .dpms-cell {
    height: 112rpx;
    margin: 0 32rpx;
    border-bottom: 2rpx solid rgba(0, 0, 0, 0.15);

    .dpms-cell-value {
      font-size: 34rpx;
      font-weight: 400;
      text-align: right;
      color: rgba(0, 0, 0, 0.5);
      .iconfont {
        margin-left: 4rpx;
        color: rgba(0, 0, 0, 0.25);
      }
    }
  }
}

.category-title {
  width: 750rpx;
  height: 82rpx;
  line-height: 82rpx;
  background: rgba(0, 0, 0, 0.04);
  text-indent: 32rpx;
  font-size: 28rpx;
  font-weight: 400;
  text-align: left;
  color: rgba(0, 0, 0, 0.5);
}
</style>
