import { doPay, getPaymentOrder } from '../../../services/API'

const app = getApp();
Page({
  data: {
    orderSn: '',
    money: '',
    type: ''
  },
  onLoad(options) {
    const type = options.type;
    const orderSn = options.orderSn;
    if (type) {
      const money = options.money;
      this.setData({
        orderSn,
        money,
        type
      })
    } else {
      getPaymentOrder({ order_sn: orderSn }).then(({status, result, msg}) => {
        if(status == 1) {
          this.setData({
            orderSn: result.order_sn,
            money: result.order_amount
          })
        }
      })
    }
  },
  submit() {
    doPay({
      order_sn: this.data.orderSn,
      account: this.data.money,
      trade_type: 'JSAPI'
    })
      .then(({ status, result, msg }) => {
        if (status === 1) {
          return app.wxAPI.requestPayment({
            timeStamp: String(result.timeStamp),
            nonceStr: result.nonceStr,
            package: result.package,
            signType: result.signType,
            paySign: result.sign
          })
        } else {
          app.wxAPI.alert(msg)
        }
      })
      .then(({ status, msg }) => {
        if (status === 1) {
          app.wxAPI.toast('支付完成')
          setTimeout(() => {
            if(this.data.type) {
              wx.switchTab({
                url: '/pages/TEAM/fight/fight'
              })
            } else {
              wx.switchTab({
                url: '/pages/HOME/home/home'
              })
            }
          }, 2000)
        } else {
          app.wxAPI.toast('取消支付', 'error')
        }
      })
      .catch(e => {
        app.wxAPI.alert(e)
      })
  }
})