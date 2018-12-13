// pages/mine/mine.js
const app = getApp()

Page({
  data: {
    faceUrl: "../resource/images/noneface.png",
  },
  onLoad: function(params) {
    var me = this;

    var user = app.userInfo;
    // fixme 修改原有的全局对象为本地缓存
    //var user = app.getGlobalUserInfo();
    var userId = user.id;

    var publisherId = params.publisherId;
    if (publisherId != null && publisherId != '' && publisherId != undefined) {
      userId = publisherId;
      me.setData({
        isMe: false,
        publisherId: publisherId,
        serverUrl: app.severUrl
      })
    }
    me.setData({
      userId: userId
    })


    wx.showLoading({
      title: '请等待...',
    });
    var serverUrl = app.severUrl;
    // 调用后端
    wx.request({
      url: serverUrl + '/user/query?userId=' + userId + "&fanId=" + user.id,
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
        'headerUserId': user.id,
        'headerUserToken': user.userToken
      },
      success: function (res) {
        console.log(res.data);
        wx.hideLoading();
        if (res.data.status == 200) {
          var userInfo = res.data.data;
          var faceUrl = "../resource/images/noneface.png";
          console.log(userInfo.faceimage)
          if (userInfo.faceimage != null && userInfo.faceimage != '' && userInfo.faceimage != undefined) {
            faceUrl = serverUrl + userInfo.faceimage;
          }
          
          console.log(serverUrl)
          console.log(faceUrl)
          me.setData({
            faceUrl: faceUrl,
            fansCounts: userInfo.followercount,
            followCounts: userInfo.followcount,
            receiveLikeCounts: userInfo.receivelikecount,
            nickname: userInfo.nickname,
            isFollow: true
          });
        } else if (res.data.status == 502) {
          wx.showToast({
            title: res.data.msg,
            duration: 3000,
            icon: "none",
            success: function () {
              wx.redirectTo({
                url: '../userLogin/login',
              })
            }
          })
        }
      }
    })

    //me.getMyVideoList(1);
  },
  logout: function () {
    var user = app.userInfo;
    //var user = app.getGlobalUserInfo();

    var serverUrl = app.severUrl;
    wx.showLoading({
      title: '请等待...',
    });
    // 调用后端
    wx.request({
      url: serverUrl + '/logout?userId=' + user.id,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        wx.hideLoading();
        if (res.data.status == 200) {
          // 登录成功跳转 
          wx.showToast({
            title: '注销成功',
            icon: 'success',
            duration: 2000
          });
          app.userInfo = null;
          // 注销以后，清空缓存
          wx.removeStorageSync("userInfo")
          // 页面跳转
          wx.redirectTo({
            url: '../userLogin/login',
          })
        }
      }
    })
  },
  changeFace: function () {
    console.log("face")
    var me = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        wx.showLoading({
          title: '上传中...',
        })
        var serverUrl = app.severUrl;
        // fixme 修改原有的全局对象为本地缓存
        var userInfo = app.userInfo;

        wx.uploadFile({
          url: serverUrl + '/user/uploadFace?userId=' + userInfo.id,  //app.userInfo.id,
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'content-type': 'application/json', // 默认值
            'headerUserId': userInfo.id,
            'headerUserToken': userInfo.userToken
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            console.log(data);
            wx.hideLoading();
            if (data.status == 200) {
              wx.showToast({
                title: '上传成功!~~',
                icon: "success"
              });

              var imageUrl = data.data;
              me.setData({
                faceUrl: serverUrl + imageUrl
              });

            } else if (data.status == 500) {
              wx.showToast({
                title: data.msg
              });
            } else if (res.data.status == 502) {
              wx.showToast({
                title: res.data.msg,
                duration: 2000,
                icon: "none",
                success: function () {
                  wx.redirectTo({
                    url: '../userLogin/login',
                  })
                }
              });

            }
          }
        })
      }
    })
  },

  uploadVideo: function () {
    // fixme 视频上传复用
    // videoUtil.uploadVideo();
    // 以下是原来的代码，不删除，便于参照
    var me = this;

    wx.chooseVideo({
      sourceType: ['album'],
      success: function (res) {
        console.log(res);

        var duration = res.duration;
        var tmpHeight = res.height;
        var tmpWidth = res.width;
        var tmpVideoUrl = res.tempFilePath;
        var tmpCoverUrl = res.thumbTempFilePath;

        if (duration > 11) {
          wx.showToast({
            title: '视频长度不能超过10秒...',
            icon: "none",
            duration: 2500
          })
        } else if (duration < 1) {
          wx.showToast({
            title: '视频长度太短，请上传超过1秒的视频...',
            icon: "none",
            duration: 2500
          })
        } else {
          // 打开选择bgm的页面
          wx.navigateTo({
            url: '../chooseBgm/chooseBgm?duration=' + duration
              + "&tmpHeight=" + tmpHeight
              + "&tmpWidth=" + tmpWidth
              + "&tmpVideoUrl=" + tmpVideoUrl
              + "&tmpCoverUrl=" + tmpCoverUrl
            ,
          })
        }
      }
    })
  },


})