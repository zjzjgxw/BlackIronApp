//index.js

const api = require("../../utils/api")

//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    banners:[],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    swiperCurrent: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 800,
    circular: true,
    categories:[],
    advertisements:[],
    navigations:[],
  },

  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  goCreateArticleView: function () {
    wx.navigateTo({
      url: '../article/create'
    })
  },
  onPullDownRefresh: function () {
    console.log("pullDown");
  },
  onReachBottom: function () {
    console.log("onReachBottom");
  },
  adClick: function(e){
    const url = e.currentTarget.dataset.item.url;
    if(url.length > 0){
      wx.navigateTo({
        url: url
      })
    }
  },
  onLoad: function () {
    //获取轮播图
    api.getBanners().then(result=>{
      if(api.isSuccess(result)){
        this.setData({
          banners:result.data.banners
        })
      }
    })
    //获取导航项目
    api.getNavigations().then(result=>{
      if(api.isSuccess(result)){
        this.setData({
          navigations:result.data.navigations
        })
      }
    });
    
    //获取广告
    api.getAdvertisements().then(result=>{
      if(api.isSuccess(result)){
        this.setData({
          advertisements:result.data.advertisements
        })
      }
    });

    //获取类目
    api.getAllCategory().then(result=>{
      if(api.isSuccess(result)){
        console.log(result);
        let categoryList = [];
        result.data.categories.forEach(item=>{
          if(item.showFlag){
            categoryList.push(item);
          }
        });
        this.setData({
          categories:categoryList
        })
      }
      return result.data.categories
    });
  
  },
  onShow:function(){
    let cart = wx.getStorageSync('cart') || [];
    if(cart.length > 0){
      wx.setTabBarBadge({
        index: 1,
        text: `${cart.length}`,
      })
    }else{
      wx.hideTabBarRedDot({
        index: 1,
      })
    }
  },
})