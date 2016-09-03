var parameters = require('./parameters'),
    wx = require("../../../lib/jweixin-1.1.0");

function Weixin() {
    this.init();
}

Weixin.prototype.init = function () {
    this.getDynamicConfig()
    
};

Weixin.prototype.getDynamicConfig = function () {
    $.ajax({
        type: 'get',/*http://mhuodong.elong.com/PromotionJson/GetWXJsConfigEx*/
        url: 'http://mp.elong.com/mobilepromotion/getwxconfig?url=' + encodeURIComponent(window.location.href),
        dataType: "jsonp",
        cache: false,
        success: this.configCallback,
        context: this
    });
};

Weixin.prototype.configCallback = function (res) {
    if (res.error === false) {
        var data = res.data;
        var config = {
            debug: false,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: ['getLocation']
        };

        var type = parameters.share.weiXinShareType ? parameters.share.weiXinShareType : 3;

        if (type === 0) {
            config.jsApiList.push('onMenuShareAppMessage');
        }
        if (type === 1) {
            config.jsApiList.push('onMenuShareTimeline');
        }
        if (type === 3) {
            config.jsApiList.push('onMenuShareAppMessage');
            config.jsApiList.push('onMenuShareTimeline');
        }

        wx.config(config);
        this.wxListener();
    }
};

Weixin.prototype.wxListener = function () {
    var _this = this;
    wx.ready(function () {
        wx.onMenuShareTimeline(_this.getShareParam(2));
        wx.onMenuShareAppMessage(_this.getShareParam(2));
        $(_this).trigger('gelocation');
    });

    wx.error(function (res) {
    });
};

Weixin.prototype.getShareParam = function (p) {
    var shareParam = {
        type: 3, //如果规则 没有获取到，则默认分享方式为3 （即 支持 好友和朋友圈）
        imgUrl: parameters.share.shareImgSrc.length > 0 ? parameters.share.shareImgSrc : 'http://m.elong.com',
        link: parameters.share.shareLink.length > 0 ? parameters.share.shareLink : 'http://m.elong.com',
        desc: parameters.share.shareDesc.length > 0 ? parameters.share.shareDesc : '订酒店，艺龙旅行网',
        title: parameters.share.shareText.length > 0 ? parameters.share.shareText : '艺龙旅行网',
        imgWidth: "110",
        imgWeight: "110",
        shortLink: parameters.share.shortLink ? parameters.share.shortLink : 'http://m.elong.ccom/',
        success: function () {
            if (typeof(shareCallBack) == "function") shareCallBack();
        },
        cancel: function () {
        }
    };

    if (p == 1) {
        shareParam.title = shareParam.desc;
    }
    return shareParam;
};

module.exports = Weixin;








