// pages/user/index.js
const api = require('../../utils/api.js')
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let app = getApp();
    console.log(app);
    if (app.globalData.userInfo != null) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
  },
  goOrderList: function (e) {
    util.checkLogin();
    wx.navigateTo({
      url: '/pages/order/list?key=' + e.currentTarget.dataset.key,
    })
  },

  handleLogin: function (e) {
    console.log("hesll");


    wx.navigateTo({
      url: './auth',
    })


  },

  showSettingToast: function (e) {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})