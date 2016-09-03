var unital = require('./unital'),
    PlatForm = require('./platform'),
    parameters = require('./parameters');

//促下载浮层 isShow  true  展示 false 不展示
var refs = window.unital.getUrlRef();
var promodownlayer = {
    init: function (isShow) {
        //pc不需要展示促下载
        var dref = refs.dref;
        var ref = refs.ref;

        if (unital.isPC() || !isShow || (sessionStorage.getItem('proDownloadShowed-' + unital.getUrlRef().activityName) === '1')) return;

        //屏蔽渠道号
        if (parameters.shieldChannel && parameters.shieldChannel.length > 0) {
            for (var i = 0; i < parameters.shieldChannel.length; i++) {
                if (ref !== null && ref.toLowerCase() == parameters.shieldChannel[i]) return;
            }
        }

        $('.downloadBar').show();
        $('.downloadBar .dlb-icon').off('click').on('click', function (e) {
            $('.downloadBar').hide();
            sessionStorage.setItem('proDownloadShowed-' + unital.getUrlRef().activityName, 1);
            e.preventDefault();
        });
    },
    bindDownClose: function () {
        $('.dlb-icon', dom).on('click', function () {
            $(".downloadBar").hide();
        })
    }
}

module.exports = promodownlayer

