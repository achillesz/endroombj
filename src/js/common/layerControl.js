
var unital = require('./unital');

var layerControl = {
		showNum : 0,
		state : false,
		show : function() {
			layerControl.showNum += 1;
			if($('.mask-layer').length == 0) {
				$("<div class='mask-layer'></div>").appendTo($('body'));
			}

			if(!unital.isPC() && !$('body').hasClass('fixed') && !unital.isMi2s()) {
				$('body').addClass('fixed');
			} else {
				$('body').css('overflow','hidden');
			}

			if(!layerControl.state) {
				$('.mask-layer').show();
				layerControl.state = true;
			}

			
		},
		hide : function() {
			
			if(layerControl.showNum > 0) {
				layerControl.showNum --;
			}

			if(!layerControl.state) return;

			if(layerControl.showNum == 0) {
				$('.mask-layer').hide();
				layerControl.state = false;
				$('body').removeClass('fixed');
				$('body').css('overflow','auto');
			}
			
		}
	}
	
module.exports = layerControl;
