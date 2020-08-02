const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('APIS', resolve('src/APIS'))
      .set('views', resolve('src/views'))
      .set('common', resolve('src/common'))
      .set('businessComponents', resolve('src/businessComponents'))
  },
}
