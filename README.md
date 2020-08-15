# dpms-wxmp

使用了 [Lerna](https://lerna.js.org) 作为子项目的管理工具。本项目的开发使用了很多 Lerna 提供的命令，所以应该对 Lerna 有基本的了解。

## 初始化项目

拉取代码后需要对项目依赖进行初始化，**不要**使用 `yarn` 命令初始化。应该使用 Lerna 命令。

```shell script
lerna bootstrap
```

## 公共方法

调用就是当前 vue 页面使用 this.\$utils.show 进行调用

| 方法              | 参数               | 说明                                                        |
| ----------------- | ------------------ | ----------------------------------------------------------- |
| show              | title, config      | 显示提示框                                                  |
| clear 1           |                    | 隐藏提示框                                                  |
| showLoading       | 字符串或者对象选项 | 显示 loading                                                |
| clearLoading      |                    | 隐藏 loading                                                |
| flyUtil.push      | { url }            | 保留当前页面，跳转到应用内某页面                            |
| flyUtil.replace   | { url }            | 关闭当前页面，跳转到应用内某页面                            |
| flyUtil.back      | delta = 1          | 关闭当前页面，返回上一页面或多级页面                        |
| flyUtil.reLaunch  | { url }            | 关闭所有页面并调跳到某页面                                  |
| flyUtil.switchtab | { url }            | 跳转到其他 tabbar 页面，并且关闭所有非 tabbar 页面          |
| getPagesInfo      | index (number)     | 获取页面数据, 默认获取当前页 需要上一页数据传入-1, 以此类推 |
| showNavBarLoading |                    | 显示导航栏 loading                                          |
| hideNavBarLoading |                    | 隐藏导航栏 loading                                          |
| hideHomeButton    |                    | 隐藏返回首页按钮                                            |
| showPageLoading   |                    | 显示 loading 和导航栏 loading                               |
| hidePageLoading   |                    | 隐藏 loading 和导航栏 loading                               |
