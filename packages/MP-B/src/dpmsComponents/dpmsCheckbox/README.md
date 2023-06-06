# checkbox

## apis

| 方法          | 参数                                                             | 说明          | 默认值             |
| ------------- | ---------------------------------------------------------------- | ------------- | ------------------ |
| v-model       | 是否选中                                                         | boolean       | false              |
| shape         | 在非自定 icon 模式下图标的形状                                   | string        | round/square round |
| label         | 选中状态的值，只在 group 模式下有效                              | string,number | --                 |
| disabled      | 是否禁用                                                         | boolean       | -false             |
| primary-color | 主题色                                                           | string        | #108ee9            |
| icon          | 自定义图标，使用 uni-icons 的图标                                | string        | -                  |
| icon-size     | 图标的大小                                                       | number        | 16                 |
| title-style   | 复选框文本样式                                                   | object        | -                  |
| prevent-click | 阻止内部的点击事件，只在自定义样式由外部触发 toggle 事件时设置为 | boolean       | false              |

## events

change 选中状态发生变更 更新后的选中状态

## methods

toggle 切换复选框的选中状态，一般配合 prevent-click 属性使用来自定义样式 -

## slot

icon evan-checkbox 自定义 icon，如果是用的图片等显示不居中，将图片的 display 设为 block
