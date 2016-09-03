var Dialog = require('./../../common/dialog');
var wx = require("../../../../lib/jweixin-1.1.0");

function GeoLocation() {
    this.element = $('#geo');
    this.addressElement = this.element.find('.addressName');
    this.geoBtn = this.element.find('.geoBtn');
    this.isNear = true; // 不精确位置定位
    this.sourceType = 1; //默认地标等都是gps坐标
    this.targetType = 5;
    this.initGeoTxt = ''; // 默认展示的定位文本
 //   this.cacheTime = 30 * 24 * 60 * 60 * 1000;
    this.geoErrTimes = 0;
    this.alertTime = 0;
    this.defaultName = '北京';
    this.defautlCityId = '0101';
    this.isWenXin = false; // 微信平台需要更改为true
}

GeoLocation.cityNameText = {
    gelocationIng: '定位中...',
    gelocationSuccess: '获取坐标成功',
    getCityIng: '获取城市中...',
    getCitySuccess: '获取城市成功',
    getCityError: '获取城市失败'
};

GeoLocation.prototype.init = function () {
    // localStorage.removeItem("_historyDatas");
    var historyDatas = this.getHistoryDatas();

    if(historyDatas) {
        var cacheData = JSON.parse(historyDatas);

        this.cacheData = cacheData;
        this.cacheCityCn = cacheData.cityCn;
        this.cacheCityLat = cacheData.cityLat;
        this.cacheCityLng = cacheData.cityLng;
    }

    this.precision(); // 不管是否缓存都应该定位,因为移动坐标就会变

    // 点击获取详细地址
    this.geoBtn.on("click", $.proxy(this.handleReFixClick, this));
};

GeoLocation.prototype.handleReFixClick = function (e) {
    this.precision();
};

GeoLocation.prototype.setCityName = function (name) {
    this.addressElement.val(name);
};

GeoLocation.prototype.getCityName = function (name) {
    return  this.addressElement.val();
};

GeoLocation.prototype.setCityDataId = function (id) {
    this.addressElement.attr("city-id", id)
};

GeoLocation.prototype.getHistoryDatas = function () {
    return localStorage.getItem("_historyDatas")
};

GeoLocation.prototype.precision = function () {
    var _this = this;
    this.alertTime++; //每次执行方法最多显示一次错误

    this.setCityName(GeoLocation.cityNameText.gelocationIng);

    if (this.isWenXin) {
        var timeoutid = setTimeout(function () {
            _this.fallBackLocation();
        }, 3000);

        wx.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            timeout: "1000",
            success: function (res) {
                clearTimeout(timeoutid);
                _this.sourceType = 5; // 默认为1 现在改为5
                _this.getPositionSuccess({coords: res});
            },
            fail: function (res) {
                clearTimeout(timeoutid);
                _this.setCityName(_this.cityName)
                _this.fallBackLocation();
            },
            cancel: function (res) {
                clearTimeout(timeoutid);
                _this.setCityName(_this.cityName)
                _this.fallBackLocation();
            }
        });

    } else {
        this.fallBackLocation();
    }
};

GeoLocation.prototype.fallBackLocation = function () {
    var _this = this;
    if (!navigator.geolocation) {
        this.errSetCity();
        Dialog.alert("无法获取位置信息");
        return;
    }

    navigator.geolocation.getCurrentPosition(function (res) {
        _this.sourceType = 1; // 浏览器定位就是1
        _this.getPositionSuccess(res);
    }, $.proxy(this.getPositionError, this), {
        enableHighAcuracy: false, //退化逻辑
        timeout: 3000
    });
};

GeoLocation.prototype.getPositionSuccess = function (position) {
    this.alertTime && this.alertTime--;
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    
    localStorage.setItem("_lat", lat);
    localStorage.setItem("_lng", lng);

    this.lat = lat;
    this.lng = lng;

    this.ajaxCity(lat, lng);
};

GeoLocation.prototype.getPositionError = function (error) {
    if (this.alertTime <= 0) {
        return;
    }

    this.alertTime--;

    //重置文字栏
    this.setCityName(this.cacheCityCn || this.defaultName);

    this.alertError();

/*    switch (error.code) {
        case error.TIMEOUT :
            // geolocation.Fuzzy();
            Dialog.alert("定位超时，请稍后再试");
            break;
        case error.PERMISSION_DENIED:
            this.alertError();
            break;
        case error.POSITION_UNAVAILABLE :
            Dialog.alert("亲爱的火星网友，非常抱歉<br />我们暂时无法为您所在的星球提供位置服务");

        default:
            Dialog.alert('定位失败请重新定位');
            break;
    }*/
};

GeoLocation.prototype.alertError = function () {
    var authError = "手机未能成功定位，请重新定位";
/*    if ($("html").hasClass('android')) {
        authError += "请在“系统设置”中开启“位置服务”后刷新页面并重试。";
    }
    else {
        authError += "请在系统“设置>隐私”中开启浏览器“定位服务”或“设置>通用”中“还原位置与隐私”并重试。";
    }*/

    this.errSetCity();

    Dialog.alert(authError);
};

GeoLocation.prototype.ajaxCity = function (lat,lng) {
    if (this.isAjaxCitying) {//同一时间就定一次位
        return;
    }

    this.isAjaxCitying = true;

    this.setCityName(GeoLocation.cityNameText.getCityIng + ".");

    $.ajax({
        timeout: 4000,
        url: '/weifang/ajax/gethotelgeocity/',/*http://around.elong.com:8802*/
        data: {
            lat: lat,
            lng: lng,
            sourceType: this.sourceType,
            targetType: this.targetType
        },
        dataType:'json',
        context: this,
        type: "GET",
        success: this.handleResponseCitySuccess,
        error: this.handleResponseCityError,
        complete: this.handleCompleteCity
    });
};

GeoLocation.prototype.handleCompleteCity = function (e) {
    this.isAjaxCitying = false;
};
GeoLocation.prototype.handleResponseCitySuccess = function (data) {
    if (!!data.errorCode) { // 表示返回错误信息
        this.handleResponseCityError();
    } else {
        this.keyWordsChange(data, true);
    }
};

GeoLocation.prototype.handleResponseCityError = function () {
    if (this.geoErrTimes == 0) {
        this.ajaxCity(this.lat, this.lng);
        this.geoErrTimes++;
    } else {
        this.errSetCity();

        Dialog.alert("城市定位失败");
    }
};

GeoLocation.prototype.errSetCity = function () {
    var historyData = this.getHistoryDatas();

    // 有历史
    if (!!historyData) {
        var cid, ccn, clat, clng, _lat, _lng,
            cacheObj = this.readCache(historyData);
        cid = cacheObj.cityId;
        ccn = cacheObj.cityCn;

        this.setCityName(ccn || this.defaultName);
        this.setCityDataId(cid || this.defautlCityId);

    } else {

        this.setCityName(this.defaultName);
        this.setCityDataId(this.defautlCityId);
    }

    $(this).trigger('complete', [this.cacheCityLat || this.lat, this.cacheCityLng || this.lng]);
};

GeoLocation.prototype.writeCache = function(obj) {
    localStorage.setItem("_historyDatas", JSON.stringify(obj));
};

// 读取缓存
GeoLocation.prototype.readCache = function(con) {
    return JSON.parse(con) || {};
};

GeoLocation.prototype.keyWordsChange = function(data) {
    var __cache = {}, __cityName;


    __cityName = data.address || data.cityName;

    this.setCityName(__cityName);
    this.setCityDataId(data.cityId);

    if (data.targetCoord && typeof data.targetCoord == 'object') {
        __cache.cityLat = data.targetCoord.latitude || this.lat;
        __cache.cityLng = data.targetCoord.longitude || this.lng;

        localStorage.setItem("_lat", __cache.cityLat);
        localStorage.setItem("_lng",  __cache.cityLng);
    } else {
        __cache.cityLat = this.lat || localStorage.getItem(_lat);
        __cache.cityLng = this.lng || localStorage.getItem(_lng);
    }

    __cache.cityCn = __cityName;
    __cache.cityId = data.cityId;
    __cache.isForeign = data.isForeign;
    __cache.sugOrigin = data.sugOrigin;
    __cache.saveTm = (new Date()).getTime();


    this.writeCache(__cache); // 写缓存

    $(this).trigger('complete', [__cache.cityLat, __cache.cityLng]);
};

module.exports = new GeoLocation();



