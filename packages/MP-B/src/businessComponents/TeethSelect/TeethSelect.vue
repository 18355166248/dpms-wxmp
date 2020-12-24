<template>
  <div class="teeth-select" :style="style" @click="openSelector">
    <div v-for="(yas, i) in computedValue" :key="i">
      <span v-for="ya in yas" :key="ya.label">
        {{ya.label}}
        <span class="sup">
          <span v-for="a in ya.area" :key="a">{{a}}</span>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    style: [Object, String],
    value: {
      type: Object,
      default() {
        return {teeth: {}}
      }
    },
    index: Number,
    disabled: Boolean,
  },
  data() {
    return {
      dataValue: this.value || {teeth: {}}
    }
  },
  computed: {
    computedValue() {
      const teeth = this.dataValue.teeth
      return Object.keys(teeth).reduce((r, k) => {
        const quadrant = k[0] % 4 || 4
        r[quadrant - 1].push({label: k[1], area: Object.keys(teeth[k] || {})})
        return r
      }, Array.from({length: 4}, () => []))
    }
  },
  methods: {
    openSelector() {
      if (this.disabled) return
      this.$utils.push({url: `/businessComponents/TeethSelect/Selector?value=${JSON.stringify(this.dataValue)}&uid=${this._uid}`})
    },
    onChange() {
      uni.$on(`teethSelectChange${this._uid}`, result => {
        this.dataValue = result
        this.$emit('input', this.dataValue, this.index)
      })
    },
  },
  created() {
    this.onChange()
  }
}
</script>

<style lang="scss" scoped>
.teeth-select{
  color: #5cbb89;
  display: flex;
  flex-wrap: wrap;
  height: 102rpx;
  line-height: 51rpx;
  font-size: 22rpx;
  >div{
    border-bottom: solid 1rpx #5cbb89;
    border-right: solid 1rpx #5cbb89;
    width: 50%;
    height: 50%;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    &:nth-child(2n){
      border-right: none;
      padding-left: 14rpx;
      >span{
        margin-right: 8rpx;
      }
    }
    &:nth-child(n+3){
      border-bottom: none;
    }
    &:nth-child(2n+1){
      text-align: right;
      padding-right: 14rpx;
      >span{
        margin-left: 8rpx;
      }
    }
    .sup{
      position: relative;
      top: -6rpx;
      margin: 0 0 0 2rpx;
    }
  }
}
</style>