const config = {
  env: 'staging',
  debug: {
    http: false,
    websocket: false,
    notVerifyPath: false,
  },
  enableNotReleaseCode: false,
  DPMSServerUrl: 'https://pre-power.medcloud.cn/api/his/',
  SCRMServerUrl: 'https://pre-power.medcloud.cn/api/',
  iconfontUrl: '//at.alicdn.com/t/font_1965288_h9yn44x7c5t.js',
  microAppUrl: 'http://uat.scrm.laoganma.fun/scrm_vue/',
  scrmUrl: 'http://pre.scrm.medcloud.cn',
  DPMSAntdPrefixCls: 'dpms-ant',
  SCRMAntdPrefixCls: 'SCRM',
}

export default config
