<template>
  <div class="imagePreview">
    <image mode="aspectFit" src="../../static/empty.png" />
    <dpmsCell title="牙位">
      <TeethSelect class="handle" v-model="toothPosition" disabled />
    </dpmsCell>
    <dpmsCell title="备注">
      <textarea class="textarea" v-model="data.remark" />
    </dpmsCell>
  </div>
</template>

<script>
import TeethSelect from '@/businessComponents/TeethSelect/TeethSelect.vue'
export default {
  components: { TeethSelect },
  data() {
    return {
      data: {
        remark: '',
      },
      toothPosition: '',
      patientId: '',
    }
  },
  methods: {
    submit() {},
  },
  onLoad({ patientId }) {
    this.patientId = patientId
  },
}
</script>

<style lang="scss" scoped>
.imagePreview {
  background-color: black;
  height: 100vh;
}
</style>
