import * as wxAPI from './wxAPI'
import { thirdLogin } from './API'

// 获取用户信息（一系列流程）
export function getUserInfo(cb) {
  wxAPI.getSetting()
    .then((res) => {
      if (res.indexOf('scope.userInfo') !== -1) return
      return wxAPI.authorize('scope.userInfo').catch((e) => Promise.reject({ errMsg: '本次拒绝授权获取用户信息' }))
    })
    .then(() => {
      return wxAPI.getUserInfo().catch((e) => Promise.reject({ errMsg: '用户已经拒绝授权获取用户信息' }))
    })
    .then((res) => {
      const userInfo = res.userInfo
      Object.assign(getApp().userInfo, userInfo)
      auth(userInfo)
      cb && cb(userInfo)
    })
    .catch((e) => {
      // 跳转设置 开启授权
      wxAPI.confirm('请先授权登录哦')
        .then(wxAPI.openSetting)
        .then((res) => {
          if (res.authSetting["scope.userInfo"]) {
            getUserInfo(cb)
            wxAPI.toast('授权成功')
          } else {
            wxAPI.alert('授权失败')
          }
        })
        .catch(() => {
          wx.switchTab({ url: '/pages/HOME/home/home' })
        })
    })
}

// 获取token等用户信息（一系列流程）
export function auth(userInfo) {
  wxAPI.showLoading('加载中...', true)
  wxAPI.checkSession()
    .then((isLogin) => {
      return wxAPI.login()
    })
    .then((res) => {
      return thirdLogin({ 
        code: res.code, 
        from: 'miniapp', 
        nickname: userInfo.nickName, 
        head_pic: userInfo.avatarUrl, 
        first_leader: getApp().userInfo.firstLeader || ''
      })
    })
    .then(({ status, result, msg }) => {
      wxAPI.hideLoading()
      if (status === 1) {
        Object.assign(getApp().userInfo, result)
        // getApp().token = result.token
        getApp().token = result.token
      } else {
        getApp().wxAPI.alert(msg)
      }
    })
    .catch((e) => {
      wxAPI.hideLoading()
    })
}