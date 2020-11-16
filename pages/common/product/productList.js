const { isSuccess } = require('../../../utils/api.js');
// pages/common/product/productList.js
const api = require('../../../utils/api.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    products:[]
  },

 

  lifetimes: {
    attached: function() {
      api.getRecommendProducts().then(result =>{
        if(api.isSuccess(result)){
          this.setData({
            products:result.data.rows
          })
        }

      });

    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },

    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getMoreData: function(){
      console.log("getMoreData")
    },
  }
})
