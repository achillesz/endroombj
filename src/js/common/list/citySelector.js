
var $ = require('../../../../lib/jquery'),
        layerControl = require('../layerControl');

function CitySelector() {
    this.cityList = [];
    this.ajaxState = false;
    this.callback = null;
    this.hotCityObj = null;
    this.cityListObj = null;
    this.btnClose = null;

};


CitySelector.prototype = {
    TEMPLATE: {
        CITYITEM : '<li class="f-cb sort_display" city-id="${city-id}" city-name="${city-name}><span>${city-name}</span></li>',
        BODY : '<div class="city-selector"><div class="morecity-title"><p>更多城市</p><a class="close-icon" href="javascript:void(0)"></a></div><div class="hotcity"><ul class="hotcity_lst f-cb"><li class="hot_pos pos_hide">不限</li></ul></div><div class="page-city-content"><div class="city-list"><ul class="morecity_lst"></ul></div></div></div>',
        LETTERSER: '<a data-href="${hotcity-letter}">${hotcity-letter}</a>',
        CITYSER: '<li class="f-cb sort_display"><i id="${hotcity-letter}">${hotcity-letter}</i>${city-list}</li>'
    },
    page: $('.city-selector'),
    state : false,
    init: function() {
        this.page = $(this.TEMPLATE.BODY);
        this.hotCityObj = this.page.find('.hotcity ul'); // 热门城市容器
        this.cityListObj = this.page.find('.morecity_lst'); // 城市主体容器
        this.btnClose = this.page.find(".close-icon"); // 关闭按钮
        
        $('body').append(this.page);
        
        if(history.replaceState) {
            history.replaceState('activity-template', document.title, (location.pathname + location.search + location.hash).replace('?_citySelector',''));
        }
       

    },
    config: function(opt) {
        if(!opt) {
            return;
        }

        this.callback = opt.callback;

    },
    getElementTop: function(element) {
        var actualTop = element.offsetTop;
        var current = element.offsetParent;
        while (current !== null){
　　　　　　 actualTop += current.offsetTop;
　　　　　　 current = current.offsetParent;
　　　　 }
　　　　 return actualTop;
    },
    show: function() {
        if(this.state) return;
        this.page.show();
        layerControl.show();
        this.state = true;
        if(history.pushState) {
            history.pushState('activity-template', document.title, location.pathname + location.search + '?_citySelector' + location.hash);
        }
    },
    hide: function() {
        if(!this.state) return;
        this.page.hide();
        layerControl.hide();
        this.state = false;
        if(history.replaceState) {
            history.replaceState('activity-template', document.title, (location.pathname + location.search + location.hash).replace('?_citySelector',''));
        }
    },
    sortCityByLetter: function(arr) {
        var cityOptions = {};
        if(arr.length === 0) return;

        if(!arr[0].cityNameEN) return;

        arr.sort(function(a,b){return (a.cityNameEN.charCodeAt(0) - b.cityNameEN.charCodeAt(0)) > 0 ? 1:-1;});

        //比较首字母 如果存在就添加到数组  不存在就建立一个空数组存
        for(var i = 0; i < arr.length; i++) {
            var item = arr[i];
            var letter = item.cityNameEN.toString().substr(0,1);
            if(!(letter in cityOptions)) {
                cityOptions[letter] = [];
            }

            cityOptions[letter].push(item);

        }

        return cityOptions;
    },
    renderMoreCity: function() {

        var index = 0;
        var letter = '<li class="hot_pos pos_active pos_hide">不限</li><li class="hot_pos">';
        var cityDom = '';
        this.cityList = this.sortCityByLetter(this.cityList);
        if($.isEmptyObject(this.cityList)) return;
        for(var item in this.cityList) {
            var content = '';
            index ++;
            letter += this.TEMPLATE.LETTERSER.replace('${hotcity-letter}', item)
                                             .replace('${hotcity-letter}', item);

            for(var i = 0; i < this.cityList[item].length; i++) {
                var city = this.cityList[item][i];
                content += '<a city-id="' + city.cityCode + '" city-code="' + city.promCityDataID + '" >' + city.cityNameCN + '</a>';

            }
            
            cityDom += this.TEMPLATE.CITYSER.replace('${hotcity-letter}', item)
                                            .replace('${hotcity-letter}', item)
                                            .replace('${city-list}', content);

            if(index%4 === 0) {
                letter += '</li><li class="hot_pos">';
            }

        }

        letter += "</li>";
        this.cityListObj.html(cityDom);
        this.hotCityObj.html(letter);
        this._bindEvent();
        this.isLetter();  
    },
    _bindEvent: function() {
        var _this = this;
        var _thisCity = this.page.find(".page-city-content");
        var _thisMoreCity = this.page.find(".morecity_lst");

        this.page.on('scroll', function(e) {
            e.preventDefault();
        });

        this.page.find('.hotcity_lst a').off('click').on("click", function(e) {
            var $Id = $('#'+$(this).attr('data-href'))[0];
            _thisCity.animate({scrollTop : _this.getElementTop($Id)},300);
            e.preventDefault();
        });

        $(".morecity_lst a").off("click").on('click', function() {
            var nowId = $(this);

            var url = decodeURIComponent(location.href);
            var dataId = '';
            if(url.indexOf("promCityDataId") !== -1) {
                dataId = url.match(/(\?|\&)promCityDataId=(\w+)/)[2];
            }
            if(dataId !== '' && dataId == nowId.attr('city-code')) {
                _this.hide();
            } else {
                $.event.trigger('resort', [nowId.attr('city-id'), nowId.attr('city-code'), nowId.text()], _this);
                _this.hide();
            }

        });

        this.btnClose.off("click").on("click", function() {
            _this.hide();
        });
        

        $(".hotcity ul li").off('click').on('click', function(e) {
            var _this = $(this);
            if(!_this.hasClass('pos_active')) {
                _this.siblings().removeClass('pos_active');
            }
            
            _this.addClass('pos_active');

            if(_this.hasClass('pos_hide')) {
                _thisMoreCity.children('li').removeClass('sort_display').addClass('sort_display');
            } else {
                _thisMoreCity.children('li').removeClass('sort_display');
                _this.children('a').each(function() {
                    _thisMoreCity.find('#' + $(this).attr('data-href')).parent().addClass('sort_display');
                });
            }
            e.preventDefault();
        });
    },
    isLetter: function () {
        //  判断如果就一个字母的话  就默认不展示】
        var $hotcity = $('.hotcity');
        var isLetterLen = $hotcity.find('a').length;
        if(isLetterLen <= 1) {
            $hotcity.hide();
        } else {
            $hotcity.show();
        }
    }

};

module.exports = CitySelector;
