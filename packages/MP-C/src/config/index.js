import devConfig from './dev.env'
import dev01Config from './dev01.env'
import prodConfig from './prod.env'
import stagingConfig from './staging.env'
import uatConfig from './uat.env'
import uat01Config from './uat01.env'

// BASE_URL: "/"
// NODE_ENV: "development"
// VUE_APP_PLATFORM: "mp-weixin"
// console.log('process.env:', process.env)

const config = {
  development: devConfig,
  dev01: dev01Config,
  prod: prodConfig,
  uat: uatConfig,
  uat01: uat01Config,
  staging: stagingConfig,
}

export default config?.[process.env?.NODE_ENV]
