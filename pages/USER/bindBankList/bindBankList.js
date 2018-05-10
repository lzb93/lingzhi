import { getUserCard } from '../../../services/API';

const app = getApp();
Page({
  data: {
    card: '',
    status: [
      {
        state: 1,
        name: '审核中'
      },
      {
        state: 2,
        name: '已通过'
      },
      {
        state: 3,
        name: '已拒绝'
      }
    ],
    state: ''
  },
  onLoad() {
    
  },
  onShow() {
    getUserCard().then(({ status, result, msg }) => {
      if (status == 1) {
        let state = '';
        if(result) {
          state = (this.data.status || []).find(item => {
            return item.state == result.status;
          })
        }
        this.setData({
          card: result,
          state: state
        })
      }
    })
  }
})