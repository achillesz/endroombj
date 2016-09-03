          //打点
                TJObject.cspot = 'roomdetail';
                TJObject.et = 'click';
                tjMVT.setData(TJObject);
                e.stopPropagation();
                
                
                
                <script type="text/javascript">
                var int = setInterval(
                	function(){
                		if(window.tjClient){
                			window.tjClient.setChannel(pageInfo.subPath, 'H5_${pageID}', '${orderFrom}', '${cardno}');
                			if( int ){
                				clearInterval(int);
                			}
                		}
                	}
                	,800);
                </script>
                
                <!-- tj start -->
                <script type="text/javascript" src="http://m.elongstatic.com/static/webapp/tj/tjmvt.js"></script>
                <!-- OM-->
                <#if "${tjSwitch}" == "1">
                <script src="http://m.elongstatic.com/static/webapp/tj/omsatellite.js"></script>
                </#if>
                <script type="text/javascript">
                TJObject.et = "show";
                tjMVT.setData(TJObject);
                
                function tjClickEvent() {
                	TJObject.et = "click";
                	var dataTj = $(this).data("tj");
                	if(typeof dataTj == "string")
                		dataTj = JSON.parse(dataTj);
                	dataTj = dataTj || {};
                	
                	for(var i in dataTj)
                		TJObject[i] = dataTj[i];
                	TJObject.st = new Date().getTime();
                	tjMVT.setData(TJObject);
                }
                $('.pages').off("click",".tjclick",tjClickEvent).on("click",".tjclick",tjClickEvent);
                </script>
                
                
                
                              $('.fastchoose > ul li').each(function() {
                                    var _this = $(this);
                                    if(!_this.hasClass('on')) {
                                        if (_this.text() == '到店付') {
                                            _this.addClass("tjclick").attr('data-tj', '{"cspot":"paymentInHotel"}');
                                        } else if(_this.text() == '免费取消') {
                                            _this.addClass("tjclick").attr('data-tj', '{"cspot":"freeCancellation"}');
                                        } else if(_this.text() == '立即确认') {
                                            _this.addClass("tjclick").attr('data-tj', '{"cspot":"instantConfirm"}');
                                        }
                                    } else {
                                        _this.removeClass('tjclick');
                                    }
                                });