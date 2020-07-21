<template>
  <view class="">
    <!-- 	<view class="intro">本项目已包含uni ui组件，无需import和注册，可直接使用。在代码区键入字母u，即可通过代码助手列出所有可用组件。光标置于组件名称处按F1，即可查看组件文档。</view>
		<text class="intro">详见：</text>
		<uni-link :href="href" :text="href"></uni-link> -->

    <!-- <calendar @change="change"></calendar> -->
    <day-table
      scrollHeight="height:calc(100vh)"
      v-on:bookMeeting="bookMeeting($event)"
      chooseDateProp="2020-07-22"
    ></day-table>
  </view>
</template>

<script>
import dayTable from '../../components/dayTable/dayTable.vue';
import calendar from '../../components/calendar/calendar.vue';

export default {
  data() {
    return {
      href: 'https://uniapp.dcloud.io/component/README?id=uniui',
    };
  },
  components: {
    dayTable,
    calendar,
  },
  methods: {
    //点击创建日程操作，
    //e返回参数 数据结构为{
    // endTime: "2020-03-22 17:30:00"
    //startTime: "2020-03-22 16:30:00"}
    bookMeeting(e) {
      console.log(e);
    },

    change(e) {
      console.log(e);
    },
  },
};
</script>

<style></style>
