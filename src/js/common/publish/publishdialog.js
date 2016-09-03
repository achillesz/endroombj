var $ = require('../../../../lib/jquery');
var Dialog = require('./../dialog');

function PublishDialog(obj) {
    Dialog.call(this, obj)

}

$.inherits(PublishDialog, Dialog);

PublishDialog.prototype.handleOk = function () {
    $.event.trigger('save', {}, this);
};

PublishDialog.prototype.handleCancel = function () {
    PublishDialog.superClass_.handleCancel.call(this);

    $.event.trigger('cancle', {}, this);
};

PublishDialog.prototype.handleClose = function (e) {
    PublishDialog.superClass_.handleCancel.call(this);

    $.event.trigger('close', {}, this);
};



module.exports = PublishDialog;