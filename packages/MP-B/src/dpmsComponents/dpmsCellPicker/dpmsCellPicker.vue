<template>
  <picker
    :range-key="defaultProps.label"
    :range="list"
    :value="selectIndex"
    @change="onChange"
    :mode="mode"
    :end="end"
  >
    <dpmsCell
      :title="title"
      :required="required"
      isLink
      :placeholder="placeholder"
      :value="pickerValue"
    />
  </picker>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      default: 'selector', // selector, multiSelector, time, date, region
    },
    list: {
      type: Array,
      default: [],
    },
    value: [String, Number],
    defaultType: {
      type: String,
      default: 'label',
    },
    defaultProps: {
      typre: Object,
      default: { label: 'label', value: 'value' },
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
    end: String,
  },
  computed: {
    pickerValue() {
      const picker = this.list.find(
        (item) => item[this.defaultType] === this.value,
      )

      return picker && picker[this.defaultProps.label]
    },
    pickerKey() {
      if (this.defaultProps.label === this.defaultType) {
        return this.defaultProps.label
      }
      if (this.defaultProps.value === this.defaultType) {
        return this.defaultProps.value
      }
    },
  },
  watch: {
    value(newVal) {
      if (this.value && this.mode === 'date') {
      }
    },
    list(newVal) {
      if (this.value) {
        this.selectIndex = this.list.findIndex((item) => {
          const v = item[this.pickerKey]

          return v === this.value
        })
      }
    },
  },
  data() {
    return {
      selectIndex: 0,
    }
  },
  created() {
    if (this.value) {
      this.selectIndex = this.list.findIndex((item) => {
        const v = item[this.pickerKey]

        return v === this.value
      })
    }
  },
  methods: {
    onChange(e) {
      let index = e.detail.value
      let value = index

      if (this.mode === 'selector') {
        value = this.list[index]
      }

      if (this.mode === 'multiSelector') {
        value = []
        e.detail.value.forEach((index2, i) => {
          value.push(this.list[i][index2])
        })
      }

      this.selectIndex = index

      this.$emit('input', value[this.defaultType], value)
    },
  },
}
</script>

<style></style>
