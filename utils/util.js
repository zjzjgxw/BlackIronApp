const api = require("./api.js")

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatMoney = money=>{
  return money/100;
}

const checkLogin = function () {
  const app = getApp();
  if (app.globalData.token == null) {
    wx.navigateTo({
      url: '/pages/user/auth',
    })
    return false;
  }
  return true;
}

const doLogin = function () {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        api.weixinLogin(res.code).then(res => {
          if (api.isSuccess(res)) {
            const app = getApp();
            app.globalData.token = res.data.accessToken
            //获取用户信息
            api.getUserInfo().then(result => {
              console.log(result)
            })
            resolve(res)
          } else {
            console.log(res.msg)
            reject(res)
          }
        })
      }
    })
  })
}


module.exports = {
  formatTime: formatTime,
  checkLogin: checkLogin,
  doLogin: doLogin,
  formatMoney:formatMoney
}