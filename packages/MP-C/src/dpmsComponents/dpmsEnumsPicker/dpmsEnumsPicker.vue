<template>
  <picker
    mode="selector"
    range-key="zh_CN"
    :range="list"
    :value="selectValue"
    @change="onChange"
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
  },
  watch: {
    value(newVal) {
      if (this.value) {
        this.selectValue = this.list.findIndex((v) => v.value === this.value)
      }
    },
  },
  computed: {
    pickerText() {
      return this.list[this.selectValue].zh_CN
    },
  },
  data() {
    return {
      list: [],
      selectValue: 0,
    }
  },
  created() {
    this.list = this.$utils.commonUtil.getEnums(this.enumsKey)
  },
  methods: {
    onChange(e) {
      let value = this.list[e.detail.value].value
      this.$emit('input', value)
    },
  },
}
</script>

<style></style>
