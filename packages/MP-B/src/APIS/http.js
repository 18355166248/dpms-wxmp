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

const newHttper = new Fly()

newHttper.config = httper.config

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

    // token
    (request) => {
      if (!request?.isNoNeedAuth) {
        // const token = getStorage(STORAGE_KEY.ACCESS_TOKEN)
        // if (token) {
        //   request.headers['Authorization'] = `Bearer ${token}`
        // }
      } else {
        delete request.isNoNeedAuth
      }
    },

    // 默认参数
    (request) => {
      const staff = getStorage(STORAGE_KEY.STAFF)
      const token = getStorage(STORAGE_KEY.ACCESS_TOKEN)

      const medicalInstitution = getStorage(STORAGE_KEY.MEDICALINSTITUTION)
      // 默认参数
      const defaultDatas = {
        // ██████ 鉴权 ██████
        _token: token,
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
          //json拼接参数
          request.url += '?'
          Object.keys(omitUndefinedAndNullValue(defaultDatas)).forEach(
            function (key) {
              request.url += `${key}=${defaultDatas[key]}&`
            },
          )
        } else {
          request.headers['Content-Type'] = 'application/x-www-form-urlencoded'

          request.body = qs.stringify(request.body, {
            arrayFormat: 'comma', // a: [1, 2] => a=1,2
          })
        }
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
    console.log(172, response)
    if ([1000373, 1000377, 0].includes(response?.data?.code)) {
      return response.data
    }
    // 这里针对收欠费拦截做特殊处理
    if (![1001157, 1001158, 1001159, 1001160].includes(response?.data?.code)) {
      uni.showToast({
        icon: 'none',
        title: response?.data?.msg || response?.data?.message || '数据请求失败',
      })
    }
    const errCodes = [
      CC_HTTP_ENUMS.CODE_STATUS_ENUM.TOKEN_EXPIRED.value,
      401,
      1001001001,
      1001001002,
      1001001004,
      1001001005,
      1001001006,
      1001001007,
      1001001100,
      1001001101,
      1001001102,
    ]

    if (errCodes.includes(response.data.code)) {
      removeStorage(STORAGE_KEY.ACCESS_TOKEN)
      removeStorage(STORAGE_KEY.LOGIN_TYPE)
      removeStorage(STORAGE_KEY.MEDICALINSTITUTION)
      removeStorage(STORAGE_KEY.STAFF)

      const systemInfo = uni.getSystemInfoSync()
      if (systemInfo?.environment === 'wxwork') {
        uni.redirectTo({
          url: '/pages/login/qyLogin',
        })
      } else {
        uni.reLaunch({
          url: '/pages/login/login',
        })
      }
    } else {
      return Promise.reject(response.data)
    }
  },
  function (err) {
    uni.showToast({
      icon: 'none',
      title: err?.data?.msg || err?.data?.message || '数据请求失败',
      complete: () => {
        if (err.status === 401) {
          // 未登录
          uni.redirectTo({
            url: '/pages/login/login',
          })
        }
      },
    })
    return Promise.reject(err)
  },
)

export default httper
