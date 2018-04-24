import { orderDetail, refundOrder  } from '../../../services/API.js'
const App = getApp()
Page({
  data: {
    host: App.host,
    typeList: ['仅退款', '退货退款', '换货'],
    reasonList: ['不想买了', '快递物流一直未送到', '质量问题', '商品与描述不符', '误购（不喜欢/大小不合适）', '卖家发错货', '发票问题', '其他'],
    typeIndex: 0,
    reasonIndex: 0,
    radioValue: 0,
    num: 1,
    remarks: '',
    goods_list: {},
    order_sn: ''
  },
  onLoad(e) {
    wx.setNavigationBarTitle({ title: "申请售后" })
    const order_id = e.order_id || 1593
    const rec_id = e.rec_id || 1859
    console.log(rec_id)
    orderDetail({ id: order_id})
    .then(({status, result, msg}) => {
      if (status === 1) {
        // 过滤数据
        // result.add_time = format(result.add_time*1000, 'yyyy-MM-dd hh:mm:ss')
        const goods_list = result.goods_list.filter(item => {
          // console.log(item.rec_id)
          if (item.rec_id == rec_id){
            return item
          }
        } )[0]
        this.setData({ goods_list, order_sn: result.order_sn })
      } else {
        App.wxAPI.alert(msg)
      }
    })

  },
  typeBindPickerChange: function (e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },
  reasonBindPickerChange: function (e) {
    this.setData({
      reasonIndex: e.detail.value
    })
  },
  swiperChange(e) {
    this.setData({ 
      radioValue: e.detail.value
    })
  },
  remarksBlur(e) {
    this.setData({ 
      remarks: e.detail.value
    })
  },
  save() {
    const goods_list = this.data.goods_list
    console.log(this.data.remarks)
    let param = {
      rec_id: goods_list.rec_id,
      goods_id: goods_list.goods_id,
      // order_sn: goods_list.order_sn,
      order_sn: this.data.order_sn, // 比较特殊
      order_id: goods_list.order_id,
      spec_key: goods_list.spec_key,
      goods_num: this.data.num || 1,
      type: this.data.typeIndex,
      reason: this.data.reasonList[this.data.reasonIndex],
      describe: this.data.remarks
    }
    console.log(param)
    refundOrder(param)
    .then(({status, result, msg}) => {
      if (status === 1) {
        App.wxAPI.alert("退款申请已提交，等待处理中")
        .then(() => {
          wx.navigateBack()
        })
      } else {
        App.wxAPI.alert(msg)
      }
    })
  //   const result = this.data.result
  //   const index =  this.data.index
  //   const params = {
  //     // order_id: result.order_id,
  //     // consignee: result.consignee,
  //     // mobile: result.mobile,
  //     // user_note: this.data.array[index]
  //     user_id: App.userInfo,
  //     rec_id: '',
  //     goods_id: result.order_sn,
  //     order_sn: result.order_sn,
  //     order_id: result.order_id,
  //     spec_key: '',
  //     goods_num: '',
  //     type: '',
  //     reason: '',
  //     describe: '',
  //   }
    
  //   refundOrder(params)
  //   .then(({status, result, msg}) => {
  //     if (status === 1) {
  //       App.wxAPI.alert("退款申请已提交，等待处理中")
  //       .then(() => {
  //         wx.navigateBack()
  //       })
  //     } else {
  //       App.wxAPI.alert(msg)
  //     }
  //   })
  }
})