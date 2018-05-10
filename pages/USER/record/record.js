import { getRecord } from '../../../services/API';
import { js_date_time, dalay } from '../../../utils/utils';

const app = getApp();
Page({
  data: {
    page: 0,
    items: [],
    isAgain: true,
    isNomore: false,
    status: [
      {
        status: 1,
        name: '提现审核中',
        src: 'icon_shenQing.png'
      },
      {
        status: 2,
        name: '提现成功',
        src: 'icon_success.png'
      },
      {
        status: 3,
        name: '提现失败',
        src: 'icon_error.png'
      }
    ]
  }, 
  onLoad() {
    this.getRecord({ page: this.data.page })
  },
  getRecord(params) {
    getRecord(params).then(({status, result, msg}) => {
      if (status == 1) {
         let records = (result || []).map(item => {
          const state = this.data.status.find(status => {
             return item.status == status.status
           })
          return {
            card_number: item.card_number,
            money: item.money,
            statusName: state.name,
            src: state.src,
            time: js_date_time(item.create_time)
          }
        })

         let items = this.data.items;
        this.setData({
          items: items.concat(records),
          p: ++this.data.page,
          isAgain: true
        })
        if (result.length < 10) {
          this.setData({
            isAgain: false,
            isNomore: true
          })
        }
      } else {
        app.wxAPI.alert(msg)
      }
    })
  },
  onReachBottom() {
    if (!dalay(500)) return
    if (!this.data.isAgain) return;
    this.setData({ isAgain: false });
    this.getRecord({ page: this.data.page })
  }
})