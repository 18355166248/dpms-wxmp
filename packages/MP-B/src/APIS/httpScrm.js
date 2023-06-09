import qs from 'qs'
import { CC_HTTP_ENUMS } from '@arctic/tools'
import EnvConfig from '../config'
import { omitUndefinedAndNullValue } from '@/utils/utils'
import { getStorage, removeStorage, STORAGE_KEY } from '@/utils/storage'

// 微信小程序
const Fly = require('flyio/dist/npm/wx')

const scrmHttper = new Fly()

//设置超时
scrmHttper.config.timeout = 60000

//设置请求基地址
scrmHttper.config.baseURL = EnvConfig.SCRMServerUrl

const newHttper = new Fly()

newHttper.config = scrmHttper.config

//添加请求拦截器
scrmHttper.interceptors.request.use((request) => {
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
        const token = getStorage(STORAGE_KEY.ACCESS_TOKEN)
        if (token) {
          request.headers['Authorization'] = `Bearer ${token}`
        }
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

        //token
        _token: token,
      }

      const newBody = { ...defaultDatas, ...(request.body || {}) }

      //过滤为空的属性
      function filterParams(obj) {
        let _newPar = {}
        for (let key in obj) {
          //如果对象属性的值不为空，就保存该属性（这里我做了限制，如果属性的值为0，保存该属性。如果属性的值全部是空格，属于为空。）
          if (
            ((obj[key] === 0 || obj[key]) &&
              obj[key].toString().replace(/(^\s*)|(\s*$)/g, '') !== '') ||
            Object.prototype.toString.call(obj[key]) === '[object Array]'
          ) {
            //记录属性
            _newPar[key] = obj[key]
          }
        }
        //返回对象
        return _newPar
      }

      request.body = omitUndefinedAndNullValue(filterParams(newBody))

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

scrmHttper.interceptors.response.use(
  function (response) {
    console.log('response:', response)

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
      removeStorage(STORAGE_KEY.LOGIN_TYPE)
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

export default scrmHttper
