import { CCEnumUtil } from '@arctic/tools'

const dataDictUtil = {
  convert(dict) {
    return CCEnumUtil.create(dict)
  },
}

export { dataDictUtil }
