const api = require("../../utils/api");

// pages/product/comments.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comments: [],
    pageNum: 1,
    pageSize: 4,
    productId: 0,
    isFinished: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.getCommentOfProduct(options.productId, this.data.pageNum, this.data.pageSize).then(result => {
      if (api.isSuccess(result)) {
        console.log(result);
        let isFinished = false;
        if (result.data.rows.length < this.data.pageSize) {
          isFinished = true;
        }
        this.setData({
          comments: result.data.rows,
          productId: options.productId,
          isFinished
        })
      }
    });
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    if (this.data.isFinished) {
      return
    }

    api.getCommentOfProduct(this.data.productId, this.data.pageNum + 1, this.data.pageSize).then(result => {
      if (api.isSuccess(result)) {
        let isFinished = false;
        if (result.data.rows.length < this.data.pageSize) {
          isFinished = true;
        }
        let comments = this.data.comments;
        comments = comments.concat(result.data.rows);
        this.setData({
          comments: comments,
          pageNum: this.data.pageNum + 1,
          isFinished
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