import { returnGoodsList } from '../../../services/API.js'
import { dalay } from '../../../utils/utils'
const App = getApp()
Page({
  data: {
    host: App.host,
    items: [],
    user_id: App.userInfo.user_id,
    // type: '',
    p: 1,
  },
  onLoad(e) {
    wx.setNavigationBarTitle({
      title: "售后列表"
    })
    // const type = e.target || ''
  },
  onShow() {
    // const type = this.data.active || ''
    this.reset()
    this.returnGoodsList({
      p: this.data.p,
    })
  },
  returnGoodsList(params) {
    if (!this.data.isAgain) return
    this.setData({ isAgain: false })
    returnGoodsList(params)
    .then(({ status, result, msg }) => {
      if (status === 1) {
        let items = this.data.items
        this.setData({
          items: items.concat(result),
          p: ++this.data.p,
          isAgain: true
        })
        if (result.length < 10) {
          this.setData({
            isAgain: false,
            isNomore: true
          })
        }
      } else {
        App.wxAPI.alert(msg)
      }
    })
  },
  onReachBottom() {
    if (!dalay(500)) return
    this.returnGoodsList({
      user_id: this.data.user_id,
      p: this.data.p,
    })
  },
  reset() {
    this.setData({
      items: [],
      user_id: App.userInfo.user_id,
      p: 1,
      isAgain: true,
      isNomore: false
    })
  },

  call() {
    wx.makePhoneCall({ phoneNumber: '10000' })
  },

})
