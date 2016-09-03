var Platform = require('../../common/platform'),
    WeiXin = require('../../common/weixin'),
    AppShare = require('../../common/appshare'),
    geoLocation = require('./gelocation'),
    parameters = require('../../common/parameters'),
    promodownlayer = require('../../common/promodownlayer'),
    ListController = require('./list/index'),
    explain = require('./explain'),
    Analysis = require('./../../common/analysis');


function Page() {
    this.init();
}

Page.prototype.init = function () {
   // window.scrollTo(0,0);

    this.content = $('body');
    this.initPlatForm();
    this.context = window.context;

    this.afternoon = this.context.afternoon;
    if(this.afternoon) {
        $('#shoppingDescription').hide();
    } else {
        // 还没到点
        $('#shoppingDescription').show();// 到点前展示
        $('#filterDistPrice').hide(); // 尾房有数据展示
        $('#noEndRoom').hide(); // 到点 请求不到数据展示
        $('#distanceNotice').show();
    }

    //初始化活动说明
    explain.init({
        ele: '.rule-explain',
        elebtn: '.the_rule',
        close: '.know'
    });

    // 初始化微信
    if(this.platForm.isWeiXin()) {
        this.weiXin = new WeiXin;
    }

    this.initList();

    this.bindEvents();
    // 初始化定位
    this.initGeoLocation();

    this.initAnalysis();
    // 刷新页面回顶部
  //   this.scrollTop();

};

Page.prototype.initAnalysis = function () {
    this.analysis = new Analysis();
    this.analysis.init();
};

Page.prototype.initList = function () {
    this.listController = new ListController();
    this.listController.init();

};

Page.prototype.initPlatForm = function () {
    $(window).on('Apploaded', $.proxy(this.handleIsApp, this));
    this.platForm = new Platform;
   // this.platForm.configAppOkCallBack($.proxy(this.handleIsApp, this));
};

// 初始化APP
Page.prototype.handleIsApp = function (e, status) {
    if(status) {
        this.appShare = new AppShare();
    } else {
        promodownlayer.init(true);  // 非app 下展示促下载浮层
    }
};

Page.prototype.initGeoLocation = function () {
    if(this.platForm.isWeiXin()) {
        $(this.weiXin).on('gelocation', $.proxy(this.handleWeiXinGeoloation, this));

        // 3S微信没有READY 走默认定位(微信READY之后其功能才可以用)
        var proxyHandleWeiXinTimeOut = $.proxy(this.handleWeiXinTimeOut, this);
        setTimeout(proxyHandleWeiXinTimeOut, 3000);

    } else {
        geoLocation.init(); //是否需要开启周边功能 true开启 false关闭
    }
};

Page.prototype.handleWeiXinTimeOut = function () {
   if(!this.weiXinGelocationStarted) {
       $(this.weiXin).off( 'gelocation', this.handleWeiXinGeoloation, this);

       geoLocation.init();
   }
};

Page.prototype.handleWeiXinGeoloation = function (e) {
    this.weiXinGelocationStarted = true;
    geoLocation.isWenXin = true;
    geoLocation.init();
};

Page.prototype.scrollTop = function () {
    //首屏刷新回到首页 需要测试小米2机型
  /*  $(document).scrollTop(0);
    document.documentElement.scrollTop = 0;*/
   // window.scrollTo(0,0);

};

Page.prototype.bindEvents = function () {

    $(geoLocation).on('complete', $.proxy(this.handleGeoLocationSuccess, this));

/*    $('.list-top').off('click').on("click", function () {
        $('.icon-top').addClass('listTopCur');
        $('.page-content').scrollTop(0);
        $('body').scrollTop(0);
        //兼容IE
        document.documentElement.scrollTop = 0;
    });*/
};

Page.prototype.handleGeoLocationSuccess = function (e, lat,lng) {
    this.listController.noPoint = false;

    if(!lat || !lng) {
        this.listController.handleNoPoint();
    }

    this.listController.resetView();

    this.listController.setParam({
        startlat:  lat,
        startlng: lng
    });

    this.listController.getData();
};

new Page();

