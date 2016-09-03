var listItem = require('./item.mustache');


function List() {
    
}

List.renderType = {
    ADD: 'add',
    ALL: 'all'
};

List.listType = {
    WEIFANG: 'weifang',
    NEAR: 'near'
};


List.prototype.createDom = function (data) {
    this.element = $('<div>');

    if(data.hotelList && data.hotelList.length) {
        // 分析data
        this.renderWeiFangDom(this.element, data.hotelList);
    }

    if(data.suggestHotelList && data.suggestHotelList.length) {
        this.renderNearDom(this.element, data.suggestHotelList);
    }

    this.bindEvents();
};

List.prototype.renderWeiFangDom = function (tar, data) {
    if(!this.weifangElement) {
        this.createWeiFangDom(data);
    }

    this.weifangElement.appendTo(tar);
};

List.prototype.createWeiFangDom = function (data) {
    this.weifangElement = $('<div class="weifang"><div class="weifangBox pro_div"></div></div>');
    this.weifangContent = this.weifangElement.find('.weifangBox');
    this.renderList(data, this.weifangContent);
};

List.prototype.renderNearDom = function (tar, data) {
    if(!this.nearElement) {
        this.createNearDom(data);
    }

    this.nearElement.appendTo(tar);
};

List.prototype.createNearDom = function (data) {
    this.nearElement = $('<div class="near"><div class="nearBox pro_div"></div></div>');;
    this.nearContent = this.nearElement.find('.nearBox');
    this.renderList(data, this.nearContent);
};

List.prototype.renderList = function (data, tar) {
    var formatData = this.preFormat(data, tar);

  // 列表渲染
    var html = listItem(formatData);
    
    this.tempEle = $(html);
    tar.append(this.tempEle);

    this.addClickDataAnalysis();
};

List.prototype.addClickDataAnalysis = function () {
    var obj = {
        cspot: "endroomindex"
    };
    this.tempEle.find('.pro_img, .shopping').each(function (i, item) {
        $(this).data('tj', JSON.stringify(obj))
    });
};

List.prototype.preFormat = function (data, tar) {
    var fData = {lists: data};

    this.handleImgSize(fData);
    $.each(data || [],function (i, item) {
        item.index = i;
        if(item.distance) {
            item.showDistance = true;
            if(item.calDistanceType == 2) {
                item.distance = item.distance.toFixed(1);
                item.distanceUnit = 'km'
            } else if(item.calDistanceType == 1) {
                item.distanceUnit = 'm'
            }
        } else {
            item.showDistance = false;
        }

        if(item.commentScore) {
            item.commentStar = item.commentScore/5*100;
        } else {
            item.commentStar = false;
        }
    });

    fData.weifang = (tar === this.weifangContent) ? true : false;

    return fData;
};

List.prototype.handleImgSize = function (data) {
    if(!data.lists.length) return;

    $.each(data.lists, function (i, item) {
        if(item.picUrl) {
            item.bigPicUrl = item.picUrl.replace('mobile220_220', 'mobile649_414');
        }
    });
};

List.prototype.render = function (tar, data) {
    if(!this.element) {
        this.createDom(data);
        this.element.appendTo(tar);
    } else {
        if(data.hotelList && data.hotelList.length) {
            this.renderList(data.hotelList,  this.weifangContent);
        }

        if(data.suggestHotelList && data.suggestHotelList.length) {
            this.renderList(data.suggestHotelList, this.nearContent);
        }
    }
};

List.prototype.bindEvents = function () {
    this.proxyHandleShoppingClick = $.proxy(this.handleShoppingClick, this);
    this.element.on('click', '.pro_img, .shopping', this.proxyHandleShoppingClick)
};

List.prototype.handleShoppingClick = function (e) {
    var tar = $(e.currentTarget);

    window.open(this.channelLink(tar.data('href')))
};

List.prototype.channelLink = function (detailUrl) {
    var urlParam = unital.type;

    urlParam.ref = 'wxqbh5';

    if(urlParam && urlParam.ref && urlParam.ref.length > 0 && urlParam.ref.toLowerCase()=="wxqbh5") {
        detailUrl = detailUrl.replace('/hotel/','/hotelwxqb/').replace('m.elong.com','x.elong.com');
        return detailUrl;
    }

    if(urlParam && urlParam.ref && urlParam.ref.length > 0 && urlParam.ref.toLowerCase()=="zdwshwh5") {
        detailUrl = detailUrl.replace('/hotel/','/hotelfx/');
        return detailUrl;
    }

    return detailUrl;

};

List.prototype.empty = function (e) {
    if(this.element) {
        this.element.remove();
        this.element = null;

        if(this.weifangElement) {
            this.weifangElement = null;
            this.weifangContent = null;
        }

        if(this.nearElement) {
            this.nearElement = null;
            this.nearContent = null;
        }

    }
};

List.prototype.emptyWeiFangContent = function (e) {
    if(this.weifangContent) {
        this.weifangContent.html('');
    }
};

List.prototype.emptyNearContent = function (e) {
    if(this.nearContent) {
        this.nearContent.html('');
    }
};

module.exports = List;