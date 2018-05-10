import { homePage, goodsList, categoryList, cacheLoading, loadMoreGoods, teamBanner } from '../../../services/API'
import { dalay } from '../../../utils/utils'

const app = getApp()
Page({
  data: {
    http: app.http,
    host: app.host,
    categorys: [],
    secondCategorys: [],
    banners:[],
    teamBanners: [],
    goodsList: [], 
    activeNav: 0,
    isShowType: false,
    page: 0,
    id: 1,
    isAgain: true,
    isNomore: false,
    url: '',
    secondCategory: 0,
    keyword: ''
  },
  onLoad() {
    homePage().then(({ status, result, msg }) => {
      if(status == 1) {
        // let categorys = [{ id: 0, name: "首页" }];
        // result.category.forEach((item) => {
        //   categorys.push(item);
        // })
        this.setData({
          // categorys: categorys,
          banners: result.banner,
          // page: ++this.data.page
        })
      } else {
        app.wxAPI.alert(msg)
      }
      
    });
    teamBanner().then(({ status, result, msg }) => {
      if (status == 1) {
        this.setData({
          teamBanners: result
        })
      } else {
        app.wxAPI.alert(msg)
      }
    })
    this.getGoodsList();
  },
  tabNavBar(e) {
    const id = e.currentTarget.dataset.id;
    const index = e.currentTarget.dataset.index;
    this.move(index); // 控制挪动
    this.reset();
    dalay(500); // 防止触发 到底
    this.setData({ activeNav: index, id: id });
    
    if(this.data.id == 0) {
      this.getGoodsList();
      this.setData({ secondCategorys: [] });
    } else {
      this.getCategoryList();
      this.setData({ secondCategorys: [] });
    }
  },
  switchSecondNav(e) {
    const secondId = e.currentTarget.dataset.secondId;
    this.reset();
    this.setData({
      secondCategory: secondId
    })
    this.loadMoreGoods({ page: this.data.page, cat_id: secondId });
  },
  loadMoreGoods(params) {
    loadMoreGoods(params).then(({ status, result, msg }) => {
      if (status === 1) {
        const goods_list = result || [];
        const arr = this.data.goodsList.concat(goods_list);
        this.setData({
          goodsList: arr,
          page: ++this.data.page,
          isAgain: true
        })
        this.finish(goods_list);
      } else {
        app.wxAPI.alert(msg)
      }
    })
  },
  getGoodsList() {
    goodsList({ page: this.data.page }).then(({ status, result, msg }) => {
      this.setData({
        goodsList: result
      })
      this.finish(result)
    })
  },
  getCategoryList() {
    categoryList({ first_category: this.data.id }).then(({ status, result, msg }) => {
      const secondCategorys = result.second_category;
      this.setData({
        goodsList: result.goods,
        secondCategorys: secondCategorys,
        secondCategory: secondCategorys[0].id
      })

      this.finish(result.goods);
    })
  },
  onReachBottom() {
    // if (!dalay(1000)) return;
    if (!this.data.isAgain) return;
    this.setData({ isAgain: false });
    const secondCategorys = this.data.secondCategorys;
    if (secondCategorys.length == 0) {
      this.againLoading("c=Index&a=homeRecommend", { page: this.data.page });
    } else {
      this.loadMoreGoods({ page: this.data.page, cat_id: secondId });
    }
  },
  againLoading(url, params) {
    cacheLoading(url, params).then(({ status, result, msg }) => {
      if (status === 1) {
        const goods_list = result || [];
        const arr = this.data.goodsList.concat(goods_list);
        this.setData({
          goodsList: arr,
          page: ++this.data.page,
          isAgain: true
        })
        this.finish(goods_list);
      } else {
        app.wxAPI.alert(msg)
      }
    })
  },
  reset() {
    this.setData({
      goodsList: [],
      page: 0,
      id: 1,
      isAgain: true,
      isNomore: false,
      keyword: ''
    })
  },
  move(index) {
    const len = this.data.categorys.length;
    if (len < 5) return;
    const needLeft = 2; // 0, 1 右边移动
    const needRight = len - 3; // 5, 6做移动
    if (index <= needLeft) {
      this.setData({ scrollLeft: 0 })
    } else if (index >= needRight) {
      this.setData({ scrollLeft: 150 })
    }
  },

  //结束处理
  finish(arr) {
    if (arr.length < 10) {
      this.setData({
        isAgain: false,
        isNomore: true
      })
    }
  },

  onblur(e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  oninput(e) {
    let keyword = e.detail.value
    if (keyword != '') {
      this.setData({
        isEmpt: true,
        keyword
      })
    } else {
      this.setData({
        isEmpt: false
      })
    }
    return keyword.trim()
  },
  empt() {
    setTimeout(() => {
      console.log(this.data.keyword, "1");
      this.setData({
        keyword: '',
        isEmpt: false
      })
    }, 50)
  },
  search() {
    const keyword = this.data.keyword;
    if (keyword) {
      wx.navigateTo({
        url: `/pages/HOME/type/type?keyword=${keyword}`
      })
    }
  },
  onShareAppMessage(res) {
    return {
      title: '蚂蚁家云超市',
      path: '/pages/HOME/home/home?userId=' + app.userInfo.user_id,
    }
  }
})