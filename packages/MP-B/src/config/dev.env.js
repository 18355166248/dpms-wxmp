const config = {
  env: 'dev',
  debug: {
    http: false,
    websocket: false,
    notVerifyPath: true,
  },

  // 强制设置登录后的权限
  overwriteFrontAuth: {
    open: false,

    isSinglePackage: false,
    isChainPackage: false,

    isSuperAdminRole: false,
    isAdminRole: false,
    isOtherRole: false,

    isInHQ: false,
    isInRegion: false,
    isInDirect: false,
    isInFranchise: false,

    isWorkInOwn: false,
    isWorkInOther: false,
  },
  enableNotReleaseCode: true,
  DPMSServerUrl: 'http://dev-tower.laoganma.fun/api/his/',
  SCRMServerUrl: 'http://dev-tower.laoganma.fun/api/',
  ServerUrl: 'http://dev-tower.laoganma.fun/',
  useServerUrlRedirection: {
    open: false,
    pathMap: {
      institution: 'http://0.0.0.0:7777/',
    },
  },
  iconfontUrl: '//at.alicdn.com/t/font_1965288_h9yn44x7c5t.js',
  microAppUrl: 'http://uat.scrm.laoganma.fun/scrm_vue/',
  scrmUrl: 'http://dev.scrm.laoganma.fun',
  DPMSAntdPrefixCls: 'dpms-ant',
  SCRMAntdPrefixCls: 'SCRM',
}

export default config
