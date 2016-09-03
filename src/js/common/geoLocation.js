var plugin = require('./plugin'),
    wx = require("../../../lib/jweixin-1.1.0"),
    unital = require('./unital');

var geoLocation = {};

window.geoHotel = function (data) {
    alert(JSON.stringify(data))
    if (!data) {
        plugin.alert('访问人数有点多～稍后再试下吧!');
    } else if (data.cityName.length > 0) {
        geoLocation.ajaxState = true;
        if (geoLocation.callback && geoLocation.callback !== null) {
            geoLocation.callback(data);
        }
    }
}

geoLocation = {
    isLocate: true, //是否定位
    ajaxState: false,
    callback: null, //回调
    init: function (isUse, wxType) {
        geoLocation.isLocate = isUse;
        if (!geoLocation.isLocate) return;
        if (sessionStorage.getItem('geoLocationResort-' + unital.getUrlRef().activityName) === '1') {
            return;
        } else {
            if ($("#allmap")) {
                geoLocation.getLocation(wxType);
            }

            this.setSessionStorage(1);
        }
    },
    setSessionStorage: function (val) {
        sessionStorage.setItem('geoLocationResort-' + unital.getUrlRef().activityName, val);
    },
    getLocation: function (wxType) {
        var _this = this;
        //判断是否支持 获取本地位置
        if (wx && wxType) {
            alert('wxType');
            wx.getLocation({
                // type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                timeout: "10000",
                success: function (res) {
                    _this.showPosition({coords: res});
                    alert(JSON.stringify(res));
                },
                fail: function (e) {
                    alert('error');
                    _this.getLocation(false);
                },
                cancel: function (res) {
                }
            });

        } else if (navigator.geolocation) {
            alert('h5');
            navigator.geolocation.getCurrentPosition(this.showPosition, this.fixPositionErr, {
                enableHighAcuracy: true,
                timeout: 10000
            });
        } else {
            this.setSessionStorage(2);
           // plugin.alert("无法获取位置信息");
        }
    },
    showPosition: function (position) {
        alert('ok')
        //slark.get('map').stopLoading();
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;


        geoLocation.ajaxCity(lat, lng);
        /*			//调用地图命名空间中的转换接口   type的可选值为 1:gps经纬度，2:搜狗经纬度，3:百度经纬度，4:mapbar经纬度，5:google经纬度，6:搜狗墨卡托
         qq.maps.convertor.translate(new qq.maps.LatLng(lat, lng), 1, function(res) {
         //取出经纬度并且赋值
         latlng = res[0];

         qqmap.setCenter(latlng);

         if(!!myPosition && myPosition.setMap) {
         myPosition.setMap(null);
         }

         //设置marker标记
         myPosition = new qq.maps.Marker({
         map: qqmap,
         position: latlng
         });

         calcRoute(latlng, myLatlng);
         });*/
    },
    fixPositionErr: function () {
        geoLocation.setSessionStorage(2);
        //plugin.alert("无法获取位置信息");
    },
    getPoint: function () {

        var map = new BMap.Map("allmap");
        var point = new BMap.Point(116.331398, 39.897445);
        map.centerAndZoom(point, 12);
        var geolocation = new BMap.Geolocation();
        var coords = {
            'latitude': '0',
            'longitude': '0'
        }

        geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                var mk = new BMap.Marker(r.point);
                map.addOverlay(mk);
                map.panTo(r.point);
                coords.latitude = r.point.lat;
                coords.longitude = r.point.lng;
                geoLocation.getPosition(coords);
            } else {
                plugin.alert('您的浏览器已禁用定位功能，您可以尝试打开该功能。');
                sessionStorage.setItem('geoLocationResort-' + unital.getUrlRef().activityName, 2);
                return null;
            }
        }, {enableHighAccuracy: true});

    },
    getPosition: function (coords) {

        if (coords == null) return;
        var lat = coords.latitude;
        var lng = coords.longitude;
        if (lat == 0 || lng == 0) {
            plugin.alert("获取经纬度失败，请重试");
        } else {
            geoLocation.ajaxCity(lat, lng);
        }
    },
    ajaxCity: function (lat, lng) {
        location.ajaxState = false;
        $.ajax({
            timeout: 10000,
            url: 'http://mp.elong.com/mobilepromotion/getsalespromotionlistjsonpcontroler/gethotelgeocity/',
            data: {
                'callback': 'geoHotel',
                'lat': lat,
                'lng': lng
            },
            type: 'GET',
            dataType: 'jsonp',
            jsonp: 'geoHotel'
        });

    }

}

module.exports = geoLocation;
