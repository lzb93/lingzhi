import { getQueryExpress } from '../../../services/API';

const app = getApp();
Page({
  data: {
    queryExpress: '',
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
    index: '',
    express: ''
  },
  onLoad(option) {
    console.log(option);
    if(option.no) {
      let params = {
        invoice_no: option.no,
        shipping_code: option.code
      }
      getQueryExpress(params).then((result) => {
        if (result.status == 200) {
          const arr = this.data.array;
          const express = (arr || []).find(item => {
            return item.type == result.com;
          })
          let queryExpress = {
            expressData: result.data,
            nu: result.nu
          }
          this.setData({ queryExpress, express });
        } else {
          app.wxAPI.alert('卖家未发货或该订单物流不存在')
          .then(() => {
            wx.navigateBack({
              delta: 1
            })
          })
        }
      })
    } else {
      this.setData({
        queryExpress: app.queryExpress
      })
      this.init();
    }
  },
  init() {
    const arr = this.data.array;
    const expressType = this.data.queryExpress.com;
    const express = (arr || []).find(item => {
      return item.type == expressType;
    })
    this.setData({ express });
  }
})