var $ = require('../../../../lib/jquery');
var PublishDialog = require('./publishdialog');
var Dialog = require('./../dialog');
var mustachePublishDom = require('./publish.mustache');
function Publish() {
};

Publish.prototype.init = function (id) {
    this.activeId = id;

    this.publishMark = $('.publishMark');

    this.render();
    
    this.publishDialog = new PublishDialog({type: 'any', title: "确认发布吗？", cancleText: "取消"});

    this.bindEvents();
    
};

Publish.prototype.createDom = function () {
    this.element = $(mustachePublishDom());
    this.publishBtn = this.element.find('.publishBtn');
};

Publish.prototype.render = function () {
    if(!this.element) {
        this.createDom();
    }

    this.element.appendTo($('body'));
};

Publish.prototype.bindEvents = function () {
    this.publishBtn.listen('click', this.handlePublishClick, this);

    $.listen(this.publishDialog, 'save', this.handlePublishSure, this);
    $.listen(this.publishDialog, 'cancle', this.handlePublishCancle, this);
    $.listen(this.publishDialog, 'close', this.handlePublishClose, this);
};

Publish.prototype.handlePublishCancle = function (e) {
    this.show();
};

Publish.prototype.handlePublishClose = function () {
    this.show();
};


Publish.prototype.handlePublishSure = function (e, a) {
    this.publishDialog.hide();

    this.loadingDialog = new Dialog({});
    this.loadingDialog.setContent('<div>发布中...</div>');
    this.loadingDialog.show();
    this.loadingDialog.dialogBtnHide();
    this.loadingDialog.closeBtnHide();
    $.ajax({
        url: 'http://mp.elong.com/activity/activityplatform/updateactivitystatus',
        type: 'post',
        data: {
            id: this.activeId
        },
        dataType: 'jsonp',
        context: this,
        success: this.handlePublishSuccess,
        error: this.netError
    });
};

Publish.prototype.netError = function (e) {
    this.publishStatus('网路错误');
};

Publish.prototype.publishStatus = function (msg) {
    this.loadingDialog.hide();
    this.errorDialog = new Dialog({okText:'关闭'});
    this.errorDialog.setContent('<div>'+ msg +'</div>');
    this.errorDialog.show();
    $.listen(this.errorDialog, 'save', this.publishFailure, this);
    $.listen(this.errorDialog, 'close', this.publishFailure, this);
};

Publish.prototype.publishFailure = function () {
    this.errorDialog.hide();
    this.show();
};

Publish.prototype.handlePublishSuccess = function (e) {
    if(e.content) {
        this.linkHref = e.content;
    }
    var issuccess = e.issuccess;
    var msg = e.msg || '发布失败，请重新发布';
    if(issuccess) {
        this.loadingDialog.hide();
        this.sureDialog = new Dialog({okText:'点击查看'});
        this.sureDialog.setContent('<div style="padding: 20px;">恭喜您发布成功哦，请去列表页查看链接。</div>');
        this.sureDialog.show();
        this.sureDialog.hideHeader();
        $.listen(this.sureDialog, 'save', this.handleViewPage, this);

    }else {

        this.publishStatus(msg);
    }
};

Publish.prototype.handleViewPage = function() {
    this.publishMark.hide();

    if(this.linkHref) {
        window.location.href = this.linkHref;
    } else {
        window.location.reload();
    }
       

};

Publish.prototype.handlePublishClick = function () {
    this.hide();
    this.publishDialog.show();
};

Publish.prototype.show = function () {
    this.element.show();
    this.publishMark.show();
};

Publish.prototype.hide = function () {
    this.element.hide();
    this.publishMark.hide();
};


module.exports = Publish;

