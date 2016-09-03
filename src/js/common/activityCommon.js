var parameters = require('./parameters'),
    plugin = require('./plugin'),
    layerControl = require('./layerControl'),
//promodownlayer = require('./promodownlayer'),
    unital = require('./unital');

var activityCommon = {};

unital.isIphAnd();


activityCommon = {
    //设置banner图片路径 区分web与pc
    setBannerPath: function (h5ImgPic, pcImgPic) {

        if (unital.isPC()) {
            $('.banner-div img').attr('src', pcImgPic);
        } else {
            $('.banner-div img').attr('src', h5ImgPic);
        }
    },
    //过期提醒
    activityExpired: function (outDatePrompt) {
        var nowdate = new Date().getTime();
        var deadline = parameters.activityExpired.deadlineDate;
        var link = parameters.activityExpired.expiredLink;
        var dom = '<div class="hadgone hide"><div class="toptips"><p>活动过期<i></i></p></div><div class="content"><div class="imgback"></div><p>' + outDatePrompt + '</p><div class="gonebtn">查看更多优惠</div></div></div>'

        var reg = new RegExp(/(http)|(https)\:\/\/(\w+\.)+(com|cn)/);
        if (!reg.test(link)) {
            plugin.alert('正则写入不规则，请重新设置');
            return;
        }
        if (deadline < nowdate) {   // 活动结束times  <  当前时间    活动结束
            $('body').append(dom);
            $('body').addClass('fixed');
            layerControl.show();
            $('.hadgone').removeClass('hide').addClass('show');

        }
        if ($('.hadgone').hasClass('show')) {
            $('.hadgone .toptips i, .hadgone .gonebtn').off('click').on('click', function () {
                window.location.href = link;
            });

        }


    },
    //免责声明
    disclaimers: function () {
        var isIOS = $('html').hasClass('ios');
        var isIpad = $('html').hasClass('ipad');
        var isIpod = $('html').hasClass('ipod');

        if (isIOS || isIpad || isIpod) {
            $(".explain_other").show();
        } else {
            $(".explain_other").hide();
        }
    },
    /*//促下载浮层
     promodownlayer: function (isShow) {
     promodownlayer.init(isShow);
     },*/
//活动说明(H5图标入口带开关--explainEnter)
    explainActive: function (onoff, activityRule, actiruleimg) {
        var text = $.trim(activityRule);
        var explaint = $('.explaintext');
        var getinDom = '<div class="getin hide"><img src="' + actiruleimg + '"></div>';
        var wh = parseInt($(window).height() * 0.38);


        // .excontent
        $('.extext').html(text);
        $('.extext').css({'max-height': wh + 'px'});
        if (!unital.isPC() && onoff) {
            $('body').append(getinDom);

            var getin = $('.getin');
            if (getin) {
                getin.off('click').on('click', function (e) {
                    if (explaint.hasClass('hide')) {
                        $('body').css({'overflow': 'hidden'});
                        explaint.removeClass('hide').addClass('show');
                        getin.removeClass('hide').addClass('show');

                    }
                });
                $(".colsepng").off('click').on('click', function () {
                    if (explaint.hasClass('show')) {
                        $('body').css({'overflow': 'auto'});
                        explaint.removeClass('show').addClass('hide');
                        getin.removeClass('show').addClass('hide');

                    }
                });
            }
        }
        else if (unital.isPC() && onoff) {
            $('.titles').text('活动说明')
            $(".explaintext").removeClass("hide");
        } else {
            $(".explaintext").remove();
            return false;
        }
    }
};

module.exports = activityCommon





	
