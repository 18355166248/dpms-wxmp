<template>
  <picker
    :range-key="listKey"
    :range="list"
    :value="selectValue"
    @change="onChange"
    :mode="mode"
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
    listKey: String,
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
  data() {
    return {
      selectValue: 0,
      pickerValue: this.value,
    }
  },
  created() {
    if (this.value) {
      this.selectValue = this.list.findIndex((item) => {
        const v = this.listKey ? item[this.listKey] : item

        return v === this.value
      })
    }
  },
  methods: {
    onChange(e) {
      console.log(e)
      let index = e.detail.value
      let value = index
      let pickerValue = value

      if (this.listKey) {
        if (this.mode === 'selector') {
          value = this.list[index]
          pickerValue = value
        }

        if (this.mode === 'multiSelector') {
          pickerValue = []
          value = []
          e.detail.value.forEach((index2, i) => {
            value.push(this.list[i][index2])
            pickerValue.push(this.list[i][index2][this.listKey])
          })
        }
      }

      this.selectValue = index

      this.pickerValue = pickerValue

      this.$emit('input', value)
    },
  },
}
</script>

<style></style>
