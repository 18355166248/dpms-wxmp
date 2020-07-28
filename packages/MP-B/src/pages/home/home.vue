<template>
  <view :style="{ paddingTop: navHeight }">
    <nav-bar
      background-color="#f00"
      :navHeight="navHeight"
      :navTop="navTop"
      :capsuleHeight="capsuleHeight"
    />
    <mescroll-body
      ref="mescrollRef"
      @init="mescrollInit"
      @down="downCallback"
      @up="upCallback"
      :down="downOption"
      :up="upOption"
      textLoading=""
    >
      <button type="primary" plain="true" @click="getPatient">请求患者列表</button>

      <button type="primary" plain="true" @click="login">login</button>
    </mescroll-body>
  </view>
</template>

<script>
import navBar from '@/components/nav-bar/nav-bar'
// 引入mescroll-mixins.js
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js'

// 引入mescroll-body组件 (如已在main.js注册全局组件,则省略此步骤)
import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue' // 注意.vue后缀不能省

import patientAPI from '@/APIS/patient/patient.api'

let systemInfoObject = uni.getSystemInfoSync()
let menuButtonObject = uni.getMenuButtonBoundingClientRect()

const navHeight =
  systemInfoObject.statusBarHeight +
  menuButtonObject.height +
  (menuButtonObject.top - systemInfoObject.statusBarHeight) * 3

export default {
  mixins: [MescrollMixin], // 使用mixin
  components: {
    navBar,
    MescrollBody,
  },
  data() {
    return {
      title: '首页',

      navHeight: `${navHeight}px`,
      // navTop: `${menuButtonObject.top}px`,
      capsuleHeight: `${menuButtonObject.height}px`,

      // 下拉刷新的配置(可选, 绝大部分情况无需配置)
      downOption: {},

      // 上拉加载的配置(可选, 绝大部分情况无需配置)
      upOption: {
        isLock: true,
      },
      // 列表数据
      pageData: {},
    }
  },
  computed: {
    // 计算属性的 getter
    navTop: function () {
      const menuButtonObject = uni.getMenuButtonBoundingClientRect()

      return `${menuButtonObject.top}px`
    },
  },
  onShow: function () {
    console.log('home Show，app展现在前台')
  },
  onHide: function () {
    console.log('home Hide，app不再展现在前台')
  },
  methods: {
    login() {
      uni.navigateTo({
        url: '/pages/login/login',
      })
    },
    getPatient() {
      patientAPI
        .getPatientList({
          registerBeginMilliSecond: 1587916800000,
          registerEndMilliSecond: 1595865599999,
          current: 1,
          size: 10,
        })
        .then((res) => {
          console.log('res:', res)
        })
        .catch((err) => console.log(err))

      patientAPI
        .getPatientTags()
        .then((res) => {
          console.log('res:', res)
        })
        .catch((err) => console.log(err))

      patientAPI
        .details()
        .then((res) => {
          console.log('res:', res)
        })
        .catch((err) => console.log(err))
    },

    /*下拉刷新的回调, 有三种处理方式:*/
    downCallback() {
      console.log('下拉刷新！')
      setTimeout(() => {
        this.mescroll.endSuccess()
      }, 3000)
    },
  },
}
</script>

<style>
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}
</style>
