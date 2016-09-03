var List = require('./list'),
    SearchParam = require('./searchparam'),
    lazyLoad = require('./../../../common/lazyLoad');


function Index() {
    this.url = '/weifang/ajax/list/';
}

Index.prototype.init = function () {
    this.filterDistPrice = $('#filterDistPrice');
    this.distanceNotice = $('#distanceNotice');
    this.listContainer = $('#listContainer');
    this.distanceBtn = $('#distanceBtn');
    this.priceBtn = $('#priceBtn');
    this.pageLoadEle = $('.loading');
    this.pageMaskEle = $('.mask-layer');
    this.loadingElem_ = $('#loading');
    this.moreButton_ = $('#nomore');
    this.window_ = $(window);
    this.pageSize = 20; // 一页的条数
    this.onceDataCount = 0; // 当前返回条数
    this.isFirst = true;

    this.param = new SearchParam();
    this.setDefaultParam();

    this.list = new List();

    this.afternoon = window.context.afternoon ? 1 : 0;

    this.bindEvents();
};

Index.prototype.setDefaultParam = function () {
    var pageSize = this.pageSize;

    var defaultParam = {
        indate: window.context.indate,
        outdate: window.context.outdate,
        sortmethod: '3',  // 3 距离 4 价格
        sortdirection: '1',  //1 小到大 2 大到小
        lbstype: '2',  // 无需更改
        isnear: '1', // 无需更改
        pageindex: 0,
        pagesize: pageSize, // 参数里面全是小写
        startlat: '',
        startlng: '',
        filtertype: this.afternoon

    };

    this.param.set(defaultParam);
};

Index.prototype.resetView = function () {
    this.listContainer.html('');

    this.resetAll();

    this.setOpen(this.moreButton_, false);
};

Index.prototype.handleNoPoint = function () {
    this.noPoint = true;

    this.setOpen(this.filterDistPrice, false);
    this.setOpen(this.distanceNotice, false);
};

Index.prototype.resetAll = function () {
    this.isFirst = true;
    this.setDefaultParam();


    this.resetDistanceView();
    this.list.empty();
};

Index.prototype.resetDistanceView = function (tar, status) {
    this.distanceBtn.addClass('act');
    this.priceBtn.removeClass('act');
};

Index.prototype.setOpen = function (tar, status) {
    if((tar.css("display") == 'block') != status) {
        status ? tar.show() : tar.hide();
    }
};

Index.prototype.setParam = function (obj) {
    this.param.set(obj)
};

Index.prototype.setElemVisible = function (elem, visible) {
    if (visible) {
        elem.show();
    } else {
        elem.hide();
    }
};

Index.prototype.bindEvents = function () {
    $(this.distanceBtn).on('click', $.proxy(this.handleDistancePrice, this));
    $(this.priceBtn).on('click', $.proxy(this.handleDistancePrice, this));

    $(this.param).on('change', $.proxy(this.handleParamChange, this));

    $(window).on("scroll", $.proxy(this.handleWindowScroll, this));
};

Index.prototype.handleWindowScroll = function (e) {
    if (!this.xhr &&
        this.window_.scrollTop() + this.window_.height() >= document.body.scrollHeight &&
        this.onceDataCount >= this.pageSize) {
        this.loadFollow();
    }
};

Index.prototype.handleComplete = function() {
    this.xhr = null;
    this.hidePageLoading();
};

Index.prototype.loadFollow = function (e) {
    this.param.set('pageindex', (this.param.get('pageindex')) + 1);

    this.getData();
};

Index.prototype.getData = function (type) {
    this.searchType = type;

    if(this.isFirst) {
        this.showPageLoading();
    } else {
        this.setMoreButtonLoading();
    }

  //  this.setSectionsVisible(true);

    if (this.xhr) {
        this.xhr.abort();
    }

    this.xhr = $.ajax({
        url: this.url,
        data: this.param.data,
        type: "get",
        timeout: 20000,
        dataType: "json",
        success: this.handleSuccess,
        complete: this.handleComplete,
        error: this.handleNetError,
        context: this
    });
};

Index.prototype.handleSuccess = function (response) {
    if(response.success) {
        var data = response.data;
        var weifangData = data.hotelList && data.hotelList.length;
        var nearData = data.suggestHotelList && data.suggestHotelList.length;

        if(!weifangData && !nearData) {
            this.handleNoResult();
            return;
        }

        if(this.isFirst && this.afternoon) {

            if(!weifangData) {
                this.filterDistPrice.hide(); // 并且吧过滤筛选条件饮喰
                $('#noEndRoom').show(); // 到点之后,没有尾房,显示没有尾房显示提示
            } else {
                if(!this.noPoint) {
                    this.filterDistPrice.show(); // 并且吧过滤筛选条件饮喰
                    $('#noEndRoom').hide(); // 到点之后,隐藏没有尾房 显示提示
                }
            }
            // 要展示附近所以要展示距离提示
        }

        if(this.isFirst) {
            if(nearData && !this.noPoint) {
                this.distanceNotice.show();
            } else {
                this.distanceNotice.hide();
            }
        }

        this.onceDataCount = weifangData || nearData;
        this.onceDataCount = this.onceDataCount || 0;

        if(this.isFirst) {
            this.isFirst = false;
            this.hidePageLoading();

        }

        //一次返回实际数据条数
        this.setOpen(this.moreButton_, true);

        if (this.onceDataCount == this.pageSize) {
            this.setMoreButtonActivible();
        } else {
            this.setMoreButtonEndless();
        }

        this.list.render(this.listContainer, data);

        lazyLoad.handleLazy();

    } else {
        this.handleReturnError(response.msg);
    }
};

Index.prototype.handleMoreButtonClick = function () {
    this.loadFollow();
};


Index.prototype.setMoreButtonActivible = function () {
    this.moreButton_.html("点击加载更多");
    this.moreButton_.off().on("click", $.proxy(this.handleMoreButtonClick, this));
};

Index.prototype.setMoreButtonEndless = function () {
    this.moreButton_.html("没有更多内容了");
    this.moreButton_.off("click");
};

Index.prototype.setMoreButtonLoading = function () {
    this.moreButton_.html('加载中...');
    this.moreButton_.off("click");
};



Index.prototype.showPageLoading = function () {
    this.pageLoadEle.show();
    this.pageMaskEle.show();
};

Index.prototype.hidePageLoading = function () {
    this.pageLoadEle.hide();
    this.pageMaskEle.hide();
};

Index.prototype.handleNetError = function (e) {
    this.listContainer.html('<div style="padding: 20px; color:#ccc; text-align: center;">网络错误</div>');
};

Index.prototype.handleNoResult = function (e) {
    this.listContainer.html('<div style="padding: 20px; color:#ccc; text-align: center;">没有数据</div>');
};

Index.prototype.handleReturnError = function (msg) {
    this.listContainer.html('<div style="padding: 20px; color:#ccc; text-align: center;">' + msg || '返回结果错误' + '</div>');
};

Index.prototype.handleParamChange = function (e) {

};

Index.prototype.handleDistancePrice = function (e) {
    var ele = $(e.currentTarget);

    ele.siblings().removeClass('act');
    ele.addClass('act');

    this.setOpen(this.moreButton_, false);

    this.param.set('sortmethod', ele.data('sortMethod'));
    this.resetPageIndex();

    this.handleSortMethodSelect();

};

Index.prototype.resetPageIndex = function () {
    this.param.set('pageindex', 0);
};

Index.prototype.handleSortMethodSelect = function (e) {
    this.isFirst = true;
    this.list.emptyWeiFangContent();
    this.list.emptyNearContent();
    this.getData();
};



module.exports = Index;

