
var Dialog = function (initParm) {
    this.initDom = false;
    this.dialogType = initParm.type || 'alert';
    this.title = initParm.title || '提示';
    this.okText = initParm.okText || '确定';
    this.cancleText = initParm.cancelText || '取消';
    this.contentStr = initParm.content || ' ';
    this.tplDom = null;
};

Dialog.tpl = '<div class="dialog-tips">' +
    '<div class="dialog-head">#title<span class="dialog-close"></span></div>' +
    '<div class="dialog-content">#content</div>' +
    '<div class="dialog-btn">#btn</div>' +
    '</div>';

Dialog.alert = function (message, type) {
    if (!this.alertDialog) {
        var initParm = {
            type: type || 'alert',
            content: message,
            handleOk: function () {
                this.hide();
            }
        }
        this.alertDialog = new Dialog(initParm);
    }
    this.alertDialog.setContent(message);
    this.alertDialog.show();
};
Dialog.prototype.createDom = function () {
    //对话框分两种一种是alert一种是confirm
    var btnstr = '';
    if (this.dialogType == 'alert') {
        btnstr = '<div class="btn-ok only-one">' + this.okText + '</div>';
    } else {
        btnstr = '<div class="btn-ok">' + this.okText + '</div><div class="btn-cancle">' + this.cancleText + '</div>';
    }
    var reg = [{
        'reg': '#title',
        'str': this.title
    }, {
        'reg': '#content',
        'str': this.contentStr
    }, {
        'reg': '#btn',
        'str': btnstr
    }
    ];
    this.coverElem_ = $('<div id="dialog-cover" class="dialog-cover"></div>');
    this.tplDom = $(this.multiReplace(Dialog.tpl, reg));
    this.contentElem = this.tplDom.find(".dialog-content");
    this.closeBtn = this.tplDom.find(".dialog-close");
    this.headerElem = this.tplDom.find(".dialog-head");
    this.dialogBtn = this.tplDom.find('.dialog-btn');
};
Dialog.prototype.dialogBtnHide = function () {
    this.dialogBtn.hide();
}

Dialog.prototype.closeBtnHide = function () {
    this.closeBtn.hide();
}


Dialog.prototype.setContent = function (content) {
    this.contentStr = content;
    this.contentElem && this.contentElem.html(content);
};

Dialog.prototype.render = function () {
    this.createDom();
    this.coverElem_.appendTo(document.body);
    this.tplDom.appendTo(document.body);
    this.initDom = true;
    this.bindEvents();
    this.tplDom.css({'margin-top': '-' + this.tplDom.height() / 2 + 'px'});
};

Dialog.prototype.bindEvents = function () {
    this.tplDom.find('.btn-ok').on('click', $.proxy(this.handleOk, this));
    this.tplDom.find('.btn-cancle').on('click', $.proxy(this.handleCancel, this));
    this.closeBtn.on('click', $.proxy(this.handleClose, this));
};

Dialog.prototype.show = function () {
    if (this.initDom == false) {
        this.render();
    } else {
        this.coverElem_.show();
        this.tplDom.show();
    }
};

Dialog.prototype.hide = function () {
    this.coverElem_.hide();
    this.tplDom.hide();
};

Dialog.prototype.multiReplace = function (str, reg) {
    var replaceResult = str;
    for (var i = reg.length - 1; i >= 0; i--) {
        var newreg = new RegExp(reg[i].reg);
        replaceResult = replaceResult.replace(newreg, reg[i].str);
    }
    ;
    return replaceResult;
};

Dialog.prototype.hideHeader = function () {
    this.headerElem.hide();
};


Dialog.prototype.destroy = function () {
    this.coverElem_.remove();
    this.tplDom.remove();
};

Dialog.prototype.handleCancel = function (e) {
    this.hide();
};

Dialog.prototype.handleClose = function (e) {
    $(this).trigger('close', {}, this);
    this.hide();
};

Dialog.prototype.handleOk = function() {
    $(this).trigger('save', {}, this);
    this.hide();
};



module.exports = Dialog;
