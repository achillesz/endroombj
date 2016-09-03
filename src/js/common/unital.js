
	var html = $("html");
	var browser = {
	        versions: function() {
	            var u = navigator.userAgent,
	                app = navigator.appVersion;
	            return {
	                trident: u.indexOf('Trident') > -1, //IE内核 
	                presto: u.indexOf('Presto') > -1, //opera内核 
	                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核 
	                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核 
	                mobile: u.match(/Mobile/), //是否为移动终端 
	                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端 
	                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器 
	                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器 
	                iPad: u.indexOf('iPad') > -1, //是否iPad 
	                webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
					mi2S: u.indexOf('MI 2S') > -1  //是否是小米2s机型,为解决欧洲杯专题bug
				};
	        }()
	    };

	//获取URL REF参数
//	var type = new Object();
	
	var unital = {
		type: {},
		isPC: function () {
		    if (browser.versions.mobile || browser.versions.android) {
		        $('html').addClass('h5_index');
		        return false;
		    } else {
		        $('html').addClass('pc_index');
		        return true;
		    }
		},
		isMi2s: function() {
			var xiaomi2s = browser.versions.mi2S;
			return xiaomi2s;
		},
		getUrlRef: function () {
		    var url = decodeURIComponent(location.href);
		    var type = unital.type = {
		        'ref' : '',
		        'activityName' : '',
		        'of' : '',
		        'ifs' : '',
		        'ch' : '',
		        'chids' : '',
		        'dref' : ''
		    }
		    unital.type.ifs = unital.ifmarking;
		    if(url.indexOf("ref") !== -1 && url.match(/(\?|\&)ref=(\w+)/)) {
		        type.ref = url.match(/(\?|\&)ref=(\w+)/)[2];
		    } else {
		        type.ref = 'ewhtml5';
		    }

		    if(url.indexOf("of") !== -1 && url.match(/(\?|\&)of=(\w+)/)) {
		        type.of = url.match(/(\?|\&)of=(\w+)/)[2];
		    }

		    if(url.indexOf("if") !== -1 && url.match(/(\?|\&)if=(\w+)/)) {
		        type.ifs = url.match(/(\?|\&)if=(\w+)/)[2];
		    }

		    if(url.indexOf("chid") !== -1 && url.match(/(\?|\&)chid=(\w+)/)) {
		        type.chids = url.match(/(\?|\&)chid=(\w+)/)[2];
		    }

		    if(url.indexOf("ch") !== -1 && url.match(/(\?|\&)ch=(\w+)/)) {
		        type.ch = url.match(/(\?|\&)ch=(\w+)/)[2];
		    }

		    if(url.indexOf("dref") !== -1 && url.match(/(\?|\&)dref=(\w+)/)) {
		    	type.dref = url.match(/(\?|\&)dref=(\w+)/)[2];
		    }

		    if(url.indexOf('index.html') !== -1 && url.match(/\/((\w+)|(\w+-\w+))\/index.html/)) {
		        type.activityName = url.match(/\/((\w+)|(\w+-\w+))\/index.html/)[1];
		    }
		    return type;
		},

		isIphAnd: function (){
			var ua = navigator.userAgent;

		    var  winphone = ua.match(/Windows Phone/);
		    if(winphone) {
		        html.addClass('winphone');
		    } else {
		        var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
		        var pad = !ua.match(/Mobile/);
		        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
		        var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
		        var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
		        var mac = ua.match(/.*(Mac OS).*Version\/([\w.]+).*(Safari).*/);
		        
		        // Android
		        if (android) {
		            html.addClass('android' + (pad ? " pad" : ""));
		        }

		        if (ipad || iphone || ipod || mac) {
		            html.addClass('ios');
		        }
		        if (iphone || ipod) {
		            html.addClass('iphone');
		        }
		        if (ipad) {
		            html.addClass('ipad');
		        }


		        // 无法检测到的机型按android处理
		        if(!android && !ipad && !iphone && !ipod) {
		          html.addClass('android');
		        }
		    }

		    //根据分辨率跟点距判断是否pad
		    var isPad = false;
		    var ratio = typeof devicePixelRatio !== "undefined" ? devicePixelRatio : 1;
		    var needDivideRatio = screen.width / document.body.clientWidth !== 1 && screen.height / document.body.clientHeight !== 1;

		    var width = needDivideRatio ? screen.width / ratio : screen.width;
		    var height = needDivideRatio ? screen.height / ratio : screen.height;

		    isPad = width >= 600 && height >= 600;

		    if(isPad) {
		        html.addClass('pad');
		    }
		}
	};

	window.unital = unital;

	unital.isIphAnd();
	unital.getUrlRef();
	module.exports = unital;
