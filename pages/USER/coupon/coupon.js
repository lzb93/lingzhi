import { getOrderList, cancelOrder1, cancelOrder2, orderConfirm, delOrder } from '../../../services/API.js'
import { dalay } from '../../../utils/utils'
const App = getApp()
Page({
  data: {
    host: App.host,
    contents: [
      {
        text: '未使用',
        type: '',
      },
      {
        text: '已使用',
        type: 'WAITPAY',
      },
      {
        text: '已过期',
        type: 'WAITSEND',
      },

    ],
    items: [],
    active: '',
    // params
    type: '',
    p: 1,
  },
  onLoad(e) {
    wx.setNavigationBarTitle({
      title: "优惠券"
    })
    const type = e.target || ''
    this.setData({ active: type })

    // this.reset()
    // if (type){
    //   this.tabNavbar(type)
    // } else{
    //   this.setData({ active: type })
    //   this.getOrderList({
    //     user_id: this.data.user_id,
    //     type: '',
    //     p: this.data.p,
    //   })
    // }

  },
  onShow() {
    const type = this.data.active || ''
    if (type) {
      this.tabNavbar(type)
    } else {
      this.setData({ active: type })
      // this.getOrderList({
      //   user_id: this.data.user_id,
      //   type: '',
      //   p: this.data.p,
      // })
    }
  },
  tabNavbar(e) {
    let type = ''
    if (typeof e === 'string') {
      type = e
    } else {
      type = e.currentTarget.dataset.type
    }
    this.setData({ active: type })
    // this.getOrderList({
    //   user_id: this.data.user_id,
    //   type: type,
    //   p: this.data.p,
    // })
  }

})
