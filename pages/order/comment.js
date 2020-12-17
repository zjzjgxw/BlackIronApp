const { isSuccess } = require("../../utils/api");
const api = require("../../utils/api");

// pages/order/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: null,
    params:{},
    maxImagesNum:1  //最多上次文件数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let order = wx.getStorageSync('order');
    let params = {};
    order.products.forEach(item=>{
      params[item.productId] = {
        type :1,
        images : [],
        content :"",
        score: 10,
        imgUrl:"",
        productId:item.productId,
        orderId:item.orderId
      }
    });

    this.setData({
      order,
      params
    })
  },

  submit:function(){
    let params = [];
    for(let productId in this.data.params){
      params.push(this.data.params[productId]);
    }
    api.commentOrder(params).then(result=>{
      if(api.isSuccess(result)){
        let order = wx.getStorageSync('order');
        order.status.index = 5
        order.status.text = "已完成"
        wx.setStorageSync('order', order)
        wx.navigateBack({
          delta: 0,
        })
      }
    })
  },

  radioChange: function (e) {
    const productId = e.currentTarget.dataset.productId;
    const type = e.detail.value;
    let params = this.data.params;
    params[productId].type = type;
    let score = 10;
    if(type == 2){
      score = 5
    }else if( type == 3){
      score = 1
    }
    params[productId].score = score;
    this.setData({
      params
    })
  },
  textChange: function (e) {
    const productId = e.currentTarget.dataset.productId;
    const content = e.detail.value;
    let params = this.data.params;
    params[productId].content = content;
    this.setData({
      params
    })
  },
  chooseImage: function (e) {
    var that = this;
    const productId = e.currentTarget.dataset.productId;
    let params = this.data.params;
    wx.chooseImage({
      count:1, //指定最多选取数量
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        //因为这里制作单文件上次，所以直接取数组第一个值
        wx.showLoading({
          title: '正在上传图片',
          mask:true
        })
        api.uploadImages(res.tempFilePaths[0]).then(result=>{
          wx.hideLoading({
            success: (res) => {},
          })
          if(api.isSuccess(result)){
            let images =  params[productId].images;
            images.push(result.data.url);
            params[productId].images = images;
            params[productId].imgUrl = result.data.path
            that.setData({
              params:params 
            });
          }
        })

      },
      fail:function(res){
        console.log(res);
      },
      complete:function(res){
        console.log(res);
      }
    })
  },

   //预览单个图片
   previewImage: function (e) {
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // =============重点重点=============
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

  }
})