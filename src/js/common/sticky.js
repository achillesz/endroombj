var $ = require('../../../lib/jquery');

function Sticky() {

}

Sticky.prototype.init = function () {
    this.element = $('#cityBar')[0];
    this.palceHolder = $('.placeholder');
    
    var _this = this;

    if(this.isSupportSticky()) {
        $('.main').css('overflow', 'visible')
        $(this.element).addClass('sticky');
    } else {
        var _this = this;
        if(window.saleReady) {
              this.fixPos = _this.element.parentNode.offsetTop;
              this.bindEvents(); 
        } 
        $('.banner-div img')[0].addEventListener('load', function () {
            _this.fixPos = _this.element.parentNode.offsetTop;
            _this.bindEvents();
        })
    }


};

Sticky.prototype.isSupportSticky = function () {
    var prefixTestList = ['', '-webkit-', '-ms-', '-moz-', '-o-'];
    var stickyText = '';
    for (var i = 0; i < prefixTestList.length; i++ ) {
        stickyText += 'position:' + prefixTestList[i] + 'sticky;';
    }
    // 创建一个dom来检查
    var div = document.createElement('div');
    var body = document.body;
    div.style.cssText = 'display:none;' + stickyText;
    body.appendChild(div);
    var isSupport = /sticky/i.test(window.getComputedStyle(div).position);
    body.removeChild(div);
    div = null;
    return isSupport;
}

Sticky.prototype.bindEvents = function () {

    this.handleProxyScroll = $.proxy(this.handleScroll, this);
    window.addEventListener('scroll', this.handleProxyScroll);

    this.handleProxyOrientation = $.proxy(this.handleOrientation, this);
    window.addEventListener('orientationchange', this.handleProxyOrientation);
};

Sticky.prototype.handleOrientation = function () {
    var _this = this;
    setTimeout(function () {
        _this.fixPos = _this.element.parentNode.offsetTop;
    }, 800)


};

Sticky.prototype.handleScroll = function() {
    var h = $(this.element).height();
  //  $('.getin').html(window.scrollY + '<br>' + this.fixPos);

   if(window.scrollY >= this.fixPos) {
       this.palceHolder.height(h).show();
       this.element.classList.add('nav-fixed');
   } else {
       this.palceHolder.height(0).hide();
       this.element.classList.remove('nav-fixed');
   }
};

module.exports = Sticky;


