// 时间格式（时间戳长度在下面）
export function format(ms, fmt) {
  const d = new Date(Number(ms))
  const obj = {
    'M+': d.getMonth() + 1,
    'd+': d.getDate(),
    'h+': d.getHours(),
    'm+': d.getMinutes(),
    's+': d.getSeconds(),
    'q+': Math.floor((d.getMonth() + 3) / 3),
    'S': d.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var i in obj) {
    if (new RegExp('(' + i + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1)
        ? (obj[i])
        : (('00' + obj[i]).substr(('' + obj[i]).length)))
    }
  }
  return fmt
}
// 对象形式参数转url形式参数 a=1&b=2
export function json2Form(json) {
  let str = []
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]))
  }
  return str.join("&")
}
// 地址加上参数
export function modifyUrl(url, params) {
  params = json2Form(params)
  if (url.indexOf('?') != -1) {
    url = url + '&' + params
  } else {
    url = url + '?' + params
  }
  return url
}
// 随机一个任意长度的字符串
export function randomString(len) {
  len = len || 32
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const maxPos = chars.length;
  let pwd = ''
  for (var i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * (maxPos + 1)))
  }
  return pwd
}
// 节流函数
export const dalay = (function () {
  let timestamp = 0
  return function(dis = 1000) {
    const now = +new Date()
    if (now - timestamp > dis) {
      timestamp = now
      return true
    } else {
      return false
    }
  }
})()

// 时间戳差 转为 剩余时间
export function remainTime(diffms) {
  const daysms = 24 * 60 * 60 * 1000;
  const hoursms = 60 * 60 * 1000;
  const minutems = 60 * 1000;
  const secondms = 1000;
  var result = '';
  var hasfrontVal = false;

  var differDay = Math.floor(diffms / daysms);
  result = differDay
    ? differDay + '天'
    : '';
  hasfrontVal = differDay
    ? true
    : false;

  diffms -= differDay * daysms;
  var differHour = Math.floor(diffms / hoursms);
  result += differHour
    ? differHour + '时'
    : (hasfrontVal
      ? '0时'
      : '');
  hasfrontVal = differHour
    ? true
    : false;

  diffms -= differHour * hoursms;
  var differMinute = Math.floor(diffms / minutems);
  result += differMinute
    ? differMinute + '分'
    : (hasfrontVal
      ? '0分'
      : '');

  diffms -= differMinute * minutems;
  var differSecond = Math.floor(diffms / secondms);
  result += differSecond
    ? differSecond + '秒'
    : '0秒';

  return result;
}