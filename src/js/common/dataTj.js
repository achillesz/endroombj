/**
 *http://res.wx.qq.com/open/js/jweixin-1.0.0.js,
 * http://api.map.baidu.com/api?v=1.3,
 * http://promotion.elong.com/wireless/H5/html/CommonJS/tjMVT.js,
 * http://promotion.elong.com/wireless/H5/html/CommonJS/dataTj.js,
 * http://m.elongstatic.com/static/webapp/bridge/bridge-1.1.1.js,
 * http://promotion.elong.com/wireless/H5/html/CommonJS/WeixinShareEx.js
 */
/**
 * 活动页面打点统计
 */

/**
 * 表示是否发送过统计，
 * 页面刷新后会改变此值
 * true(已发送过统计);
 * false(没有发送过统计);
 */

//window.isSend=false;
/**
 * 第二版方式，dom 加载和渲染完成各执行一次
 */

window.onload = function () {
	var Tjdata = {
				getTjObject:function(){
						var tjObject = window.TJObject || new Object();
						tjObject.et="show";
				    	tjObject.biz="h5_promotion";
				     /**
				      * chid :统计(第二重)
				      */
				    var ref=getQueryString("ref");
				    if (ref!=null && ref!="") {
				    	tjObject.chid=ref;
				    } else{
				    	tjObject.chid="h5_promotion";
				    } 
					/*var ch=getQueryString("ch");
					if (ch!=null && ch!="") {
						tjObject.ch=ch;
					}else{
						tjObject.ch="h5-adbanner";
					}
					
					var userAgent=navigator.userAgent;
					if(userAgent==undefined){
						tjObject.v="wei xin default version";
					}else{
					var index=userAgent.lastIndexOf("/");
					var appVersion=userAgent.substring(index+1);
					var pattern=/^\d(.)\d{0,1}(.)\d/;
					if (appVersion.match(pattern)!=null) {
						tjObject.v=appVersion;
					} else{
						tjObject.v="wei xin default version";
					}
						
					}
					
					
					var of=getQueryString("of");
					if (of!=null && of!="") {
						tjObject.of=of;
					}else{
						tjObject.of=20000;
					}
					//获取if
					var str=document.location.href; 
					var iffirstIndex=str.indexOf("=");
					var ifsecondIndex=str.indexOf("&");
					var _if=str.substring(iffirstIndex+1,ifsecondIndex);
					var n_if=Number(_if);
					if (_if!=null && _if!="" && !isNaN(n_if)) {
						tjObject.inf=_if;
					}else{
						var  _if=getQueryString("if");
						var n_if=Number(_if);
						 if(_if!=null && _if!="" && !isNaN(n_if)){
						 	tjObject.inf=_if;
						 }
					}*/
					
					/**
					 * bns:统计客户端类型
					 * 1—App ;2—Html5;3—Affiliate;4—PC;99—Unkown
					 */
					//tjObject.bns=2;
					// pt 页面名称统计
					var promotionTitle=$("title").text();
					tjObject.pt=promotionTitle;
					/**
					 * 修改URL,因为app端或许会重置统计参数，导致数据不准确
					 */
					/*var url=document.location.href;
					if (url!=null && url!="") {
						var index=url.indexOf("?");
						url=url.substr(0,index);
						tjObject.pturl=url;
						return tjObject;
					}*/

						return tjObject;
					
					

					
					
				},
					
					/**
					 * 其他2个参数:
					 * sid(h5SessionId)
					 * cid(h5CookieId)
					 * 需要在ajax 回调之后获取数据发送，并统计真实的pv
					 */

					getCookie:function(name){
						var cookieArr=document.cookie.split("; ");
						for (var i=0;i<cookieArr.length;i++) {
							var cookie=cookieArr[i].split("=");
							if (cookie[0]==name) {
								return cookie[1];
							} 
						}
						return "";
					},
					/**
					 *  cin 用于统计日志丢失率
					 *  先自增，再发送数据
					 */
					/**
					getCin:function(){
						var cin=Tjdata.getCookie("cin");
						if (cin=="" || cin==null || cin==undefined) {
							cin=1;
						} else{
							cin=parseInt(cin)+1;
						}
						Tjdata.setCookie("cid",cin);
						return cin;			
					},
					*/
					/**
					 * 设置cookie
					 * @param {Object} name
					 * @param {Object} value
					 */
					setCookie:function(name,value){
						var expires=60*24*60*60*1000;
						document.cookie=name+"="+value+";expires="+expires;
					},
					/**
					 * 生成UUid
					 */
					createUUid:function(){
						 var s = [];
						    var hexDigits = "0123456789abcdef";
						    for (var i = 0; i < 36; i++) {
						        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
						    }
						    s[14] = "4"; 
						    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  
						    s[8] = s[13] = s[18] = s[23] = "-";
						    var uuid = s.join("");	
						    return uuid;
					},
					sendData:function(){
						//增加一个参数,tjObject
			             /**
			             * 数据回来触发时机
			             */
					//	$.extend(tjObject,{})
			            var tjObject=Tjdata.getTjObject();
							tjMVT.setData(tjObject);
			            //判断是否需要发送
			//          if (window.isSend==false || window.isSend==undefined) {
			//              tjMVT.setData(tjObject);
			//              window.isSend=true ;
			//          }
						/**
						var cookieArray=document.cookie.split("; ");
						if(cookieArray.toString().contains("sendTotal")){
							var sendTotal=document.getCookie("sendTotal");
							
							if (sendTotal==undefined ||sendTotal=0) {
								sendTotal=0;
								tjMVT.setData(tjObject);
								sendTotal+=sendTotal;
								document.setCookie("sendTotal",sendTotal);
							} else if(sendTotal==1){
								tjMVT.setData(tjObject);
								document.setCookie("sendTotal",0);					
							}				
						}else{
							var sendTotal;
							if (sendTotal==undefined ||sendTotal=0) {
								sendTotal=0;
								tjMVT.setData(tjObject);
								sendTotal+=sendTotal;
								document.setCookie("sendTotal",sendTotal);
							} else if(sendTotal==1){
								tjMVT.setData(tjObject);
								document.setCookie("sendTotal",0);					
							}				
							
						}
						*/
						
					}
			};

			
var getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = decodeURI(window.location.href).substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
};

Tjdata.sendData();

}




   		
			



