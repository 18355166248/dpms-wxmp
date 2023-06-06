# DPMS 小程序

## 初始化苹果 x 以上设备型号样式

### 初始化

在 packages/MP-B/src/store/modules/systemStore.js 初始化值
isPhoneXCeil 为 true 表示苹果 x 以上手机

初始化方法在 packages/MP-common/utils/os.js
在 packages/MP-B/src/App.vue 的 onLaunch 生命周期中进行初始化

### 设置样式

把公共处理的样式全部写在 packages/MP-B/src/common/css/screen.scss 下

### 使用

```js
import { mapState } from 'vuex'

computed: {
  ...mapState('systemStore', ['isPhoneXCeil']),
},
```
