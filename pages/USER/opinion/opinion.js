import { uploadHeadpic } from '../../../services/API.js'
import { uploadFileQueue } from '../../../utils/request'

const App = getApp()
Page({
  data: {
    host: App.host,
    array: ['美国', '中国', '巴西', '日本'],
    index: 0,
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: "我要吐槽"
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  chooseImage() {
    App.wxAPI.chooseImage()
    .then(({ tempFiles }) => {
      console.log(tempFiles)
      return uploadFileQueue(App.host + '?m=api&c=User&a=upload_headpic', tempFiles)
    })
    .then(res => {
      console.log(res)
    })
    .catch(e => {
      console.log(e)
    })
  }
})

