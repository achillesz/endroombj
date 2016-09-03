
		
	var layerControl = require('./layerControl'),
	unital = require('./unital');
    
		
　　 　　 var html = $("html");
	var plugin={};

	plugin = {
	    loadingTmp : '<div class="loading hide"><div class="content"></div></div>',
	    alertTmp : '<div class="dialog hide"><div class="error"> <p class="content"></p><p class="error_btn">确定</p></div></div>',
	    loading : $('.loading'),
	    dialog : $('.dialog'),
	    init : function() {
	        plugin.loading = $(this.loadingTmp);
	        plugin.dialog = $(this.alertTmp);
	        $('.page-content').append(this.loading).append(this.dialog);

	    },
	    startLoading: function() {
	        plugin.loading.show();
	        layerControl.show();
	    },
	    stopLoading: function() {
	        plugin.loading.hide();
	        layerControl.hide();
	    },
	    dialogShow : function() {
	        plugin.dialog.show();
	        layerControl.show();
	    },
	    dialogHide : function() {
	        plugin.dialog.hide();
	        layerControl.hide();
	    },
	    alert: function(msg) {
	        if( (typeof msg !== 'string') && !!msg) return;
	        plugin.dialog.find('.content').text(msg);
	        plugin.dialogShow();
	        plugin.dialogEventBind();
	    },
	    dialogEventBind : function() {
	        plugin.dialog.find('.error_btn').off('click').on('click', function() {
	            plugin.dialogHide();
	        });
	    }
	}
		plugin.init();
        
        module.exports = plugin;
