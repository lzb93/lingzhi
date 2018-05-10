import { getMoney } from '../../../services/API';

Page({
  data: {
    money: ''
  },
  onLoad() {
    
  },
  onShow() {
    getMoney().then(({status, result, msg}) => {
      if(status == 1) {
        this.setData({
          money: result
        })
      }
    })
  }
})