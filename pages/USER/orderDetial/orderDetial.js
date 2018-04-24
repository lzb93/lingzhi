import { orderDetail, cancelOrder1, cancelOrder2, orderConfirm, delOrder } from '../../../services/API.js'
import { format } from '../../../utils/utils'
const App = getApp()
Page({
  data: {
    host: App.host,
    result: {}
  },
  onLoad(e) {
    wx.setNavigationBarTitle({title: '订单详情'})
    const order_id = e.order_id
    orderDetail({
      id: order_id
    })
    .then(({status, result, msg}) => {
      if (status === 1) {
        // 过滤数据
        result.add_time = format(result.add_time*1000, 'yyyy-MM-dd hh:mm:ss')
        this.setData({
          result: result
        })
      } else {
        App.wxAPI.alert(msg)
      }
    })
  },
  cancelOrder(e) {
    const order_id = this.data.result.order_id
    const order_status_code = this.data.result.order_status_code
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
        App.wxAPI.toast(order_status_code === 'WAITPAY' ? '订单已取消': '提交成功，处理中...')
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      } else {
        App.wxAPI.alert(msg)
        return Promise.reject(msg)
      }
    })
    .catch(e => {
      console.log(e)
    })
  },
  confirm() {
    const order_id = this.data.result.order_id
    App.wxAPI.confirm('确定收货吗？')
    .then(() => {
      return orderConfirm({ order_id: order_id})
    })
    .then(({status, result, msg}) => {
      if (status === 1) {
        // 输入支付密码
        App.wxAPI.toast("确认收货成功")
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      } else {
        App.wxAPI.alert(msg)
      }
    })
  },
  call() {
    wx.makePhoneCall({ phoneNumber: '10000' })
  },
  delOrder(e) {
    // App.wxAPI.alert("无删除订单接口")
    const order_id = e.currentTarget.dataset.order_id
    App.wxAPI.confirm('确定删除此订单？')
    .then(() => {
      return delOrder({ order_id })
    })
    .then(({ status, result, msg }) => {
      if (status === 1) {
        this.onShow()
        App.wxAPI.toast("删除成功")
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      } else {
        App.wxAPI.alert(msg)
      }
    })
  },
  copy(e) {
    const order_sn = e.currentTarget.dataset.order_sn
    wx.setClipboardData({
      data: order_sn,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            App.wxAPI.toast('已复制')
          }
        })
      }
    })
  }
})