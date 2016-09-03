(function () {
    var ua = navigator.userAgent.toLowerCase();
    var ratio = typeof devicePixelRatio !== "undefined" ? devicePixelRatio : 1;
    var needDivideRatio = screen.width / document.body.clientWidth !== 1 && screen.height / document.body.clientHeight !== 1;
    var width = needDivideRatio ? screen.width / ratio : screen.width;
    var height = needDivideRatio ? screen.height / ratio : screen.height;
    var isPad = width >= 600 && height >= 600;
    var inApp = / ew(\w+)\/([\d.-_]*)/.test(ua) ? 1 : 0;
    var tj_timeout = 500;
    var tj_jsStartTime = (new Date).getTime();
    var getCt = function () {
        return inApp ? 1 : 2
    };
    var getNt = function () {
        if (navigator.connection) {
            return navigator.connection.type
        }
        return 0
    };
    var getModel = function () {
        var mod = {};
        var tmp = ua.match(/android(.*);(.*)build/i);
        if (tmp) {
            mod.os = tmp[1];
            mod.md = tmp[2]
        } else if (ua.match(/iphone/)) {
            mod.os = "ios";
            mod.md = "iphone"
        } else if (ua.match(/ipad/)) {
            mod.os = "ios";
            mod.md = "ipad"
        } else {
            mod.os = "unkown";
            mod.md = "unkown"
        }
        return mod
    };
    var getDt = function () {
        var devicetype = 99;
        if (ua.match(/android/)) {
            devicetype = isPad ? 8 : 3
        } else if (ua.match(/iphone/)) {
            devicetype = 1
        } else if (ua.match(/ipad/)) {
            devicetype = 2
        } else if (ua.match(/macintosh/)) {
            devicetype = 7
        } else if (ua.match(/windows/)) {
            if (ua.indexOf("Touch") !== -1) {
                devicetype = isPad ? 9 : 5
            } else {
                devicetype = 7
            }
        }
        return devicetype
    };
    var baseUrl = function () {
        var baseDomain = location.protocol === "https:" ? "msecure.elong.com" : "m.elongstatic.com";
        var baseUrl = "//" + baseDomain + "/tj/t.gif?";
        var commonObj = {
            rf: "",
            bs: screen ? screen.width + "*" + screen.height + "*" + (window.devicePixelRatio || 1) : "",
            md: getModel().md,
            os: getModel().os,
            nt: getNt(),
            dt: getDt()
        };
        var t = [];
        for (var i in commonObj) {
            t.push(i + "=" + commonObj[i])
        }
        baseUrl += t.join("&");
        return baseUrl
    }();
    var parmsTJ = {fetchStart: "p88", responseStart: "p94", domContentLoadedEventEnd: "drt", loadEventEnd: "olt"};
    var setPerformance = function (perf, timeouttime) {
        var tjObj = {}, a = {};
        if (perf && perf.timing) {
            var i;
            for (i in perf.timing) {
                if (typeof perf.timing[i] === "number" && timeouttime < perf.timing[i]) {
                    timeouttime = perf.timing[i]
                }
            }
            for (i in parmsTJ) {
                tjObj[i] = perf.timing[i] || timeouttime
            }
            for (var c in tjObj) {
                var d = parmsTJ[c];
                if (d) {
                    a[d] = tjObj[c]
                }
            }
        }
        return a
    };
    var generatPfT = function (timeStart, timeEnd) {
        var perf = {};
        perf.timing = {};
        for (var i in parmsTJ) {
            perf.timing[i] = timeStart
        }
        perf.timing.domContentLoadedEventEnd = timeEnd;
        perf.timing.loadEventEnd = timeEnd;
        return perf
    };
    var tjBase = function () {
        this.bns = 2;
        this.fst = tj_jsStartTime;
        this.ct = getCt();
        if (document.cookie.match(/H5CookieId=([\w-]*)/)) {
            this.cid = document.cookie.match(/H5CookieId=([\w-]*)/)[1]
        }
        this.execTime = 0
    };
    var __sendObj = function (pft, tjMVT) {
        var tjData = setPerformance(pft, tj_jsStartTime + tj_timeout);
        for (var a in tjMVT) {
            if (tjMVT[a] && typeof tjMVT[a] !== "function") {
                tjData[a] = tjMVT[a]
            }
        }
        var params = "";
        for (var i in tjData) {
            params = params + "&" + i + "=" + tjData[i]
        }
        (new Image).src = baseUrl + params
    };
    tjBase.prototype.__sendObj = function (pft) {
        var _this = this;
        var timenow = (new Date).getTime();
        if (timenow - tj_jsStartTime >= tj_timeout || pft && pft.timing && pft.timing.loadEventEnd) {
            __sendObj(pft, _this)
        } else {
            setTimeout(function () {
                __sendObj(pft, _this)
            }, tj_timeout - timenow + tj_jsStartTime)
        }
    };
    window.tjmvtjscb = function (data) {
        try {
            var d = JSON.parse(data);
            tjMVT.cid = d.publicAttris.deviceID
        } catch (e) {
        } finally {
            tjMVT.__sendObj(window.performance)
        }
    };
    tjBase.prototype.setData = function (obj) {
        for (var i in obj) {
            this[i] = obj[i]
        }
        this.execTime++;
        try {
            var lcnt = parseInt(localStorage.getItem("tjmvtcin"));
            if (lcnt) {
                this.cin = ++lcnt
            } else {
                this.cin = 1
            }
            localStorage.setItem("tjmvtcin", this.cin)
        } catch (e) {
            this.cin = this.execTime
        }
        var _this = this;
        if (inApp) {
            if (typeof ElongApp == "undefined") {
                document.addEventListener("ElongAppReady", function (ev) {
                    _this.setData(obj)
                });
                return
            } else if (typeof ElongApp.getPublicAttris == "function") {
                ElongApp.getPublicAttris("window.tjmvtjscb");
                return
            }
        }
        this.__sendObj(window.performance)
    };
    var tjMVT = new tjBase;
    if (typeof define == "function" && define.amd) {
        define(function () {
            "use strict";
            return tjMVT
        })
    } else if (typeof module !== "undefined" && module.exports) {
        module.exports.tjMVT = tjMVT
    }
    window.tjMVT = tjMVT
})();