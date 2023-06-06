<template>
  <web-view :src="webUrl"></web-view>
</template>
<script>
import EnvConfig from '@/config'
export default {
  data() {
    return {
      webUrl: EnvConfig.ServerUrl + 'h5/operationTips',
    }
  },
}
</script>
