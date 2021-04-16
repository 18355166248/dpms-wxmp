<template>
  <div
    class="teeth-select"
    :style="[style, { '--color': color }]"
    @click="openSelector"
  >
    <div v-for="(yas, i) in computedValue" :key="i">
      <span v-for="ya in yas" :key="ya.label">
        {{ ya.label }}
        <span class="sup">
          <span v-for="a in ya.area" :key="a">{{ a }}</span>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
const ru = ['A', 'B', 'C', 'D', 'E']
function toSortValue(label) {
  return ru.includes(label) ? ru.indexOf(label) + 1.1 : Number(label)
}
export default {
  props: {
    style: [Object, String],
    color: {
      type: String,
      default: '#5cbb89',
    },
    value: {
      type: Object,
      default() {
        return { teeth: {} }
      },
    },
    index: Number,
    disabled: Boolean,
  },
  data() {
    return {
      dataValue: this.value || { teeth: {} },
    }
  },
  computed: {
    computedValue() {
      const teeth = this.dataValue.teeth
      const value = Object.keys(teeth)
        .reduce(
          (r, k) => {
            const quadrant = k[0] % 4 || 4
            r[quadrant - 1]['push']({
              label: k[0] > 4 ? ru[k[1] - 1] : k[1],
              area: Object.keys(teeth[k] || {}),
            })
            return r
          },
          Array.from({ length: 4 }, () => []),
        )
        .map((arr, i) =>
          arr.sort((a, b) => {
            return (
              (toSortValue(a.label) - toSortValue(b.label)) *
              ([0, 3].includes(i) ? -1 : 1)
            )
          }),
        )
      value.splice(2, 0, value[3])
      return value.slice(0, 4)
    },
  },
  methods: {
    openSelector() {
      if (this.disabled) return
      this.$utils.push({
        url: `/businessComponents/TeethSelect/Selector?value=${JSON.stringify(
          this.dataValue,
        )}&uid=${this._uid}`,
      })
    },
    onChange() {
      uni.$on(`teethSelectChange${this._uid}`, (result) => {
        this.dataValue = result
        this.$emit('input', this.dataValue, this.index)
      })
    },
  },
  created() {
    this.onChange()
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal === oldVal) return
      this.dataValue = this.value || { teeth: {} }
    },
  },
}
</script>

<style lang="scss" scoped>
.teeth-select {
  color: var(--color);
  display: flex;
  flex-wrap: wrap;
  height: 102rpx;
  line-height: 51rpx;
  font-size: 22rpx;
  > div {
    border-bottom: solid 2rpx var(--color);
    border-right: solid 2rpx var(--color);
    width: 50%;
    height: 50%;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    &:nth-child(2n) {
      border-right: none;
      padding-left: 14rpx;
      > span {
        margin-right: 8rpx;
      }
    }
    &:nth-child(n + 3) {
      border-bottom: none;
    }
    &:nth-child(2n + 1) {
      display: flex;
      justify-content: flex-end;
      padding-right: 12rpx;
      > span {
        margin-left: 8rpx;
      }
    }
    .sup {
      position: relative;
      top: -6rpx;
      margin: 0 0 0 2rpx;
    }
  }
}
</style>
