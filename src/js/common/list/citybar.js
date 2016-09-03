var $ = require('../../../../lib/jquery'),
    util = require('../util'),
    geoLocation = require('../geoLocation'),
    parameters = require('../parameters'),
    mustachecitybar = require('./mustache/citybar.mustache');


function CityBar() {
}

$.extend(CityBar.prototype, {
    page: $("#cityBar"),
    isPC: false, //默认PC
    cityListData: [],
    ajaxState: false,
    init: function (cityBarConfig) {
        
        this.navbarChooseColor = cityBarConfig.navbarChooseColor || "#FF6CA6";
        this.navbarTextColor = cityBarConfig.navbarTextColor || "#fff";
        this.navbarColor = cityBarConfig.navbarColor;
        this.navbarFocusColor = cityBarConfig.navbarFocusColor || "#fff";

        this.initTemplate();


        this.isPC = unital.isPC();

        if (util.getHash('promDataSourceId')) {
            parameters.cityList.promDataSourceId = util.getHash('promDataSourceId');
            parameters.cityBar.promDataSourceId = parameters.cityList.promDataSourceId;
            parameters.cityList.pageNo = util.getHash('pageIndex');
            parameters.cityList.promCityDataId = util.getHash('promCityDataId');
        }

        this.getCityListData();
        
        //定位后重新排序
       /* this.geoLocationResort();*/

    },
    initTemplate: function() {
        this.TEMPLATE = '<ul style="background-color:' + this.navbarColor + '">${city-content}</ul>';
        this.ITEM = '<li style="background-color:' + this.navbarColor + '" city-id=${city-id} class=${highbac}><span style="color:${highlight};background-color:${highbacor}">${city-name}</span></li>';
        this.MORE = '<li class="more" style="background-color:' + this.navbarColor + '"><span style="color: ' + this.navbarTextColor + '">更多>></span></li>';
       
    },
    getDataItems: function (itemOptions) {
        var items = "";
        for (var i = 0; i < itemOptions.dataLength; i++) {
            if (i == 0) {
                items += this.ITEM.replace('${highlight}', this.navbarChooseColor)
                    .replace('${highbac}', 'city-active')
                    .replace('${highbacor}', this.navbarFocusColor)
                    .replace('${city-id}', itemOptions.cities[i].promCityDataID)
                    .replace('${city-name}', itemOptions.cities[i].cityNameCN);
            } else {
                items += this.ITEM.replace('${highlight}', this.navbarTextColor)
                    .replace('${highbac}', '')
                    .replace('${highbacor}', '')
                    .replace('${city-id}', itemOptions.cities[i].promCityDataID)
                    .replace('${city-name}', itemOptions.cities[i].cityNameCN);
            }
        }
        return items;

    },
    _bindEvent: function () {
        this.page.find('ul').children('li').listen('click', this.handleCityClick, this);
        this.page.find('.moreCity').listen('click', this.handleH5More, this);
    },
    handleH5More: function (e) {
        $.event.trigger('more', [], this);
    },
    handleCityClick: function (e) {
        var ele = $(e.currentTarget);

        if (!ele.hasClass('more')) {
            $.event.trigger('update', [ele.attr('city-id')], this);

            //切换highlight
            ele.children().css('color', this.navbarChooseColor).css('background', this.navbarFocusColor);
            ele.addClass('city-active').siblings().removeClass('city-active');
            ele.siblings().children().css('color', this.navbarTextColor).css('background', '');

        } else {
            $.event.trigger('more', [], this);

        }

    },
    preFormatData: function (data) {
        var tempData = data;

        tempData.showMore = function () {
            return this.dataLength > 4
        };

        tempData.isHightLight = function () {
            return $.inArray(this, data.cities) == 0
        };
        tempData.navbarChooseColor = this.navbarChooseColor;
        tempData.navbarTextColor = this.navbarTextColor;
        tempData.navbarColor = this.navbarColor;
        tempData.navbarFocusColor = this.navbarFocusColor;

        return tempData;
    },
    renderCityBar: function (data) {
        return mustachecitybar(data);
    },
    setCity: function (cities) { // 请求到的所有城市数据
        var items = "";
        var cityLength = cities.length;
        if (this.isPC) {  // pc端的逻辑
            if (cityLength <= 8) {
                items += this.getDataItems({"dataLength": cityLength, "cities": cities});
            } else {
                items += this.getDataItems({"dataLength": 7, "cities": cities});
                items += this.MORE;
            }

            this.page.addClass('city cityBar');

            this.page.html(this.TEMPLATE.replace('${city-content}', items));
            $(".nav_box120").html(this.TEMPLATE.replace('${city-content}', items));

        } else {  // 渲染移动端的dom 结构
            var html = this.renderCityBar(this.preFormatData({"dataLength": cityLength, "cities": cities}));
            this.page.html(html);
        }
    },
    sortArr: function (arr) {
        var result = arr.sort(function (a, b) {
            return a.indexNo - b.indexNo;
        });
        return result;
    },
    isLocationCity: function (arr, city) {
        var result = '';
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (item.promCityDataID == city.promCityDataID) {
                result = item;
                break;
            }
        }

        return result;
    },
    isSetCity: function (arr, city) {
        var result = '';
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (item.promCityDataID == city.cityDataId) {
                result = item;
                break;
            }
        }

        return result;
    },
    reSetCityBar: function (data) {
        var result = '';
        //重新排序显示城市列表
        if (data.cityDataId) {
            result = this.isSetCity(this.cityListData, data);
            if (result) {
                for (var i = this.cityListData.length - 1; i >= 0; i--) {
                    if (this.cityListData[i].promCityDataID == data.cityDataId) {
                        this.cityListData.splice(i, 1);
                        break;
                    }
                }

                this.sortArr(this.cityListData);
                this.cityListData.unshift(result);

            }
        }
        this.setCity(this.cityListData);
        this._bindEvent();
    },
    resortCity: function (data) {
        var result = '';
        //重新排序显示城市列表
        if (data.promCityDataID) {
            result = this.isLocationCity(this.cityListData, data);
            if (result) {
                for (var i = this.cityListData.length - 1; i >= 0; i--) {
                    if (this.cityListData[i].promCityDataID == data.promCityDataID) {
                        this.cityListData.splice(i, 1);
                        break;
                    }
                }

                this.sortArr(this.cityListData);
                this.cityListData.unshift(result);
                this.setCity(this.cityListData);
                this._bindEvent();

                $.event.trigger('update', [result.promCityDataID], this);
            }
        }

    },
    resortByCurCity: function (cityId) {
        if(!cityId) return;

        var promCityDataID = this.findPromCityDataID(cityId);

        if(!promCityDataID) return;

        var data = {promCityDataID: promCityDataID}

        this.resortCity(data)
    },
    findPromCityDataID: function (cityId) {
        for (var i = this.cityListData.length - 1; i >= 0; i--) {
            if (this.cityListData[i].cityCode == cityId) {
                return this.cityListData[i].promCityDataID;
            }
        }
    },
    //定位后排序
    geoLocationResort: function () {
        geoLocation.callback = this.resortCity;
    },
    getCityListData: function () {
        this.ajaxState = false;
        $.ajax({
            timeout: 10000,
            url: 'http://mp.elong.com/mobilepromotion/getsalespromotionlistjsonpcontroler/getsalespromotioncitylist/',
            data: {
                'promDataSourceId': parameters.cityBar.promDataSourceId
            },
            type: "GET",
            dataType: "jsonp",
            success: this.cityListCallBack,
            context: this
        });
    },
    cityListCallBack: function (data) {
        if (this.ajaxState) return;
        if (!data) {
            plugin.alert('访问人数有点多～稍后再试下吧！');
        } else if (data.length > 0) {
            this.cityListData = data;
            this.ajaxState = true;

            this.reSetCityBar({
                'cityDataId': parameters.cityList.promCityDataId,
                'cityName': parameters.cityList.promCityDataId
            });

            $.event.trigger('load', [this.cityListData[0].promCityDataID, this.cityListData], this);
        }
    }
})

module.exports = CityBar;