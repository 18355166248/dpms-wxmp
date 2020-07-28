<template>
  <div>
    <dpmsDatetimePicker
      isCell
      :disabled="disabled"
      :placeholder="placeholder"
      :fields="fields"
      :defaultValue="defaultValue"
      @change="onChange"
    >
      <dpmsCell
        :title="title"
        :required="required"
        isLink
        :placeholder="placeholder"
        :value="pickerValue"
      />
    </dpmsDatetimePicker>
  </div>
</template>

<script>
import moment from 'moment'
import dpmsDatetimePicker from './dpmsDatetimePicker/dpmsDatetimePicker.vue'

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '请选择日期时间',
    },
    // 表示选择器的粒度，有效值：year | month | day | hour | minute
    fields: {
      type: String,
      default: 'minute',
    },
    required: {
      type: Boolean,
      default: false,
    },
    title: String,
    value: String,
    formatValue: String, // 格式化展示时间格式
  },
  data() {
    return {
      defaultValue: this.value || moment().format('YYYY-MM-DD HH:mm'),
      pickerValue: undefined,
    }
  },
  methods: {
    onChange(value) {
      const pickerValue = this.formatValue
        ? moment(value.dt).format(this.formatValue)
        : value.f3
      this.pickerValue = pickerValue

      this.$emit('input', value.dt)
    },
  },
  components: {
    dpmsDatetimePicker,
  },
}
</script>

<style></style>
