import { addAddress } from '../../../services/API';
const App = getApp()
Page({
  data: {
    adsParams: {
      consignee: '', //收货人
      mobile: '', 
      // province_name: '', //省
      province: '',
      // city_name: '', //市
      city: '',
      // district_name: '', //区
      district: '',
      // twon_name: '街道地址为空', // 街道
      // twon: 16306, 
      address: '', // 详细地址
      is_default: 0, // 是否设为默认
    },
    region: ['省份', '城市', '区'],
  },
  //生命周期函数--监听页面初次渲染完成
  onLoad(e) {
    const from = e.from
    const target = e.target
    from && this.setData({ from })
    wx.setNavigationBarTitle({
      title: "地址管理"
    })
    this.init(target)
  },
  init(target) {
    if (target) {
      wx.setNavigationBarTitle({
        title: "编辑地址"
      })
      let adsParams = App.curEditAddress
      this.setData({ 
        adsParams,
        region: [adsParams.province, adsParams.city, adsParams.district,]
      })
    } else {
      wx.setNavigationBarTitle({
        title: "新增地址"
      })
    }
  },
  setConsignee(e) {
    const consignee = e.detail.value
    this.data.adsParams.consignee = consignee
    this.setData({})
  },
  setMobile(e) {
    const mobile = e.detail.value
    this.data.adsParams.mobile = mobile
    this.setData({})
  },
  setDetail(e) {
    const detail = e.detail.value
    this.data.adsParams.address = detail
    this.setData({})
  },
  save() {
    let adsParams = this.data.adsParams
    let arr = this.data.region
    Object.assign(adsParams, {
      province: arr[0],
      city: arr[1],
      district: arr[2],
    })
    addAddress(adsParams)
    .then(({ status, result, msg }) => {
      if (status === 1) {
        // wx.redirectTo({ url: '/pages/USER/address/address' })
        if (this.data.from === "payOrder") {
          App.curCheckedAddress = result
          return wx.navigateBack()
        }
        wx.navigateBack()
      } else {
        if (status === -1) {
          return wx.navigateBack()
        }
        App.wxAPI.alert(msg, "error")
      }
    })
  },
  bindRegionChange(e) {
    let arr = e.detail.value
    this.setData({ region: arr})
  },

})
