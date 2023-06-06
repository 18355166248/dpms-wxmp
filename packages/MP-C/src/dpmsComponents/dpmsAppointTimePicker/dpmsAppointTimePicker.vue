<template>
  <picker
    mode="multiSelector"
    :range="range"
    :value="pickerValue"
    @columnchange="columnchange"
    @change="change"
  >
    <div>{{ pickerText || placeholder }}</div>
  </picker>
</template>

<script>
import moment from 'moment'
const now = moment()
const years = Array.from({ length: 100 }).map((v, i) => i + now.year())
const months = Array.from({ length: 12 }).map((v, i) => i + 1)
const dates = Array.from({
  length: moment()
    .year(years[0])
    .month(months[0] - 1)
    .endOf('month')
    .date(),
}).map((v, i) => i + 1)
const hourMinutes = ['09:00', '10:00', '11:30', '12:00']
export default {
  props: {
    placeholder: {
      default() {
        return '请选择预约时间'
      },
    },
    value: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      range: [years, months, dates, hourMinutes],
      pickerValue: this.filterValue(this.value),
      pickerText: '',
    }
  },
  watch: {
    value(newVal) {
      this.pickerValue = this.filterValue(newVal)
    },
  },
  computed: {
    dateText() {
      const hourMinute = hourMinutes[this.pickerValue[3]].split(':')
      return moment()
        .year(this.range[0][this.pickerValue[0]])
        .month(this.pickerValue[1])
        .date(this.pickerValue[2] + 1)
        .hour(hourMinute[0])
        .minute(hourMinute[1])
        .format('YYYY-MM-DD HH:mm')
    },
  },
  methods: {
    filterValue(val) {
      if (val) {
        return [
          this.range[0].indexOf(moment(val).year()),
          this.range[1].indexOf(moment(val).month() + 1),
          this.range[2].indexOf(moment(val).date()),
          this.range[3].indexOf(moment(val).format('HH:mm')),
        ]
      } else {
        return [0, now.month(), now.date() - 1, 0]
      }
    },
    columnchange({ detail: { column, value } }) {
      let pickerValue = this.pickerValue.map((v, i) => {
        if (i === column) {
          return value
        }
        return v
      })
      if (column in [0, 1]) {
        const dateLength = moment()
          .year(years[pickerValue[0]])
          .month(months[pickerValue[1]] - 1)
          .endOf('month')
          .date()
        if (dateLength !== this.range[2].length) {
          this.range = this.range.map((v, i) => {
            if (i === 2) {
              return Array.from({ length: dateLength }).map((v, i) => i + 1)
            }
            return v
          })
          if (dateLength - 1 < pickerValue[2]) {
            pickerValue = pickerValue.map((v, i) => {
              if (i === 2) {
                return dateLength - 1
              }
              return v
            })
          }
        }
      }
      this.pickerValue = pickerValue
    },
    change() {
      this.pickerText = this.dateText
      this.$emit('input', moment(this.dateText).valueOf())
    },
  },
}
</script>

<style></style>
