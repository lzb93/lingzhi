import { getCouponList} from '../../../services/API.js'
import { format } from '../../../utils/utils'
const App = getApp()
Page({
  data: {
    host: App.host,
    coupons:[],
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
    isAgain: true,
    isNomore: false,
    isNoSearch: false
  },
  onLoad(e) {
    wx.setNavigationBarTitle({
      title: "优惠券"
    })
    const type = e.target || ''
    this.setData({ active: type })


    // 返回优惠券列表
    return getCouponList({ type: 0 })
      .then(({ status, result, msg }) => {

        if (status === 1) {
          result.forEach(item => {

            item.use_start_time = format(item.use_start_time * 1000, 'yyyy.MM.dd');
            item.use_end_time = format(item.use_end_time * 1000, 'yyyy.MM.dd');
          })
          if (result.length < 1) {
            this.setData({
              isNoSearch: true,
            })
            return

          }
          
          this.setData({
            iscouPon: true,
            coupons: result,
            isNomore: true
          })
        } else {
          App.wxAPI.alert(msg)
        }
      })
      .catch(e => {
        App.wxAPI.alert(e)
        // App.wxAPI.toast("暂时没有优惠券！")
      })

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
    this.setData({ active: type, isNoSearch: false })

    return getCouponList({ type: e.currentTarget.dataset.index })
      .then(({ status, result, msg }) => {

        if (status === 1) {
          result.forEach(item => {

            item.use_start_time = format(item.use_start_time * 1000, 'yyyy.MM.dd');
            item.use_end_time = format(item.use_end_time * 1000, 'yyyy.MM.dd');
          })

          if (result.length < 1) {
            this.setData({
              isNoSearch: true,
              iscouPon: true,
              coupons: result,
            })
            return

          }

          this.setData({
            iscouPon: true,
            coupons: result,
            isNomore: true
          })
        } else {
          App.wxAPI.alert(msg)
        }
      })
      .catch(e => {
        App.wxAPI.alert(e)
        // App.wxAPI.toast("暂时没有优惠券！")
      })
    // this.getOrderList({
    //   user_id: this.data.user_id,
    //   type: type,
    //   p: this.data.p,
    // })
  },
  lingquan(){
    wx.switchTab({ url: '/pages/CART/cart/cart'})
  }

})
