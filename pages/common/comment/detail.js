// pages/common/comment/detail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail: Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //预览单个图片
    previewImage: function (e) {
      let src = e.currentTarget.dataset.src;
      wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: [src] // =============重点重点=============
      })
    },
  }
})