import { getWithdrawalsList } from '../../../services/API'
import { format } from '../../../utils/utils'

const App = getApp()

const statusList = {
  '-1': '2删除作废',
  '0': '申请中',
  '1': '审核通过',
  '2': '提现成功',
  '3': '付款失败',
}
Page({
  data: {
    items: []
  },
  onLoad(e) {
    wx.setNavigationBarTitle({
      title: "提现记录"
    })
    getWithdrawalsList()
    .then(({ status, result, msg }) => {
      if (status === 1) {
        result.forEach(item => {
          item.status = statusList[item.status]
          item.create_time = format(item.create_time*1000, 'yyyy-MM-dd')
        })
        this.setData({
          items: result
        })
      } else {
        App.wxAPI.alert(msg)
      }
    })
    .catch(e => {
      App.wxAPI.alert(msg)
    })
    
  },


})
