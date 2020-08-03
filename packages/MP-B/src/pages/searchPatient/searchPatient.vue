<template>
  <scroll-view>
    <div data-layout-align="space-between center">
      <dpmsSearch
        type="text"
        confirmType="search"
        placeholder="搜索患者"
        @change="changePatientParam"
        @search="searchPatients"
      />
      <button class="mini-btn" type="primary" size="mini">新建</button>
    </div>

    <div v-if="!searchPatientParam">请输入姓名/拼音/手机号查找患者</div>
    <div v-if="searchPatientParam && patientList.length === 0">
      没有找到“{{ searchPatientParam }}”这个患者
    </div>
    <div
      style="margin-top: 60px; margin-bottom: 60px;"
      v-if="patientList.length === 0"
    >
      <div data-layout-align="space-between center">
        <image
          style="width: 20px; height: 20px;"
          src="http://uat.cloud.dental.his.laoganma.fun/static/images/male.e2a2278.png"
        />
        <span>历史搜索</span>
        <button
          class="mini-btn"
          size="mini"
          @click="clearHistorySearch"
          v-if="searchRecords.length !== 0"
        >
          x
        </button>
      </div>
      <div>
        <button
          class="mini-btn"
          type="primary"
          size="mini"
          v-for="searchRecord in searchRecords"
          :key="searchRecord"
          @click="chooseSearchRecord(searchRecord)"
        >
          {{ searchRecord }}
        </button>
      </div>
    </div>
    <div v-if="searchPatientParam && patientList.length != 0">
      <div data-layout-align v-for="parient in patientList" :key="parient.id">
        <image
          style="width: 60px; height: 60px;"
          src="http://uat.cloud.dental.his.laoganma.fun/static/images/male.e2a2278.png"
        />
        <div>
          <div>
            <span>{{ parient.patientName }}</span>
            <span>{{ parient.genderText }}</span>
            <span>{{ parient.age }}</span>
          </div>
          <div>联系电话: {{ parient.mobile }}</div>
        </div>
      </div>

      <div data-layout-align>
        <image
          style="width: 60px; height: 60px;"
          src="http://uat.cloud.dental.his.laoganma.fun/static/images/male.e2a2278.png"
        />
        <div>
          <div><span>张三丰</span><span>男</span><span>31岁</span></div>
          <div>联系电话: 15900451752</div>
        </div>
      </div>
      <div data-layout-align>
        <image
          style="width: 60px; height: 60px;"
          src="http://uat.cloud.dental.his.laoganma.fun/static/images/male.e2a2278.png"
        />
        <div>
          <div><span>张三哥</span><span>男</span><span>23岁</span></div>
          <div>联系电话: 15900451752</div>
        </div>
      </div>
      <div data-layout-align>
        <image
          style="width: 60px; height: 60px;"
          src="http://uat.cloud.dental.his.laoganma.fun/static/images/female.ac74756.png"
        />
        <div>
          <div><span>张三妹</span><span>女</span><span>16岁</span></div>
          <div>联系电话: 15900451752</div>
        </div>
      </div>
    </div>
  </scroll-view>
</template>

<script>
import authAPI from '@/APIS/patient/patient.api'
import { dataDictUtil } from '../../utils/dataDict.util'

console.log(
  '&&&&&&&&&',
  dataDictUtil.convert(uni.getStorageSync('enums').Gender || {}),
)

export default {
  data() {
    return {
      GENDER_ENUM: dataDictUtil.convert(
        uni.getStorageSync('enums').Gender || {},
      ),
      searchPatientParam: '',
      patientList: [],
      searchRecords: [],
      searchFlag: false,
    }
  },
  onLoad() {
    this.searchRecords = uni.getStorageSync('searchPatientHistory') || []
  },
  methods: {
    changePatientParam(param) {
      this.searchPatientParam = param.value
      this.patientList = []
    },
    searchPatients: function (e) {
      this.searchFlag = true
      let that = this

      //搜索历史列表数据
      let searchList = [
        ...new Set([
          this.searchPatientParam,
          ...uni.getStorageSync('searchPatientHistory'),
        ]),
      ]

      this.searchRecords = searchList
      uni.setStorageSync('searchPatientHistory', searchList)

      authAPI
        .getPatientList({
          regularParam: this.searchPatientParam,
        })
        .then((res) => {
          //TODO：搜索患者
          console.log('--ddd-0----', res)
          that.searchFlag = false
          that.patientList = res.data.records.map((item) => {
            return {
              ...item,
              genderText: that.GENDER_ENUM.properties[item.gender].text.zh_CN,
            }
          })
          console.log('--ddd-----', that.patientList)
        })
    },
    chooseSearchRecord(searchRecord) {
      this.searchPatientParam = searchRecord
    },
    clearHistorySearch() {
      uni.setStorageSync('searchPatientHistory', [])
    },
  },
}
</script>

<style scoped>
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
</style>
