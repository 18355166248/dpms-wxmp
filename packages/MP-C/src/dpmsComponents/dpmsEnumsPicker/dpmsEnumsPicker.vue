<template>
  <picker
    mode="selector"
    range-key="zh_CN"
    :range="list"
    :value="selectValue"
    @change="onChange"
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
export default {
  name: 'dpmsEnumsPicker',
  props: {
    enumsKey: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      default: 0,
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
    style: {
      type: String,
      required: false,
    },
    headerText: String,
  },
  watch: {
    value(newVal) {
      this.pickerValue = newVal
      this.selectValue = newVal
        ? this.list.findIndex((v) => v.value === newVal)
        : 0
    },
  },
  computed: {
    pickerText() {
      return this.pickerValue ? this.list[this.selectValue].zh_CN : ''
    },
  },
  data() {
    return {
      list: [],
      selectValue: 0,
      pickerValue: this.value,
    }
  },
  created() {
    let enums = this.$utils.getEnums(this.enumsKey)
    this.list = Object.values(enums.properties)
    if (this.value) {
      this.selectValue = this.list.findIndex((v) => v.value === this.value)
    }
  },
  methods: {
    onChange(e) {
      let value = this.list[e.detail.value].value
      this.pickerValue = value
      this.$emit('input', value)
    },
  },
}
</script>

<style></style>
