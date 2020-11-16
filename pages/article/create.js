// pages/article/create.js
const api = require("../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoSrc:"",
    filePath:null,
  },

  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail)
    var content = e.detail.value.content
    var title = e.detail.value.title
    if(title.length < 2 || title.length > 50){
      wx.showToast({
        title: '请输入标题，字数在2-50字以内',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(this.data.filePath == null){
      wx.showToast({
        title: '请上传视频',
        icon: 'none',
        duration: 2000
      })
      return
    }

    var articleInfo = {
      title:title,
      content:content,
      videoUrl:this.data.filePath
    }
    api.createArticle(articleInfo).then(res=>{
      console.log(res)
    })

  },

  chooseVideo:function(){
    const that = this
    wx.chooseVideo({
      sourceType: ['album'],
      compressed:false,
      success(res) {
        console.log(res)
        that.setData({
          videoSrc:res.tempFilePath
        })
        //将文件上传到文件服务器
        api.uploadVideo(res.tempFilePath).then(result=>{
          if(result.code == 200){
            that.setData({
              filePath:result.data.path
            })
          }else{
            console.log(result.msg)
          }
        })
      },
      fail(res){
        console.log(res)
      }
    })
  }

})