$.ajaxSetup({
	 async : false
});
(function($) {
    jQuery.fn.imageMaps = function(setting) {
        var $container = this;
        if ($container.length == 0) return false;
		$container.each(function(){
			var container = $(this);
			var $images = container.find('img[ref=imageMaps]');
			$images.wrap('<div class="image-maps-conrainer" style="position:relative;"></div>').css('border','1px solid #ccc');
			$images.each(function(){
				var _img_conrainer = $(this).parent();
				_img_conrainer.append('<div style="display:none" class="button-conrainer "><input type="button"  value="添加标注" /></div>').append('<div style="display:none" class="link-conrainer"></div>').append($.browser.msie ? $('<div class="position-conrainer" style="position:absolute"></div>').css({
					background:'#fff',
					opacity:0
				}) : '<div class="position-conrainer" style="position:absolute"></div>');
				var _img_offset = $(this).offset();
				var _img_conrainer_offset = _img_conrainer.offset();
				_img_conrainer.find('.position-conrainer').css({
					top: _img_offset.top - _img_conrainer_offset.top,
					left: _img_offset.left - _img_conrainer_offset.left,
					width:$(this).width(),
					height:$(this).height(),
					border:'1px solid transparent'
				});
				var map_name = $(this).attr('usemap').replace('#','');
				if(map_name !=''){
					var index = 1;
					var _link_conrainer = _img_conrainer.find('.link-conrainer');
					var _position_conrainer = _img_conrainer.find('.position-conrainer');
					var image_param = $(this).attr('name') == '' ? '' : '['+ $(this).attr('name') + ']';
					container.find('map[name='+map_name+']').find('area[shape=rect]').each(function(){
						var coords = $(this).attr('coords');
						var title="";
						$.post(getPath()+"/ebhouse/decorating/get360Data",{fid:$(this).attr("cid")},function(dt){
								if(dt.imagePoint){
									$(dt.imagePoint).each(function(){
										if(map_name==this.image.id){
											var option="<option>无链接</option>";
											$(".imageText").each(function(){
												option+="<option value='"+$(this).attr("value")+"'>"+$(this).attr("name")+"</option>";
											});
											title = this.title;
											_link_conrainer.append('<p ref="'+index+'" class="map-link"><span class="link-number-text">标注 '+index+'</span>:标题 <input  type="text" size="60" name="title" value="'+this.title+'" />描述：<input name="remark" type="text" value="'+this.remark+'" /> 单价：<input  value="'+this.price+'" name="price" type="text" />链接:<select name="link">'+option+'</select><input type="hidden" class="rect-value" value="'+this.left+","+this.top+","+this.width+","+this.height+'" /></p>');
											
										}
									});
								}
						},"json");
						coords = coords.split(',');
						_position_conrainer.append('<div ref="'+index+'" class="map-position" style="left:'+coords[0]+'px;top:'+coords[1]+'px;width:'+(coords[2])+'px;height:'+(coords[3])+'px;"><div class="map-position-bg"></div><span class="link-number-text"> '+title+'</span><span class="delete">X</span><span class="resize"></span></div>');
						index++;
					});
				}
			});
			
		});
		
		$('.button-conrainer input[type=button]').click(function(){
			var option="<option>无链接</option>";
			$(".imageText").each(function(){
				option+="<option value='"+$(this).attr("value")+"'>"+$(this).attr("name")+"</option>"
			});
			var _link_conrainer = $(this).parent().parent().find('.link-conrainer');
			var _position_conrainer = $(this).parent().parent().find('.position-conrainer');
			var index = _link_conrainer.find('.map-link').length +1;
			var image = $(this).parent().parent().find('img[ref=imageMaps]').attr('name');
			image = (image == '' ? '' : '['+ image + ']');
			_link_conrainer.append('<p ref="'+index+'" class="map-link"><span class="link-number-text">标注 '+index+'</span>:标题 <input  type="text" size="60" name="title" value="" />描述：<input name="remark" type="text" /> 单价：<input name="price" type="text" />链接:<select name="link">'+option+'</select><input type="hidden" class="rect-value" name="rect'+image+'[]" value="10,10,100,40" /></p>');
			var mapid=$(this).closest(".image-maps-conrainer").find("img").attr("usemap");
			var p = $("img[usemap='"+mapid+"']").closest(".image-maps-conrainer").position();
			// var t=p.top;
			var l;
			if(Math.abs(p.left)!=410){
					l=Math.abs(p.left)+410;
			}else{
				l=Math.abs(p.left);
			}
			_position_conrainer.append('<div ref="'+index+'" class="map-position" style="left:'+l+'px;top:0px;width:90px;height:30px;"><div class="map-position-bg"></div><span class="link-number-text">标题'+index+'</span><span class="delete">X</span><span class="resize"></span></div>');
			bind_map_event();
			define_css();
		});
		
		
		//绑定map事件
		function bind_map_event(){
			$('.position-conrainer .map-position .map-position-bg').each(function(){
				var map_position_bg = $(this);
				var conrainer = $(this).parent().parent();
				map_position_bg.unbind('mousedown').mousedown(function(event){
					map_position_bg.data('mousedown', true);
					map_position_bg.data('pageX', event.pageX);
					map_position_bg.data('pageY', event.pageY);
					map_position_bg.css('cursor','move');
					return false;
				}).unbind('mouseup').mouseup(function(event){
					map_position_bg.data('mousedown', false);
					map_position_bg.css('cursor','default');
					return false;
				});
				conrainer.mousemove(function(event){
					if (!map_position_bg.data('mousedown')) return false;
                    var dx = event.pageX - map_position_bg.data('pageX');
                    var dy = event.pageY - map_position_bg.data('pageY');
                    if ((dx == 0) && (dy == 0)){
                        return false;
                    }
					var map_position = map_position_bg.parent();
					var p = map_position.position();
					var left = p.left+dx;
					if(left <0) left = 0;
					var top = p.top+dy;
					if (top < 0) top = 0;
					var bottom = top + map_position.height();
					if(bottom > conrainer.height()){
						top = top-(bottom-conrainer.height());
					}
					var right = left + map_position.width();
					if(right > conrainer.width()){
						left = left-(right-conrainer.width());
					}
					map_position.css({
						left:left,
						top:top
					});
					map_position_bg.data('pageX', event.pageX);
					map_position_bg.data('pageY', event.pageY);
					
					bottom = top + map_position.height();
					right = left + map_position.width();
					$('.link-conrainer p[ref='+map_position.attr('ref')+'] .rect-value').val(new Array(left,top,right,bottom).join(','));
					return false;
				}).mouseup(function(event){
					map_position_bg.data('mousedown', false);
					map_position_bg.css('cursor','default');
					return false;
				});
			});
			$('.position-conrainer .map-position .resize').each(function(){
				var map_position_resize = $(this);
				var conrainer = $(this).parent().parent();
				map_position_resize.unbind('mousedown').mousedown(function(event){
					map_position_resize.data('mousedown', true);
					map_position_resize.data('pageX', event.pageX);
					map_position_resize.data('pageY', event.pageY);
					return false;
				}).unbind('mouseup').mouseup(function(event){
					map_position_resize.data('mousedown', false);
					return false;
				});
				conrainer.mousemove(function(event){
					if (!map_position_resize.data('mousedown')) return false;
                    var dx = event.pageX - map_position_resize.data('pageX');
                    var dy = event.pageY - map_position_resize.data('pageY');
                    if ((dx == 0) && (dy == 0)){
                        return false;
                    }
					var map_position = map_position_resize.parent();
					var p = map_position.position();
					var left = p.left;
					var top = p.top;
					var height = map_position.height()+dy;
					if((top+height) > conrainer.height()){
						height = height-((top+height)-conrainer.height());
					}
					if (height <20) height = 20;
					var width = map_position.width()+dx;
					if((left+width) > conrainer.width()){
						width = width-((left+width)-conrainer.width());
					}
					if(width <50) width = 50;
					map_position.css({
						width:width,
						height:height
					});
					map_position_resize.data('pageX', event.pageX);
					map_position_resize.data('pageY', event.pageY);
					
					bottom = top + map_position.height();
					right = left + map_position.width();
					$('.link-conrainer p[ref='+map_position.attr('ref')+'] .rect-value').val(new Array(left,top,right,bottom).join(','));
					return false;
				}).mouseup(function(event){
					map_position_resize.data('mousedown', false);
					return false;
				});
			});
			$('.position-conrainer .map-position .delete').unbind('click').click(function(){
				
				var ref = $(this).parent().attr('ref');
				var _link_conrainer = $(this).parent().parent().parent().find('.link-conrainer');
				var _position_conrainer = $(this).parent().parent().parent().find('.position-conrainer');
				_link_conrainer.find('.map-link[ref='+ref+']').remove();
				_position_conrainer.find('.map-position[ref='+ref+']').remove();
				var ret=$("#tab li[class='map-marknow']").attr("ret");
				$(".map-tab[ref='"+ret+"'] .map-tablist").each(function(){
					if($(this).attr("ref")==ref){
						$(this).remove();
					}
				});
				/*var index = 1;
				_link_conrainer.find('.map-link').each(function(){
					$(this).attr('ref',index).find('.link-number-text').html('标题 '+index);
					index ++;
				});
				index = 1;
				_position_conrainer.find('.map-position').each(function(){
					$(this).attr('ref',index).find('.link-number-text').html('标题 '+index);
					index ++;
				});*/
			});
		}
		
		bind_map_event();
		
		function define_css(){
			//样式定义
			$container.find('.map-position').css({
				position:'absolute',
				border:'0',
				'font-weight':'bold',
				'padding':'10px'
				
			});
			$container.find('.map-position .map-position-bg').css({
				position:'absolute',
				background:'none repeat scroll 0 0 #fff',
				border: '3px solid #000',
				opacity:0.5,
				cursor: 'pointer',
				top:0,
				left:0,
				right:0,
				bottom:0
			});
			$container.find('.link-number-text').css({
				position:'absolute',
				color:'#ff0000',
			    'font-size':16,
			    'font-family':'Arial',
			    align:'center'
			});
			$container.find('.map-position .resize').css({
				display:'block',
				position:'absolute',
				right:0,
				bottom:0,
				width:5,
				padding:5,
				cursor:'nw-resize'
				
			});
			$container.find('.map-position .delete').css({
				display:'block',
				position:'absolute',
				right:0,
				top:0,
				width:10,
				height:12,
				'line-height':'11px',
				'font-size':12,
				'font-weight':'bold',
                background:'#000',
				color:'#fff',
				'font-family':'Arial',
				'padding-left':'2px',
				cursor:'pointer',
				opactiey : 1
			});
		}
		define_css();
    };
})(jQuery); 

function save360(){
	var data="[";	
	
	$(".imageText").each(function(j){
		var pthis=this;
		var count = $(this).closest("div").find(".map-link .rect-value").length;
		$(this).closest("div").find(".map-link .rect-value").each(function(i){
			var json="{";
			json+="image:{id:'"+$(pthis).val()+"'},";
			json+="title:'"+$(".map-tab[ref='"+$(pthis).val()+"'] .map-tablist[ref='"+$(this).closest("p").attr("ref")+"']").find("input[name='title']").val()+"',";
			if($(".map-tab[ref='"+$(pthis).val()+"'] .map-tablist[ref='"+$(this).closest("p").attr("ref")+"']").find("input[name='price']").val()==''){
				json+="price:0,";
			}else{
				json+="price:"+$(".map-tab[ref='"+$(pthis).val()+"'] .map-tablist[ref='"+$(this).closest("p").attr("ref")+"']").find("input[name='price']").val()+",";
			}
			json+="remark:'"+$(".map-tab[ref='"+$(pthis).val()+"'] .map-tablist[ref='"+$(this).closest("p").attr("ref")+"']").find("input[name='remark']").val()+"',";
			json+="picUrl:'"+$(".map-tab[ref='"+$(pthis).val()+"'] .map-tablist[ref='"+$(this).closest("p").attr("ref")+"']").find("input[name='picUrl']").val()+"',";
			json+="picName:'"+$(".map-tab[ref='"+$(pthis).val()+"'] .map-tablist[ref='"+$(this).closest("p").attr("ref")+"']").find("input[name='picName']").val()+"',";
			json+="remarkHtml:'"+$(".map-tab[ref='"+$(pthis).val()+"'] .map-tablist[ref='"+$(this).closest("p").attr("ref")+"']").find("input[name='remarkHtml']").val()+"',";
			var strarr = $(this).closest(".image-maps-conrainer").find(".position-conrainer .map-position[ref='"+$(this).closest("p").attr("ref")+"']");
			json+="left:"+strarr.css("left").replace("px","")+",";
			json+="top:"+strarr.css("top").replace("px","")+",";
			json+="height:"+strarr.css("height").replace("px","")+",";
			json+="width:"+strarr.css("width").replace("px","")+",";
			/*var strarr = $(this).closest(".image-maps-conrainer").find(".position-conrainer .map-position[ref='"+$(this).closest("p").attr("ref")+"']");
			json+="left:"+strarr.css("left").replace("px","")+",";
			json+="top:"+strarr.css("top").replace("px","")+",";
			json+="height:"+strarr.css("height").replace("px","")+",";
			json+="width:"+strarr.css("width").replace("px","")+",";*/
			json+="decId:'"+decId+"',";
			json+="type:'"+$(".map-tab[ref='"+$(pthis).val()+"'] .map-tablist[ref='"+$(this).closest("p").attr("ref")+"']").find("select[name='link']").val()+"'";
			json+="}";
			if(count-1>i){
				json+=",";
			}
			data+=json;
		});
		if(count>0 && j<$(".imageText").length-1){
			data+=",";
		}
	});
	data+="]";
	$.post(getPath()+"/ebhouse/decorating/save360",{dataStr:data,decId:decId},function(res){
		if(res.MSG){
			art.dialog.alert(res.MSG);
		}else{
			art.dialog.tips("保存成功！")
		}
	},"json")
}