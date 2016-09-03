
function Analysis() {
    this.tjObject = window.TJObject || new Object();
}

Analysis.prototype.init = function () {
    this.sendDefaults();
    this.bindEvents();
};

Analysis.prototype.sendDefaults = function () {
    this.tjObject.et = 'show';
    this.send(this.tjObject);
};

Analysis.prototype.send = function (obj) {
    tjMVT.setData(obj);
};

Analysis.prototype.bindEvents = function () {
   $('body').on('click', '.tjclick', $.proxy(this.handleClickAnalysis, this))
};

Analysis.prototype.handleClickAnalysis = function (e) {
    var tar = $(e.currentTarget);

    var obj = this.tjObject;

    obj.et = 'click';

    var dataTj = tar.data("tj");
    if(typeof dataTj == "string") {
        dataTj = JSON.parse(dataTj);
    }
    dataTj = dataTj || {};

    for(var i in dataTj) {
        obj[i] = dataTj[i];
    }

    obj.st = new Date().getTime();

    this.send(obj);
};

module.exports = Analysis;


