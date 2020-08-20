import devConfig from './dev.env'
import prodConfig from './prod.env'
import stagingConfig from './staging.env'
import uatConfig from './uat.env'

// BASE_URL: "/"
// NODE_ENV: "development"
// VUE_APP_PLATFORM: "mp-weixin"
// console.log('process.env:', process.env)

const config = {
  development: devConfig,
  prod: prodConfig,
  uat: uatConfig,
  staging: stagingConfig,
}

export default config?.[process.env?.NODE_ENV]
