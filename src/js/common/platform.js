
function PlatForm() {
    this.ua =  navigator.userAgent;
    this.step = 1;
    this.stepMax = 7;
    this.timer = null;

    this.startAppDetect();
}

PlatForm.prototype.startAppDetect = function () {
    this.step++;
    if(this.step >= this.stepMax) {
        if (this.timer) clearTimeout(this.timer);
        this.appDetectComplete();
        return;
    }

    if (this.isApp()) {
        this.step = this.stepMax;
        this.appDetectComplete();
        if (this.timer) clearTimeout(this.timer);
    } else {
        this.timer = setTimeout($.proxy(this.startAppDetect, this), 300)
    }
};

PlatForm.prototype.appDetectComplete = function () {
    this.appDetectStatus = true;
    $(window).trigger('Apploaded', [this.isApp()]);
};


PlatForm.prototype.isAppDetectComplete = function () {
   return this.appDetectStatus || false;
};

PlatForm.prototype.isApp = function () {
    // 先判断 isAppLoaded
    return typeof(ElongApp) != "undefined";
};


PlatForm.prototype.isWeiXin = function () {
    if(this.ua.match(/ micromessenger/i)) {
        return true;
    }
};

module.exports = PlatForm;
