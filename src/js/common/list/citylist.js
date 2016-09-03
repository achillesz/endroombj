
var $ = require('../../../../lib/jquery'),
    util = require('../util'),
    parameters = require('../parameters'),
    plugin = require('../plugin'),
    lazyLoad = require('../lazyLoad'),
    mustachecitylista = require('./mustache/citylista.mustache'),
    mustachecitylistitema = require('./mustache/citylistitema.mustache'),
    mustachecitylistb = require('./mustache/citylistb.mustache'),
    mustachecitylistitemb = require('./mustache/citylistitemb.mustache'),
    mustachecitylistc = require('./mustache/citylistc.mustache'),
    mustachecitylistitemc = require('./mustache/citylistitemc.mustache'),
    mustachecitybanner = require('./mustache/citybanner.mustache');


var throttle = function (func, delay, mustRunDelay) {
    var startTime = null,
        timer = null;
    return function () {
        var context = this,
            args = arguments,
            currentTime;
        clearTimeout(timer);
        if (!startTime) {
            startTime = Date.now();
        }
        currentTime = Date.now();
        if (currentTime - startTime >= 100) {
            func.apply(context, args);
            startTime = null;
            clearTimeout(timer);
        } else {
            timer = setTimeout(function () {
                func.apply(context, args);
                startTime = null;
                clearTimeout(timer);
            }, delay);
        }
    }
};


//城市列表
var cityList = {
    labelType: {
        ZHEKOU: 'zhekou',
        ZENGSONG: 'zengsong',
        ZHIJIANG: 'zhijiang'
    },
    //TEMPLATE :htmlstr,
    //TEMPLATE: '<li class="s-product"><a class="h5-link pc-link" href="${list-link}" title="${list-title}"><div class="pic"><img src-set="${list-img}"><div class="mark-discount"><p class="discount">XX折</p></div><div class="mark-give"><p class="give">赠送</p><span class="give-content">法式早餐</span></div><div class="mark-distance"><p class="distance">距考点</p><span class="distance-content">15.3公里</span></div>${full-house}</div><div class="information"><h1>${list-title-info}</h1><div class="inf-left"><div class="inf-icon"><span class="icon"></span><span class="address">${list-address}</span></div></div><div class="inf-right"><span class="qi">起</span><span class="price">${list-price}</span><span class="rmb">￥</span></div></div></a></li>',
    listMain: $('#list-container'),
    ajaxState: false, //屏幕滚动当前是否数据还有更多
    pageIndex: 1,
    count: 0, //请求酒店列表总数
    isLoadFailed: false, //是否请求失败 false 未失败 true 失败
    isLoadEnd: true, //是否可以继续请求
    controlDOM: false, //加载方式，false清空刷新加载，true增加加载
    init: function () {
        cityList.getCityList();
        if (util.getHash('promDataSourceId')) {
            parameters.cityList.promDataSourceId = util.getHash('promDataSourceId');
            if (unital.isPC()) {
                parameters.cityList.pageNo = util.getHash('pageIndex') ? util.getHash('pageIndex') : 1;
            }
            parameters.cityList.promCityDataId = util.getHash('promCityDataId');
        }

       

        if (!unital.isPC()) {

            $(document).off('scroll', this.ajaxmore).on('scroll', throttle($.proxy(this.ajaxmore, this), 200, 150));

            $(".list-div .nomore p").off('click').on('click', function () {

                if (cityList.ajaxState && $(this).html() !== "没有更多酒店了") {
                    cityList.controlDOM = true;
                    cityList.pageIndex = parseInt(cityList.pageIndex);

                    if (!cityList.isLoadFailed) {
                        cityList.pageIndex = cityList.pageIndex + 1;
                    }

                    cityList.getCityList();
                }
            });
        } else {
            //pc 翻页
            $(document).off('scroll', this.backToTop).on('scroll', this.backToTop);

            $('.page-container .turn-page').off('click').on('click', function () {
                var pageNo = parseInt($('.turn-page-index').val());
                cityList.pageIndex = parseInt(cityList.pageIndex);
                if (isNaN(pageNo)) {
                    plugin.alert('请填写页码数字。');
                    return;
                }
                if (pageNo <= 0) {
                    plugin.alert('请填写大于0的数字。');
                    return;
                }
                if (pageNo > cityList.count) {
                    plugin.alert('填写页码超过总页数，请重新填写！');
                    return;
                }

                cityList.pageIndex = pageNo;

                if (cityList.pageIndex > 0 && cityList.pageIndex <= cityList.count) {
                    cityList.controlDOM = false;
                    cityList.getCityList();

                    var scrollHeight = $('.top-banner').height() - 85;
                    $('.page-content').scrollTop(scrollHeight);
                    $(document).scrollTop(scrollHeight);
                }
            });
            $(".page-container .page-prev").off('click').on('click', function (e) {
                var _thisBtn = $(this);
                var _btns = $(".page-container .page-cur");

                cityList.pageIndex = parseInt(cityList.pageIndex);

                if (_thisBtn.hasClass('hide') || cityList.pageIndex < 1) return;

                if (!cityList.isLoadFailed) {
                    cityList.pageIndex = cityList.pageIndex - 1;
                }

                if (cityList.pageIndex > 0 && cityList.pageIndex <= cityList.count) {
                    cityList.controlDOM = false;
                    cityList.getCityList();
                    _thisBtn.attr('data-index', cityList.pageIndex);
                    var scrollHeight = $('.top-banner').height() - 85;

                    $('.page-content').scrollTop(scrollHeight);
                    $(document).scrollTop(scrollHeight);
                }

                e.preventDefault();
            });

            $(".page-container .page-cur").off('click').on('click', function (e) {
                var _thisBtn = $(this);
                if (_thisBtn.hasClass('hide')) return;
                cityList.pageIndex = parseInt(cityList.pageIndex);
                _thisBtn.siblings().removeClass('on');
                _thisBtn.each(function (i) {
                    cityList.pageIndex = parseInt(_thisBtn.text());

                    if (cityList.pageIndex <= cityList.count) {
                        cityList.controlDOM = false;
                        cityList.getCityList();
                        var scrollHeight = $('.top-banner').height() - 85;
                        $('.page-content').scrollTop(scrollHeight);
                        $(document).scrollTop(scrollHeight);
                    }

                });

                if (cityList.pageIndex <= cityList.count) {
                    _thisBtn.addClass('on');
                }

                e.preventDefault();

            });

            $(".page-container .page-next").off('click').on('click', function (e) {
                var _thisBtn = $(this);
                cityList.pageIndex = parseInt(cityList.pageIndex);
                if (_thisBtn.hasClass('hide')) return;

                if (!cityList.isLoadFailed) {
                    cityList.pageIndex = cityList.pageIndex + 1;
                }

                if (cityList.pageIndex <= cityList.count) {
                    var scrollHeight = $('.top-banner').height() - 85;
                    $('.page-content').scrollTop(scrollHeight);
                    $(document).scrollTop(scrollHeight);
                    var _btns = $(".page-container .page-cur");
                    _btns.siblings().removeClass('on');

                    cityList.controlDOM = false;
                    cityList.getCityList();
                    _thisBtn.attr('data-index', cityList.pageIndex);

                }

                e.preventDefault();
            });
        }

    },
    urlHandle: function (type) {

        var nowUrlChange = [];
        $.each(type, function (name, value) {
            var url = encodeURIComponent(value);
            if (url == "null") {
                delete type[name];
            } else {
                nowUrlChange.push({name: name, value: value});
            }
        });

        util.setHash(nowUrlChange);//修改URL参数
        unital.getUrlRef();

    },
    preFormData: function(arr) {
        var data = {lists: []};

        if (arr.length === 0) return data;

        this.bannerOperation(arr[0]); 

        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            data.lists.push(this.preFormDataItem(item));
        }

        return data;
    },
    channelLink: function (detailUrl) { 
        var urlParam = unital.type;

        if(urlParam && urlParam.ref && urlParam.ref.length > 0 && urlParam.ref.toLowerCase()=="wxqbh5") {
            detailUrl = detailUrl.replace('/hotel/cityname/','/hotelwxqb/').replace('m.elong.com','x.elong.com');
            return detailUrl;
        }

        if(urlParam && urlParam.ref && urlParam.ref.length > 0 && urlParam.ref.toLowerCase()=="zdwshwh5") {
            detailUrl = detailUrl.replace('/hotel/cityname/','/hotelfx/');
            return detailUrl;
        }

        return detailUrl;

    },
    bannerOperation: function(item) { // banner 运营位
        var bannerdata = {};
        var bannerOnOff;
        if(!item.extend7 || unital.isPC()){
             bannerOnOff = false;
        } else {
           
            bannerOnOff = true;
            bannerdata.promotionCityPic = item.extend7;  // banner 位
          
            bannerdata.promotionCityLink = item.extend8 || 'void:javascript(0)'; // 跳转链接 
        }

        bannerdata.onOff = bannerOnOff;
        if (cityList.listMain.siblings('.bannerOperation')) {

            cityList.listMain.siblings('.bannerOperation').remove().end().before($(mustachecitybanner(bannerdata)));
        } else {
            
             cityList.listMain.before($(mustachecitybanner(bannerdata)));
        }
       

    },
    preFormDataItem: function(item) {
        var data = {
                    'listLink' : cityList.getLink(item),
                    'listTitle' : item.hotelName,
                    'listImg' : item.hotelImageUrl,
                    'listTitleInfo' : item.hotelName,
                    'listAddress' : item.hotelAddress,
                    'listPrice' : (item.price).toFixed(0),
                    'labelText' : item.extend1 || '',  //  模版2 的yang shi
                    'purchaseprice' : item.extend2,  //  原价
                    'promotionLabelTextColor' : cityList.promotionLabelTextColor,
                    'promotionLabelBgColor' : cityList.promotionLabelBgColor,
                    'promotionRated' : item.extend3,  // 评价
                    'promotionMark' : item.extend4, // 评分
                    'promotionRecommend' : item.extend5,// 推荐语
                    'promotionhotelCommerical' : item.extend9 || item.hotelCommerical || item.hotelAddress// 自定义9 》 商圈 》 详细地址
                  

        };
        var fullHose = '';
        var priceFlag;
        var priceHide;
        if ((item.price).toFixed(0) == 0) {
            fullHose = '<div class="huicover"><span>已满房</span></div>';
        } else {
            fullHose = '';
        }

        if (!item.extend2 || (item.extend2 * 1 <= (item.price).toFixed(0))) {  // 原价 <＝现价
            priceFlag = true;
        } else {
            priceFlag = false;
        }

        data.purchasepriceHide = priceFlag;               // 跳转链接
        data.fullHose = fullHose;

       // data.activityentity = cityList.activityentity;  // 模版(1，2，3)，
        //console.log(data.activityentity)
        //  data.promotionLabel = cityList.promotionLabel; // 标签类型  'zhekou' zengsong
        if (data.labelText && cityList.promotionLabel) {
            data[cityList.promotionLabel] = true;
            
        }

        return data;
    },
    renderTemplate: function (arr) {
        var data = this.preFormData(arr);
        if (cityList.activityentity == '1') {  // 模版1
            if (!cityList.controlDOM) {
                cityList.listMain.find('>ul').remove().end().prepend($(mustachecitylista(data)).html(mustachecitylistitema(data)));
            } else {
                cityList.listMain.find('>ul').append(mustachecitylistitema(data));
            }


        } else if(cityList.activityentity == '2') {  // 模版2
            if (!cityList.controlDOM) {
                cityList.listMain.find('>ul').remove().end().prepend($(mustachecitylistb(data)).html(mustachecitylistitemb(data)));
            } else {
                cityList.listMain.find('>ul').append(mustachecitylistitemb(data));
            }
        } else if(cityList.activityentity == '3') {  // 模版3
            if (!cityList.controlDOM) {
                cityList.listMain.find('>ul').remove().end().prepend($(mustachecitylistc(data)).html(mustachecitylistitemc(data)));
            } else {
                cityList.listMain.find('>ul').append(mustachecitylistitemc(data));
            }
        }
       

        lazyLoad.handleLazy();
    },
    bindScrollLoad: function () {
        $(document).unlisten('scroll', this.handleAjaxMore, this);

        $(document).listen('scroll', this.handleAjaxMore, this);
    },
    getCityList: function () {
        cityList.ajaxState = false;
        cityList.pageIndex = parseInt(cityList.pageIndex);

        if (cityList.pageIndex !== 1 && cityList.count !== 0 && (cityList.pageIndex > cityList.count)) return;

        if (cityList.pageIndex === 1 && !unital.isPC()) {
            $(".list-div .nomore p").addClass("moretext");
            plugin.startLoading();

            this.bindScrollLoad();

         //   $(document).off('scroll', this.ajaxmore).on('scroll', throttle(this.ajaxmore, 200, 150));


        } else if (unital.isPC()) {
            plugin.startLoading();
            $('.turn-page-index').val('');
        }

        parameters.cityList.pageNo = cityList.pageIndex;

        $.ajax({
            timeout: 10000,
            url: 'http://mp.elong.com/mobilepromotion/getsalespromotionlistjsonpcontroler/getsalespromotionlist/',
            data: {
                'callback': 'hotelListCallBack',
                'promCityDataId': parameters.cityList.promCityDataId,
                'promDataSourceId': parameters.cityList.promDataSourceId,
                'pageNo': parameters.cityList.pageNo,
                'pageSize': parameters.cityList.pageSize, //酒店产品列表展示个数
                'pageType': parameters.cityList.pageType, //pc 0, h5 1
                'channelId': parameters.cityList.channelId //ref值
            },
            type: 'GET',
            dataType: 'jsonp',
            jsonp: 'hotelListCallBack'
        });


    },
    handleAjaxMore: function () {
        throttle(this.ajaxmore, 200, 150)
    },
    checkDate: function (n) {
        var today = new Date().getTime();
        var day = '';
        if (n <= 0) {
            day = today;
        } else {
            day = today + n * 24 * 60 * 60 * 1000;
        }

        var checkDate = new Date(day);
        var year = checkDate.getFullYear();
        var month = checkDate.getMonth() + 1;
        var date = checkDate.getDate();
        if (month <= 9) {
            month = "0" + month;
        }
        if (date <= 9) {
            date = "0" + date;
        }

        if (!unital.isPC()) {
            return year + "-" + month + "-" + date;
        } else {
            return year + "/" + month + "/" + date;
        }
    },
    getLink: function (city) {
        var detailUrl = '';
        var urlParam = unital.type;

        if (!unital.isPC()) {
            detailUrl += 'http://m.elong.com/hotel/cityname/' + city.hotelId + '/';
            if (city.inDate || city.outDate) {
                //app=hoteldetail 是在APP环境内跳转链接至APP内的页，不是H5的页面
                detailUrl += '?checkindate=' + this.checkDate(city.inDate) + '&checkoutdate=' + this.checkDate(city.outDate) + '&app=hoteldetail';
            }
        } else {
            detailUrl += city.hotelUrl;
        }
        if (urlParam && urlParam.ref && urlParam.ref.length > 0) {
            if (!unital.isPC()) {
                detailUrl += '&ref=' + urlParam.ref;
            } else {
                detailUrl += '&fparam=' + urlParam.ref;
            }
        }
        if (urlParam && urlParam.ifs && urlParam.ifs.length > 0) {
            detailUrl += '&if=' + urlParam.ifs;
        }

        if (urlParam && urlParam.of && urlParam.of.length > 0) {
            detailUrl += '&of=' + urlParam.of;
        }

        if (urlParam && urlParam.ch && urlParam.ch.length > 0) {
            detailUrl += '&ch=' + urlParam.ch;
        }

        if (urlParam && urlParam.chids && urlParam.chids.length > 0) {
            detailUrl += '&chid=' + urlParam.chids;
        }
       return cityList.channelLink(detailUrl);
    },
    ajaxmore: function (e) {
        var scrollHeight = $("body").height();
        var contentHeight = document.body.scrollTop;
        var screenHeight = window.screen.availHeight;
        cityList.pageIndex = parseInt(cityList.pageIndex);

        if ((contentHeight + screenHeight + 200 >= scrollHeight) && cityList.ajaxState && $(".moretext").html() !== "没有更多酒店了") {
            cityList.controlDOM = true;
            cityList.pageIndex = cityList.pageIndex + 1;
            cityList.getCityList();
        }

        cityList.backToTop();

        e.stopPropagation();
        e.preventDefault();
    },
    backToTop: function () {
        var $this = $('.page-content');
        var androidTop = window.scrollY;
        var view = window.innerHeight;//可见高度
        var iosTop = $this.scrollTop();//滚动高度

        if (iosTop > view * 2 || androidTop > view * 2 ||
            document.documentElement.scrollTop !== 0 ||
            document.documentElement.scrollTop + document.body.scrollTop > 100) {
            $(".list-top").show();
            $('.icon-top').removeClass('listTopCur');
        } else {
            $(".list-top").hide();
            $('.icon-top').removeClass('listTopCur');
        }
    }

};

window.hotelListCallBack = function (data) {
    if (!unital.isPC()) {
        $(".list-div .nomore").show();
    }
    $(".page-fallload").removeClass('show').addClass('hide');
    if (data.IsError) {
        cityList.isLoadFailed = true;
        cityList.ajaxState = true;
        cityList.count = 0;
        $('.page-container').hide();
        plugin.alert('访问人数有点多～稍后再试下吧！');
    } else if (data.value && data.value.length > 0) {
        cityList.count = Math.ceil(data.count / parameters.cityList.pageSize);
        if ((cityList.pageIndex * parameters.cityList.pageSize == data.count) || (data.value.length < parameters.cityList.pageSize)) {
            cityList.isLoadEnd = false;
            $(".list-div .nomore p").removeClass("moretext");
            $(".list-div .nomore p").html("没有更多酒店了");

        } else {
            $(".list-div .nomore p").html("点击加载更多酒店");
            $(".list-div .nomore p").addClass("moretext");

        }

        cityList.renderTemplate(data.value);

        cityList.ajaxState = true;

        if (unital.isPC()) {
            if (cityList.count == 0) {
                $('.page-container').hide();
            } else {
                $('.page-container').show();
                cityList.pageIndex = parseInt(cityList.pageIndex);
                if (cityList.pageIndex == 1) {
                    $('.page-prev').removeClass('hide').addClass('hide');
                } else {
                    $('.page-prev').removeClass('hide');
                }

                if (cityList.count <= cityList.pageIndex) {
                    $('.page-next').removeClass('hide').addClass('hide');
                } else {
                    $('.page-next').removeClass('hide');
                }

                var _btns = $('.page-cur');

                var prevMax = parseInt($('.page-cur').eq(7).text());
                var prevMin = parseInt($('.page-cur').eq(0).text());

                _btns.removeClass('on');

                _btns.each(function (i) {

                    var index = 1; //默认是1~8
                    var rewrite = false;
                    var dataIndexPre = parseInt(_btns.eq(i).attr('data-index'));

                    if (cityList.pageIndex > 8) {
                        if (cityList.pageIndex > prevMax) {
                            index = cityList.pageIndex + i;
                            rewrite = true;
                        } else if (cityList.pageIndex < prevMin) {
                            index = cityList.pageIndex + i - 7;
                            rewrite = true;
                        }
                    } else {
                        index = i + 1;
                        rewrite = true;
                    }

                    if (rewrite) {
                        _btns.eq(i).attr('title', '第' + index + '页')
                            .attr('data-index', index)
                            .text(index);
                    }

                    var dataIndexNow = parseInt(_btns.eq(i).attr('data-index'));
                    if (dataIndexNow > cityList.count) {
                        _btns.eq(i).removeClass('show').addClass('hide');
                    } else {
                        _btns.eq(i).removeClass('hide');
                    }

                    if (cityList.pageIndex == dataIndexNow) {
                        _btns.eq(i).addClass('on');
                    }
                });

                if (cityList.count <= 8) {
                    $('.page-more').addClass('page-hide');
                    $('.page-maxcount').addClass('page-hide');
                } else if (cityList.count > 8 && cityList.count == cityList.pageIndex) {
                    $('.page-more').addClass('page-hide');
                } else {
                    $('.page-more').removeClass('page-hide');
                    $('.page-maxcount').removeClass('page-hide')
                        .attr('data-index', cityList.count);
                    $('.page-maxcount em').text(cityList.count);
                }

            }

        }

    } else if (data.value && data.value.length <= 0) {
        //提示没数据 用图
        if (!unital.isPC()) {
            $(".list-div .nomore").hide();
        }
        $(".page-fallload").removeClass('hide').addClass('show');
        $('.page-container').hide();
    } else {
        cityList.isLoadFailed = true;
        cityList.count = 0;
        cityList.ajaxState = true;
        $('.page-container').hide();
        plugin.alert('访问人数有点多～稍后再试下吧！');
    }

    cityList.urlHandle({
        'promDataSourceId': parameters.cityList.promDataSourceId,
        'pageIndex': parameters.cityList.pageNo,
        'promCityDataId': parameters.cityList.promCityDataId
    });


    //阻止其他alert弹出时，蒙层会被关闭
    if (cityList.pageIndex === 1 && !unital.isPC()) {
        plugin.stopLoading();
    } else if (unital.isPC()) {
        plugin.stopLoading();
    }
}

module.exports = cityList;



