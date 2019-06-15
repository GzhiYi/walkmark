let _animation // 动画实体
let _animationIndex = 0 // 动画执行次数index（当前执行了多少次）
let _animationIntervalId = -1 // 动画定时任务id，通过setInterval来达到无限旋转，记录id，用于结束定时任务
const _ANIMATION_TIME = 1500 // 动画播放一次的时长ms

Component({
  options: {
    multipleSlots: true
  },
  properties: {
    backgroundColor: {
      type: String,
      value: 'rgba(0,0,0,0)'
    },
    showIcons: {
      type: Array
    }
  },
  data: {
    anination: '',
    showLoadingIcon: false,
    showBackIcon: false,
    showHomeIcons: false
  },
  ready() {
    let {
      statusBarHeight,
      navBarHeight
    } = getApp().globalData
    const { showIcons } = this.data
    this.setData({
      statusBarHeight,
      navBarHeight,
      showBackIcon: showIcons.includes('back'),
      showHomeIcons: showIcons.includes('home')
    })
  },
  attached() {
    _animation = wx.createAnimation({
      duration: _ANIMATION_TIME,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50% 0'
    })
  },
  methods: {
    back() {
      wx.navigateBack({
        delta: 1
      })
    },
    rotateAni: function (n) {
      _animation.rotate(-360 * (n)).step()
      this.setData({
        animation: _animation.export()
      })
    },
    /**
   * 开始旋转
   */
    showLoading: function () {
      var that = this;
      this.setData({
        showLoadingIcon: true
      })
      that.rotateAni(++_animationIndex); // 进行一次旋转
      _animationIntervalId = setInterval(function () {
        that.rotateAni(++_animationIndex);
      }, _ANIMATION_TIME); // 每间隔_ANIMATION_TIME进行一次旋转
    },

    /**
     * 停止旋转
     */
    hideLoading: function () {
      this.setData({
        showLoadingIcon: false
      })
      if (_animationIntervalId > 0) {
        clearInterval(_animationIntervalId);
        _animationIntervalId = 0;
      }
    },
  }
})