import request, { get, post} from '../utils/request' 
import config from '../utils/config'
// 登录（获取token）
export function thirdLogin(params) {
  return post(config.host + '/api/user/thirdLogin', params)
}
// 首页数据
export function homePage() {
  return get(config.host + '/api/index/homePage')
}
// 最热门数据(分页)
export function favourite(params) {
  return get(config.host + '/api/index/favourite', params)
}
// 搜索
export function search(params) {
  return get(config.host + '/api/goods/search', params)
}
// 获取所有商品分类
export function goodsCategoryList() {
  return post(config.host + '/index.php?m=Api&c=Goods&a=goodsCategoryList')
}
// 根据分类获取产品列表
export function goodsList(params) {
  return get(config.host + '/index.php?m=Api&c=Goods&a=goodsList', params)
}

// 根据id获取商品详情
export function goodsInfo(params) {
  return post(config.host + '/index.php?m=Api&c=Goods&a=goodsInfo', params)
}
// 根据id获取商品详情规格
export function goodsContent(params) {
  return get(config.host + '/api/goods/goodsContent', params)
}
// 排序 默认
export function orderbyDefault(url, params) {
  return get(config.hosts + url, params)
}
// 获取最新商品列表

export function newinfo(url, params) {
  return get(config.host + '/api/goods/newinfo', params)
}

// 获取热门商品列表
export function hotinfo(url, params) {
  return get(config.host + '/api/goods/hotinfo', params)
}

// 将商品加入购物车
export function addCart(params) {
  return post(config.host + '/index.php?m=Api&c=Cart&a=addCart', params)
}
// 购物车列表
export function cartList(params) {
  return post(config.host + '/index.php?m=Api&c=Cart&a=cartList', params)
}
// 获取订单表格
export function orderEdit(params) {
  return post(config.host + '/index.php?m=Api&c=Cart&a=cart2', params)
}
// 获取订单列表
export function getOrderList(params) {
  return get(config.host + '/index.php?m=Api&c=User&a=getOrderList', params)
}
// 获取退款退货订单列表
export function returnGoodsList(params) {
  return get(config.host + '/api/user/return_goods_list', params)
}
// 提交订单
export function saveOrder(params) {
  return post(config.host + '/index.php?m=Api&c=Cart&a=cart3', params)
}
// 获取微信支付需要的信息
export function getPaymentOrder(params) {
  return get(config.host + '/api/cart/cart4', params)
}
// 订单详情
export function orderDetail(params) {
  return get(config.host + '/api/order/order_detail', params)
}
// 取消订单（在未支付未发货的时候使用）
export function cancelOrder1(params) {
  return post(config.host + '/api/user/cancelOrder', params)
}
// 删除订单
export function delOrder(params) {
  return get(config.host + '/index.php?m=Api&c=Order&a=del_order', params)
}

// 取消订单（在已支付未发货的时候使用）
export function cancelOrder2(params) {
  return post(config.host + '/api/order/refund_order', params)
}
// 确定收货
export function orderConfirm(params) {
  return post(config.host + '/index.php?m=Api&c=User&a=orderConfirm', params)
}
// 退换,货申请
export function refundOrder(params) {
  return post(config.host + '/index.php?m=Api&c=Order&a=return_goods', params)
}
// 获取支付信息
export function doPay(params) {
  return post(config.host + '/index.php?m=api&c=Wxpay&a=dopay', params)
}
// 删除商品
export function delCart(params) {
  return post(config.host + '/index.php?m=Api&c=Cart&a=delCart', params)
}
// 获取收货地址列表
export function getAddressList(params) {
  return get(config.host + '/api/user/getAddressList', params)
}
// 新增收货地址
export function addAddress(params) {
  return post(config.host + '/api/user/addAddress', params)
}
// 删除收货地址
export function delAddress(params) {
  return post(config.host + '/api/user/del_address', params)
}
// 设置默认地址（暂时未使用）
export function setDefaultAddress(params) {
  return post(config.host + '/index.php?m=Api&c=User&a=setDefaultAddress', params)
}
// 设置默认地址（暂时未使用）
export function uploadHeadpic(params) {
  return post(config.host + '/index.php?m=api&c=User&a=upload_headpic', params)
}
// 收藏/取消收藏 商品
export function collectGoods(params) {
  return post(config.host + '/index.php?m=Api&c=Goods&a=collectGoodsOrNo', params)
}
// 收藏列表
export function getGoodsCollect(params) {
  return get(config.host + '/api/user/getGoodsCollect', params)
}
//优惠券列表   
export function getGoodscoupons(params) {
  return get(config.host + '?m=api&c=Activity&a=coupon_list', params)
}

//优惠券领取 
export function getGoodsgetcoupon(params) {
  return get(config.host + '?m=api&c=Activity&a=get_coupon', params)
}

//写评论 
export function getGoodsaddcomment(params) {
  return post(config.host + '?m=Api&c=User&a=add_comment', params)
}


// 申请提现
export function withdrawals(params) {
  return post(config.host + '/api/user/withdrawals', params)
}
// 提现列表
export function getWithdrawalsList(params) {
  return get(config.host + '/index.php?m=api&c=user&a=withdrawals_list', params)
}

// 获取验证码
export function getVerifyCode(params) {
  // return post(config.host + `/api/user/verify?is_image=1&t=${+new Date()}`, params)
  return config.host + `/api/user/verify?is_image=1&t=${+new Date()}`
}
// 设置支付密码
export function setPassword(params) {
  return post(config.host + `/index.php?m=api&c=user&a=paypwd`, params)
}
