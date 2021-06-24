// 微信小程序
const Fly = require('flyio/dist/npm/wx')

const httperStatistic = new Fly()

//设置超时
httperStatistic.config.timeout = 60000

export default httperStatistic
