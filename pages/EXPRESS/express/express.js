import { expressOrder, expressQuery, getAddressList } from '../../../services/API';

const app = getApp();
Page({
  data: {
    tab: 'bespoke',
    agree: false,
    sendAddress: '',
    collectAddress: '',
    array: [
      {
        type: 'shunfeng',
        name: '顺丰快递'
      }, 
      {
        type: 'ems',
        name: 'EMS快递'
      }, 
      {
        type: 'shentong',
        name: '申通快递'
      }, 
      {
        type: 'yuantong',
        name: '圆通快递'
      }, 
      {
        type: 'huitong',
        name: '百世汇通快递'
      }, 
      {
        type: 'zhongtong',
        name: '中通快递'
      },
      {
        type: 'pingyou',
        name: '中国邮政'
      }
    ],
    index: 0,
    expressNum: ''
  },
  onLoad() {
    getAddressList().then(({ status, result, msg }) => {
      if (status == 1) {
        (result || []).forEach((item) => {
          if (item.is_default) {
            app.sendAddress = item;
            this.setData({
              sendAddress: item
            })
          }
        })
      }
    })
  },
  onShow() {
    app.sendAddress && this.setData({ sendAddress: app.sendAddress });
    app.collectAddress && this.setData({ collectAddress: app.collectAddress });
  },
  openAddress(e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({ url: '/pages/EXPRESS/address/address?type=' + type });
  },
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      tab: tab
    })
  },
  agreeClause() {
    this.setData({
      agree: !this.data.agree
    })
  },
  placeOrder() {
    const send = this.data.sendAddress;
    const collect = this.data.collectAddress;
    if (send.city == '南平市') {
      let params = {
        sender: send.consignee,
        addressee: collect.consignee,
        sender_address: send.province + send.city + send.district + send.address,
        addressee_address: collect.province + collect.city + collect.district + collect.address,
        mobile: send.mobile,
        shou_mobile: collect.mobile,
        // user_id: app.userInfo.user_id
      }
      expressOrder(params).then(({ status, result, msg }) => {
        if(status == 1) {
          
        } else {
          app.wxAPI.alert(msg);
        }
      })
    } else {
      app.wxAPI.alert('寄件地址不在福建省南平市内!');
    }
  },


  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
  setExpressNum(e) {
    const expressNum = e.detail.value
    this.data.expressNum = expressNum;
    this.setData({})
  },
  queryKd() {
    const arr = this.data.array;
    const index = this.data.index;
    const expressType = arr[index].type;
    const expressNum = this.data.expressNum;
    if (!expressNum) {
      app.wxAPI.alert('请输入运单号查询!');
      return;
    }
    expressQuery({ order: expressNum, express_type: expressType }).then(({ status, result, msg }) => {
      if(status == 1) {
        const data = result.data || [];
        if(result.status == 200) {
          let queryExpress = (data || []).map(item => {
            let arr = item.time.split(" ");
            return {
              date: arr[0],
              time: arr[1],
              context: item.context
            }
          })
          result.expressData = queryExpress;
          app.queryExpress = result;
          wx.navigateTo({
            url: '/pages/USER/order-logistic/order-logistic'
          })
        } else {
          app.wxAPI.alert(result.message);
        }
        
      } else {
        app.wxAPI.alert(msg);
      }
    })
  }
})