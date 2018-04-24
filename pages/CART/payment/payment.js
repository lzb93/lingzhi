import { doPay, getPaymentOrder } from '../../../services/API'
const App = getApp()
Page({
  data: {
    result: {},
    payInfo: {}
  },
  onLoad(e) {
    wx.setNavigationBarTitle({ title: '商品订单'})
    const orderId = e.orderId
    getPaymentOrder({ order_id: orderId })
    .then(({ status, result, msg }) => {
      if (status === 1) {
        this.setData({ result })
      } else {
        App.wxAPI.alert(msg)
      }
    })
    .catch(e => {
      console.log(e)
    })
  },
  submit() {
    doPay({ 
      order_sn: this.data.result.order_sn,
      account: this.data.result.order_amount,
      trade_type: 'JSAPI'
    })
    .then(({ status, result, msg }) => {
      if (status === 1) {
        return App.wxAPI.requestPayment({
          timeStamp: String(result.timeStamp),
          nonceStr: result.nonceStr,
          package: result.package,
          signType: result.signType,
          paySign: result.sign
        })
      } else {
        App.wxAPI.alert(msg)
      }
    })
    .then(({ status, msg}) => {
      if(status === 1) {
        App.wxAPI.toast('支付完成')
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/HOME/home/home'
          })
        }, 2000)
      } else {
        App.wxAPI.toast('取消支付', 'error')
      }
    })
    .catch(e => {
      App.wxAPI.alert(e)
    })
  }
  
})