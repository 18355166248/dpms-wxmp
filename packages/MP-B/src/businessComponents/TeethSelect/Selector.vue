<template>
  <div class="selector">
    <div class="sets">
      <div @click="setClick(teeth[0][0], teeth[1][0])">上半口-乳</div>
      <div @click="setClick(teeth[2][1], teeth[3][1])">下半口-乳</div>
      <div @click="setClick(teeth[0][1], teeth[1][1])">上半口-恒</div>
      <div @click="setClick(teeth[2][0], teeth[3][0])">下半口-恒</div>
    </div>
    <div class="teeth">
      <div v-for="(quadrant, i) in teeth" :key="i">
        <div class="yaWrap" :class="[`pos${i}${j}`]"
          v-for="(yas, j) in quadrant" :key="j"
        >
          <div v-for="ya in yas" :key="ya.position" 
            :class="{active: teethSelected.some(s => s.position === ya.position)}" 
            @click="yaClick(ya)"
          >
            {{ya.label}}
          </div>
        </div>
      </div>
    </div>
    <div class="area">
      <div class="label">区域</div>
      <div class="group">
        <div v-for="a in areas" :key="a" :class="{active: areaSelected.includes(a)}"
          @click="areaClick(a)"
        >{{a}}</div>
      </div>
    </div>
    <div class="bottom">
      <button @click="save">保 存</button>
    </div>
  </div>
</template>

<script>
function genYa(quadrant) {
  //大于4是乳牙
  const [start, num] = quadrant > 4 && ['A', 5] || ['1', 8]
  return Array.from({length: num}, (v, i) => ({
    label: String.fromCharCode(start.charCodeAt() + i),
    position: `${quadrant}${i + 1}`
  }))
}
export default {
  data() {
    return {
      teeth: [
        [
          genYa(5).reverse(),
          genYa(1).reverse(),
        ], 
        [
          (() => {
            const yas = genYa(6)
            return [...yas.slice(4), ...yas.slice(0, 4)]
          })(),
          (() => {
            const yas = genYa(2)
            return [...yas.slice(4), ...yas.slice(0, 4)]
          })(),
        ],
        [
          (() => {
            const yas = genYa(4)
            return [...yas.slice(0, 4).reverse(), ...yas.slice(4).reverse()]
          })(),
          (() => {
            const yas = genYa(8)
            return [...yas.slice(0, 4).reverse(), ...yas.slice(4).reverse()]
          })(),
        ],
        [
          genYa(3),
          genYa(7),
        ],
      ],
      areas: ['B', 'L', 'O', 'M', 'D'],
      areaSelected: [], teethSelected: [],
    }
  },
  methods: {
    areaClick(a) {
      if (!this.teethSelected.length) return
      this.areaSelected = this.areaSelected.includes(a) ? this.areaSelected.filter(_a => _a !== a) : [...this.areaSelected, a]
    },
    yaClick(ya) {
      if (this.teethSelected.some(s => s.position === ya.position)) {
        this.teethSelected = this.teethSelected.filter(s => s.position !== ya.position)
      } else {
        this.teethSelected.push(ya)
      }
    },
    setClick(...yas) {
      this.teethSelected = [...this.teethSelected, ...yas.flat()]
    },
    save() {
      const result = this.teethSelected.reduce((r, s) => {
        r.teeth[`${s.position}`] = this.areaSelected.reduce((r, _a) => ({...r, [_a]: true}), {})
        return r
      }, {teeth: {}})
      uni.$emit(`teethSelectChange${this.uid}`, result)
      this.$utils.back()
    },
    initValue({teeth}) {
      this.teethSelected = Object.keys(teeth).map(t => ({
        position: t,
      }))
      if (this.teethSelected.length) {
        this.areaSelected = [...new Set(Object.values(teeth).map(t => Object.keys(t)).flat())]
      }
    }
  },
  onLoad({value, uid}) {
    this.uid = uid
    this.initValue(JSON.parse(value))
  },
  watch: {
    teethSelected(newVal, oldVal) {
      if (newVal === oldVal) return
      if (!newVal.length) {
        this.area = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.selector{
  font-size: 28rpx;
  color: rgba(0,0,0,0.7);
}
.sets{
  height: 112rpx;
  background: #feffff;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  gap: 0 12rpx;
  padding: 0 32rpx;
  >div{
    line-height: 48rpx;
    border: 2rpx solid rgba(0,0,0,0.15);
    border-radius: 4rpx;
    text-align: center;
  }
}
.teeth{
  background: #feffff;
  margin-top: 20rpx;
  padding: 32rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 42rpx 62rpx;
  position: relative;
  &::before{
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 2rpx;
    background: #5cbb89;
    width: 82rpx;
  }
  &::after{
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2rpx;
    background: #5cbb89;
    height: 82rpx;
  }
  .yaWrap{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8rpx;
    &:last-child{
      margin-top: 20rpx;
    }
    &.pos00{
      :first-child{
        grid-column-start: 4;
      }
    }
    &.pos10{
      :nth-child(1){
        grid-column:1 /5;
      }
    }
    &.pos21{
      :nth-child(5){
        grid-column:4 /5;
      }
    }
    >div{
      border: 2rpx solid rgba(0,0,0,0.15);
      border-radius: 4rpx;
      width: 72rpx;
      height: 72rpx;
      box-sizing: border-box;
      text-align: center;
      line-height: 72rpx;
    }
    .active{
      background: #5cbb89;
      border-color: #5cbb89;
      color: #ffffff;
    }
  }
}
.area{
  height: 112rpx;
  background: #feffff;
  display: flex;
  align-items: center;
  margin-top: 20rpx;
  padding: 0 32rpx;
  .label{
    color: rgba(0,0,0,0.9);
    font-size: 34rpx;
    margin-right: 16rpx;
  }
  .group{
    display: flex;
    text-align: center;
    line-height: 64rpx;
    >div{
      width: 84rpx;
      height: 64rpx;
      border: 2rpx solid rgba(0,0,0,0.15);
      margin-left: -2rpx;
      &:first-child{
        border-radius: 8rpx 0 0 8rpx;
      }
      &:last-child{
        border-radius: 0 8rpx 8rpx 0;
      }
    }
    .active{
      color: #5cbb89;
      border-color: #5cbb89;
      position: relative;
    }
  }
}
.bottom{
  height: 90rpx;
  button{
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    height: 90rpx;
    background: #5cbb89;
    color: #ffffff;
    font-size: 36rpx;
    border-radius: 0;
  }
}
</style>