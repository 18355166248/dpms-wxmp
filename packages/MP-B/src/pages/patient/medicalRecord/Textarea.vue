<template>
  <div>
    <textarea
      class="textarea" v-model="value"
      placeholder-style="color: rgba(0,0,0,0.3);"
      :placeholder="`请输入${title}`"
    />
    <div class="bottom">
      <button @click="save">保 存</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: '', title: '', key: ''
    }
  },
  methods: {
    save() {
      uni.$emit('medicalRecordTextareaChange', {
        value: this.value,
        key: this.key
      })
      this.$utils.back()
    }
  },
  onLoad({title, value, key}) {
    this.title = title
    this.key = key
    uni.setNavigationBarTitle({
      title
    });
    this.value = value || ''
  }
}
</script>

<style lang="scss" scoped>
.textarea{
  box-sizing: border-box;
  width: 100%;
  min-height: 480rpx;
  background: #ffffff;
  padding: 28rpx 32rpx;
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