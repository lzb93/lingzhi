const App = getApp()
Page({
  data: {
    userInfo: {}
  },
  onLoad() {
    this.setData({
      userInfo: App.userInfo
    })
  }
})