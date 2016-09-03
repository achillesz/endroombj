
function explain() {
    this.ele = '';//弹层的class
    this.elebtn = '';//触发弹层显示按钮class
    this.close = '';//触发弹层关闭按钮class
    this.content = [];//说明内容,[0]为插入容器,[1]为string类型内容,默认无
}

explain.prototype.init = function (op) {
    this.paramManage(op);
    this.bindEvent();
};

explain.prototype.paramManage = function (op) {
    this.ele = $(op['ele']);
    this.elebtn = $(op['elebtn']);
    this.close = this.ele.find(op['close']);
    this.content = op['content'];
    if (!!this.content) {
        var conBox = $(op['content'][0]);
        var conText = op['content'][1];
        conBox.append(conText);
    }
};

explain.prototype.bindEvent = function () {
    var _this = this;
    this.elebtn.on('click', function () {
        _this.ele.show();
        _this.removeScroll(true);
    });
    this.close.on('click', function () {
        _this.ele.hide();
        _this.removeScroll(false);
    });
};

explain.prototype.removeScroll = function (derail) {
    if (derail) {
        $('html, body').addClass('ovf-hidden');
    }
    else {
        $('html, body').removeClass('ovf-hidden');
    }
};

module.exports = new explain();