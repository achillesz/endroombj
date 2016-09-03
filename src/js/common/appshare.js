var parameters = require('../common/parameters');

function AppShare() {
    this.init();
}

AppShare.prototype.init = function () {
    if(!this.isAppLoaded()) {
        this.initElongApp();
    } else {
        this.bindEvents();
    }
};


AppShare.prototype.bindEvents = function () {
    // 以前是on  但不清楚这个事件是哪里触发的。
    $(document).listen("ElongAppReady", this.initElongApp, this);
};

AppShare.prototype.initElongApp = function () {
    if (typeof(ElongApp.share) != "undefined") {
        //供app按钮调用
        var _this = this;
        window.callshare = function () {
            if (typeof(shareCallBack) == "function") shareCallBack();
            ElongApp.share("myonsuccess", JSON.stringify(_this.getShareParam(2)));
        }
    }

    if (typeof(ElongApp.showBtn) != "undefined") {
        ElongApp.showBtn("myonsuccess", JSON.stringify({
            sharebtn: "1"
        }));
    }


    $(window).unload(function () {
        if (typeof(ElongApp.showBtn) != "undefined") {
            ElongApp.showBtn("myonsuccess", JSON.stringify({
                sharebtn: "0"
            }));
        }
    });
};

AppShare.prototype.isAppLoaded = function () {
    return typeof($("#shareUrl")) == "undefined";
};

AppShare.prototype.getShareParam = function (p) {
    shareParam = {
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

module.exports = AppShare;