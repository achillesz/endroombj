var $ = require('../../../../lib/jquery'),
    CitySelector = require('./citySelector'),
    CityBar = require('./citybar'),
    parameters = require('../parameters'),
    util = require('../util'),
    geoLocation = require('../../common/geoLocation'),
    cityList = require('./citylist');

function List() {

}

List.prototype.init = function (cityBarConfig, cityListConfig) {
    var citySelector = this.citySelector = new CitySelector();
    citySelector.init();

    cityList.activityentity = cityListConfig.activityentity;   //  模版样式1，2，3
    cityList.promotionLabel = cityListConfig.promotionLabel;  //   标签样式
    cityList.promotionLabelTextColor = cityListConfig.promotionLabelTextColor; // 标签字体色
    cityList.promotionLabelBgColor = cityListConfig.promotionLabelBgColor; // 标签的背景色
    this.cityBar  = new CityBar();
    this.cityBar.init(cityBarConfig);



    geoLocation.callback = $.proxy(this.handleCurrentCity, this);


    this.bindEvents();
};

List.prototype.handleCurrentCity = function (data) {
    this.cityBar.resortByCurCity(data && data.cityId);
};

List.prototype.handleLoadCitySelect = function (e, promCityDataID, cityListData) {
    parameters.cityList.promCityDataId = promCityDataID;
    cityList.init();

    //点击更多城市列表
    this.citySelector.cityList = cityListData;
    this.citySelector.renderMoreCity();
};

List.prototype.handleMoreCity = function () {
    this.citySelector.show();

   // $(document).off('scroll', this.ajaxmore);
    _this = this;
    if (unital.isPC()) {
        $('.mask-layer').off('click').on('click', function () {
            _this.citySelector.hide();
        });
    }
};


List.prototype.handlePopState = function () {
    this.citySelector.hide();
    if (!unital.isPC()) {
        cityList.bindScrollLoad();
     /*   $(document).off('scroll', ajaxmore).on('scroll', throttle(ajaxmore, 200, 150));*/
    }
};

List.prototype.handleHashChange = function (e) {
    cityList.pageIndex = parseInt(cityList.pageIndex);
    parameters.cityBar.promDataSourceId = util.getHash('promDataSourceId');
    parameters.cityList.pageNo = util.getHash('pageIndex') ? util.getHash('pageIndex') : 1;
    parameters.cityList.promDataSourceId = parameters.cityBar.promDataSourceId;

    if (cityList.pageIndex < parameters.cityList.pageNo) {
        cityList.controlDOM = true;
    } else {
        cityList.controlDOM = false;
    }

    cityList.isLoadEnd = true;
    this.cityBar.ajaxState = false;
    this.cityBar.getCityListData();
    cityList.getCityList();
};

List.prototype.bindEvents = function() {
    $.listen(this.citySelector, 'resort', this.handleResortCity, this); // 城市选择页面,选择城市之后,citybar 会更新城市
    $.listen(this.cityBar, 'update', this.handleUpdateCityList, this); // 点击某个城市 城市列表会更新
    $.listen(this.cityBar, 'load', this.handleLoadCitySelect, this); // city loaded 加载城市选择页面
    $.listen(this.cityBar, 'more', this.handleMoreCity, this); // 点击更多 展示城市选择页面



    // todo
    if (window.addEventListener) {

        $.listen(window, 'popstate', this.handlePopState, this);

/*        window.addEventListener('popstate', function () {
            _this.citySelector.hide();
            if (!unital.isPC()) {
                $(document).off('scroll', ajaxmore).on('scroll', throttle(ajaxmore, 200, 150));
            }
        });*/

        $.listen(window, 'hashchange', this.handleHashChange, this);

/*        window.addEventListener('hashchange', function () {
            cityList.pageIndex = parseInt(cityList.pageIndex);
            parameters.cityBar.promDataSourceId = util.getHash('promDataSourceId');
            parameters.cityList.pageNo = util.getHash('pageIndex') ? util.getHash('pageIndex') : 1;
            parameters.cityList.promDataSourceId = parameters.cityBar.promDataSourceId;

            if (cityList.pageIndex < parameters.cityList.pageNo) {
                cityList.controlDOM = true;
            } else {
                cityList.controlDOM = false;
            }

            cityList.isLoadEnd = true;
            _this.cityBar.ajaxState = false;
            _this.cityBar.getCityListData();
            _cityList.getCityList();
        });*/

    }
};


List.prototype.handleResortCity = function (e, cityId, promCityDataID, cityText) {
    parameters.cityList.promCityDataId = promCityDataID;
    this.cityBar.resortCity({'cityName': cityText, 'promCityDataID': promCityDataID});
};

List.prototype.handleUpdateCityList = function (e, cityid) {
    parameters.cityList.promCityDataId = cityid;

    cityList.pageIndex = 1;
    cityList.controlDOM = false;
    cityList.isLoadEnd = true;
    cityList.getCityList();
};

module.exports = List;