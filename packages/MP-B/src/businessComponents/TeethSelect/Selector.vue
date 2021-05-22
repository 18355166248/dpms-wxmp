<template>
  <div class="selector">
    <div class="teeth-select">
      <TeethSelect class="handle" :value="toothPositionStr" :disabled="true" />
    </div>
    <div class="sets">
      <div @click="setClick(teeth[0][0], teeth[1][0])">上半口-乳</div>
      <div @click="setClick(teeth[2][1], teeth[3][1])">下半口-乳</div>
      <div @click="setClick(teeth[0][1], teeth[1][1])">上半口-恒</div>
      <div @click="setClick(teeth[2][0], teeth[3][0])">下半口-恒</div>
    </div>
    <div class="teeth">
      <div v-for="(quadrant, i) in teeth" :key="i">
        <div
          class="yaWrap"
          :class="[`pos${i}${j}`]"
          v-for="(yas, j) in quadrant"
          :key="j"
        >
          <div
            v-for="ya in yas"
            :key="ya.position"
            :class="{
              active: teethSelected.some((s) => s.position === ya.position),
              nowSelected: activeTeeth === ya.position,
              super: teethSelected.find((s) => s.position === ya.position)
                .hasArea,
            }"
            @click="yaClick(ya)"
          >
            {{ ya.label }}
          </div>
        </div>
      </div>
    </div>
    <div class="area">
      <div class="label">区域</div>
      <div class="group">
        <div
          v-for="a in areas"
          :key="a"
          :class="{ active: activeTeethObj.areaSelected.includes(a) }"
          @click="areaClick(a)"
        >
          {{ a }}
        </div>
      </div>
    </div>
    <fixed-footer :bgColor="primaryColor">
      <div class="bottom">
        <button @click="save">保 存</button>
      </div>
    </fixed-footer>
  </div>
</template>

<script>
import _ from 'lodash'
import fixedFooter from '@/components/fixed-footer/fixed-footer.vue'
import TeethSelect from '@/businessComponents/TeethSelect/TeethSelect.vue'

function genYa(quadrant) {
  //大于4是乳牙
  const [start, num] = (quadrant > 4 && ['A', 5]) || ['1', 8]
  return Array.from({ length: num }, (v, i) => ({
    label: String.fromCharCode(start.charCodeAt() + i),
    position: `${quadrant}${i + 1}`,
    areaSelected: [],
    hasArea: false,
  }))
}
export default {
  components: { fixedFooter, TeethSelect },
  data() {
    return {
      teeth: [
        [genYa(5).reverse(), genYa(1).reverse()],
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
        [genYa(3), genYa(7)],
      ],
      areas: ['B', 'L', 'O', 'M', 'D'],
      teethSelected: [],
      primaryColor: this.$commonCss.commonColor,
      activeTeeth: '',
    }
  },
  computed: {
    activeTeethObj: {
      get() {
        return (
          this.teethSelected.find((v) => v.position === this.activeTeeth) || {
            areaSelected: [],
          }
        )
      },
      set() {},
    },
    toothPositionStr() {
      return this.teethSelected.reduce(
        (r, s) => {
          r.teeth[s.position] = s.areaSelected.reduce(
            (r, _a) => ({ ...r, [_a]: true }),
            {},
          )
          return r
        },
        { teeth: {} },
      )
    },
  },
  methods: {
    areaClick(a) {
      if (!this.activeTeeth) return
      this.activeTeethObj.areaSelected = this.activeTeethObj.areaSelected.includes(
        a,
      )
        ? this.activeTeethObj.areaSelected.filter((_a) => _a !== a)
        : [...this.activeTeethObj.areaSelected, a]
      this.activeTeethObj.hasArea = !!this.activeTeethObj.areaSelected.length
    },
    yaClick(ya) {
      if (ya.position === this.activeTeeth) {
        this.teethSelected = this.teethSelected.filter(
          (s) => s.position !== ya.position,
        )
        this.activeTeeth = ''
        return
      }

      if (!this.teethSelected.some((s) => s.position === ya.position))
        this.teethSelected.push(_.cloneDeep(ya))
      this.activeTeeth = ya.position
    },
    setClick(...yas) {
      let teethSelected = this.teethSelected.map((v) => v.position)
      let sets = _.cloneDeep(yas)
        .flat()
        .filter((s) => !teethSelected.includes(s.position))
      this.teethSelected = [...this.teethSelected, ...sets]
    },
    save() {
      uni.$emit(`teethSelectChange${this.uid}`, this.toothPositionStr)
      this.$utils.back()
    },
    initValue({ teeth }) {
      this.teethSelected = Object.keys(teeth).map((t) => ({
        position: t,
        areaSelected: Object.keys(teeth[t] || {}),
        hasArea: !!Object.keys(teeth[t] || {}).length,
      }))
    },
  },
  onLoad({ value, uid }) {
    this.uid = uid
    this.initValue(JSON.parse(value))
  },
}
</script>

<style lang="scss" scoped>
.teeth-select {
  background-color: #fff;
  margin-bottom: 20rpx;
  padding: 32rpx;
  .handle {
    width: 100%;
  }
}
.selector {
  font-size: 28rpx;
  color: rgba(0, 0, 0, 0.7);
}
.sets {
  height: 112rpx;
  background: #feffff;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  gap: 0 12rpx;
  padding: 0 32rpx;
  > div {
    line-height: 48rpx;
    border: 2rpx solid rgba(0, 0, 0, 0.15);
    border-radius: 4rpx;
    text-align: center;
  }
}
.teeth {
  background: #feffff;
  margin-top: 20rpx;
  padding: 32rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 42rpx 62rpx;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 2rpx;
    background: #5cbb89;
    width: 82rpx;
  }
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2rpx;
    background: #5cbb89;
    height: 82rpx;
  }
  .yaWrap {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8rpx;
    &:last-child {
      margin-top: 20rpx;
    }
    &.pos00 {
      :first-child {
        grid-column-start: 4;
      }
    }
    &.pos10 {
      :nth-child(1) {
        grid-column: 1 /5;
      }
    }
    &.pos21 {
      :nth-child(5) {
        grid-column: 4 /5;
      }
    }
    > div {
      position: relative;
      border: 2rpx solid rgba(0, 0, 0, 0.15);
      border-radius: 4rpx;
      width: 72rpx;
      height: 72rpx;
      box-sizing: border-box;
      text-align: center;
      line-height: 72rpx;
    }
    .active {
      background: #5cbb89;
      border-color: #5cbb89;
      color: #ffffff;
    }
    .nowSelected {
      background: #faad51;
      border-color: #faad51;
      color: #ffffff;
    }
    .super:after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border-top: 30rpx solid rgb(255, 0, 0);
      border-left: 30rpx solid transparent;
    }
  }
}
.area {
  height: 112rpx;
  background: #feffff;
  display: flex;
  align-items: center;
  margin-top: 20rpx;
  padding: 0 32rpx;
  .label {
    color: rgba(0, 0, 0, 0.9);
    font-size: 34rpx;
    margin-right: 16rpx;
  }
  .group {
    display: flex;
    text-align: center;
    line-height: 64rpx;
    > div {
      width: 84rpx;
      height: 64rpx;
      border: 2rpx solid #d9d9d9;
      margin-left: -2rpx;
      &:first-child {
        border-radius: 8rpx 0 0 8rpx;
      }
      &:last-child {
        border-radius: 0 8rpx 8rpx 0;
      }
    }
    .active {
      color: #5cbb89;
      border-color: #5cbb89;
      position: relative;
    }
  }
}
.bottom {
  height: 90rpx;
  button {
    height: 90rpx;
    background: #5cbb89;
    color: #ffffff;
    font-size: 36rpx;
    border-radius: 0;
  }
}
</style>
