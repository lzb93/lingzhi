import { json2Form, modifyUrl, randomString } from './utils'

function getToken() {
  return getApp().token || ''
}
function getUserid() {
  if( getApp().userInfo ) {
    return getApp().userInfo.user_id || ''
  }else {
    return ''
  }
}
// function getUniqueId() {
//   if ( getApp().globalData.uniqueId ) {
//     return getApp().globalData.uniqueId
//   } else {
//     return getApp().globalData.uniqueId = 'miniapp' + randomString(17)
//   }
// }

export default function request(url, data = {}, methods = 'GET') {
  // 附加鉴权参数
  url = modifyUrl(url, {
    is_anonymous: 1,
    // unique_id: getUniqueId(),
    token: getToken(),
    user_id: getUserid()
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      method: methods,
      header: {
        // 'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: resolve,
      fail: reject
    })
  })
  .then(({ data, statusCode, errMsg}) => {
    if (statusCode != 200) {
      return Promise.reject(errMsg)
    } else {
      if (data.status == -100 || data.status == -101) {
        // 没登录处理....
        return
        getApp().getUserInfo(() => {
          wx.switchTab({
            url: '/pages/HOME/home/home'
          })
        })
        return Promise.reject(errMsg)
      }
      return data
    }
  })
}

// 上传图片（文件）
export function uploadFile(url, file) {
  // 附加鉴权参数
  // url = modifyUrl(url, {
  // is_json: 1,
  // unique_id: getUniqueId(),
  // token: getToken()
  // })
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url,
      filePath: file.path,
      name: 'file',
      success(res) {
        resolve(res)
      },
      fail(e) {
        reject(e)
      }
    })
  })
    .then(({ data, statusCode, errMsg }) => {
      if (statusCode != 200) {
        return Promise.reject(errMsg)
      } else {
        return data
      }
    })
}

// export function uploadFile(url, { filePath, name }) {
//   // 附加鉴权参数
//   url = modifyUrl(url, {
//     is_anonymous: 1,
//     // unique_id: getUniqueId(),
//     token: getToken()
//   })
//   return new Promise((resolve, reject) => {
//     wx.uploadFile({
//       url,
//       filePath,
//       name,
//       success (res) {
//         resolve(res)
//       },
//       fail (e) {
//         reject(e)
//       }
//     })
//   })
//   .then(({ data, statusCode, errMsg}) => {
//     if (statusCode != 200) {
//       return Promise.reject(errMsg)
//     } else {
//       return data
//     }
//   })
// }
// 队列上传图片
export function uploadFileQueue(url, arr) {
  let i = 0
  let len = arr.length
  let resultArr = []
  return new Promise((resolve, reject) => {
    upload(resolve)
  })
  // comment_img_file[]
  function upload(resolve) {
    uploadFile(url, {
      filePath: arr[i].path,
      name: 'file'
    })
    .then(res => {
      const { status, result, msg } = JSON.parse(res)
      if (status === 1) {
        resultArr.push(result)
        if (++i == len) {
          resolve(resultArr)
        } else {
          upload(resolve)
        }
      } else {
        App.wxAPI.alert(msg)
      }
    })
    .catch(e => {
      console.log(e)
    })
  }
}
export function get(url, data = {}) {
  return request(url, data, 'GET')
}
export function post(url, data = {}) {
  return request(url, data, 'POST')
}