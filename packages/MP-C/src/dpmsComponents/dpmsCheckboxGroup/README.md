# checkboxGroup

## props

| 参数     | 说明           | 类型    | 可选值 | 默认值 |
| -------- | -------------- | ------- | ------ | ------ |
| v-model  | 选中项的       | label   | array  | - -    |
| disabled | 是否禁用       | boolean | -      | false  |
| max      | 最多选中的个数 | number  | -      | -      |

## events

change 选中状态发生变更 更新后选中值的 label 组

## methods

| 方法名        | 说明                                         | 参数 |
| ------------- | -------------------------------------------- | ---- |
| selectAll     | 全选，注意主动调用该方法不会触发 change 事件 | -    |
| selectReverse | 反选，注意主动调用该方法不会触发 change 事件 | -    |
| clearAll      | 清空，注意主动调用该方法不会触发 change 事件 | -    |
