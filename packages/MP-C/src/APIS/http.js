import qs from 'qs'
import { CC_HTTP_ENUMS } from '@arctic/tools'
import EnvConfig from '../config'
import { omitUndefinedAndNullValue } from '@/utils/utils'
import { getStorage, removeStorage, STORAGE_KEY } from '@/utils/storage'

// 微信小程序
const Fly = require('flyio/dist/npm/wx')

const httper = new Fly()

//设置超时
httper.config.timeout = 60000

//设置请求基地址
httper.config.baseURL = EnvConfig.DPMSServerUrl

//添加请求拦截器
httper.interceptors.request.use((request) => {
  const requestInterceptors = [
    // 连接指定后端人员调试
    (request) => {
      if (EnvConfig.useServerUrlRedirection?.open) {
        const pathname = request.url
          .replace(request.baseURL, '')
          .replace(/^\//, '')
        const rootPath = pathname.split('/')[0]
        const redirecttedBaseURL =
          EnvConfig.useServerUrlRedirection.pathMap[rootPath]

        if (redirecttedBaseURL) {
          request.baseURL = redirecttedBaseURL
          request.url = redirecttedBaseURL + pathname
        }
      }
    },

    // access_token
    (request) => {
      if (!request?.isNoNeedAuth) {
        const staff = getStorage(STORAGE_KEY.STAFF)
        if (staff?.accessToken) {
          request.headers['Authorization'] = `Bearer ${staff?.accessToken}`
        }
      } else {
        delete request.isNoNeedAuth
      }
    },

    // 默认参数
    async (request) => {
      const token = getStorage(STORAGE_KEY.ACCESS_TOKEN)
      const staff = getStorage(STORAGE_KEY.STAFF)

      const medicalInstitution = getStorage(STORAGE_KEY.MEDICALINSTITUTION)
      console.log('staff:', staff)
      console.log('medicalInstitution:', medicalInstitution)
      // 默认参数
      const defaultDatas = {
        // 进入app就获取，记录用户行为
        headerRequest: {
          accessToken: token,
          deviceToken: '123',
          medicalInstitutionId: medicalInstitution?.medicalInstitutionId,
          // 来源 小程序
          scenario: 'miniApp_auth',
          lang: 'zh_CN'
        },
        // ██████ 鉴权 ██████
        // 用户 ID
        _uid: staff?.staffId,

        /**
         * @desc 用户类型
         */
        _ut: CC_HTTP_ENUMS.SYSTEM_PARAMS_ENUMS.USER_TYPE.STAFF.value,

        /**
         * @desc 终端
         */
        _t: CC_HTTP_ENUMS.SYSTEM_PARAMS_ENUMS.TERMINAL_TYPE.PCWeb.value,

        /**
         * @desc 系统
         */
        // _s: CC_HTTP_ENUMS.SYSTEM_PARAMS_ENUMS.TYPE.HIS.value,
        _s: 11,

        // 机构 ID
        _mtId: medicalInstitution?.medicalInstitutionId,
        // ██████ 鉴权 over ██████

        // 租户 ID
        _tenantId: medicalInstitution?.tenantId,

        // 连锁机构总部 Id
        _cmtId: medicalInstitution?.topParentId,

        // 连锁机构类型
        _cmtType: medicalInstitution?.institutionChainType,

        // 请求时间
        _ct: Date.now(),

        /**
         * @desc 网络
         */
        _n: undefined,

        // app 版本
        _v: undefined,

        // 设备号
        _udid: undefined,

        // 操作系统版本
        _sdk: undefined,

        // app 内部版本（热更新）
        _iv: undefined,

        // 设备品牌
        _m: undefined,

        // 签名
        _sign: undefined,

        // 语言
        _lang: 'zh_CN',
      }

      const newBody = { ...defaultDatas, ...(request.body || {}) }

      request.body = omitUndefinedAndNullValue(newBody)

      if (
        request.method === 'POST' ||
        request.method === 'PUT' ||
        request.method === 'DELETE'
      ) {
        //   小程序不支持 formData

        if (
          request.headers['Content-Type'].indexOf('application/json') !== -1
        ) {
          request.headers = {
            'Content-Type': 'application/json; charset=utf-8',
            ...request.headers,
          }
        } else {
          request.headers['Content-Type'] = 'application/x-www-form-urlencoded'

          request.body = qs.stringify(request.body, {
            arrayFormat: 'comma', // a: [1, 2] => a=1,2
            allowDots: true
          })
        }
      } else if (request.method === 'GET') {
        request.body = qs.stringify(request.body, {
          arrayFormat: 'comma', // a: [1, 2] => a=1,2
          allowDots: true
        })
      }
      return request
    },
  ]

  requestInterceptors.forEach((requestInterceptor) =>
    requestInterceptor(request),
  )

  return request
})

httper.interceptors.response.use(
  function (response) {
    //不要使用箭头函数，否则调用this.lock()时，this指向不对
    if (response?.data?.code === 0) {
      return response.data
    }

    uni.showToast({
      icon: 'none',
      title: response?.data?.msg || response?.data?.message || '数据请求失败',
    })

    if (
      response.data.code === CC_HTTP_ENUMS.CODE_STATUS_ENUM.TOKEN_EXPIRED.value
    ) {
      removeStorage(STORAGE_KEY.ACCESS_TOKEN)
      removeStorage(STORAGE_KEY.MEDICALINSTITUTION)
      removeStorage(STORAGE_KEY.STAFF)

      uni.reLaunch({
        url: '/pages/login/login',
      })
    } else {
      return Promise.reject(response.data)
    }
  },
  function (err) {
    uni.showToast({
      icon: 'none',
      title: err?.data?.msg || err?.data?.message || '数据请求失败',
    })

    return Promise.reject(err)
  },
)

export default httper
