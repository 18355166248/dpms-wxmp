<template>
  <picker
    mode="multiSelector"
    range-key="name"
    :range="multiArray"
    :value="multiIndex"
    @change="onChange"
    @columnchange="bindMultiPickerColumnChange"
    :header-text="headerText"
  >
    <dpmsCell
      :title="title"
      :required="required"
      isLink
      :placeholder="placeholder"
      :value="pickerText"
    />
  </picker>
</template>

<script>
import institutionAPI from '@/APIS/institution/institution.api'

export default {
  name: 'dpmsPlacePicker',
  props: {
    value: {
      type: Array,
      default: [],
      required: true,
    },
    placeholder: String,
    required: {
      type: Boolean,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    isLink: {
      type: Boolean,
      required: false,
    },
    headerText: String,
  },
  data() {
    return {
      multiArray: [[], [], []],
      multiIndex: [0, 0, 0],
      placeArr: [],
      pickerValue: this.value,
    }
  },
  computed: {
    pickerText() {
      return this.pickerValue.length
        ? this.pickerValue
            .reduce((acc, cur, idx) => {
              this.multiArray[idx].map(
                (v) => v.placeId === cur && acc.push(v.name),
              )
              return acc
            }, [])
            .join(' ')
        : ''
    },
    pickerArr() {
      return this.multiArray.map((v, i) =>
        v[this.multiIndex[i]] ? v[this.multiIndex[i]].placeId : '',
      )
    },
  },
  watch: {
    value(newVal) {
      this.pickerValue = newVal
      if (newVal && newVal.length) {
        this.reWrite(newVal)
        this.renderPlaceArr()
      }
    },
    'multiIndex.0': function (newVal) {
      this.multiArray[1] = this.filterArr(this.placeArr[newVal].children)
      this.multiArray[2] = this.filterArr(
        this.placeArr[newVal].children[0].children,
      )
      this.multiIndex[1] = 0
      this.multiIndex[2] = 0
    },
    'multiIndex.1': function (newVal) {
      this.multiArray[2] = this.filterArr(
        this.placeArr[this.multiIndex[0]].children[newVal].children,
      )
      this.multiIndex[2] = 0
    },
  },
  created() {
    this.getAllPlace()
  },
  methods: {
    // 获取地区列表
    getAllPlace() {
      institutionAPI.getAllPlace().then((res) => {
        this.placeArr = res.data.constants.PLACE
        if (this.pickerValue.length) {
          this.reWrite(this.pickerValue)
        }
        this.renderPlaceArr()
      })
    },
    // 初始化数组
    renderPlaceArr() {
      let key = this.multiIndex

      this.$set(this.multiArray, 0, this.filterArr(this.placeArr))

      if (this.placeArr[key[0]]) {
        this.$set(
          this.multiArray,
          1,
          this.filterArr(this.placeArr[key[0]].children),
        )
        this.$set(
          this.multiArray,
          2,
          this.filterArr(this.placeArr[key[0]].children[key[1]].children),
        )
      }
    },
    // 复写数据
    reWrite(arr) {
      JSON.stringify(this.placeArr, (k, v) => {
        if (v.placeId && arr.includes(v.placeId)) {
          this.multiIndex[v.type - 2] = Number(k)
        }
        return v
      })
    },
    // 格式化属性
    filterArr(arr = []) {
      return JSON.parse(JSON.stringify(arr, ['name', 'placeId']))
    },

    bindMultiPickerColumnChange(e) {
      this.$set(this.multiIndex, e.detail.column, e.detail.value)
    },
    onChange(e) {
      this.pickerValue = this.pickerArr
      this.$emit('input', this.pickerArr)
    },
  },
}
</script>

<style></style>
