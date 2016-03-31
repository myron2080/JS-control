/**
 * 自动补全控件
 * @since 2015-8-7 14:29:24
 * @author li.biao
 */
var AutoComp = {
	sets:{
		//paramKey 增加参数 ... 描述 :对应页面 input标签 的key为该参数值的 参数 传至后台查询
		type:1,//1：方式一
		ctrlUrl:base+'/framework/autocomp/listAllname',
		ctrlId:'ctrl_autocomp',
		seletor:'[autocomp]',//autocomp="{id:'autoPerson',type:1,width:'300px',param:'{number:\'W\'}',tagId:'acId[id]|longNumber[longnumber]',backFun:'testBack'}"
		width:'150px',
		level:100
	},
	init:function(o){
		$.extend(this.sets,o);
		if(this.sets.type === 1){
			
		}
		var _this = this ;
		$(this.sets.seletor).each(function(){
			var _seletor=this;
			//判断标签是否已经初始化
			if(!$(_seletor).hasClass("ctrl_ac_txt")){
				$(_seletor).wrap(_this.wrapHtml(_seletor));
				$(_seletor).addClass('ctrl_ac_txt');
				//获取焦点执行查询   改用one只执行一次 为了解决分页执行三次问题
				/*$(_seletor).one("focus",function(){
					_this.send(this);
				});*/
				//改回 by hyl 2015-12-09
				$(_seletor).focus(function(){
					_this.send(this);
				});
			}
		});
		//$(this.sets.seletor).blur(function(){
		//	_this.selectFirst(this);
		//});
		$(this.sets.seletor).keyup(function(event){
			var _keyCode = event.keyCode ;//keycode : 13 = Enter ,37 = Left , 38 = Up ,39 = Right ,40 = Down ，
			if(_keyCode != 13 && _keyCode !=37 && _keyCode !=38 && _keyCode !=39 && _keyCode !=40){
				if(8 == _keyCode || 46 == _keyCode){//删除
					var auto = $(this).attr("autocomp");
					eval("auto="+auto);
					var tagId = auto.tagId;
					if(tagId){
						var tags = tagId.split("|");
						for(var i = 0 ; i < tags.length ; i ++){
							var dom = tags[i].substring(0,tags[i].indexOf('['));
							if($.trim(this.value) == ""){
								$("#"+dom).val("");
							}
						}
					}
				}
				_this.send(this);
			}
			
		});
		$(window).keyup(function(event){
			var _keyCode = event.keyCode ;//keycode : 13 = Enter ,37 = Left , 38 = Up ,39 = Right ,40 = Down ，
			if(_keyCode == 13){//select first 
				_this.enter();
			}else if(_keyCode == 37){//page prev 
				_this.p_prev();
			}else if(_keyCode == 38){//page up 
				_this.up();
			}else if(_keyCode == 39){//page next 
				_this.p_next();
			}else if(_keyCode == 40){//page down
				_this.down();
			}
		});
	},
	afterFilter:function(attr){//增加 自动补全 判断 函数 add by xqh 2015-09-15
		var auto = $(attr).attr("autocomp");
		eval("auto="+auto);
		if(auto.afterFilter){//有传 判断参数
			var _afterFilter = auto.afterFilter;
			if(window[_afterFilter]){
				if(!window[_afterFilter].call()){
					return false;
				}
			}
		}
		return true;
	},
	send:function(attr,page){
		if(!this.afterFilter(attr)){//
			return;
		}
		var auto = $(attr).attr("autocomp");
		eval("auto="+auto);
		var _keyword = $.trim($(attr).val());
		if(!auto.type){
			auto.type = this.sets.type ;
		}
		var _params = auto.param ;
		
		var _paramKey=auto.paramKey;
		
		eval("_params="+_params);
		if(!_params){
			_params = {} ;
		}
		
		/**
		 * 自动补全增加参数
		 */
		$("input[key='autocomp_params']").each(function(){
			_params[$(this).attr("id")]=$(this).val();
		});
		
		if(isNotNull(_paramKey)){
			$("input[key='"+_paramKey+"']").each(function(){
				_params[$(this).attr("id")]=$(this).val();
			});
		}
		if(!page){
			page = 1 ;
		}
		$.extend(_params,{keyword:_keyword,autoId:auto.id,autoType:auto.type,page:page});
		var _this = this;
		$.post(this.sets.ctrlUrl,_params,function(res){
			$("#"+_this.sets.ctrlId).remove();
			$(attr).after(res);
			$("#"+_this.sets.ctrlId+" li").click(function(){
				_this.select(this,attr,true);
			});
			$("#"+_this.sets.ctrlId+" .clearfix span").click(function(){//点击叉叉 关闭事件
				_this.close();
				var _closeFun = auto.closeFun;
				if(window[_closeFun]){
					window[_closeFun].call(null,attr);
				}
			});
		});
	},
	wrapHtml:function(attr){
		var auto = $(attr).attr("autocomp");
		eval("auto="+auto);
		var _clstype = "ctrl_autocomp"+this.sets.type;
		var _wrap = '<div style="position: relative; z-index:'+this.sets.level+';">';
		if(auto.width){
			_wrap += '<div class="'+_clstype+'" style="width:'+auto.width+';"></div> ';
		}else{
			_wrap += '<div class="'+_clstype+'" style="width:'+this.sets.width+';"></div> ';
		}
		_wrap += '</div>' ;
		this.sets.level -- ;
		return _wrap ;
	},
	select:function(clickObj,sourceObj,closeFlag){
		if(!closeFlag){
			closeFlag = false ;
		}
		var auto = $(sourceObj).attr("autocomp");
		eval("auto="+auto);
		var tagId = auto.tagId ;
		if(tagId){
			var tags = tagId.split("|");
			for(var i = 0 ; i < tags.length ; i ++){
				var dom = tags[i].substring(0,tags[i].indexOf('['));
				var filed = tags[i].substring(tags[i].indexOf('[')+1,tags[i].indexOf(']'));
				$("#"+dom).val($.trim($(clickObj).attr(filed)));
			}
		}
		
		$(sourceObj).val($.trim($(clickObj).find(".trueResult").text()));
		if(closeFlag){
			this.close();
		}
		var _backFun = auto.backFun;
		if(window[_backFun]){
			window[_backFun].call(null,clickObj,sourceObj);
		}
	},
	setValue:function(attr,line){
		var _clickObj = $("#"+this.sets.ctrlId+" li:eq("+line+")");
		this.select(_clickObj, attr);
	},
	close:function(){
		$("#"+this.sets.ctrlId).remove();
	},
	pageQuery:function(obj,page){
		var _clstype = "ctrl_autocomp" + this.sets.type;
		var _attr = $(obj).parents("."+_clstype).find(".ctrl_ac_txt");
		this.send(_attr, page);
	},
	enter:function(){
		var _ctrl = $("#"+this.sets.ctrlId);
		if(!_ctrl){
			return ;
		}
		var _attr = $(_ctrl).prev();
		var items = $(_ctrl).find("li");
		if(items && items.length > 0){
			var hitItem = $(_ctrl).find("li.hit");
			if(hitItem.length == 0){
				hitItem = $(_ctrl).find("li:first");
			}
			this.select(hitItem, _attr, true);
		}else{
			this.clean(_attr);
		}
	},
	up:function(){
		var _ctrl = $("#"+this.sets.ctrlId);
		if(!_ctrl){
			return ;
		}
		var _attr = $(_ctrl).prev();
		var items = $(_ctrl).find("li");
		if(items && items.length > 0){
			var hitItem = $(_ctrl).find("li.hit");
			if(hitItem.length == 0){
				$(_ctrl).find("li:first").addClass("hit");
				$(_ctrl).find("ul").attr("curr",0);
			}else{
				hitItem.prev().addClass("hit");
				hitItem.removeClass("hit");
				var currHit = $(_ctrl).find("ul").attr("curr");
				if(!currHit){
					currHit = 0 ;
				}
				$(_ctrl).find("ul").attr("curr",parseInt(currHit) == 0 ? 0 : (parseInt(currHit) - 1));
			}
		}
	},
	down:function(){
		var _ctrl = $("#"+this.sets.ctrlId);
		if(!_ctrl){
			return ;
		}
		var _attr = $(_ctrl).prev();
		var items = $(_ctrl).find("li");
		if(items && items.length > 0){
			var hitItem = $(_ctrl).find("li.hit");
			if(hitItem.length == 0){
				$(_ctrl).find("li:first").addClass("hit");
				$(_ctrl).find("ul").attr("curr",0);
			}else{
				hitItem.next().addClass("hit");
				hitItem.removeClass("hit");
				var currHit = $(_ctrl).find("ul").attr("curr");
				if(!currHit){
					currHit = 0 ;
				}
				$(_ctrl).find("ul").attr("curr",parseInt(currHit) == items.length ? items.length : (parseInt(currHit) + 1));
			}
		}
	},
	p_next:function(){
		var page = $("#"+this.sets.ctrlId+" .ctrl_ac_page").attr("page");
		page = parseInt(page);
		var pageCount = $("#"+this.sets.ctrlId+" .ctrl_ac_page").attr("pageCount");
		if(page == pageCount){
			return ;
		}
		var _ctrl = $("#"+this.sets.ctrlId);
		var _attr = $(_ctrl).prev();
		this.send(_attr, page + 1);
	},
	p_prev:function(){
		var page = $("#"+this.sets.ctrlId+" .ctrl_ac_page").attr("page");
		page = parseInt(page);
		if(page == 1){
			return ;
		}
		var _ctrl = $("#"+this.sets.ctrlId);
		var _attr = $(_ctrl).prev();
		this.send(_attr, page - 1);
	},
	clean:function(_attr){
		var auto = $(_attr).attr("autocomp");
		eval("auto="+auto);
		var tagId = auto.tagId ;
		if(tagId){
			var tags = tagId.split("|");
			for(var i = 0 ; i < tags.length ; i ++){
				var dom = tags[i].substring(0,tags[i].indexOf('['));
				$("#"+dom).val("");
			}
		}
		$(_attr).val("");
		this.close();
	}
}
$(document).ready(function(){
	AutoComp.init();
});