
    
    var lazyLoad = {};

    var content = null;

    lazyLoad = {
        handleLazy: function() {
            content = $('body').eq(0);
            $(document).off('scroll', lazyLoad.handleLazyLoad).on('scroll', lazyLoad.handleLazyLoad);
            //为兼容IE6、7、8
            if(window.ActiveXObject) {
                document.body.onmousewheel = function(event) {
                    lazyLoad.handleLazyLoad();
                    //只未兼容IE6
                    if(document.documentElement.scrollTop + document.body.scrollTop > 100) {
                        $(".list-top").show();
                    } else {
                        $(".list-top").hide();
                    }
                }
            }

            lazyLoad.handleLazyLoad();
        },
        getElementVisibleTop: function(element) {
            var actualTop = element.offsetTop;
    　　　　  var current = element.offsetParent;

    　　　　 while (current !== null){
    　　　　　　 actualTop += current.offsetTop;
    　　　　　　 current = current.offsetParent;
    　　　　 }

    　　　　 return actualTop;
    　　 },
        handleLazyLoad : function() {  // window.pageYOffset  IE8以前不支持   
            var documentTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            var screenHeight = window.screen.height;

            $('.page-content').eq(0).find('img[src-set]').each(function(){
                var elemIsVisible = this;
                //隐藏的img，找到一直未隐藏的上一级元素，用该元素位置做判断
                if(this.offsetParent == null) {
                    //判断是否已找到未隐藏的上一级元素
                    if(!this.visibleParent) {
                        var parent = this.parentElement;

                        while(!!parent && !parent.offsetParent) {
                            parent = parent.parentElement;
                        }

                        //若所有父节点都为隐藏，则立即加载该图片
                        if(!parent) {
                            lazyLoad.loadImg(this);
                            return true;
                        } else {
                            elemIsVisible = parent;
                            //将该元素保存起来，避免重复查找
                            this.visibleParent = parent;
                        }
                    } else {
                        elemIsVisible = this.visibleParent;
                    }
                }
                //当判断的元素在可视区域下方50像素以内开始加载图片
                if(lazyLoad.getElementVisibleTop(elemIsVisible) - documentTop  < screenHeight + 50) {
                    lazyLoad.loadImg(this);
                }
            });
        },
        loadImg: function(img) {
            var _img = $(img);
            var url = _img.attr('src-set');

            if(!!url) {
                _img.attr('src', url);
                _img.removeAttr('src-set');
            }
        }
        
    };
    
    
    module.exports = lazyLoad;
