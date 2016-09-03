(function() {


    // 增加标识 appt (app_type)，值范围如下，其中网站和H5可以使用除6以外的取值标识
    // 1—Iphone
    // 2—Ipad
    // 3—Android
    // 5—Winphone
    // 6—Affiliate
    // 7—PC
    // 8—androidpad
    // 9—windowspad
    // 99—Unkown
    var ua = navigator.userAgent.toLowerCase();
    var ratio = typeof devicePixelRatio !== "undefined" ? devicePixelRatio : 1;
    var needDivideRatio = screen.width / document.body.clientWidth !== 1 && screen.height / document.body.clientHeight !== 1;
    var width = needDivideRatio ? screen.width / ratio : screen.width;
    var height = needDivideRatio ? screen.height / ratio : screen.height;
    var isPad = width >= 600 && height >= 600;
    var inApp = (/ ew(\w+)\/([\d.-_]*)/.test(ua)) ? 1 : 0;


    var tj_timeout = 500;
    var tj_jsStartTime = (new Date()).getTime();

    var getCt = function() {
        return inApp?1:2;
    };
    var getNt = function() {
        if (navigator.connection) {
            return navigator.connection.type;
        }
        return 0;
    };
    var getModel = function() {
        //deal with android
        var mod = {};
        var tmp = ua.match(/android(.*);(.*)build/i);
        if (tmp) {
            mod.os = tmp[1];
            mod.md = tmp[2];
        } else if (ua.match(/iphone/)) {
            mod.os = 'ios';
            mod.md = 'iphone';
        } else if (ua.match(/ipad/)) {
            mod.os = 'ios';
            mod.md = 'ipad';
        } else {
            mod.os = 'unkown';
            mod.md = 'unkown';
        }
        return mod;

    };

    var getDt = function() {
        var devicetype = 99;
        if (ua.match(/android/)) {
            devicetype = isPad ? 8 : 3;
        } else if (ua.match(/iphone/)) {
            devicetype = 1;
        } else if (ua.match(/ipad/)) {
            devicetype = 2;
        } else if (ua.match(/macintosh/)) { //mac
            devicetype = 7;
        } else if (ua.match(/windows/)) {
            if (ua.indexOf("Touch") !== -1) { //mobile
                devicetype = isPad ? 9 : 5;
            } else {
                devicetype = 7;
            }
        }
        return devicetype;
    };

    var baseUrl = (function() {

        var baseDomain = location.protocol === 'https:' ? 'msecure.elong.com' : 'm.elongstatic.com';

        var baseUrl = "//" + baseDomain + '/tj/t.gif?';
        var commonObj = {
            rf: '', //来源
            bs: screen ? screen.width + '*' + screen.height + '*' + (window.devicePixelRatio || 1) : '',
            md: getModel().md,
            os: getModel().os,
            nt: getNt(),
            dt: getDt(), //device type
        };
        // if (document.cookie.match(/SessionGuid=([\w-]*)/)){
        //     commonObj.sid = document.cookie.match(/SessionGuid=([\w-]*)/)[1];
        // }

        // if (document.cookie.match(/H5CookieId=([\w-]*)/)){
        //     commonObj.cid = document.cookie.match(/H5CookieId=([\w-]*)/)[1];
        // }

        var t = [];
        for (var i in commonObj) {
            t.push(i + '=' + commonObj[i]);
        }
        baseUrl += t.join("&");

        return baseUrl;
    })();


    var parmsTJ = { //统计脚本发送范围

        fetchStart: "p88",
        // domainLookupStart: "p89",
        // domainLookupEnd: "p90",
        // connectStart: "p91",
        // connectEnd: "p92",
        // requestStart: "p93",
        responseStart: "p94", //new for cdn check
        // responseEnd: "p95",
        // domLoading: "p96",
        domContentLoadedEventEnd: "drt", //after dom ready
        // domContentLoadedEventStart: "p97",//dom ready
        // tj_jsStartTime: "fst",
        // loadEventStart: "p99",// onload start
        loadEventEnd: "olt", // onload end
        //browserInfoStr: "p100"
    };

    var setPerformance = function(perf, timeouttime) {

        var tjObj = {},
            a = {};
        // var maxtime =
        if ((perf) && (perf.timing)) {

            var i;
            //find max time as timeouttime
            for (i in perf.timing) {
                if (typeof perf.timing[i] === 'number' && timeouttime < perf.timing[i]) {
                    timeouttime = perf.timing[i];
                }
            }

            for (i in parmsTJ) {
                tjObj[i] = perf.timing[i] || timeouttime;
            }

            for (var c in tjObj) {
                var d = parmsTJ[c];
                if (d) {
                    a[d] = tjObj[c];
                }
            }
        }
        return a;
    };

    var generatPfT = function(timeStart, timeEnd) {
        var perf = {};
        perf.timing = {};
        for (var i in parmsTJ) {
            perf.timing[i] = timeStart;
        }
        perf.timing.domContentLoadedEventEnd = timeEnd;
        perf.timing.loadEventEnd = timeEnd;

        return perf;
    };
    //与slark框架结合

    // document.addEventListener("onrender",function(ev){
    //     if (typeof ev.data1 === 'string' && ev.data1.indexOf(",")!==-1 ) {
    //         var arr = ev.data1.split(",");
    //         var pft = generatPfT(arr[1],arr[0]);

    //         tjMVT.pt = "slark-"+ev.detail;
    //         tjMVT.p98 = arr[0];
    //         tjMVT.__sendObj(pft);
    //     }

    // });


    //CLASS tjBase
    var tjBase = function() {
        //     pf改为bns (vist_type),值范围如下,其中网站和H5可以使用4或2取值
        // 1—App
        // 2—Html5
        // 3—Affiliate
        // 4—PC
        // 99—Unkown
        this.bns = 2; //
        this.fst = tj_jsStartTime;
        this.ct = getCt();
        if (document.cookie.match(/H5CookieId=([\w-]*)/)) {
            this.cid = document.cookie.match(/H5CookieId=([\w-]*)/)[1];
        }

        this.execTime=0;
    };

    var __sendObj = function(pft, tjMVT) {

        var tjData = setPerformance(pft, (tj_jsStartTime + tj_timeout));

        for (var a in tjMVT) {
            if (tjMVT[a] && typeof tjMVT[a] !== 'function') {
                tjData[a] = tjMVT[a];
            }
        }

        var params = '';
        for (var i in tjData) {
            params = params + '&' + i + '=' + tjData[i];
        }
        new Image().src = baseUrl + params;
    };


    tjBase.prototype.__sendObj = function(pft) {
        var _this = this;
        //此时可能没有加载完成
        var timenow = (new Date()).getTime();
        if ((timenow - tj_jsStartTime >= tj_timeout) || (pft && pft.timing && pft.timing.loadEventEnd)) {
            __sendObj(pft, _this);
        } else {
            setTimeout(function() {
                __sendObj(pft, _this);
            }, (tj_timeout - timenow + tj_jsStartTime));
        }
    };

    window.tjmvtjscb = function(data) {
        try {
            var d = JSON.parse(data);
            tjMVT.cid = d.publicAttris.deviceID;
        } catch (e) {} finally {
            tjMVT.__sendObj(window.performance);
        }
    };
    tjBase.prototype.setData = function(obj) {

        for (var i in obj) {
            this[i] = obj[i];
        }
        //cin //覆盖后端cin
        this.execTime++;//本页面里面的执行次数

        try{
            //支持localstorage 则用localStorage，否则则退化成只发本次的执行次数
            var lcnt = parseInt(localStorage.getItem("tjmvtcin"));

            if (lcnt){
                this.cin = ++lcnt;
            }else{
                this.cin=1;
            }
            localStorage.setItem("tjmvtcin",this.cin);
        }catch(e){
            this.cin = this.execTime;
        };


        //默认获取cid
        //获取deviceId
        var _this = this;
        // 使用deviceId 覆盖obj.cid
        if (inApp) { //覆盖obj.cid
            if (typeof ElongApp == 'undefined') {
                document.addEventListener("ElongAppReady", function(ev) {
                    _this.setData(obj);
                });
                return;
            } else if (typeof ElongApp.getPublicAttris == 'function') {
                ElongApp.getPublicAttris("window.tjmvtjscb");
                return;
            }
        }


        this.__sendObj(window.performance);
    };

    var tjMVT = new tjBase();

    if (typeof define == 'function' && define.amd) {

        // AMD. Register as an anonymous module.
        define(function() {
            'use strict';
            return tjMVT;
        });
    } else if (typeof module !== 'undefined' && module.exports) {

        //cmd
        module.exports.tjMVT = tjMVT;
    }

    window.tjMVT = tjMVT;
})();