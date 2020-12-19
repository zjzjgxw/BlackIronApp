
const api = require('../../../utils/api.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: String, // list 为商品类目列表， recommend 为推荐类别
    categoryId: Number,
    title: String,
    imgUrl:String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    products: []
  },



  lifetimes: {
    attached: function () {
      if (this.properties.type === 'recommend') {
        api.getRecommendProducts().then(result => {
          if (api.isSuccess(result)) {
            this.setData({
              products: result.data.rows,
            })
          }
        });
      } else if (this.properties.type === 'list') {
        api.getProductsOfCategory(this.properties.categoryId, 1, 6).then(result => {
          if (api.isSuccess(result)) {
            this.setData({
              products: result.data.rows
            })
          }
        })
      }
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },


  /**
   * 组件的方法列表
   */
  methods: {
    getMoreData: function () {
      console.log("getMoreData")
    },

    handleClick: function(e){
      wx.navigateTo({
        url: `/pages/product/detail?id=${e.currentTarget.dataset.itemId}`
      })
    }
  }
})