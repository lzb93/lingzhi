import { getAddressList, delAddress, addAddress } from '../../../services/API'
const App = getApp()
Page({
  data: {
    isChecked: true,
    addressItems: [],
    from: '',
    isEmpty: false,
  },
  onLoad(e) {
    const from = e.from
    from && this.setData({from: from})
    wx.setNavigationBarTitle({
      title: "地址管理"
    })
  },
  onShow() {
    this.init()
  },
  init() {
    getAddressList()
    .then(({ status, result, msg }) => {
      if (status == 1) {
        this.setData({ addressItems: result })
        
        result.length === 0 && this.setData({ isEmpty: true})
        // if (result.length === 0 && this.data.from === 'payOrder') {
        //   wx.navigateTo({
        //     url: '/pages/USER/addressEdit/addressEdit'
        //   })
        // }
      } else {
        App.wxAPI.alert(msg)
      }
      
    })
    .catch((e) => {
      console.log(e)
    })
  },
  checkedAds(e) {
    if (this.data.from === 'payOrder') {
      let index = e.currentTarget.dataset.index
      App.curCheckedAddress = this.data.addressItems[index].address_id
      wx.navigateBack()
      // let address_id = this.data.addressItems[index].address_id
      // wx.redirectTo({
      //   url: '/pages/CART/payOrder/payOrder?address_id=' + address_id
      // })
    }
  },
  checked(e) {
    let index = e.currentTarget.dataset.index
    let params = this.data.addressItems[index]
    params.is_default = params.is_default === 1 ? 0 : 1
    addAddress(params)
    .then(({ status, result, msg}) => {
      if (status === 1) {
        this.init()
      } else {  
        App.wxAPI.alert(e)
      }
    })
    .catch((e) => {
      console.log(e)
    })
  },
  edit(e) {
    let index = e.currentTarget.dataset.index
    App.curEditAddress = this.data.addressItems[index]
    wx.navigateTo({
      url: `/pages/USER/addressEdit/addressEdit?target=${App.curEditAddress.user_id}`
    })
  },
  del(e) {
    App.wxAPI.confirm("确定删除？")
    .then(() => {
      let id = e.currentTarget.dataset.id
      return delAddress({ id: id })
    })
    .then(({ status, msg }) => {
      App.wxAPI.toast(msg)
      if (status === 1) {
        this.init()
      }
    })
    .catch(e => {
      console.log('已取消')
    })
  },
  jumpEdit() {
    wx.navigateTo({
      url: '/pages/USER/addressEdit/addressEdit'
    })
  }
})