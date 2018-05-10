import { getLowerLevel } from '../../../services/API';
import { dalay } from '../../../utils/utils'

const app = getApp();
Page({
  data: {
    page: 0,
    items: [],
    total: '',
    isAgain: true,
    isNomore: false
  },
  onLoad() {
    this.getLowerLevel({ page: this.data.page});
  },
  getLowerLevel(params) {
    getLowerLevel(params).then(({status, result, msg}) => {
      if (status == 1) {
        let items = this.data.items;
        if(this.data.page ==0) {
          this.setData({
            total: result.count
          })
        }
        this.setData({
          items: items.concat(result.list),
          p: ++this.data.page,
          isAgain: true
        })
        if (result.list.length < 15) {
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
    this.getLowerLevel({ page: this.data.page })
  }
})