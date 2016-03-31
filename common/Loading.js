/**
 * JS等待提示工具类
 * @author li.biao 修改于
 * @since 2013-12-2
 */
var Loading={
	init:function(o,tips){
		//实例：Loading.init({winType:'div',divObj:$("#div_loading")[0],tip:'正在查询...'});
		var parm={
			imgUrl:base+'/default/style/images/loading.gif',
			//top全屏等待，win本窗口等待，div表示某个层元素中等待
			winType:'win',
			//是否锁屏
			lock:true,
			//winType为div的时候需要指定div的dom对象
			divObj:null,
			//提示的消息内容
			tip:''
		}
		$.extend(parm,o);
		var filterDiv='<div id=load_out_div >';
		filterDiv+='<div id=load_img_div >';
		filterDiv+='<img id=load_img_p src='+parm.imgUrl+' />';
		if(tips){
			parm.tip = tips ;
		}
		if(parm.tip){
			filterDiv+='  '+parm.tip;
		}
		filterDiv+='</div></div>';
		var win = window;
		if(parm.winType == 'top'){
			win = window.top;
		}else if(parm.winType == 'div'){
			win = parm.divObj ;
		}
		var width = 0;
		var height = 0 ;
		var top = 0 ;
		var left = 0 ;
		if(parm.winType == 'div'){
			//{"absoluteTop":179,"absoluteLeft":16,"offsetWidth":1450,"offsetHeight":63}
			var p = Loading.getAbsoluteLocation(parm.divObj) ;
			if(p){
				top = p.absoluteTop ;
	            left = p.absoluteLeft ;
	            width = p.offsetWidth ; 
	            height = p.offsetHeight ;
			}else{
				width = window.document.documentElement.clientWidth;
				height = window.document.documentElement.clientHeight;
			}
		}else{
			width = win.document.documentElement.clientWidth;
			height = win.document.documentElement.clientHeight;
		}
		var topBody = parm.winType == 'div' ? $(parm.divObj) : $(win.document).find('body');
		if($(top.document).find('#load_out_div').length>0){
			return ;
		}else{
		topBody.append(filterDiv);}
		var enlOutDiv = topBody.find('#load_out_div');
		if(parm.lock){
			enlOutDiv.css({'position':'absolute','width':width,'height':height,'top':top,'left':left,'overflow':'auto','z-index':10001});
			enlOutDiv.css({'background-color':'#fff','opacity':0.9,'filter':'alpha(opacity=95)','-moz-opacity':0.95});//,
			enlOutDiv.find('#load_img_div').css({'display':'table-cell','vertical-align':'middle','width':width,'text-align':'center','height':height});
		}else{
			enlOutDiv.css({'position':'absolute','top':height/2,'left':width/2,'opacity':0.9,'filter':'alpha(opacity=95)','-moz-opacity':0.95,'z-index':10001});
		}
	},
	close:function(){
		if($('#load_img_p').attr('id')){
			$('#load_out_div,#load_img_p').remove();
		}else{
			$(top.document).find('#load_out_div').remove();
		}
	},
	isExistLoad:function(){
		if($('#load_img_p').attr('id') || $(top.document).find('#load_img_p').attr('id')){
			return true;
		}else{
			return false;
		}
	},
	//获取某个HTML Element绝对位置
	getAbsoluteLocation:function(element){
		if ( arguments.length != 1 || element == null ){
	        return null;
	    }
	    var offsetTop = element.offsetTop;
	    var offsetLeft = element.offsetLeft;
	    var offsetWidth = element.offsetWidth;
	    var offsetHeight = element.offsetHeight;
	    while( element = element.offsetParent ){
	        offsetTop += element.offsetTop;
	        offsetLeft += element.offsetLeft;
	    }
	    return { absoluteTop: offsetTop, absoluteLeft: offsetLeft,
	        offsetWidth: offsetWidth, offsetHeight: offsetHeight };
	}
	
}