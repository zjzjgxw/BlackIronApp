const api = require("../../utils/api");
const util = require("../../utils/util");

// pages/product/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    swiperCurrent: 0,
    indicatorDots: true,
    autoplay: false,
    interval: 3000,
    duration: 800,
    circular: true,
    hidePicker: true,
    pickerType: 'buy',
    cartNum: 0,
    productId: 0,
    comments:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      productId: options.id
    })
    api.getProductInfo(options.id).then(result => {
      if (api.isSuccess(result)) {
        console.log(result);
        if(result.data.detail == null){
          wx.navigateBack({
            delta: 0,
          })
        }
        this.setData({
          detail: result.data.detail
        })
      }
    })
    let cart = wx.getStorageSync('cart') || [];
    this.setData({
      cartNum: cart.length
    })

    api.getCommentOfProduct(options.id).then(result=>{
      if(api.isSuccess(result)){
        this.setData({
          comments: result.data.rows
        })
      }
    });
  },

  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  handleBuy: function (e) {
    util.checkLogin();
    this.setData({
      hidePicker: false,
      pickerType: 'buy'
    })
  },

  handleAddCart: function () {
    util.checkLogin();
    this.setData({
      hidePicker: false,
      pickerType: 'cart'
    })
  },

  onAddCartEvent: function (e) {
    let cart = wx.getStorageSync('cart') || [];
    this.setData({
      cartNum: cart.length
    })
  },
  goCart: function () {
    wx.switchTab({
      url: '/pages/cart/index',
    })
  },
  goHome: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  goCommentList: function(){
    wx.navigateTo({
      url: '/pages/product/comments?productId='+this.data.detail.id,
    })
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
    const detail = this.data.detail;
    return {
      title: detail.name,
      path: `/pages/product/detail?id=${detail.id}`,
      imageUrl:detail.coverUrl
    }
  },
  onShareTimeline:function(){
    const detail = this.data.detail;
    return {
      title: detail.name,
      path: `/pages/product/detail?id=${detail.id}`,
      imageUrl:detail.coverUrl
    }
  }
})