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
  useServerUrlRedirection: {
    open: false,
    pathMap: {
      'institution-customer': 'http://10.101.11.93:8449/',
    },
  },
  iconfontUrl: '//at.alicdn.com/t/font_1575084_5snnlrkarpw.js',
  microAppUrl: 'http://uat.scrm.laoganma.fun/scrm_vue/',
  scrmUrl: 'http://dev.scrm.laoganma.fun',
  DPMSAntdPrefixCls: 'dpms-ant',
  SCRMAntdPrefixCls: 'SCRM',
  appId: 'wxdc573e390f80f5c0',
}

export default config
