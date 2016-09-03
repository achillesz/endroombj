
//SearchParam
SearchParam = function() {
    this.data = {};
};

SearchParam.prototype.clear = function() {
    this.data = {};
};

SearchParam.prototype.set = function(key, value) {
    if(typeof key == 'object') {
        var obj = key;
        var _this = this;

        $.each(obj, function (key, value) {
            _this.data[key] = value;
        });

    } else {
        this.data[key] = value;
    }
};


SearchParam.prototype.get = function(key, value) {
    return this.data[key];
};

SearchParam.prototype.forEach_ = function(fn, opt_this) {
    for (var i in this.data) {
        if (fn.call(opt_this || this, i, this.data[i]) === 'break')
            break;
    }
};

SearchParam.prototype.toString = function() {
    return $.param(this.data);
};

SearchParam.prototype.equals = function() {

};

SearchParam.prototype.delete = function(key) {
    if(typeof key  == 'string') {
        delete this.data[key]
    } else {
        $.each(key, function (i, item) {
            delete this.data[item]
        });
    }
};

module.exports = SearchParam;