(function(){


    // 增加标识 appt (app_type)，值范围如下，其中网站和H5可以使用除6以外的取值标识
    // 1—Iphone
    // 2—Ipad
    // 3—Android
    // 5—Winphone
    // 6—Affiliate
    // 7—PC
    // 8—androidpad
    // 9—windowspad111111
    // 99—Unkown
    var ua = navigator.userAgent.toLowerCase();
    var ratio = typeof devicePixelRatio !== "undefined" ? devicePixelRatio : 1;
    var needDivideRatio = screen.width / document.body.clientWidth !== 1 && screen.height / document.body.clientHeight !== 1;
    var width = needDivideRatio ? screen.width / ratio : screen.width;
    var height = needDivideRatio ? screen.height / ratio : screen.height;
    var isPad = width >= 600 && height >= 600;

    var inApp = / ew(\w+)\/([\d.-_]*)/.test(ua);
    // pf改为vt (vist_type),值范围如下,其中网站和H5可以使用4或2取值
    // 1—App
    // 2—Html5
    // 3—Affiliate
    // 4—PC
    // 99—Unkown
    var thisvt;
    if (inApp) {
        thisvt = 1;
    }else if (location.host.match(/^m[\w\.]*\.elong\.com/)) {
        thisvt = 2;
    }else{
        thisvt = 4;
    }

    var appt = 99;
    if (ua.match(/android/)) {
        appt = isPad?8:3;
    }else if (ua.match(/iphone/)) {
        appt = 1;
    }else if (ua.match(/ipad/)) {
        appt = 2;
    }else if (ua.match(/macintosh/)) {//mac
        appt = 7;
    }else if (ua.match(/windows/)) {
        if (ua.indexOf("Touch")!== -1) {//mobile
            appt = isPad?9:5;
        }else{
            appt = 7;
        }
    } 

    var tj_timeout = 500;
    var tj_jsStartTime = (new Date()).getTime();

    var baseUrl = (function(){
        
        var baseDomain = location.protocol==='https:'?'msecure.elong.com':'tj.elongstatic.com';

        var baseUrl = "//"+baseDomain+'/t.gif?';
        var commonObj = {
            g:Math.floor(Math.random()*99999),//5位随机数
            rf:'',
            bs:screen?screen.width+'*'+screen.height:''
        };
        
        var t = [];
        for (var i in commonObj) {
             t.push(i+'='+commonObj[i]);
        }
        baseUrl += t.join("&");

        return baseUrl;
    })();

    var parmsTJ = {//统计脚本发送范围
        
        fetchStart: "p88",
        domainLookupStart: "p89",
        domainLookupEnd: "p90",
        connectStart: "p91",
        connectEnd: "p92",
        requestStart: "p93",
        responseStart: "p94",
        responseEnd: "p95",
        domLoading: "p96",
        domContentLoadedEventEnd: "p97",//after dom ready
        // domContentLoadedEventStart: "p97",//dom ready
        // tj_jsStartTime: "p98",
        // loadEventStart: "p99",// onload start
        loadEventEnd: "p99",// onload end
        //browserInfoStr: "p100"
    };

    var setPerformance = function(perf,timeouttime){
        
        var tjObj= {},a={};
        // var maxtime =
        if ((perf) && (perf.timing)) {


            //find max time as timeouttime
            for (var i in perf.timing) {
                if (typeof perf.timing[i] === 'number' && timeouttime < perf.timing[i] ) {
                    timeouttime = perf.timing[i];
                }
            }

            for (var i in parmsTJ) {
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

    var generatPfT = function(timeStart,timeEnd) {
        var perf = {};
        perf.timing={};
        for (var i in parmsTJ) {
            perf.timing[i] = timeStart;
        }
        perf.timing['domContentLoadedEventEnd'] = timeEnd;
        perf.timing['loadEventEnd'] = timeEnd;

        return perf;
    }

    //与slark框架结合
    
    document.addEventListener("onrender",function(ev){
        if (typeof ev.data1 === 'string' && ev.data1.indexOf(",")!==-1 ) {
            var arr = ev.data1.split(",");
            var pft = generatPfT(arr[1],arr[0]);

            tjClient.pt = ev.detail;
            tjClient.p98 = arr[0];
            tjClient.__sendObj(pft);
        }

    });
    

    //CLASS tjBase 
    var tjBase = function(){
        
        this.vt = thisvt;
        this.appt = appt;

        // if (thisvt == 4) {
        if (document.cookie.match(/SessionGuid=([\w-]*)/)){
            this.sid = document.cookie.match(/SessionGuid=([\w-]*)/)[1];
        }
        if (document.cookie.match(/CookieGuid=([\w-]*)/)){
            this.cid = document.cookie.match(/CookieGuid=([\w-]*)/)[1];
        }
        // }else{//H5的cookit要改造成非Http only
        //     if (document.cookie.match(/H5SessionId=([\w-]*)/)){
        //         commonObj.sid = document.cookie.match(/H5SessionId=([\w-]*)/)[1];
        //     }
        //     if (document.cookie.match(/H5CookieId=([\w-]*)/)){
        //         commonObj.cid = document.cookie.match(/H5CookieId=([\w-]*)/)[1];
        //     }
        // }

        if (navigator.connection){
            this.nt = navigator.connection.type;
        }

        this.ch = 'webapp';
        this.pt = 'tjonly';
        this.p1 = '';
        this.p98 = tj_jsStartTime;
    };

    var __sendObj = function(pft,tjObj){

        var tjData = setPerformance(pft,(tj_jsStartTime+tj_timeout));
        
        for (var a in tjObj){
            if (tjObj[a] && typeof tjObj[a] !== 'function'){
                tjData[a] = tjObj[a];
            }
        }
        
        var params = '';
        for (var i in tjData) {
            params =params + '&' + i+'='+tjData[i];
        }
        new Image().src = baseUrl + params;
    };


    tjBase.prototype.__sendObj = function(pft){

        //此时可能没有加载完成
        var _this = this;
        var timenow = (new Date()).getTime();
        if ( (timenow - tj_jsStartTime >= tj_timeout) || (pft && pft.timing && pft.timing.loadEventEnd) ) {
            __sendObj(pft,_this);
        }else{
            setTimeout(function(){
                __sendObj(pft,_this);
            },(tj_timeout - timenow + tj_jsStartTime));
        }
    };

    //platform,network //for mobile, 

    tjBase.prototype.setChannel = function(ch,pt,orderfrom,cardno){//channel, pagetype,
        if (ch){
            this.ch = ch;
        }
        if (pt) {
            this.pt = pt;
        }
        if (orderfrom) {
            this.p1 = orderfrom;
        }
        if (cardno) {
            this.cardno = cardno;
        }
        this.__sendObj(window.performance)

    };

    var tjClient = new tjBase();

    // checkCdnIp 
    (function(){
        var cdnTestUrl = {
            23:'http://www.elongstatic.com/hc/status.html',
            88:'http://m.elongstatic.com/hc/status.html',
            1:'http://pavo.elongstatic.com/hc/status.html'
        };
        var rani = parseInt(Math.random()*100);//1;

        //cdn:p81-85 ||cdn

        try{
            if (cdnTestUrl[rani]){
                var tnow = (new Date()).getTime();

                var cdnClient = new tjBase();
                
                window.req = new XMLHttpRequest();
                req.timeout = 3000;
                req.onreadystatechange=function(){
                    if (req.readyState === 4 ){
                        var tend = (new Date()).getTime();

                        var pft = generatPfT(tnow,tend);
                        cdnClient.ch = "monitor"

                        cdnClient.pt = (req.status>0 && req.status<500)?"cdnmonitor":"cdnerror";

                        if (tend-tnow>2000) {//2s外都认为error
                            cdnClient.pt = "cdnerror";
                        }

                        cdnClient.p98 = tend;
                        cdnClient.p81 = req.status; //cdn status
                        cdnClient.p82 = cdnTestUrl[rani].match(/([^/]*)\.elongstatic/)[1]; //cdn domain
                        cdnClient.p83 = tj_jsStartTime; //cdn time
                        
                        cdnClient.p85 = req.getResponseHeader("chinacacheip")||""; //cdn ip
                        
                        cdnClient.__sendObj(pft);

                    }
                };
                req.open('HEAD', cdnTestUrl[rani], true);
                req.send(null);
                
            }

        }catch(ex){
        }

    })();

    //error: p75-p79
    window.onerror = function(msg,file,line,col,err){
        __sendObj(null,{
            ch:'webapp',
            pt:'jserror',
            p75:msg,
            p76:file,
            p77:tj_jsStartTime,
            p78:tjClient.ch+'_'+tjClient.pt,
            p79:(err?err.stack:msg)
        });
    };

    if (typeof define == 'function'  && define.amd) {

        // AMD. Register as an anonymous module.
        define(function() {
            'use strict';
            return tjClient;
        });
    } else if (typeof module !== 'undefined' && module.exports) {

        //cmd
        module.exports.tjClient = tjClient;
    }
    window.tjClient = tjClient;
})();