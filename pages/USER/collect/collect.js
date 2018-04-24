const App = getApp()
import { getGoodsCollect, collectGoods } from '../../../services/API.js'
import { dalay } from '../../../utils/utils'
Page({
  data: {
    host: App.host,
    items: [],
    p: 1,
    isAgain: true,
    isNomore: false, 
    isNoSearch: false, 
  },
  onLoad() {
    wx.setNavigationBarTitle({title: '我的收藏'})
    this.getGoodsCollect({ p: 1 })
  },
  getGoodsCollect(params) {
    getGoodsCollect(params)
    .then(({status, result, msg}) => {
      if (status === 1) {
        if (this.data.p == 1 && result.length == 0) {
          return this.setData({ 
            isNoSearch: true,
            isNomore: true
          })
        }
        let arr = this.data.items.concat(result)
        this.setData({
          items: arr,
          p: ++this.data.p,
          isAgain: true
        })
        if (result.length < 10) {
          this.setData({ isAgain: false, isNomore: true })
        }
      } else {
        App.wxAPI.alert(msg)
      }
    })
  },
  onReachBottom() {
    if (!dalay(500)) return
    if (!this.data.isAgain) return
    this.setData({ isAgain: false })
    this.getGoodsCollect({ p: this.data.p })
  },
  collect(e) {
    const index = e.currentTarget.dataset.index
    let items = this.data.items
    const type = items[index].is_on_sale ? 0 : 1
    const goods_id = items[index].goods_id
    collectGoods({
      goods_id: goods_id,
      type: type,
      user_id: App.userInfo.user_id
    })
    .then(({status, result, msg}) => {
      if (status === 1) {
        items[index].is_on_sale = type
        this.setData({ items })

      } 
    })
  }

})