import { getOrderList, cancelOrder1, cancelOrder2, orderConfirm, delOrder }from '../../../services/API.js'
import { dalay } from '../../../utils/utils'
const App = getApp()
Page({
  data: {
    host: App.host,
    contents: [
      {
        text: '全部',
        type: '',
      },
      {
        text: '待付款',
        type: 'WAITPAY',
      },
      {
        text: '待发货',
        type: 'WAITSEND',
      },
      {
        text: '待收货',
        type: 'WAITRECEIVE'
      },
      {
        text: '已完成',
        type: 'COMMENTED',
      },
      // {
      //   text: '退款售后',
      //   type: '',
      // }
    ],
    items: [],
    active: '',
    // params
    user_id: App.userInfo.user_id,
    type: '',
    p: 1,
  },
  onLoad(e) {
    wx.setNavigationBarTitle({
      title: "订单管理"
    })
    const type = e.target || ''
    this.setData({active: type})
    
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
    this.reset()
    if (type){
      this.tabNavbar(type)
    } else{
      this.setData({ active: type })
      this.getOrderList({
        user_id: this.data.user_id,
        type: '',
        p: this.data.p,
      })
    }
  },
  getOrderList(params) {
    if (!this.data.isAgain) return
    this.setData({ isAgain: false })
    getOrderList(params)
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
    this.getOrderList({
      user_id: this.data.user_id,
      type: this.data.active,
      p: this.data.p,
    })
  },
  tabNavbar(e) {
    let type = ''
    if (typeof e === 'string') {
      type = e
    } else {
      type = e.currentTarget.dataset.type
    }
    this.reset()
    this.setData({ active: type })
    this.getOrderList({
      user_id: this.data.user_id,
      type: type,
      p: this.data.p,
    })
  },
  reset() {
    this.setData({
      items: [],
      user_id: App.userInfo.user_id,
      type: '',
      p: 1,
      isAgain: true,
      isNomore: false
    })
  },
  cancelOrder(e) {
    const order_id = e.currentTarget.dataset.order_id
    const order_status_code = e.currentTarget.dataset.order_status_code
    App.wxAPI.confirm(order_status_code === 'WAITPAY' ? '确定取消此订单？': '此订单已支付，确定撤销此订单？')
    .then(() => {
      if (order_status_code === 'WAITPAY') {
        return cancelOrder1({ order_id: order_id })
      } else {
        return cancelOrder2({ order_id: order_id })
      }
    })
    .then(({ status, result, msg }) => {
      if (status === 1) {
        App.wxAPI.toast(msg)
        this.reset()
        const type = this.data.active
        // this.tabNavbar(type)
        this.getOrderList({
          user_id: this.data.user_id,
          type: type,
          p: 1
        })
      } else {
        App.wxAPI.alert(msg)
        return Promise.reject(msg)
      }
    })
    .catch(e => {
      console.log(e)
    })
  },
  delOrder(e) {
    // App.wxAPI.alert("无删除订单接口")
    const order_id = e.currentTarget.dataset.order_id
    App.wxAPI.confirm('确定删除此订单？')
    .then(() => {
      return delOrder({ order_id, user_id: this.data.user_id })
    })
    .then(({ status, result, msg }) => {
      if (status === 1) {
        this.onShow()
        App.wxAPI.toast("删除成功")
      } else {
        App.wxAPI.alert(msg)
      }
    })

  },
  call() {
    wx.makePhoneCall({ phoneNumber: '10000' })
  },
  confirm(e) {
    const order_id = e.currentTarget.dataset.order_id
    App.wxAPI.confirm('确定收货吗？')
    .then(() => {
      return orderConfirm({ order_id })
    })
    .then(({status, result, msg}) => {
      if (status === 1) {
        // 输入支付密码
        this.onShow()
        App.wxAPI.toast("确认收货成功")
      } else {
        App.wxAPI.alert(msg)
      }
    })
  },
  pinJia(e) {
    const order_id = e.currentTarget.dataset.order_id
    wx.navigateTo({
      url: "../opinion/opinion?order_id=" + order_id
    });
  },

})
