# 抽屉组件

## API

```vue
<dpmsDrawer maskClose ref="dpmsDrawer" width="320" />
```

### prop

| 方法      | 参数    | 默认值 | 说明                                                             |
| --------- | ------- | ------ | ---------------------------------------------------------------- |
| mask      | Boolean | true   | 是否显示遮罩                                                     |
| maskClose | Boolean | true   | 点击遮罩是否可以关闭抽屉                                         |
| mode      | String  | left   | Drawe 滑出位置，可选值：left（从左侧滑出）， right（从右侧滑出） |
| width     | Number  | 220    | Drawe 宽度，仅 vue 页面设置生效                                  |

### event

事件名 说明 返回值
@change 抽屉状态发生变化触发事件 true：抽屉已经打开；false：抽屉已经关闭；

### ref

通过 ref 获取组件调用方法 open, close
