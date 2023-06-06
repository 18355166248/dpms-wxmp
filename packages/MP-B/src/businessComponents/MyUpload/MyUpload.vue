<template>
  <div class="upload">
    <div class="thumbnail" v-for="f in files" :key="f.path">
      <image :src="f.path" @click="preview(files, f.path)"/>
      <div class="close" @click="del(f)">X</div>
    </div>
    <button @click="choose" class="add">
      <image src="/static/icon-upload.png"/>
    </button>
  </div>
</template>

<script>
import systemAPI from '@/APIS/system.api'
export default {
  props: {
    value: Array,
    format: {
      type: Function,
      default() {
        return v => v
      }
    },
  },
  data() {
    return {
      files: [], fileUrls: [],
    }
  },
  methods: {
    choose() {
      uni.chooseImage({
        count: 6, sourceType: ['album', 'camera'],
        success: async ({tempFiles}) => {
          const targetFiles = tempFiles
          this.files = [...this.files, ...targetFiles]
          await Promise.all(targetFiles.map(async f => {
            const ossParam = await this.getOssParam()
            await this.uploadOss(ossParam, f)
          }))
          this.$emit('input', this.format(this.fileUrls))
        }
      })
    },
    async getOssParam() {
      const res = await systemAPI.getOssParam()
      if (res.code !== 0) return Promise.reject()
      return {
        ...res.data,
        'key': `${res.data.directory}${String(Math.random()).slice(2).padEnd(18, String(Math.random()).slice(2))}.jpg`,
      };
    },
    async uploadOss({key, policy, accessKeyId, signature, host}, file) {
      await uni.uploadFile({
        url: host, file, filePath: file.path, name: 'file', formData: {
          key, policy, OSSAccessKeyId: accessKeyId, success_action_status: 200,
          signature
        },
      })
      const url = `${host}/${key}`
      this.fileUrls.push(url)
      this.files.find(f => f.path === file.path).url = url
    },
    del(f) {
      this.fileUrls = this.fileUrls.filter(u => u !== f.url)
      this.files = this.files.filter(file => file.url !== f.url)
      this.$emit('input', this.format(this.fileUrls))
    },
    preview(imgs, current) {
      uni.previewImage({
        current,
        urls: imgs.map(img => img.path)
      })
    }
  },
  // watch: {
  //   value(newVal, oldVal) {
  //     if (newVal === oldVal) return
  //     this.fileUrls = newVal
  //     this.files = newVal.map(v => ({path: v, url: v}))
  //   }
  // }
}
</script>

<style lang="scss" scoped>
.upload{
  display: grid;
  grid-template-columns: repeat(4, 160rpx);
  gap: 16rpx;
}
.add{
  width: 160rpx;
  height: 160rpx;
  background: rgba(0,0,0,0.04);
  border-radius: 4rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  image{
    width:80rpx;
    height:80rpx;
  }
}
.thumbnail{
  width: 160rpx;
  height: 160rpx;
  position: relative;
  image{
    width: 100%;
    height: 100%;
    border-radius: 4rpx;
  }
  .close{
    width: 36rpx;
    height: 36rpx;
    background: rgba(0,0,0,0.5);
    border-radius: 50%;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 22rpx;
    position: absolute;
    top: 0;
    right: 0;
    margin: -10rpx -10rpx 0 0;
  }
}
</style>