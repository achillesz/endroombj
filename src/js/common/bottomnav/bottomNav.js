var $ = require('../../../../lib/jquery');
var h5bottomnavmustache = require('./H5bottomnav.mustache');
var pcbottomnavmustache = require('./pcbottomnav.mustache');
    
function BottomNav(){


}



BottomNav.prototype.init = function (conference) {


    if(unital.isPC()) {

        this.pcdom(conference);

    } else {

        this.h5dom(conference);
        this.bindEvents();
    }

    this.parameterUrl();
    this.linkurl();
};

BottomNav.prototype.preFormDataItem = function (conference) {
   
    var data = {};
        data.mainMUrl = conference.mainMUrl;
        data.meetingPic = conference.meetingPic;
        data.meetingColor =conference.meetingColor;
        data.miaoshalink = 'http://miaosha.mp.elong.com/miaosha/myorders';

    if(conference.secskillGuid) {
        data.flag = false;
        
       
    } else {
        data.flag = true;
    }
    if(conference.semeeting) {
        //    分会场   
        var sessionlen = conference.semeeting.semeetCount;
    }
    

    data.list = [];
    for(var i = 1;i <= sessionlen;i++) {

        data.list.push({semeetName: conference.semeeting['semeetName'+i], semenetUrl: conference.semeeting['semenetUrl'+i]});
    }
    return data;

}; 

BottomNav.prototype.h5dom = function (conference) {

   $('body').append(h5bottomnavmustache(this.preFormDataItem(conference)));


};


BottomNav.prototype.pcdom = function (conference) {

   $('body').append(pcbottomnavmustache(this.preFormDataItem(conference)));
  

};

BottomNav.prototype.bindEvents = function () {

    
    $(".parallelSessions").click(function(){
            
        $(".ceilingNav").addClass("ceilingNav_up").next().removeClass("parallelNav_up");
        $(".pop").show();
    })


    $(".parallel_close,.pop").click(function(){

        $(".parallelNav").addClass("parallelNav_up").prev().removeClass("ceilingNav_up");
        $(".pop").hide();            
    })


    $(".ceil_ul li").each(function(){

        var _this = $(this);
        var meetingColor = _this.parent('.ceil_ul').attr('meetingColor');


        _this.click(function(){
            _this.css('background-color',meetingColor).siblings().css('background-color','#fff');

        })
    })

    

};

BottomNav.prototype.linkurl = function () {
    item = $(".hotellink");
     item.on("click",function() {
        var hotellink = $(this).attr("hotellink");
        window.location.href = hotellink;
    });
}

BottomNav.prototype.parameterUrl = function () {
        var item = $(".hotellink");
        var urlParam = unital.type;
        var detailUrl = '';

        for(var i = 0; i < item.length; i++) {
            detailUrl = item.eq(i).attr('hotellink');
            if(detailUrl.indexOf('?') != -1) {
                if (urlParam && urlParam.ifs && urlParam.ifs.length > 0) {
                    detailUrl += '&if=' + urlParam.ifs;
                }

                if (urlParam && urlParam.of && urlParam.of.length > 0) {
                    detailUrl += '&of=' + urlParam.of;
                }

                if (urlParam && urlParam.ch && urlParam.ch.length > 0) {
                    detailUrl += '&ch=' + urlParam.ch;
                }

                if (urlParam && urlParam.chids && urlParam.chids.length > 0) {
                    detailUrl += '&chid=' + urlParam.chids;
                }
            } else {
                if (urlParam && urlParam.ifs && urlParam.ifs.length > 0) {
                    detailUrl += '?if=' + urlParam.ifs;
                }

                if (urlParam && urlParam.of && urlParam.of.length > 0) {
                    detailUrl += '?of=' + urlParam.of;
                }

                if (urlParam && urlParam.ch && urlParam.ch.length > 0) {
                    detailUrl += '?ch=' + urlParam.ch;
                }

                if (urlParam && urlParam.chids && urlParam.chids.length > 0) {
                    detailUrl += '?chid=' + urlParam.chids;
                }
            }
            
           item.eq(i).attr('hotellink',detailUrl);
        }
        
       

};
module.exports = BottomNav;
//exports.bottomNam = BottomNav;
