// pages/USER/pinglun/pinglun.js
import { orderDetail, cancelOrder1, cancelOrder2, orderConfirm, delOrder } from '../../../services/API.js'
import { format } from '../../../utils/utils'
import { uploadFileQueue } from '../../../utils/request'
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.order_id)
  
  },
  chooseImage() {
    App.wxAPI.chooseImage()
      .then(({ tempFiles }) => {
        return uploadFileQueue(App.host + '?m=Api&c=User&a=add_comment', tempFiles)
      })
      .then(res => {
        console.log(res)
      })
      .catch(e => {
        console.log(e)
      })
  }


})