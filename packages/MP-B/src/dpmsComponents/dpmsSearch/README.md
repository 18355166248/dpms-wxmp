# dpmsSearch 搜索

## API

```vue
<dpmsSearch
  showCancel
  @cancel="cancel"
  @change="change"
  @search="search"
></dpmsSearch>
```

### prop

| 方法        | 参数    | 说明                 | 默认值           |
| ----------- | ------- | -------------------- | ---------------- |
| value       | string  | 输入框的值           | null             |
| placeholder | string  |                      | 请输入搜索关键词 |
| showCancel  | boolean | 是否展示右侧取消按钮 | false            |
| cancelText  | string  | 右侧取消按钮的文本   | 取消             |

### event

| 方法   | 参数     | 说明               |
| ------ | -------- | ------------------ |
| cancel | function | 取消搜索搜索时触发 |
| change | function | 输入内容变化时触发 |
| search | function | 确定搜索时触发     |
| clear  | function | 点击清空控件时触发 |
| focus  | function | 输入框聚焦时触发   |
| blur   | function | 输入框失焦时触发   |
