
var util = {
        getHash : function(name){
            var params = location.hash.substring(1).split('&');

            for(var i = 0; i < params.length; i ++) {
                var tmp = params[i].split("=");

                if(tmp.length > 1 && name == tmp[0]) {
                    return tmp[1];
                }
            }

            return null;
        },
        setHash : function(opt) {
            if(!opt || !opt.length) return;

            var hash = location.hash;

            var _setHash = function(name, value){
                var start = hash.indexOf(name);
                var end = hash.charAt(start + name.length);

                if(!value) return;

                if(hash.length === 0) {
                    //hash长度为0，直接添加
                    hash = name + '=' + value;
                    return;
                } else if(start > 0 && (end == '=' || end == '&' || end === '')) {
                    //hash里包含该参数
                    var oldValue = util.getHash(name);
                    //旧值不存在替换整个键值对
                    var tmp = hash.substring(start);
                    var end = tmp.indexOf('&');
                    tmp = tmp.substring(0, end > 0 ? end : tmp.length);
                    hash = hash.replace(tmp, name + '=' + value);
                    return;
                } else {
                    //hash中不包含参数
                    hash += hash.charAt(hash.length - 1) == '&' ? '' : '&' + name + '=' + value;
                    return;
                }
            }

            for(var i = 0; i < opt.length; i ++){
                var param = opt[i];
                _setHash(param.name, param.value);
            }

            if(hash.charAt(0) !== '#') {

                    hash = '#' + hash;
                
            }

            if(history.replaceState) {
                history.replaceState('active-template', document.title, location.pathname + location.search + hash);
            }

        }
    };

module.exports = util;