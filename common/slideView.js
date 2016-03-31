/**
 * 滑动页面效果工具类
 * @author li.biao 
 * @since 2014-6-20
 */
var SlideView={
	//初始配置
	sets:{
		url:'',
		lock:true,
		width:"75%",
		height:"100%",
		top:0,
		right:0,
		zIndex:109,
		excludeId:'',
		onfocusDiv:'',
		cls:'slide_iframestyle',
		speed:'normal'//("slow", "normal", "fast")
	},
	//序列id
	slideId:'',
	ifarmeId:'detailIframe0527',
	//初始化
	init:function(o){
		$.extend(this.sets ,o );
		if(this.slideId == null || this.slideId == ''){
			this.slideId = this.getDateSerial();
		}
		
		var _body = $(window.document).find('body') ;
		if(!this.isExistSlide()){
			var _html = this.buildHtml() ;
			_body.append(_html);
		}
		var _elOutObj = $(_body).find("#"+this.getDivId());
		_elOutObj.css({'position':'absolute','width':this.sets.width,'height':this.sets.height,'z-index':this.sets.zIndex});
		_elOutObj.css({'top':this.sets.top,'right':this.sets.right});
		_elOutObj.css({'display':'none'});
		var _elOutIfr = $(_body).find("#"+this.getIframeId());
		_elOutIfr.css({'width':'100%','height':'100%'});
		_elOutIfr.css({'frameborder':'no','border':'0','marginwidth':'0','marginheight':'0'});
		_elOutIfr.attr('src',this.sets.url);
		
		//如果鼠标的事件不在区域内则隐藏
		var _this = this ;
		$(function(){
		     document.onmouseup = function(event){
		     event = event || window.event;
		     var obj = event.srcElement || event.target;
		     var flg = true;
		     var focusFlg = false ;
		     //排除界面DOM元素 指定此ID则不隐藏
		     if(obj.id == _this.sets.excludeId){
		    	 flg = false ;
		     }else{
		    	 while(obj.id != _this.getDivId()){
			    	 obj = obj.parentNode;
			    	 if(obj.nodeName == "BODY"){
			    		 break;
			    	 }
			    	 //指定界面DOM区域，区域内则隐藏
			    	 if(_this.sets.onfocusDiv!="" && obj.id!="" && _this.sets.onfocusDiv.indexOf(obj.id) > -1 ){
			    		 focusFlg = true ;
				     }
			    	 //查看区域内不隐藏
			    	 if(obj.id == _this.getDivId()){
			    		 flg = false;
			    		 break;
			    	 }
			     }
		     }
		     if(_this.sets.onfocusDiv == null || _this.sets.onfocusDiv == ""){
		    	 focusFlg = true ;
		     }
		     if(flg && focusFlg){
		    	 _this.hide();
		     }
		}});
		
	},
	//显示
	show:function(){
		$("#"+this.getDivId()).show();
		//$("#"+this.getDivId()).animate({width:this.sets.width},this.sets.speed);
		var open = $("#"+this.getDivId()).attr("open");
		if(open == null || open == "" || open == "off"){
			$("#"+this.getDivId()).animate({width:this.sets.width},this.sets.speed);
		}else{
			$("#"+this.getDivId()).css({width:this.sets.width});
		}
		$("#"+this.getDivId()).attr("open","on");
		
	},
	//隐藏
	hide:function(evhide){
		$("#"+this.getDivId()).attr("open","off");
		$("#"+this.getDivId()).animate({width:0},this.sets.speed);
	},
	//判断是否存在SlideView对象
	isExistSlide:function(){
		if($('#'+this.getDivId()) && $('#'+this.getDivId()).length != 0 ){
			return true;
		}else{
			return false;
		}
	},
	//构建html
	buildHtml:function(){
		var divHtml = "" ;
		if(this.isExistSlide()){
			divHtml = $("#"+this.getDivId())[0];
		}else{
			divHtml += "<div id='"+this.getDivId()+"' class='"+this.sets.cls+"'>";
			divHtml += "<iframe id='"+this.getIframeId()+"'></iframe>"
			divHtml += "</div>" ;
		}
		return divHtml ;
	},
	//获取时间戳
	getDateSerial:function(){
		var nowDateStr = formatDate(new Date(),"yyyy-MM-dd HH:mm:ss");
		var reg = /[^0-9]/g;
		var dateStr = nowDateStr.replace(reg,"");
		return dateStr ;
	},
	//取得div对象
	getDivId:function(){
		return this.ifarmeId + "Div" + this.slideId ;
	},
	//取得iframe对象
	getIframeId:function(){
		return this.ifarmeId + this.slideId ;
	}
	
}