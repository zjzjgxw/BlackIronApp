const api = require("../../utils/api")

// pages/order/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs:[{
      key:0,
      title:"全部",
      statuses:[],
      visable:"show",
    },{
      key:1,
      title:"待付款",
      statuses:[1],
      visable:"hidden",
    },{
      key:2,
      title:"待发货",
      statuses:[2],
      visable:"hidden",
    },
    {
      key:3,
      title:"待收货",
      statuses:[3,4],
      visable:"hidden",
    },
    {
      key:4,
      title:"已完成",
      statuses:[5],
      visable:"hidden",
    }],
    currentStatues:[],
    currentPageNum:1,
    pageSize:10,
    isFinished:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderData(options.key);
  },

  getOrderData:function(key){
    let activeKey = key;
    let tabs = this.data.tabs;
    let statuses = [];
    tabs.forEach(item =>{
      if(item.key == activeKey){
        item.visable="show"
        statuses = item.statuses
      }else{
        item.visable="hidden"
      }
    });
    this.setData({
      currentStatues:statuses,
      tabs
    })
    wx.showLoading({
      title: '正在加载',
      mask:true
    })
    api.getOrderList(statuses).then(result=>{
      wx.hideLoading({
        success: (res) => {},
      })
      if(api.isSuccess(result)){
        console.log(result);
        let isFinished = false;
        if(result.data.rows.length < this.data.pageSize){
          isFinished = true
        }
        this.setData({
          orders:result.data.rows,
          isFinished,
          currentPageNum:1
        })
      }
    });
  },

  selcetTab:function(e){
    const activeKey = e.currentTarget.dataset.activeKey;
    this.getOrderData(activeKey);
  },

  goOrderDetail:function(e){
    let order =  e.currentTarget.dataset.order;
    order['products'] = order.items;
    delete order.items;
    let mode = "detail";
    if(order.status.index == 1){
      mode = "pay"
    }
    wx.setStorageSync('order', order);
    wx.navigateTo({
      url: '/pages/order/index?mode='+mode,
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
    if(this.data.isFinished){
      return;
    }

    api.getOrderList(this.data.statuses,this.data.currentPageNum+1,this.data.pageSize).then(result=>{
     
      if(api.isSuccess(result)){
        let orders = this.data.orders;
        orders = orders.concat(result.data.rows);
        let isFinished = false;
        if(result.data.rows.length < this.data.pageSize){
          isFinished = true
        }
        this.setData({
          orders: orders,
          isFinished,
          currentPageNum: this.data.currentPageNum+1
        })
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})